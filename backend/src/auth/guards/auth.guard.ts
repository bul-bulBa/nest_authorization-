import { ExecutionContext, Injectable, CanActivate, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "prisma/generated/enums";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { UserService } from "@/user/user.service";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}

    async canActivate( context: ExecutionContext ): Promise<boolean> {
        const request = context.switchToHttp().getRequest()

        if(typeof request.session.userId === 'undefined')
            throw new UnauthorizedException('user unauthorized')

        const user =  await this.userService.findById(request.session.userId)

        request.user = user
        
        return true
    }
}