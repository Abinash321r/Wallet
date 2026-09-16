import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(input: RegisterInput): Promise<boolean>;
    login(input: LoginInput, res: Response): Promise<any>;
    logout(res: Response): Promise<boolean>;
    getMe(userId: string): Promise<{
        name: string;
        mobile: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
