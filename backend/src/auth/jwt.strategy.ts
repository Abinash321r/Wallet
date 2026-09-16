import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';



const cookieExtractor = (req: Request): string | null => {
  if (req && req.cookies) {
    return req.cookies['auth_token'] ?? null;
  }
  return null;
};



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy , 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'wallet-super-secret-key-change-in-production',
    });
  }

  
  
  async validate(payload: { sub: string; mobile: string; role: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, mobile: true, role: true, name: true },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return user; 
  }
}
