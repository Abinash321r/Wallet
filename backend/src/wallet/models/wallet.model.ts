import { ObjectType, Field, Float } from '@nestjs/graphql';



@ObjectType()
export class WalletType {
  @Field()
  id: string;

  @Field(() => Float)
  balance: number;

  @Field()
  isFrozen: boolean; 

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
