"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const city = formData.get('city') as string;
    const telephone = formData.get('telephone') as string;
    const password = formData.get('password') as string;
    const terms = formData.get('terms');

    if (!terms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, city, telephone, password }),
      });

      const data = await res.json();

      if (data.success) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth-change'));
        }
        router.push('/account');
        router.refresh();
      } else {
        setError(data.error || 'Failed to register');
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
        <div className="max-w-[1050px] w-full bg-white rounded-2xl overflow-hidden shadow-xl flex flex-col md:flex-row">
          
          {/* Left Panel: Creative Inspiration & Promo */}
          <div 
            className="hidden md:flex md:w-5/12 p-8 text-white flex-col justify-between relative bg-cover bg-center"
            style={{ 
              backgroundImage: "url('/register-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            {/* Top spacer for background logo */}
            <div className="h-12"></div>

            {/* Middle Section: Centered Soft Launch Badge & Offer Card */}
            <div className="my-auto flex flex-col items-center text-center">
              <div className="mb-3">
                <span className="bg-[#e77a25] text-white py-1 px-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md inline-block">
                  Soft Launch 2026
                </span>
              </div>

              {/* Offer Image */}
              <div className="bg-white rounded-2xl p-4 shadow-2xl overflow-hidden border border-white/30 flex items-center justify-center w-full max-w-[280px]">
                <Image 
                  src="/offer-6for6.png" 
                  alt="6 Months for Only £6 Subscription" 
                  width={500} 
                  height={350} 
                  className="w-full h-auto rounded-xl object-contain mx-auto"
                  priority
                />
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-4 mt-6">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl font-bold text-white">850</span>
                <span className="text-sm text-white/70">Members Registered</span>
              </div>
              <div className="text-xs text-white/60">Join live interactive Q&A sessions with certified wellness coaches.</div>
            </div>
          </div>

          {/* Right Panel: Registration Form */}
          <div className="md:w-7/12 p-6 md:p-12 flex flex-col justify-center max-h-[85vh] overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Create Your Free Account</h3>
              <p className="text-gray-500 text-sm">Instant access to selected webinars, newsletters, free video library & events.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="name">Full Name *</label>
                  <input 
                    type="text" id="name" name="name" 
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#006818] focus:ring-1 focus:ring-[#006818] outline-none text-sm" 
                    placeholder="Aiden Gallagher" required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="email">Email Address *</label>
                  <input 
                    type="email" id="email" name="email" 
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#006818] focus:ring-1 focus:ring-[#006818] outline-none text-sm" 
                    placeholder="aiden@example.com" required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="city">City</label>
                  <input 
                    type="text" id="city" name="city" 
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#006818] focus:ring-1 focus:ring-[#006818] outline-none text-sm" 
                    placeholder="London" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="telephone">Telephone Number</label>
                  <input 
                    type="tel" id="telephone" name="telephone" 
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#006818] focus:ring-1 focus:ring-[#006818] outline-none text-sm" 
                    placeholder="+44 7123 456789" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="password">Password *</label>
                  <input 
                    type="password" id="password" name="password" 
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#006818] focus:ring-1 focus:ring-[#006818] outline-none text-sm" 
                    placeholder="••••••••" required 
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 pb-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  name="terms" 
                  className="mt-1 w-4 h-4 text-[#006818] rounded border-gray-300 focus:ring-[#006818]" 
                  required 
                />
                <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed cursor-pointer">
                  I agree to the <Link href="/terms" className="text-[#006818] font-semibold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#006818] font-semibold hover:underline">Privacy Policy</Link>.
                </label>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#006818] hover:bg-[#005213] text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Free Account'}
              </button>
            </form>

            <div className="text-center mt-6 text-xs text-gray-500">
              Already have an account? <Link href="/signin" className="text-[#e77a25] font-semibold hover:underline">Sign in here</Link>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
