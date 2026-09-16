import { WalletService } from './wallet.service';
export declare class WalletResolver {
    private walletService;
    constructor(walletService: WalletService);
    myWallet(user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        balance: number;
        isFrozen: boolean;
        userId: string;
    }>;
}
