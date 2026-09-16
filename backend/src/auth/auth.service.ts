import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(input: RegisterInput): Promise<boolean> {
    const { mobile, name, password } = input;

    
    const existing = await this.prisma.user.findUnique({ where: { mobile } });
    if (existing) {
      throw new BadRequestException('Mobile number already registered');
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    
    await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { mobile, name, password: hashedPassword },
      });
      
      await tx.wallet.create({
        data: { userId: user.id, balance: 0 },
      });
    });

    return true;
  }

  async login(input: LoginInput, res: Response): Promise<any> {
    const { mobile, password } = input;

    const user = await this.prisma.user.findUnique({ where: { mobile } });
    
    if (!user) throw new UnauthorizedException('Invalid mobile or password');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid mobile or password');

    
    const payload = { sub: user.id, mobile: user.mobile, role: user.role };
    const token = this.jwtService.sign(payload);

    
    
    
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite:process.env.NODE_ENV === 'production'?'none':'lax',                               
      maxAge: 24 * 60 * 60 * 1000,                 
    });

    return { id: user.id, name: user.name, mobile: user.mobile, role: user.role };
  }

  async logout(res: Response): Promise<boolean> {
    
    // res.clearCookie('auth_token');
      res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });

    return true;
  }

  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, mobile: true, role: true },
    });
  }
}
