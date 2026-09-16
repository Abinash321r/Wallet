import { ObjectType, Field, Float } from '@nestjs/graphql';


@ObjectType()
export class WalletSummary {
  @Field()
  id: string;

  @Field(() => Float)
  balance: number;
}


@ObjectType()
export class TransactionType {
  @Field()
  id: string;

  @Field(() => Float)
  amount: number;

  @Field()
  currency: string;

  @Field()
  status: string; 

  @Field()
  senderWalletId: string;

  @Field()
  receiverWalletId: string;

  
  
  
  @Field(() => WalletSummary, { nullable: true })
  senderWallet?: WalletSummary;

  @Field(() => WalletSummary, { nullable: true })
  receiverWallet?: WalletSummary;

  @Field()
  createdAt: Date;
}


@ObjectType()
export class PaginatedTransactions {
  @Field(() => [TransactionType])
  transactions: TransactionType[];

  
  
  @Field({ nullable: true })
  nextCursor: string | null;

  @Field()
  hasMore: boolean;
}
