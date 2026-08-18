"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/');
        router.refresh();
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#eaf1ec]">
      <div className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="max-w-[480px] w-full bg-white rounded-2xl overflow-hidden shadow-xl p-10 md:p-12">
          
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h3>
            <p className="text-gray-500 text-base">Access your HealthSummits.tv member area</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#006818] focus:ring-1 focus:ring-[#006818] outline-none transition-colors" 
                placeholder="name@example.com" 
                required 
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-semibold text-gray-700" htmlFor="password">Password</label>
                <button type="button" onClick={() => alert('Password recovery to be implemented.')} className="text-xs font-semibold text-[#e77a25] hover:underline">
                  Forgot?
                </button>
              </div>
              <input 
                type="password" 
                id="password" 
                name="password" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#006818] focus:ring-1 focus:ring-[#006818] outline-none transition-colors" 
                placeholder="••••••••" 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#006818] hover:bg-[#005213] text-white font-bold py-3.5 px-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-8 text-sm text-gray-500">
            Don't have an account? <Link href="/register" className="text-[#e77a25] font-semibold hover:underline">Register free</Link>.
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
