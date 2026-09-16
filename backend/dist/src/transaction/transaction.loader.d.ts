import * as DataLoader from 'dataloader';
import { PrismaService } from '../prisma/prisma.service';
export declare function createWalletLoader(prisma: PrismaService): DataLoader<string, any, string>;
