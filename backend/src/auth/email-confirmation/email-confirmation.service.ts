import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { TokenType } from 'prisma/generated/enums';
import { v4 as uuidv4} from 'uuid'
import { ConfirmationDto } from './dto/confirmation.dto';
import { User } from 'prisma/generated/browser';
import { MailService } from '@/libs/mail/mail.service';
import { UserService } from '@/user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class EmailConfirmationService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService,
        private readonly userService: UserService,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService
    ) {}

    async newVerification(req: Request, dto: ConfirmationDto) {
        const existingToken = await this.prismaService.token.findUnique({
            where: {
                token: dto.token,
                type: TokenType.VERIFICATION
            }
        })

        if(!existingToken) 
            throw new NotFoundException('token is undefined, check if the token is correct')
            
        const hasExpired = new Date(existingToken.expiresIn) < new Date()

        if(hasExpired) 
            throw new BadRequestException(`confirmation token is expired. Please request a new token`)
    
        const existingUser = await this.userService.findByEmail(
            existingToken.email
        )

        if(!existingUser)
            throw new NotFoundException(`User is undefined, check that you have entered correct email`)

        await this.prismaService.user.update({
            where: {
                id: existingUser.id
            },
            data: {
                isVerified: true
            }
        })

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.VERIFICATION
            }
        })
         
        return this.authService.saveSession(req, existingUser)
    }


    async sendVerificationToken(user: User) {
        const verificationToken = await this.generateVerificationToken(user.email)

        await this.mailService.sendConfirmationEmail(
            verificationToken.email,
            verificationToken.token
        )
        
        return true
    }

    private async generateVerificationToken(email: string) {
        const token = uuidv4()
        const expiresIn = new Date(Date.now() + 3600 * 1000)

        const existingToken = await this.prismaService.token.findFirst({
            where: {
                email,
                type: TokenType.VERIFICATION
            }
        })

        if(existingToken) {
            await this.prismaService.token.delete({
                where: {
                    id: existingToken.id,
                    type: TokenType.VERIFICATION
                }
            })
        }

        const verificationToken = await this.prismaService.token.create({
            data: {
                email,
                token,
                expiresIn: expiresIn,
                type: TokenType.VERIFICATION
            }
        })
        
        return verificationToken
    }

}
