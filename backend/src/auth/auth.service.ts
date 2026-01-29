import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '@/user/user.service';
import { AuthMethod } from 'prisma/generated/enums';
import { User } from 'prisma/generated/client';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config';
import { ProviderService } from './provider/provider.service';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly config: ConfigService,
        private readonly providerService: ProviderService,
        private readonly prismaService: PrismaService
    ) { }

    async register(req: Request, dto: RegisterDto) {
        const { email, password, name } = dto

        const isExists = await this.userService.findByEmail(dto.email)
        if (isExists) throw new ConflictException('User with this email is already exist. Please user another email, or login to system')

        const newUser = await this.userService.create(
            email,
            password,
            name,
            '',
            AuthMethod.CREDENTIALS,
            false
        )

        return this.saveSession(req, newUser)
    }

    async login(req: Request, dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email)

        if (!user || !user.password)
            throw new NotFoundException('User not found, please check entered data')

        const isValidPass = await bcrypt.compare(dto.password, user.password)
        console.log(isValidPass, user.password, dto.password)
        if (!isValidPass)
            throw new UnauthorizedException('Incorrect password, please try again, or reset password')

        return this.saveSession(req, user)
    }

    async extractProfileFromCode(
        req: Request, 
        provider: string, 
        code: string
    ) {
        const providerInstance = this.providerService.findByService(provider)
        const profile = await providerInstance.findUserByCode(code)

        const account = await this.prismaService.account.findFirst({
            where: {
                id: profile.id,
                provider: profile.provider
            }
        })

        let user
        if(account.userId) user = await this.userService.findById(account.userId)
        else user = await this.userService.findByEmail(profile.email)

        if(user) return this.saveSession(req, user)

        user = await this.userService.create(
            profile.email,
            '',
            profile.name,
            profile.picture,
            AuthMethod[profile.provider.toUpperCase()],
            true
        )

        if(!account) await this.prismaService.account.create({
            data: {
                userId: user.id,
                type: 'oauth',
                provider: profile.provider,
                accessToken: profile.access_token,
                refreshToken: profile.refresh_token,
                expiresAt: profile.expires_at
            }
        })

        return this.saveSession(req, user)
    }

    async logout(req: Request, res: Response): Promise<void> {
        return new Promise((resolve, reject) => {

            req.session.destroy(err => {
                if (err) {
                    return reject(
                        new InternalServerErrorException(
                            `Unable to complete the session. 
                            There may have been an error on the server, 
                            or the session may have already been completed.`
                        )
                    )
                }
            })

            res.clearCookie(this.config.getOrThrow<string>('SESSION_NAME'))
            resolve()
        })
    }

    async saveSession(req: Request, user: User) {
        return new Promise((resolve, reject) => {
            req.session.userId = user.id

            req.session.save(err => {
                if (err) return reject(
                    new InternalServerErrorException(
                        'Can`t save sesstion, check session parameters'
                    )
                )
            })

            resolve({
                user
            })
        })
    }
}
