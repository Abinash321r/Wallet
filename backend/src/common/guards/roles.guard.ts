import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '@prisma/client';




@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    
    const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler());

    
    if (!requiredRoles || requiredRoles.length === 0) return true;

    
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;

    
    return user && requiredRoles.includes(user.role);
  }
}
