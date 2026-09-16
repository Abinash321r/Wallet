import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsPositive, Matches, Min } from 'class-validator';

@InputType()
export class TransferInput {
  
  @Field()
  @IsString()
  @Matches(/^\d{10}$/, { message: 'Receiver mobile must be a 10-digit number' })
  receiverMobile: string; 

  @Field(() => Float)
  @IsNumber()
  @IsPositive({ message: 'Amount must be positive' })
  @Min(0.01, { message: 'Minimum transfer amount is $0.01' })
  amount: number;

  
  
  @Field()
  @IsString()
  idempotencyKey: string;
}
