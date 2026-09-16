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
exports.AdminUsersArgs = void 0;
const graphql_1 = require("@nestjs/graphql");
let AdminUsersArgs = class AdminUsersArgs {
};
exports.AdminUsersArgs = AdminUsersArgs;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { defaultValue: 1 }),
    __metadata("design:type", Number)
], AdminUsersArgs.prototype, "page", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { defaultValue: 10 }),
    __metadata("design:type", Number)
], AdminUsersArgs.prototype, "limit", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AdminUsersArgs.prototype, "search", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AdminUsersArgs.prototype, "roleFilter", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AdminUsersArgs.prototype, "sortBy", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AdminUsersArgs.prototype, "sortOrder", void 0);
exports.AdminUsersArgs = AdminUsersArgs = __decorate([
    (0, graphql_1.ArgsType)()
], AdminUsersArgs);
//# sourceMappingURL=admin-users.args.js.map