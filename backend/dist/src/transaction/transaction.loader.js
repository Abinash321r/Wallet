"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWalletLoader = createWalletLoader;
const DataLoader = require("dataloader");
function createWalletLoader(prisma) {
    return new DataLoader(async (walletIds) => {
        const wallets = await prisma.wallet.findMany({
            where: { id: { in: walletIds } },
        });
        const walletMap = new Map(wallets.map((w) => [w.id, w]));
        return walletIds.map((id) => walletMap.get(id) ?? null);
    });
}
//# sourceMappingURL=transaction.loader.js.map