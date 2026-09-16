import { PrismaService } from '../prisma/prisma.service';
import { TransferInput } from './dto/transfer.input';
export declare class TransferService {
    private prisma;
    constructor(prisma: PrismaService);
    transfer(senderId: string, input: TransferInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        receiverWalletId: string;
        senderWalletId: string;
        amount: number;
        currency: string;
        status: string;
        idempotencyKey: string;
    }>;
    private getOrCreateSystemWallet;
    deposit(userId: string, amount: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        balance: number;
        isFrozen: boolean;
        userId: string;
    }>;
}
