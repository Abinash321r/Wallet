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
exports.TransferService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
let TransferService = class TransferService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async transfer(senderId, input) {
        const { receiverMobile, amount, idempotencyKey } = input;
        const existingTransaction = await this.prisma.transaction.findUnique({
            where: { idempotencyKey },
        });
        if (existingTransaction) {
            return existingTransaction;
        }
        const senderWallet = await this.prisma.wallet.findUnique({
            where: { userId: senderId },
        });
        if (!senderWallet) {
            throw new common_1.NotFoundException('Sender wallet not found');
        }
        if (senderWallet.isFrozen) {
            throw new common_1.BadRequestException('Your wallet is frozen. Please contact support.');
        }
        const receiver = await this.prisma.user.findUnique({
            where: { mobile: receiverMobile },
            include: { wallet: true },
        });
        if (!receiver || !receiver.wallet) {
            throw new common_1.NotFoundException('Receiver not found');
        }
        if (receiver.id === senderId) {
            throw new common_1.BadRequestException('You cannot transfer money to yourself');
        }
        if (senderWallet.balance < amount) {
            throw new common_1.BadRequestException('Insufficient balance');
        }
        const receiverWallet = receiver.wallet;
        const newTransaction = await this.prisma.$transaction(async (tx) => {
            const [firstId, secondId] = [
                senderWallet.id,
                receiverWallet.id,
            ].sort();
            await tx.$queryRaw `
        SELECT id
        FROM "Wallet"
        WHERE id = ${firstId}
        FOR UPDATE
      `;
            await tx.$queryRaw `
        SELECT id
        FROM "Wallet"
        WHERE id = ${secondId}
        FOR UPDATE
      `;
            const lockedSenderWallet = await tx.wallet.findUnique({
                where: { id: senderWallet.id },
            });
            if (!lockedSenderWallet) {
                throw new common_1.NotFoundException('Sender wallet not found');
            }
            if (lockedSenderWallet.balance < amount) {
                throw new common_1.BadRequestException('Insufficient balance');
            }
            await tx.wallet.update({
                where: { id: senderWallet.id },
                data: {
                    balance: {
                        decrement: amount,
                    },
                },
            });
            await tx.wallet.update({
                where: { id: receiverWallet.id },
                data: {
                    balance: {
                        increment: amount,
                    },
                },
            });
            const transaction = await tx.transaction.create({
                data: {
                    amount,
                    status: 'COMPLETED',
                    idempotencyKey,
                    senderWalletId: senderWallet.id,
                    receiverWalletId: receiverWallet.id,
                },
            });
            await tx.ledgerEntry.createMany({
                data: [
                    {
                        transactionId: transaction.id,
                        walletId: senderWallet.id,
                        type: 'DEBIT',
                        amount,
                    },
                    {
                        transactionId: transaction.id,
                        walletId: receiverWallet.id,
                        type: 'CREDIT',
                        amount,
                    },
                ],
            });
            return transaction;
        });
        return newTransaction;
    }
    async getOrCreateSystemWallet() {
        const SYSTEM_USER_MOBILE = '0000000000';
        let user = await this.prisma.user.findUnique({
            where: { mobile: SYSTEM_USER_MOBILE },
            include: { wallet: true },
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    name: 'System Treasury',
                    mobile: SYSTEM_USER_MOBILE,
                    password: 'unused',
                    role: 'ADMIN',
                    wallet: {
                        create: {
                            balance: 0,
                        },
                    },
                },
                include: {
                    wallet: true,
                },
            });
        }
        return user.wallet;
    }
    async deposit(userId, amount) {
        const wallet = await this.prisma.wallet.findUnique({
            where: { userId },
        });
        if (!wallet) {
            throw new common_1.NotFoundException('Wallet not found');
        }
        const systemWallet = await this.getOrCreateSystemWallet();
        return this.prisma.$transaction(async (tx) => {
            await tx.wallet.update({
                where: { id: wallet.id },
                data: {
                    balance: {
                        increment: amount,
                    },
                },
            });
            const transaction = await tx.transaction.create({
                data: {
                    amount,
                    status: 'COMPLETED',
                    idempotencyKey: (0, crypto_1.randomUUID)(),
                    senderWalletId: systemWallet.id,
                    receiverWalletId: wallet.id,
                },
            });
            await tx.ledgerEntry.createMany({
                data: [
                    {
                        transactionId: transaction.id,
                        walletId: systemWallet.id,
                        type: 'DEBIT',
                        amount,
                    },
                    {
                        transactionId: transaction.id,
                        walletId: wallet.id,
                        type: 'CREDIT',
                        amount,
                    },
                ],
            });
            return tx.wallet.findUnique({
                where: { id: wallet.id },
            });
        });
    }
};
exports.TransferService = TransferService;
exports.TransferService = TransferService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransferService);
//# sourceMappingURL=transfer.service.js.map