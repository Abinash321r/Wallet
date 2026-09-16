"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const path_1 = require("path");
const prisma_module_1 = require("./prisma/prisma.module");
const prisma_service_1 = require("./prisma/prisma.service");
const auth_module_1 = require("./auth/auth.module");
const wallet_module_1 = require("./wallet/wallet.module");
const transaction_module_1 = require("./transaction/transaction.module");
const transfer_module_1 = require("./transfer/transfer.module");
const admin_module_1 = require("./admin/admin.module");
const transaction_loader_1 = require("./transaction/transaction.loader");
const config_1 = require("@nestjs/config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            graphql_1.GraphQLModule.forRootAsync({
                driver: apollo_1.ApolloDriver,
                imports: [prisma_module_1.PrismaModule],
                inject: [prisma_service_1.PrismaService],
                useFactory: (prisma) => ({
                    autoSchemaFile: (0, path_1.join)(process.cwd(), 'src/schema.gql'),
                    sortSchema: true,
                    context: ({ req, res }) => ({
                        req,
                        res,
                        walletLoader: (0, transaction_loader_1.createWalletLoader)(prisma),
                    }),
                }),
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            wallet_module_1.WalletModule,
            transaction_module_1.TransactionModule,
            transfer_module_1.TransferModule,
            admin_module_1.AdminModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map