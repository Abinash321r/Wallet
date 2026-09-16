import { Resolver, Mutation, Args, Float } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferInput } from './dto/transfer.input';
import { TransactionType } from '../transaction/models/transaction.model';
import { WalletType } from '../wallet/models/wallet.model';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Resolver()
export class TransferResolver {
  constructor(private transferService: TransferService) {}

  @Mutation(() => TransactionType, { description: 'Transfer money to another user by their mobile number' })
  @UseGuards(GqlAuthGuard)
  async transfer(
    @CurrentUser() user: any,
    @Args('input') input: TransferInput,
  ) {
    return this.transferService.transfer(user.id, input);
  }

  @Mutation(() => WalletType, { description: 'Add dummy funds to your wallet (demo only)' })
  @UseGuards(GqlAuthGuard)
  async deposit(
    @CurrentUser() user: any,
    @Args('amount', { type: () => Float }) amount: number,
  ) {
    return this.transferService.deposit(user.id, amount);
  }
}
