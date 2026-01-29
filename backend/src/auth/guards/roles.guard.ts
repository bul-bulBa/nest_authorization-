import { ExecutionContext, Injectable, CanActivate, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "prisma/generated/enums";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate( context: ExecutionContext ): boolean {
        const roles = this.reflector.getAllAndOverride<UserRole>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        const request = context.switchToHttp().getRequest()
        
        if(!roles) return true

        if(!roles.includes(request.user.role))
            throw new ForbiddenException('no access')

        return true
    }
}