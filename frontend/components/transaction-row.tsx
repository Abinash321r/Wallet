import { memo } from 'react';

interface Transaction {
  id: string;
  amount: number;
  status: string;
  senderWalletId: string;
  receiverWalletId: string;
  createdAt: string;
}

interface Props {
  transaction: Transaction;
  myWalletId: string;
}






const TransactionRow = memo(function TransactionRow({ transaction, myWalletId }: Props) {
  const isSent = transaction.senderWalletId === myWalletId;
  const amountColor = isSent ? 'text-red-600' : 'text-green-600';
  const sign = isSent ? '-' : '+';

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b hover:bg-gray-50 transition-colors">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-800">
          {isSent ? '↑ Sent' : '↓ Received'}
        </span>
        <span className="text-xs text-gray-400 mt-0.5">
          {new Date(transaction.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
      <div className="flex flex-col items-end">
        <span className={`text-sm font-semibold ${amountColor}`}>
          {sign}${Number(transaction.amount).toFixed(2)}
        </span>
        <span className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">
          {transaction.status}
        </span>
      </div>
    </div>
  );
});

export default TransactionRow;
