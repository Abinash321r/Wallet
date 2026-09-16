import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  
  
  async getMyWallet(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  
  async getWalletById(walletId: string) {
    return this.prisma.wallet.findUnique({ where: { id: walletId } });
  }
}
