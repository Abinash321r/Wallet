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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedAdminUsers = exports.AdminUser = void 0;
const graphql_1 = require("@nestjs/graphql");
let AdminWalletInfo = class AdminWalletInfo {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AdminWalletInfo.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], AdminWalletInfo.prototype, "balance", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], AdminWalletInfo.prototype, "isFrozen", void 0);
AdminWalletInfo = __decorate([
    (0, graphql_1.ObjectType)()
], AdminWalletInfo);
let AdminUser = class AdminUser {
};
exports.AdminUser = AdminUser;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AdminUser.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AdminUser.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AdminUser.prototype, "mobile", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AdminUser.prototype, "role", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], AdminUser.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => AdminWalletInfo, { nullable: true }),
    __metadata("design:type", AdminWalletInfo)
], AdminUser.prototype, "wallet", void 0);
exports.AdminUser = AdminUser = __decorate([
    (0, graphql_1.ObjectType)()
], AdminUser);
let PaginatedAdminUsers = class PaginatedAdminUsers {
};
exports.PaginatedAdminUsers = PaginatedAdminUsers;
__decorate([
    (0, graphql_1.Field)(() => [AdminUser]),
    __metadata("design:type", Array)
], PaginatedAdminUsers.prototype, "users", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], PaginatedAdminUsers.prototype, "total", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], PaginatedAdminUsers.prototype, "page", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], PaginatedAdminUsers.prototype, "totalPages", void 0);
exports.PaginatedAdminUsers = PaginatedAdminUsers = __decorate([
    (0, graphql_1.ObjectType)()
], PaginatedAdminUsers);
//# sourceMappingURL=admin-user.model.js.map