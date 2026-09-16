'use client';
import { useRef, useState, useCallback, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useInfiniteQuery } from '@tanstack/react-query';
import { gqlClient } from '../lib/graphql-client';
import { MY_TRANSACTIONS_QUERY } from '../lib/queries';
import { useThrottle } from '../hooks/use-throttle';
import TransactionRow from './transaction-row';
import { TransactionRowSkeleton } from './ui/skeleton';



const DATE_FILTERS = [
  { label: 'Today',      value: 'TODAY'          },
  { label: 'Yesterday',  value: 'YESTERDAY'      },
  { label: 'Last Week',  value: 'LAST_WEEK'      },
  { label: 'Last Month', value: 'LAST_MONTH'     },
  { label: 'All',        value: undefined        },
] as const;

type DateFilterValue = typeof DATE_FILTERS[number]['value'];

interface Props {
  walletId: string;
}

const PAGE_SIZE = 20;

export default function TransactionList({ walletId }: Props) {
  
  
  const [activeFilter, setActiveFilter] = useState<DateFilterValue>('TODAY');

  
  
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } = useInfiniteQuery({
    queryKey: ['transactions', walletId, activeFilter],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      gqlClient
        .request<{ myTransactions: any }>(MY_TRANSACTIONS_QUERY, {
          cursor: pageParam,
          limit: PAGE_SIZE,
          dateFilter: activeFilter,     
        })
        .then((res) => res.myTransactions),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: any) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined, 
  });

  
  const allTransactions = useMemo(
    () => data?.pages.flatMap((page: any) => page.transactions) ?? [],
    [data],
  );

  
  const parentRef = useRef<HTMLDivElement>(null);

  
  
  const rowVirtualizer = useVirtualizer({
    count: allTransactions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 65,   
    overscan: 2,               
  });

  
  
  const handleScroll = useThrottle(
    useCallback(() => {
      const el = parentRef.current;
      if (!el) return;
      const isNearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 200;
      if (isNearBottom && hasNextPage && !isFetching) {
        fetchNextPage();
      }
    }, [hasNextPage, isFetching, fetchNextPage]),
    150,
  );

  
  const totalCount = allTransactions.length;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-3">Transactions</h2>
          <div className="flex gap-2">
            {DATE_FILTERS.map((f) => (
              <div key={f.label} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <TransactionRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Transactions</h2>
          {}
          <span className="text-xs text-gray-400">
            {totalCount} shown{hasNextPage ? ', scroll for more' : ''}
          </span>
        </div>

        {}
        <div className="flex flex-wrap gap-2">
          {DATE_FILTERS.map((filter) => {
            const isActive = activeFilter === filter.value;
            return (
              <button
                key={filter.label}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'          
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {allTransactions.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-400 text-sm">
            {activeFilter
              ? `No transactions found for "${DATE_FILTERS.find((f) => f.value === activeFilter)?.label}".`
              : 'No transactions yet.'}
          </p>
          {activeFilter && (
            <button
              onClick={() => setActiveFilter(undefined)}
              className="mt-2 text-blue-500 text-xs hover:underline"
            >
              Show all transactions
            </button>
          )}
        </div>
      ) : (
        <div
          ref={parentRef}
          onScroll={handleScroll}
          className="overflow-auto"
        style={{ height: '390px' }}
        >
        
          <div style={{ height: `${rowVirtualizer.getTotalSize()}px` , position: 'relative' }}>
            {rowVirtualizer.getVirtualItems().map((virtualRow) => (
              <div
                key={virtualRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  transform: `translateY(${virtualRow.start}px)`,
                  width: '100%',
                   height: `${virtualRow.size}px`,
                }}
              >
                <TransactionRow
                  transaction={allTransactions[virtualRow.index]}
                  myWalletId={walletId}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {isFetching && (
        <div className="p-3 text-center text-xs text-gray-400 border-t">
          Loading more transactions...
        </div>
      )}
    </div>
  );
}
