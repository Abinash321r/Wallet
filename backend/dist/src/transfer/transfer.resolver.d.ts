import { TransferService } from './transfer.service';
import { TransferInput } from './dto/transfer.input';
export declare class TransferResolver {
    private transferService;
    constructor(transferService: TransferService);
    transfer(user: any, input: TransferInput): Promise<{
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
    deposit(user: any, amount: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        balance: number;
        isFrozen: boolean;
        userId: string;
    }>;
}
