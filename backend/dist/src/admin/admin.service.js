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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUsers(args) {
        const { page, limit, search, roleFilter, sortBy, sortOrder } = args;
        const where = {};
        if (search && search.trim()) {
            where.OR = [
                { name: { contains: search.trim(), mode: 'insensitive' } },
                { mobile: { contains: search.trim() } },
            ];
        }
        if (roleFilter && roleFilter !== 'ALL') {
            where.role = roleFilter;
        }
        let orderBy = { createdAt: 'desc' };
        if (sortBy === 'name')
            orderBy = { name: sortOrder === 'asc' ? 'asc' : 'desc' };
        if (sortBy === 'mobile')
            orderBy = { mobile: sortOrder === 'asc' ? 'asc' : 'desc' };
        if (sortBy === 'createdAt')
            orderBy = { createdAt: sortOrder === 'asc' ? 'asc' : 'desc' };
        if (sortBy === 'balance')
            orderBy = { wallet: { balance: sortOrder === 'asc' ? 'asc' : 'desc' } };
        const [total, users] = await Promise.all([
            this.prisma.user.count({ where }),
            this.prisma.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy,
                select: {
                    id: true,
                    name: true,
                    mobile: true,
                    role: true,
                    createdAt: true,
                    wallet: { select: { id: true, balance: true, isFrozen: true } },
                },
            }),
        ]);
        return {
            users,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async freezeWallet(walletId) {
        const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
        if (!wallet)
            throw new common_1.NotFoundException('Wallet not found');
        return this.prisma.wallet.update({
            where: { id: walletId },
            data: { isFrozen: true },
        });
    }
    async unfreezeWallet(walletId) {
        const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
        if (!wallet)
            throw new common_1.NotFoundException('Wallet not found');
        return this.prisma.wallet.update({
            where: { id: walletId },
            data: { isFrozen: false },
        });
    }
    async makeAdmin(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({
            where: { id: userId },
            data: { role: 'ADMIN' },
            select: {
                id: true,
                name: true,
                mobile: true,
                role: true,
                createdAt: true,
                wallet: { select: { id: true, balance: true, isFrozen: true } },
            },
        });
    }
    async deleteUser(userId) {
        const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
        await this.prisma.$transaction(async (tx) => {
            if (wallet) {
                const transactions = await tx.transaction.findMany({
                    where: {
                        OR: [
                            { senderWalletId: wallet.id },
                            { receiverWalletId: wallet.id },
                        ],
                    },
                    select: { id: true },
                });
                const transactionIds = transactions.map((t) => t.id);
                if (transactionIds.length > 0) {
                    await tx.ledgerEntry.deleteMany({
                        where: { transactionId: { in: transactionIds } },
                    });
                    await tx.transaction.deleteMany({
                        where: { id: { in: transactionIds } },
                    });
                }
                await tx.wallet.delete({ where: { id: wallet.id } });
            }
            await tx.user.delete({ where: { id: userId } });
        });
        return true;
    }
    async getAllTransactions() {
        return this.prisma.transaction.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map