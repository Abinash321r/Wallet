'use client';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { gqlClient } from '../../lib/graphql-client';
import { useDebounce } from '../../hooks/use-debounce';
import {
  ADMIN_USERS_QUERY,
  ADMIN_FREEZE_WALLET,
  ADMIN_UNFREEZE_WALLET,
  ADMIN_MAKE_ADMIN,
  ADMIN_DELETE_USER,
} from '../../lib/queries';



interface AdminUserWallet {
  id: string;
  balance: number;
  isFrozen: boolean;
}

interface AdminUser {
  id: string;
  name?: string;
  mobile: string;
  role: string;
  createdAt: string;
  wallet?: AdminUserWallet;
}

interface UsersResponse {
  adminUsers: {
    users: AdminUser[];
    total: number;
    page: number;
    totalPages: number;
  };
}



const SORT_OPTIONS = [
  { label: 'Newest first',    sortBy: 'createdAt', sortOrder: 'desc' },
  { label: 'Oldest first',    sortBy: 'createdAt', sortOrder: 'asc'  },
  { label: 'Mobile A→Z',      sortBy: 'mobile',    sortOrder: 'asc'  },
  { label: 'Mobile Z→A',      sortBy: 'mobile',    sortOrder: 'desc' },
  { label: 'Name A→Z',        sortBy: 'name',      sortOrder: 'asc'  },
  { label: 'Highest balance', sortBy: 'balance',   sortOrder: 'desc' },
  { label: 'Lowest balance',  sortBy: 'balance',   sortOrder: 'asc'  },
];

const ROLE_FILTERS = [
  { label: 'All users',   value: 'ALL'   },
  { label: 'Users only',  value: 'USER'  },
  { label: 'Admins only', value: 'ADMIN' },
];

const PAGE_SIZE = 3;




function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [1]; 

  if (current > 3) pages.push('...'); 

  
  const start = Math.max(2, current - 1);
  const end   = Math.min(total - 1, current + 1);
  for (let p = start; p <= end; p++) pages.push(p);

  if (current < total - 2) pages.push('...'); 

  pages.push(total); 
  return pages;
}



