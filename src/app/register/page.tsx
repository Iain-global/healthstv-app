"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    const password = formData.get('password') as string;
    const terms = formData.get('terms');

    const telephone = formData.get('telephone') as string;
    const addressLine1 = formData.get('addressLine1') as string;
    const addressLine2 = formData.get('addressLine2') as string;
    const city = formData.get('city') as string;
    const postcode = formData.get('postcode') as string;
    const country = formData.get('country') as string;

    if (!terms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, telephone, addressLine1, addressLine2, city, postcode, country }),
      });

      const data = await res.json();

      if (data.success) {
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
        <div className="max-w-[1000px] w-full bg-white rounded-2xl overflow-hidden shadow-xl flex flex-col md:flex-row">
          
          {/* Left Panel: Creative Inspiration */}
          <div 
            className="hidden md:flex md:w-5/12 p-10 text-white flex-col justify-between relative bg-cover bg-center"
            style={{ 
              backgroundImage: "linear-gradient(135deg, rgba(12,28,16,0.9) 0%, rgba(0,104,24,0.7) 100%), url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop')" 
            }}
          >
            <div>
              <span className="bg-[#e77a25] text-white py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block">
                Soft Launch 2026
              </span>
              <h2 className="text-3xl font-bold text-white mb-6 leading-tight">Elevate Your Vitality</h2>
              <p className="text-white/85 text-lg leading-relaxed mb-6">
                "The lectures on gut-biome healing changed how I approach daily cooking. Truly a goldmine of natural science."
              </p>
              <span className="font-semibold text-[0.95rem] block text-[#e77a25]">— Sarah L., HSTV Subscriber</span>
            </div>
            
            <div className="border-t border-white/10 pt-6 mt-10">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-bold text-white">10,000+</span>
                <span className="text-sm text-white/70">Members Registered</span>
              </div>
              <div className="text-sm text-white/50">Join live interactive Q&A sessions with certified wellness coaches.</div>
            </div>
          </div>

          {/* Right Panel: Registration Form */}
          <div className="md:w-7/12 p-6 md:p-12 flex flex-col justify-center max-h-[85vh] overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Create Your Free Account</h3>
              <p className="text-gray-500 text-sm">Instant access to selected webinars, newsletters & events.</p>
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="telephone">Telephone Number</label>
                  <input 
                    type="tel" id="telephone" name="telephone" 
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#006818] focus:ring-1 focus:ring-[#006818] outline-none text-sm" 
                    placeholder="+44 7123 456789" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="password">Password *</label>
                  <input 
                    type="password" id="password" name="password" 
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#006818] focus:ring-1 focus:ring-[#006818] outline-none text-sm" 
                    placeholder="••••••••" required 
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-2">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Billing Address</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="addressLine1">Address Line 1</label>
                    <input 
                      type="text" id="addressLine1" name="addressLine1" 
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#006818] focus:ring-1 focus:ring-[#006818] outline-none text-sm" 
                      placeholder="123 Wellness Ave" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="addressLine2">Address Line 2</label>
                    <input 
                      type="text" id="addressLine2" name="addressLine2" 
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#006818] focus:ring-1 focus:ring-[#006818] outline-none text-sm" 
                      placeholder="Apt 4B" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="city">City</label>
                      <input 
                        type="text" id="city" name="city" 
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#006818] focus:ring-1 focus:ring-[#006818] outline-none text-sm" 
                        placeholder="London" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="postcode">Postcode</label>
                      <input 
                        type="text" id="postcode" name="postcode" 
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#006818] focus:ring-1 focus:ring-[#006818] outline-none text-sm" 
                        placeholder="SW1A 1AA" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="country">Country</label>
                      <input 
                        type="text" id="country" name="country" 
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#006818] focus:ring-1 focus:ring-[#006818] outline-none text-sm" 
                        placeholder="UK" defaultValue="UK"
                      />
                    </div>
                  </div>
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
