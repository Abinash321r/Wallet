import { PrismaService } from '../prisma/prisma.service';
import { TransactionsArgs } from './dto/transactions.args';
export declare class TransactionService {
    private prisma;
    constructor(prisma: PrismaService);
    getMyTransactions(walletId: string, args: TransactionsArgs): Promise<{
        transactions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            receiverWalletId: string;
            senderWalletId: string;
            amount: number;
            currency: string;
            status: string;
            idempotencyKey: string;
        }[];
        nextCursor: string;
        hasMore: boolean;
    }>;
    getAllTransactions(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        receiverWalletId: string;
        senderWalletId: string;
        amount: number;
        currency: string;
        status: string;
        idempotencyKey: string;
    }[]>;
}
