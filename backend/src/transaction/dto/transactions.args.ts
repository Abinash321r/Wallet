import { ArgsType, Field, Int } from '@nestjs/graphql';


@ArgsType()
export class TransactionsArgs {
  
  
  @Field({ nullable: true })
  cursor?: string;

  @Field(() => Int, { defaultValue: 20 })
  limit: number;

  
  
  
  
  @Field({ nullable: true })
  dateFilter?: string;
}
