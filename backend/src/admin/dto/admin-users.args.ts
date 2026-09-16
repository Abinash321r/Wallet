import { ArgsType, Field, Int } from '@nestjs/graphql';


@ArgsType()
export class AdminUsersArgs {
  
  
  
  @Field(() => Int, { defaultValue: 1 })
  page: number;

  @Field(() => Int, { defaultValue: 10 })
  limit: number;

  
  @Field({ nullable: true })
  search?: string;

  
  @Field({ nullable: true })
  roleFilter?: string;

  
  @Field({ nullable: true })
  sortBy?: string;

  
  @Field({ nullable: true })
  sortOrder?: string;
}
