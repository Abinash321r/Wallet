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
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
function buildDateRange(dateFilter) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    switch (dateFilter) {
        case 'TODAY':
            return { gte: today };
        case 'YESTERDAY': {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return { gte: yesterday, lt: today };
        }
        case 'LAST_WEEK': {
            const lastWeek = new Date(today);
            lastWeek.setDate(lastWeek.getDate() - 7);
            return { gte: lastWeek };
        }
        case 'LAST_MONTH': {
            const lastMonth = new Date(today);
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            return { gte: lastMonth };
        }
        default:
            return undefined;
    }
}
let TransactionService = class TransactionService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyTransactions(walletId, args) {
        const { cursor, limit, dateFilter } = args;
        const where = {
            OR: [
                { senderWalletId: walletId },
                { receiverWalletId: walletId },
            ],
        };
        const dateRange = buildDateRange(dateFilter);
        if (dateRange) {
            where.createdAt = dateRange;
        }
        const rawTransactions = await this.prisma.transaction.findMany({
            where,
            take: limit + 1,
            ...(cursor
                ? { cursor: { id: cursor }, skip: 1 }
                : {}),
            orderBy: { createdAt: 'desc' },
        });
        const hasMore = rawTransactions.length > limit;
        const transactions = hasMore ? rawTransactions.slice(0, limit) : rawTransactions;
        const nextCursor = hasMore ? transactions[transactions.length - 1].id : null;
        return { transactions, nextCursor, hasMore };
    }
    async getAllTransactions() {
        return this.prisma.transaction.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map