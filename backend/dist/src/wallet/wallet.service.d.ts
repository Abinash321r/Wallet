import { PrismaService } from '../prisma/prisma.service';
export declare class WalletService {
    private prisma;
    constructor(prisma: PrismaService);
    getMyWallet(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        balance: number;
        isFrozen: boolean;
        userId: string;
    }>;
    getWalletById(walletId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        balance: number;
        isFrozen: boolean;
        userId: string;
    }>;
}
