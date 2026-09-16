import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';





const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  wallet: {
    create: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('mock-jwt-token') },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks(); 
  });

  

  it('throws BadRequestException if mobile is already registered', async () => {
    
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing-id', mobile: '1234567890' });

    await expect(
      authService.register({ mobile: '1234567890', password: 'password123' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('creates a user and wallet atomically when mobile is new', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null); 

    
    mockPrisma.$transaction.mockImplementation((fn: Function) => fn(mockPrisma));
    mockPrisma.user.create.mockResolvedValue({ id: 'new-user-id', mobile: '1234567890' });
    mockPrisma.wallet.create.mockResolvedValue({ id: 'new-wallet-id' });

    const result = await authService.register({ mobile: '1234567890', password: 'password123' });

    expect(result).toBe(true);
    expect(mockPrisma.user.create).toHaveBeenCalledTimes(1);  
    expect(mockPrisma.wallet.create).toHaveBeenCalledTimes(1); 
  });

  

  it('throws UnauthorizedException when mobile is not found', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null); 
    const mockRes = { cookie: jest.fn() };

    await expect(
      authService.login({ mobile: '0000000000', password: 'any' }, mockRes as any),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException when password is wrong', async () => {
    
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-id',
      mobile: '1234567890',
      password: 'some-hash-that-does-not-match-plaintext',
      role: 'USER',
    });
    const mockRes = { cookie: jest.fn() };

    await expect(
      authService.login({ mobile: '1234567890', password: 'wrongpassword' }, mockRes as any),
    ).rejects.toThrow(UnauthorizedException);
  });
});
