import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletType } from './models/wallet.model';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Resolver(() => WalletType)
export class WalletResolver {
  constructor(private walletService: WalletService) {}

  
  
  @Query(() => WalletType, { description: 'Get the wallet of the currently logged-in user' })
  @UseGuards(GqlAuthGuard)
  async myWallet(@CurrentUser() user: any) {
    return this.walletService.getMyWallet(user.id);
  }
}
