'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { gqlClient } from '../../lib/graphql-client';
import { LOGIN_MUTATION } from '../../lib/queries';
import { useAuth } from '../../lib/auth-context';


const loginSchema = z.object({
  mobile: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>; 



export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  
  const loginMutation = useMutation({
    mutationFn: (values: LoginValues) =>
      gqlClient
        .request<{ login: any }>(LOGIN_MUTATION, { input: values })
        .then((res) => res.login),
    onSuccess: (user) => {
      setUser(user);          
      router.push('/dashboard'); 
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">💳</div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your wallet</p>
        </div>

        <form onSubmit={handleSubmit((v) => loginMutation.mutate(v))} className="space-y-4">
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
              placeholder="Your password"
              {...register('password')}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {loginMutation.isError && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center">
              {(loginMutation.error as any)?.response?.errors?.[0]?.message ??
                'Invalid mobile or password'}
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-blue-600 font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
