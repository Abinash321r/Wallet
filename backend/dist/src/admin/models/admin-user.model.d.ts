declare class AdminWalletInfo {
    id: string;
    balance: number;
    isFrozen: boolean;
}
export declare class AdminUser {
    id: string;
    name?: string;
    mobile: string;
    role: string;
    createdAt: Date;
    wallet?: AdminWalletInfo;
}
export declare class PaginatedAdminUsers {
    users: AdminUser[];
    total: number;
    page: number;
    totalPages: number;
}
export {};
