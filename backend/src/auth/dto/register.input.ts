import { InputType, Field } from '@nestjs/graphql';
import { IsString, Length, Matches } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field({ nullable: true })
  name?: string;

  
  @Field()
  @IsString()
  @Matches(/^\d{10}$/, { message: 'Mobile must be exactly 10 digits' })
  mobile: string;

  @Field()
  @IsString()
  @Length(6, 100, { message: 'Password must be at least 6 characters' })
  password: string;
}
