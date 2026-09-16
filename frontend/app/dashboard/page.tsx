'use client';
import { Suspense, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { gqlClient } from '../../lib/graphql-client';
import { MY_WALLET_QUERY } from '../../lib/queries';
import WalletCard from '../../components/wallet-card';
import TransferForm from '../../components/transfer-form';
import TransactionList from '../../components/transaction-list';
import { WalletCardSkeleton } from '../../components/ui/skeleton';




export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  
  
  
  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: () =>
      gqlClient
        .request<{ myWallet: any }>(MY_WALLET_QUERY)
        .then((res) => res.myWallet),
    enabled: !!user, 
    
    
    
    
  });

  
  
  const formattedBalance = useMemo(
    () => `$${Number(wallet?.balance ?? 0).toFixed(2)}`,
    [wallet?.balance],
  );

  if (loading || (!user && !loading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-xl">💳</span>
            <span className="font-bold text-gray-900">Wallet</span>
            <span className="text-sm text-gray-500 hidden sm:block">{formattedBalance}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:block">
              {user?.name || user?.mobile}
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">
              {user?.role}
            </span>
            {user?.role === 'ADMIN' && (
              <button
                onClick={() => router.push('/admin')}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Admin
              </button>
            )}
            <button
              onClick={logout}
              className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Suspense fallback={<WalletCardSkeleton />}>
            <WalletCard wallet={wallet} isLoading={walletLoading} />
          </Suspense>

          <TransferForm
            walletId={wallet?.id ?? ''}
            isFrozen={wallet?.isFrozen ?? false}
          />
        </div>

        {wallet?.id && <TransactionList walletId={wallet.id} />}
      </main>
    </div>
  );
}
