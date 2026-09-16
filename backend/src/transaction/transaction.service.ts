import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionsArgs } from './dto/transactions.args';



function buildDateRange(dateFilter?: string): { gte?: Date; lt?: Date } | undefined {
  const now = new Date();
  
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (dateFilter) {
    case 'TODAY':
      
      return { gte: today };

    case 'YESTERDAY': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      return { gte: yesterday, lt: today };
    }

    case 'LAST_WEEK': {
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      return { gte: lastWeek };
    }

    case 'LAST_MONTH': {
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return { gte: lastMonth };
    }

    default:
      
      return undefined;
  }
}

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async getMyTransactions(walletId: string, args: TransactionsArgs) {
    const { cursor, limit, dateFilter } = args;

    
    const where: any = {
      OR: [
        { senderWalletId: walletId },
        { receiverWalletId: walletId },
      ],
    };

    
    
    const dateRange = buildDateRange(dateFilter);
    if (dateRange) {
      where.createdAt = dateRange;
    }

    
    const rawTransactions = await this.prisma.transaction.findMany({
      where,
      take: limit + 1,
      ...(cursor
        ? { cursor: { id: cursor }, skip: 1 }
        : {}),
      orderBy: { createdAt: 'desc' }, 
    });

    const hasMore = rawTransactions.length > limit;
    const transactions = hasMore ? rawTransactions.slice(0, limit) : rawTransactions;
    const nextCursor = hasMore ? transactions[transactions.length - 1].id : null;

    return { transactions, nextCursor, hasMore };
  }

  async getAllTransactions() {
    return this.prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
