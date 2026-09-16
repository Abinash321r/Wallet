'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { gqlClient } from '../../lib/graphql-client';
import { REGISTER_MUTATION } from '../../lib/queries';


const registerSchema = z.object({
  name: z.string().optional(),
  mobile: z.string().regex(/^\d{10}$/, 'Must be a 10-digit mobile number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();

  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: (values: RegisterValues) =>
      gqlClient.request(REGISTER_MUTATION, { input: values }),
    onSuccess: () => {
      router.push('/login'); 
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">💳</div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">Get your wallet in seconds</p>
        </div>

        <form onSubmit={handleSubmit((v) => registerMutation.mutate(v))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="Your name"
              {...register('name')}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input
              type="text"
              placeholder="10-digit mobile number"
              {...register('mobile')}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.mobile && (
              <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="At least 6 characters"
              {...register('password')}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {registerMutation.isError && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center">
              {(registerMutation.error as any)?.response?.errors?.[0]?.message ??
                'Registration failed'}
            </div>
          )}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
