export declare class WalletSummary {
    id: string;
    balance: number;
}
export declare class TransactionType {
    id: string;
    amount: number;
    currency: string;
    status: string;
    senderWalletId: string;
    receiverWalletId: string;
    senderWallet?: WalletSummary;
    receiverWallet?: WalletSummary;
    createdAt: Date;
}
export declare class PaginatedTransactions {
    transactions: TransactionType[];
    nextCursor: string | null;
    hasMore: boolean;
}
