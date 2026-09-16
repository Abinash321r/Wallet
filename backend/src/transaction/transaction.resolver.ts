import { Resolver, Query, Args, ResolveField, Parent, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionType, WalletSummary, PaginatedTransactions } from './models/transaction.model';
import { TransactionsArgs } from './dto/transactions.args';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { WalletService } from '../wallet/wallet.service';

@Resolver(() => TransactionType)
export class TransactionResolver {
  constructor(
    private transactionService: TransactionService,
    private walletService: WalletService,
  ) {}

  
  @Query(() => PaginatedTransactions, { description: 'Get paginated transactions for the logged-in user' })
  @UseGuards(GqlAuthGuard)
  async myTransactions(
    @CurrentUser() user: any,
    @Args() args: TransactionsArgs,
  ): Promise<PaginatedTransactions> {
    
    const wallet = await this.walletService.getMyWallet(user.id);
    return this.transactionService.getMyTransactions(wallet.id, args);
  }

  
  
  
  @ResolveField('senderWallet', () => WalletSummary, { nullable: true })
  async senderWallet(
    @Parent() transaction: any,
    @Context() ctx: any, 
  ): Promise<any> {
    
    return ctx.walletLoader.load(transaction.senderWalletId);
  }

  @ResolveField('receiverWallet', () => WalletSummary, { nullable: true })
  async receiverWallet(
    @Parent() transaction: any,
    @Context() ctx: any,
  ): Promise<any> {
    return ctx.walletLoader.load(transaction.receiverWalletId);
  }
}
