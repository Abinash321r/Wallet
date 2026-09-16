import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { AuthUser } from './models/auth-user.model';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  
  @Mutation(() => Boolean, { description: 'Register a new user with a 10-digit mobile number' })
  async register(@Args('input') input: RegisterInput): Promise<boolean> {
    return this.authService.register(input);
  }

  @Mutation(() => AuthUser, { description: 'Login and receive a JWT stored in an HttpOnly cookie' })
  async login(
    @Args('input') input: LoginInput,
    @Context() ctx: { res: any }, 
  ): Promise<any> {
    return this.authService.login(input, ctx.res);
  }

  @Mutation(() => Boolean, { description: 'Logout and clear the auth cookie' })
  async logout(@Context() ctx: { res: any }): Promise<boolean> {
    return this.authService.logout(ctx.res);
  }

  
  @Query(() => AuthUser, { description: 'Get the currently logged-in user' })
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: any): Promise<any> {
    return this.authService.getMe(user.id);
  }
}