export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  
  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role !== 'ADMIN') router.push('/dashboard');
    }
  }, [user, loading, router]);

  

  
  
  
  
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  const [roleFilter, setRoleFilter]     = useState('ALL');
  const [activeSortIndex, setActiveSortIndex] = useState(0);
  const [currentPage, setCurrentPage]   = useState(1);

  
  
  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, roleFilter, activeSortIndex]);

  const activeSort = SORT_OPTIONS[activeSortIndex];

  

  
  
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      'adminUsers',
      currentPage,
      debouncedSearch,
      roleFilter,
      activeSort.sortBy,
      activeSort.sortOrder,
    ],
    queryFn: () =>
      gqlClient
        .request<UsersResponse>(ADMIN_USERS_QUERY, {
          page: currentPage,
          limit: PAGE_SIZE,
          search: debouncedSearch || undefined,
          roleFilter: roleFilter !== 'ALL' ? roleFilter : undefined,
          sortBy: activeSort.sortBy,
          sortOrder: activeSort.sortOrder,
        })
        .then((res) => res.adminUsers),
        
    enabled: user?.role === 'ADMIN',
    placeholderData: (prev) => prev, 
  });

  const users      = data?.users      ?? [];
  const total      = data?.total      ?? 0;
  const totalPages = data?.totalPages ?? 1;

  

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['adminUsers'] });

  const freezeMutation     = useMutation({ mutationFn: (id: string) => gqlClient.request(ADMIN_FREEZE_WALLET,   { walletId: id }), onSuccess: invalidate });
  const unfreezeMutation   = useMutation({ mutationFn: (id: string) => gqlClient.request(ADMIN_UNFREEZE_WALLET, { walletId: id }), onSuccess: invalidate });

  const [confirmMakeAdmin, setConfirmMakeAdmin] = useState<string | null>(null);
  const [confirmDelete,    setConfirmDelete]    = useState<string | null>(null);

  const makeAdminMutation = useMutation({
    mutationFn: (userId: string) => gqlClient.request(ADMIN_MAKE_ADMIN, { userId }),
    onSuccess: () => { invalidate(); setConfirmMakeAdmin(null); },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => gqlClient.request(ADMIN_DELETE_USER, { userId }),
    onSuccess: () => {
      invalidate();
      setConfirmDelete(null);
      
      if (users.length === 1 && currentPage > 1) setCurrentPage((p) => p - 1);
    },
  });

  

  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen text-gray-400 text-sm">Loading...</div>;
  }
  if (user.role !== 'ADMIN') return null;

  

  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-xl">🛡️</span>
            <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">ADMIN</span>
          </div>
          <button onClick={() => router.push('/dashboard')} className="text-sm text-blue-600 hover:underline font-medium">
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {}
        <div className="bg-white rounded-xl shadow p-4 mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {}
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🔍</span>
              <input
                type="text"
                placeholder="Search by name or mobile..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-8 pr-8 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchInput && (
                <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
                  ✕
                </button>
              )}
            </div>

            {}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {ROLE_FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>

            {}
            <select
              value={activeSortIndex}
              onChange={(e) => setActiveSortIndex(Number(e.target.value))}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {SORT_OPTIONS.map((opt, idx) => <option key={idx} value={idx}>{opt.label}</option>)}
            </select>
          </div>

          {}
          <p className="text-xs text-gray-500">
            {isLoading ? 'Loading...' : `${total} user${total !== 1 ? 's' : ''} found • Page ${currentPage} of ${totalPages}`}
            {isFetching && !isLoading && <span className="ml-2 text-blue-400">Refreshing...</span>}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No users found matching your filters.</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Name', 'Mobile', 'Role', 'Balance', 'Wallet', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-800">{u.name || <span className="text-gray-400 italic">—</span>}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{u.mobile}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      ${Number(u.wallet?.balance ?? 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      {u.wallet?.isFrozen
                        ? <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">❄️ Frozen</span>
                        : <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✅ Active</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {u.wallet && (
                          u.wallet.isFrozen
                            ? <button onClick={() => unfreezeMutation.mutate(u.wallet!.id)} disabled={unfreezeMutation.isPending} className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 disabled:opacity-50 transition">Unfreeze</button>
                            : <button onClick={() => freezeMutation.mutate(u.wallet!.id)}   disabled={freezeMutation.isPending}   className="text-xs bg-blue-600  text-white px-2 py-1 rounded hover:bg-blue-700  disabled:opacity-50 transition">Freeze</button>
                        )}
                        {u.role !== 'ADMIN' && (
                          <button onClick={() => setConfirmMakeAdmin(u.id)} className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition">
                            Make Admin
                          </button>
                        )}
                        {u.id !== user.id && (
                          <button onClick={() => setConfirmDelete(u.id)} className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition">
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {}
          {totalPages > 1 && (
            <div className="px-4 py-4 border-t flex items-center justify-between">
              {}
              <p className="text-xs text-gray-500">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, total)} of {total}
              </p>

              {}
              <div className="flex items-center gap-1">
                {}
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1 || isFetching}
                  className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  ← Prev
                </button>

                {}
                {getPageNumbers(currentPage, totalPages).map((p, idx) =>
                  p === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 py-1.5 text-sm text-gray-400">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p as number)}
                      disabled={isFetching}
                      className={`w-9 h-9 text-sm rounded-lg font-medium transition ${
                        currentPage === p
                          ? 'bg-blue-600 text-white shadow-sm'          
                          : 'border hover:bg-gray-50 text-gray-700'     
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === totalPages || isFetching}
                  className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next →
                </button>
              </div>

              {totalPages > 5 && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Go to</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    defaultValue={currentPage}
                    key={currentPage}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = parseInt((e.target as HTMLInputElement).value);
                        if (val >= 1 && val <= totalPages) setCurrentPage(val);
                      }
                    }}
                    className="w-14 border rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span>of {totalPages}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {confirmMakeAdmin && (
        <ConfirmDialog
          title="Promote to Admin?"
          message="This will give the user full admin access. You cannot undo this from the UI."
          confirmLabel="Yes, Make Admin"
          confirmClass="bg-purple-600 hover:bg-purple-700"
          isPending={makeAdminMutation.isPending}
          onConfirm={() => makeAdminMutation.mutate(confirmMakeAdmin)}
          onCancel={() => setConfirmMakeAdmin(null)}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Delete user permanently?"
          message="This deletes the user, their wallet, and all their transaction history. This cannot be undone."
          confirmLabel="Yes, Delete"
          confirmClass="bg-red-600 hover:bg-red-700"
          isPending={deleteUserMutation.isPending}
          onConfirm={() => deleteUserMutation.mutate(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

function ConfirmDialog({
  title, message, confirmLabel, confirmClass, isPending, onConfirm, onCancel,
}: {
  title: string; message: string; confirmLabel: string; confirmClass: string;
  isPending: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} disabled={isPending} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 transition">Cancel</button>
          <button onClick={onConfirm} disabled={isPending} className={`px-4 py-2 text-sm text-white rounded-lg disabled:opacity-50 transition ${confirmClass}`}>
            {isPending ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
