import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthMethod } from 'prisma/generated/enums';
import  bcrypt  from 'bcrypt'

@Injectable()
export class UserService {
    public constructor(private readonly prismaService: PrismaService) { }

    async findById(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: { id },
            include: { accounts: true }
        })

        if (!user) throw new NotFoundException('user not found')

        return user
    }

    async findByEmail(email: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            },
            include: {
                accounts: true
            }
        })

        return user
    }

    async create(
        email: string,
        password: string,
        displayName: string,
        picture: string,
        method: AuthMethod,
        isVerified: boolean
    ) {
        console.log('DATA', email, password, displayName, picture, method, isVerified)
        const user = await this.prismaService.user.create({
            data: {
                email,
                password: password ? await bcrypt.hash(password, 3) : '',
                displayName,
                picture,
                method,
                isVerified
            },
            include: {
                accounts: true
            }
        })

        return user
    }
}
