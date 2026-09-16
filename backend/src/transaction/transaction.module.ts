import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [WalletModule], 
  providers: [TransactionService, TransactionResolver],
  exports: [TransactionService],
})
export class TransactionModule {}
