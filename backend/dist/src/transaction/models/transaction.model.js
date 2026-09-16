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
exports.PaginatedTransactions = exports.TransactionType = exports.WalletSummary = void 0;
const graphql_1 = require("@nestjs/graphql");
let WalletSummary = class WalletSummary {
};
exports.WalletSummary = WalletSummary;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], WalletSummary.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], WalletSummary.prototype, "balance", void 0);
exports.WalletSummary = WalletSummary = __decorate([
    (0, graphql_1.ObjectType)()
], WalletSummary);
let TransactionType = class TransactionType {
};
exports.TransactionType = TransactionType;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TransactionType.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], TransactionType.prototype, "amount", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TransactionType.prototype, "currency", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TransactionType.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TransactionType.prototype, "senderWalletId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TransactionType.prototype, "receiverWalletId", void 0);
__decorate([
    (0, graphql_1.Field)(() => WalletSummary, { nullable: true }),
    __metadata("design:type", WalletSummary)
], TransactionType.prototype, "senderWallet", void 0);
__decorate([
    (0, graphql_1.Field)(() => WalletSummary, { nullable: true }),
    __metadata("design:type", WalletSummary)
], TransactionType.prototype, "receiverWallet", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], TransactionType.prototype, "createdAt", void 0);
exports.TransactionType = TransactionType = __decorate([
    (0, graphql_1.ObjectType)()
], TransactionType);
let PaginatedTransactions = class PaginatedTransactions {
};
exports.PaginatedTransactions = PaginatedTransactions;
__decorate([
    (0, graphql_1.Field)(() => [TransactionType]),
    __metadata("design:type", Array)
], PaginatedTransactions.prototype, "transactions", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PaginatedTransactions.prototype, "nextCursor", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PaginatedTransactions.prototype, "hasMore", void 0);
exports.PaginatedTransactions = PaginatedTransactions = __decorate([
    (0, graphql_1.ObjectType)()
], PaginatedTransactions);
//# sourceMappingURL=transaction.model.js.map