import { WalletCardSkeleton } from './ui/skeleton';

interface Wallet {
  id: string;
  balance: number;
  isFrozen: boolean;
}

interface Props {
  wallet: Wallet | undefined;
  isLoading: boolean;
}



export default function WalletCard({ wallet, isLoading }: Props) {
  
  if (isLoading) return <WalletCardSkeleton />;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-sm font-medium text-gray-500 mb-1">Your Balance</p>
      <p className="text-4xl font-bold text-gray-900 mb-3">
        ${Number(wallet?.balance ?? 0).toFixed(2)}
      </p>
      {wallet?.isFrozen ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          ❄️ Wallet Frozen
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          ✅ Active
        </span>
      )}
    </div>
  );
}
