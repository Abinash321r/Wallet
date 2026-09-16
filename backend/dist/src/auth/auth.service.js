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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(input) {
        const { mobile, name, password } = input;
        const existing = await this.prisma.user.findUnique({ where: { mobile } });
        if (existing) {
            throw new common_1.BadRequestException('Mobile number already registered');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: { mobile, name, password: hashedPassword },
            });
            await tx.wallet.create({
                data: { userId: user.id, balance: 0 },
            });
        });
        return true;
    }
    async login(input, res) {
        const { mobile, password } = input;
        const user = await this.prisma.user.findUnique({ where: { mobile } });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid mobile or password');
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch)
            throw new common_1.UnauthorizedException('Invalid mobile or password');
        const payload = { sub: user.id, mobile: user.mobile, role: user.role };
        const token = this.jwtService.sign(payload);
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });
        return { id: user.id, name: user.name, mobile: user.mobile, role: user.role };
    }
    async logout(res) {
        res.clearCookie('auth_token');
        return true;
    }
    async getMe(userId) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, mobile: true, role: true },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map