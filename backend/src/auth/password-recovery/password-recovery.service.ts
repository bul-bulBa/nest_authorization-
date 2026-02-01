import { MailService } from '@/libs/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid'
import { ResetPasswordDto } from './dto/reset-password.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { TokenType } from 'prisma/generated/enums';
import bcrypt from 'bcrypt'

@Injectable()
export class PasswordRecoveryService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UserService,
        private readonly mailService: MailService
    ) { }

    async reset(dto: ResetPasswordDto) {
        const existingUser = await this.userService.findByEmail(dto.email)

        if (!existingUser)
            throw new NotFoundException('User is undefined. Please check if correct is email address')

        const PasswordResetToken = await this.generatePasswordResetToken(existingUser.email)

        await this.mailService.sendPasswordReset(PasswordResetToken.email, PasswordResetToken.token)

        return true
    }

    async newPassword(dto: NewPasswordDto, token: string) {
        const existingToken = await this.prismaService.token.findFirst({
            where: {
                token,
                type: TokenType.PASSWORD_RESET
            }
        })

        if (!existingToken)
            throw new NotFoundException('token is undefined. Please check if token is correct')

        const hasExpired = new Date(existingToken.expiresIn) < new Date()

        if (hasExpired)
            throw new BadRequestException(`reset password token is expired. Please request a new token`)
    
        const existingUser = await this.userService.findByEmail(
            existingToken.email
        )

        if(!existingUser)
            throw new NotFoundException(`User is undefined, check that you have entered correct email`)
    
        await this.prismaService.user.update({
            where: {
                id: existingUser.id
            }, data: {
                password: await bcrypt.hash(dto.password, 3)
            }
        })

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.PASSWORD_RESET
            }
        })

        return true
    }

    private async generatePasswordResetToken(email: string) {
        const token = uuidv4()
        const expiresIn = new Date(Date.now() + 3600 * 1000)

        const existingToken = await this.prismaService.token.findFirst({
            where: {
                email,
                type: TokenType.PASSWORD_RESET
            }
        })

        if (existingToken) {
            await this.prismaService.token.delete({
                where: {
                    id: existingToken.id,
                    type: TokenType.PASSWORD_RESET
                }
            })
        }

        const PasswordResetToken = await this.prismaService.token.create({
            data: {
                email,
                token,
                expiresIn: expiresIn,
                type: TokenType.PASSWORD_RESET
            }
        })

        return PasswordResetToken
    }
}
