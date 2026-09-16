import { PrismaService } from '../prisma/prisma.service';
import { AdminUsersArgs } from './dto/admin-users.args';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getUsers(args: AdminUsersArgs): Promise<{
        users: {
            wallet: {
                id: string;
                balance: number;
                isFrozen: boolean;
            };
            name: string;
            mobile: string;
            id: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    freezeWallet(walletId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        balance: number;
        isFrozen: boolean;
        userId: string;
    }>;
    unfreezeWallet(walletId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        balance: number;
        isFrozen: boolean;
        userId: string;
    }>;
    makeAdmin(userId: string): Promise<{
        wallet: {
            id: string;
            balance: number;
            isFrozen: boolean;
        };
        name: string;
        mobile: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
    deleteUser(userId: string): Promise<boolean>;
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
