import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { TransferModule } from './transfer/transfer.module';
import { AdminModule } from './admin/admin.module';
import { createWalletLoader } from './transaction/transaction.loader';

@Module({
  imports: [
    
    
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [PrismaModule],
      inject: [PrismaService],
      useFactory: (prisma: PrismaService) => ({
        
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,

        
        
        
        
        
        context: ({ req, res }) => ({
          req,
          res,
          walletLoader: createWalletLoader(prisma), 
        }),
      }),
    }),

    PrismaModule,
    AuthModule,
    WalletModule,
    TransactionModule,
    TransferModule,
    AdminModule,
  ],
})
export class AppModule {}
