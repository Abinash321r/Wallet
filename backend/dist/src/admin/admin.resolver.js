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
exports.AdminResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const admin_user_model_1 = require("./models/admin-user.model");
const admin_users_args_1 = require("./dto/admin-users.args");
const wallet_model_1 = require("../wallet/models/wallet.model");
const transaction_model_1 = require("../transaction/models/transaction.model");
const gql_auth_guard_1 = require("../common/guards/gql-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let AdminResolver = class AdminResolver {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async adminUsers(args) {
        return this.adminService.getUsers(args);
    }
    async adminFreezeWallet(walletId) {
        return this.adminService.freezeWallet(walletId);
    }
    async adminUnfreezeWallet(walletId) {
        return this.adminService.unfreezeWallet(walletId);
    }
    async adminMakeAdmin(userId) {
        return this.adminService.makeAdmin(userId);
    }
    async adminDeleteUser(userId) {
        return this.adminService.deleteUser(userId);
    }
    async adminTransactions() {
        return this.adminService.getAllTransactions();
    }
};
exports.AdminResolver = AdminResolver;
__decorate([
    (0, graphql_1.Query)(() => admin_user_model_1.PaginatedAdminUsers, { description: 'Admin: list users with search, filter, sort, and pagination' }),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_users_args_1.AdminUsersArgs]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminUsers", null);
__decorate([
    (0, graphql_1.Mutation)(() => wallet_model_1.WalletType, { description: 'Admin: freeze a user wallet' }),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, graphql_1.Args)('walletId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminFreezeWallet", null);
__decorate([
    (0, graphql_1.Mutation)(() => wallet_model_1.WalletType, { description: 'Admin: unfreeze a user wallet' }),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, graphql_1.Args)('walletId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminUnfreezeWallet", null);
__decorate([
    (0, graphql_1.Mutation)(() => admin_user_model_1.AdminUser, { description: 'Admin: promote a user to admin role' }),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, graphql_1.Args)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminMakeAdmin", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean, { description: 'Admin: delete a user and all their data' }),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, graphql_1.Args)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminDeleteUser", null);
__decorate([
    (0, graphql_1.Query)(() => [transaction_model_1.TransactionType], { description: 'Admin: view all transactions' }),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminTransactions", null);
exports.AdminResolver = AdminResolver = __decorate([
    (0, graphql_1.Resolver)(),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminResolver);
//# sourceMappingURL=admin.resolver.js.map