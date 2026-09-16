import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { PrismaService } from '../prisma/prisma.service';
import { TransferInput } from './dto/transfer.input';

@Injectable()
export class TransferService {
  constructor(private prisma: PrismaService) {}

  async transfer(senderId: string, input: TransferInput) {
    const { receiverMobile, amount, idempotencyKey } = input;

    
    const existingTransaction = await this.prisma.transaction.findUnique({
      where: { idempotencyKey },
    });

    if (existingTransaction) {
      
      return existingTransaction;
    }

    
    const senderWallet = await this.prisma.wallet.findUnique({
      where: { userId: senderId },
    });

    if (!senderWallet) {
      throw new NotFoundException('Sender wallet not found');
    }

    
    if (senderWallet.isFrozen) {
      throw new BadRequestException(
        'Your wallet is frozen. Please contact support.',
      );
    }

    
    const receiver = await this.prisma.user.findUnique({
      where: { mobile: receiverMobile },
      include: { wallet: true },
    });

    if (!receiver || !receiver.wallet) {
      throw new NotFoundException('Receiver not found');
    }

    
    if (receiver.id === senderId) {
      throw new BadRequestException(
        'You cannot transfer money to yourself',
      );
    }

    
    if (senderWallet.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const receiverWallet = receiver.wallet;

    
    const newTransaction = await this.prisma.$transaction(async (tx) => {
      
      const [firstId, secondId] = [
        senderWallet.id,
        receiverWallet.id,
      ].sort();

      
      await tx.$queryRaw`
        SELECT id
        FROM "Wallet"
        WHERE id = ${firstId}
        FOR UPDATE
      `;

      await tx.$queryRaw`
        SELECT id
        FROM "Wallet"
        WHERE id = ${secondId}
        FOR UPDATE
      `;

      const lockedSenderWallet = await tx.wallet.findUnique({
        where: { id: senderWallet.id },
      });

      if (!lockedSenderWallet) {
        throw new NotFoundException('Sender wallet not found');
      }

      if (lockedSenderWallet.balance < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      await tx.wallet.update({
        where: { id: receiverWallet.id },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          amount,
          status: 'COMPLETED',
          idempotencyKey,
          senderWalletId: senderWallet.id,
          receiverWalletId: receiverWallet.id,
        },
      });

      await tx.ledgerEntry.createMany({
        data: [
          {
            transactionId: transaction.id,
            walletId: senderWallet.id,
            type: 'DEBIT',
            amount,
          },
          {
            transactionId: transaction.id,
            walletId: receiverWallet.id,
            type: 'CREDIT',
            amount,
          },
        ],
      });

      return transaction;
    });

    return newTransaction;
  }

  private async getOrCreateSystemWallet() {
    const SYSTEM_USER_MOBILE = '0000000000';

    let user = await this.prisma.user.findUnique({
      where: { mobile: SYSTEM_USER_MOBILE },
      include: { wallet: true },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: 'System Treasury',
          mobile: SYSTEM_USER_MOBILE,
          password: 'unused',
          role: 'ADMIN',

          wallet: {
            create: {
              balance: 0,
            },
          },
        },

        include: {
          wallet: true,
        },
      });
    }

    return user.wallet!;
  }

  async deposit(userId: string, amount: number) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const systemWallet = await this.getOrCreateSystemWallet();

    return this.prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          amount,
          status: 'COMPLETED',

          idempotencyKey: randomUUID(),

          senderWalletId: systemWallet.id,
          receiverWalletId: wallet.id,
        },
      });

      await tx.ledgerEntry.createMany({
        data: [
          {
            transactionId: transaction.id,
            walletId: systemWallet.id,
            type: 'DEBIT',
            amount,
          },
          {
            transactionId: transaction.id,
            walletId: wallet.id,
            type: 'CREDIT',
            amount,
          },
        ],
      });

      return tx.wallet.findUnique({
        where: { id: wallet.id },
      });
    });
  }
}