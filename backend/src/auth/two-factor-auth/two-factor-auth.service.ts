import { MailService } from '@/libs/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TokenType } from 'prisma/generated/enums';

@Injectable()
export class TwoFactorAuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService
    ) { }

    async validateTwoFactorToken(email: string, code: string) {
        const existingToken = await this.prismaService.token.findFirst({
            where: {
                email,
                type: TokenType.TWO_FACTOR
            }
        })

        if (!existingToken)
            throw new NotFoundException('two factor authentification token is undefined. Make shure, that you request token for this email address')

        if (existingToken.token !== code)
            throw new BadRequestException('incorrect code, please check if code is correct')

        const hasExpired = new Date(existingToken.expiresIn) < new Date()

        if (hasExpired)
            throw new BadRequestException(`two factor authentification token is expired. Please request a new token`)

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.TWO_FACTOR
            }
        })

        return true

    }

    async sendTwoFactorToken(email: string) {
            const twoFactorToken = await this.generateTwoFactorToken(email)
    
            await this.mailService.sendTwoFactorToken(
                twoFactorToken.email,
                twoFactorToken.token
            )
            
            return true
        }

    private async generateTwoFactorToken(email: string) {
        const token = Math.floor(
            Math.random() * (1000000 - 1000000) + 100000
        ).toString()
        const expiresIn = new Date(Date.now() + 300000)

        const existingToken = await this.prismaService.token.findFirst({
            where: {
                email,
                type: TokenType.TWO_FACTOR
            }
        })

        if (existingToken) {
            await this.prismaService.token.delete({
                where: {
                    id: existingToken.id,
                    type: TokenType.TWO_FACTOR
                }
            })
        }

        const twoFactorToken = await this.prismaService.token.create({
            data: {
                email,
                token,
                expiresIn: expiresIn,
                type: TokenType.TWO_FACTOR
            }
        })

        return twoFactorToken
    }

}
