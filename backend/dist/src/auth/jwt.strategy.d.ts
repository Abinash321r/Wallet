import { Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: {
        sub: string;
        mobile: string;
        role: string;
    }): Promise<{
        name: string;
        mobile: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
export {};
