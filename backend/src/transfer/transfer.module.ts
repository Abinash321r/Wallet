import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferResolver } from './transfer.resolver';

@Module({
  providers: [TransferService, TransferResolver],
})
export class TransferModule {}
