import { AdminService } from './admin.service';
import { PaginatedAdminUsers } from './models/admin-user.model';
import { AdminUsersArgs } from './dto/admin-users.args';
export declare class AdminResolver {
    private adminService;
    constructor(adminService: AdminService);
    adminUsers(args: AdminUsersArgs): Promise<PaginatedAdminUsers>;
    adminFreezeWallet(walletId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        balance: number;
        isFrozen: boolean;
        userId: string;
    }>;
    adminUnfreezeWallet(walletId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        balance: number;
        isFrozen: boolean;
        userId: string;
    }>;
    adminMakeAdmin(userId: string): Promise<{
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
    adminDeleteUser(userId: string): Promise<boolean>;
    adminTransactions(): Promise<{
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
