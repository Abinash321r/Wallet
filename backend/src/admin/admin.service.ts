import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminUsersArgs } from './dto/admin-users.args';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  
  async getUsers(args: AdminUsersArgs) {
    const { page, limit, search, roleFilter, sortBy, sortOrder } = args;

    
    const where: any = {};

    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { mobile: { contains: search.trim() } },
      ];
    }

    if (roleFilter && roleFilter !== 'ALL') {
      where.role = roleFilter;
    }

    
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'name')      orderBy = { name:    sortOrder === 'asc' ? 'asc' : 'desc' };
    if (sortBy === 'mobile')    orderBy = { mobile:  sortOrder === 'asc' ? 'asc' : 'desc' };
    if (sortBy === 'createdAt') orderBy = { createdAt: sortOrder === 'asc' ? 'asc' : 'desc' };
    if (sortBy === 'balance')   orderBy = { wallet: { balance: sortOrder === 'asc' ? 'asc' : 'desc' } };

    
    const [total, users] = await Promise.all([
      
      this.prisma.user.count({ where }),

      
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit, 
        take: limit,
        orderBy,
        select: {
          id: true,
          name: true,
          mobile: true,
          role: true,
          createdAt: true,
          wallet: { select: { id: true, balance: true, isFrozen: true } },
        },
      }),
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit), 
    };
  }

  
  async freezeWallet(walletId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return this.prisma.wallet.update({
      where: { id: walletId },
      data: { isFrozen: true },
    });
  }

  
  async unfreezeWallet(walletId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return this.prisma.wallet.update({
      where: { id: walletId },
      data: { isFrozen: false },
    });
  }

  
  async makeAdmin(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id: userId },
      data: { role: 'ADMIN' },
      select: {
        id: true,
        name: true,
        mobile: true,
        role: true,
        createdAt: true,
        wallet: { select: { id: true, balance: true, isFrozen: true } },
      },
    });
  }

  
  
  
  async deleteUser(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });

    
    await this.prisma.$transaction(async (tx) => {
      if (wallet) {
        
        const transactions = await tx.transaction.findMany({
          where: {
            OR: [
              { senderWalletId: wallet.id },
              { receiverWalletId: wallet.id },
            ],
          },
          select: { id: true },
        });
        const transactionIds = transactions.map((t) => t.id);

        if (transactionIds.length > 0) {
          
          await tx.ledgerEntry.deleteMany({
            where: { transactionId: { in: transactionIds } },
          });
          
          await tx.transaction.deleteMany({
            where: { id: { in: transactionIds } },
          });
        }

        
        await tx.wallet.delete({ where: { id: wallet.id } });
      }

      
      await tx.user.delete({ where: { id: userId } });
    });

    return true;
  }

  
  async getAllTransactions() {
    return this.prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
