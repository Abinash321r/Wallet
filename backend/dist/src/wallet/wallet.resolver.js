"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const wallet_service_1 = require("./wallet.service");
const wallet_model_1 = require("./models/wallet.model");
const gql_auth_guard_1 = require("../common/guards/gql-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let WalletResolver = class WalletResolver {
    constructor(walletService) {
        this.walletService = walletService;
    }
    async myWallet(user) {
        return this.walletService.getMyWallet(user.id);
    }
};
exports.WalletResolver = WalletResolver;
__decorate([
    (0, graphql_1.Query)(() => wallet_model_1.WalletType, { description: 'Get the wallet of the currently logged-in user' }),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletResolver.prototype, "myWallet", null);
exports.WalletResolver = WalletResolver = __decorate([
    (0, graphql_1.Resolver)(() => wallet_model_1.WalletType),
    __metadata("design:paramtypes", [wallet_service_1.WalletService])
], WalletResolver);
//# sourceMappingURL=wallet.resolver.js.map