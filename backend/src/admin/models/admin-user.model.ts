import { ObjectType, Field, Float, Int } from '@nestjs/graphql';


@ObjectType()
class AdminWalletInfo {
  @Field()
  id: string;

  @Field(() => Float)
  balance: number;

  @Field()
  isFrozen: boolean;
}


@ObjectType()
export class AdminUser {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  mobile: string;

  @Field()
  role: string;

  @Field()
  createdAt: Date;

  @Field(() => AdminWalletInfo, { nullable: true })
  wallet?: AdminWalletInfo;
}


@ObjectType()
export class PaginatedAdminUsers {
  @Field(() => [AdminUser])
  users: AdminUser[];

  @Field(() => Int)
  total: number; 

  @Field(() => Int)
  page: number; 

  @Field(() => Int)
  totalPages: number; 
}
