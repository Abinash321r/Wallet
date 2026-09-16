import * as DataLoader from 'dataloader';
import { PrismaService } from '../prisma/prisma.service';

















export function createWalletLoader(prisma: PrismaService) {
  return new DataLoader<string, any>(async (walletIds: readonly string[]) => {
    
    const wallets = await prisma.wallet.findMany({
      where: { id: { in: walletIds as string[] } },
    });

    
    const walletMap = new Map(wallets.map((w) => [w.id, w]));
    return walletIds.map((id) => walletMap.get(id) ?? null);
  });
}
