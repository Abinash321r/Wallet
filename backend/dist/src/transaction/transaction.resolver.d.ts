import { TransactionService } from './transaction.service';
import { PaginatedTransactions } from './models/transaction.model';
import { TransactionsArgs } from './dto/transactions.args';
import { WalletService } from '../wallet/wallet.service';
export declare class TransactionResolver {
    private transactionService;
    private walletService;
    constructor(transactionService: TransactionService, walletService: WalletService);
    myTransactions(user: any, args: TransactionsArgs): Promise<PaginatedTransactions>;
    senderWallet(transaction: any, ctx: any): Promise<any>;
    receiverWallet(transaction: any, ctx: any): Promise<any>;
}
