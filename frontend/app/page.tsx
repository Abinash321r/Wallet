import type { Metadata } from 'next';
import Link from 'next/link';



export const metadata: Metadata = {
  title: 'Secure Digital Wallet',
  description:
    'Send and receive money instantly. Track your transactions. Stay in control of your finances.',
  openGraph: {
    title: 'Wallet App — Secure Digital Wallet',
    description: 'Send and receive money instantly with our secure digital wallet.',
    type: 'website',
    url: 'http://localhost:3000',
  },
  
  
  alternates: { canonical: 'http://localhost:3000' },
};





export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <main className="flex flex-col items-center text-center max-w-2xl px-6">
        <div className="text-7xl mb-6">💳</div>

        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">Wallet App</h1>

        <p className="text-xl text-gray-500 mb-10 leading-relaxed">
          Send money instantly. Track every transaction. Your finances, simplified.
        </p>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 bg-white text-gray-800 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-sm"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl mb-2">⚡</div>
            <p className="text-sm font-medium text-gray-700">Instant Transfers</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🔒</div>
            <p className="text-sm font-medium text-gray-700">Secure by Design</p>
          </div>
          <div>
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm font-medium text-gray-700">Full Audit Trail</p>
          </div>
        </div>
      </main>
    </div>
  );
}
