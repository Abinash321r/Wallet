import { ObjectType, Field } from '@nestjs/graphql';


@ObjectType()
export class AuthUser {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  mobile: string;

  @Field()
  role: string; 
}
