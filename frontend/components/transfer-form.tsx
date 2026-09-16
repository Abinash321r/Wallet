'use client';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gqlClient } from '../lib/graphql-client';
import { TRANSFER_MUTATION, DEPOSIT_MUTATION } from '../lib/queries';

const transferSchema = z.object({
  receiverMobile: z
    .string()
    .regex(/^\d{10}$/, 'Must be a 10-digit mobile number'),
  amount: z
    .number({ invalid_type_error: 'Enter a valid amount' })
    .positive('Amount must be positive')
    .min(0.01, 'Minimum transfer is $0.01'),
});

const depositSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Enter a valid amount' })
    .positive('Amount must be positive'),
});

type TransferValues = z.infer<typeof transferSchema>;
type DepositValues = z.infer<typeof depositSchema>;

interface Props {
  walletId: string;
  isFrozen: boolean;
}

export default function TransferForm({ walletId, isFrozen }: Props) {
  const queryClient = useQueryClient();

  
  const transferForm = useForm<TransferValues>({
    resolver: zodResolver(transferSchema),
  });

  const depositForm = useForm<DepositValues>({
    resolver: zodResolver(depositSchema),
  });

  
  const transferMutation = useMutation({
    mutationFn: (values: TransferValues) =>
      gqlClient.request(TRANSFER_MUTATION, {
        input: {
          receiverMobile: values.receiverMobile,
          amount: values.amount,
          
          
          
          idempotencyKey: crypto.randomUUID(),
        },
      }),
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      transferForm.reset(); 
    },
  });

  const depositMutation = useMutation({
    mutationFn: (values: DepositValues) =>
      gqlClient.request(DEPOSIT_MUTATION, { amount: values.amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] }); 
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      depositForm.reset();
    },
  });

  
  const handleTransfer = useCallback(
    transferForm.handleSubmit((values) => transferMutation.mutate(values)),
    [transferForm.handleSubmit],
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">
      {}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Add Funds (Demo)</h2>
        <form
          onSubmit={depositForm.handleSubmit((v) => depositMutation.mutate(v))}
          className="space-y-3"
        >
          <div>
            <input
              type="number"
              step="0.01"
              placeholder="Amount ($)"
              {...depositForm.register('amount', { valueAsNumber: true })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {depositForm.formState.errors.amount && (
              <p className="text-red-500 text-xs mt-1">
                {depositForm.formState.errors.amount.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={depositMutation.isPending}
            className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition"
          >
            {depositMutation.isPending ? 'Adding...' : 'Add Funds'}
          </button>
          {depositMutation.isSuccess && (
            <p className="text-green-600 text-xs text-center">Funds added successfully!</p>
          )}
        </form>
      </div>

      {}
      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Send Money</h2>
        {isFrozen && (
          <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-lg mb-4">
            ❄️ Your wallet is frozen. Transfers are disabled. Contact support.
          </div>
        )}
        <form onSubmit={handleTransfer} className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="Receiver Mobile (10 digits)"
              {...transferForm.register('receiverMobile')}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {transferForm.formState.errors.receiverMobile && (
              <p className="text-red-500 text-xs mt-1">
                {transferForm.formState.errors.receiverMobile.message}
              </p>
            )}
          </div>
          <div>
            <input
              type="number"
              step="0.01"
              placeholder="Amount ($)"
              {...transferForm.register('amount', { valueAsNumber: true })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {transferForm.formState.errors.amount && (
              <p className="text-red-500 text-xs mt-1">
                {transferForm.formState.errors.amount.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isFrozen || transferMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {transferMutation.isPending ? 'Sending...' : 'Send Money'}
          </button>
          {transferMutation.isError && (
            <p className="text-red-500 text-xs text-center">
              {(transferMutation.error as any)?.response?.errors?.[0]?.message ?? 'Transfer failed'}
            </p>
          )}
          {transferMutation.isSuccess && (
            <p className="text-green-600 text-xs text-center">Transfer successful! ✓</p>
          )}
        </form>
      </div>
    </div>
  );
}
