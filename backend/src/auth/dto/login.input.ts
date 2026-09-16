import { InputType, Field } from '@nestjs/graphql';
import { IsString, Length, Matches } from 'class-validator';

@InputType()
export class LoginInput {
  
  @Field()
  @IsString()
  @Matches(/^\d{10}$/, { message: 'Mobile must be exactly 10 digits' })
  mobile: string;

  @Field()
  @IsString()
  @Length(1, 100)
  password: string;
}
