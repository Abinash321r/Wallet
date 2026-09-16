




export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      aria-hidden="true"
    />
  );
}

export function WalletCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-5 w-16" />
    </div>
  );
}

export function TransactionRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="space-y-2 items-end flex flex-col">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}
