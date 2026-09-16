import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
export declare class AuthResolver {
    private authService;
    constructor(authService: AuthService);
    register(input: RegisterInput): Promise<boolean>;
    login(input: LoginInput, ctx: {
        res: any;
    }): Promise<any>;
    logout(ctx: {
        res: any;
    }): Promise<boolean>;
    me(user: any): Promise<any>;
}
