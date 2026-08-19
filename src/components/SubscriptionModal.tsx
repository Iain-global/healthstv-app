"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { soundFx } from "@/lib/audio";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export default function SubscriptionModal({
  isOpen,
  onClose,
  initialEmail = ""
}: SubscriptionModalProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  
  // Mock Payment Fields
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8892");
  const [cardExpiry, setCardExpiry] = useState("08/29");
  const [cardCvc, setCardCvc] = useState("321");
  const [cardName, setCardName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Check if current user is logged in
  useEffect(() => {
    if (isOpen) {
      setError("");
      setSuccess(false);
      fetch('/api/auth/update')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setCurrentUser(data.user);
            setEmail(data.user.email || "");
            setName(data.user.name || "");
            setCardName(data.user.name || "");
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSocialSubscribe = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    setError("");
    try {
      // 1. Authenticate with provider
      const socialRes = await fetch('/api/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          email: provider === 'google' ? 'google_subscriber@gmail.com' : 'facebook_subscriber@facebook.com',
          name: provider === 'google' ? 'Google Subscriber' : 'Facebook Subscriber'
        })
      });
      const socialData = await socialRes.json();
      if (!socialRes.ok) {
        throw new Error(socialData.error || 'Social authentication failed');
      }

      // 2. Complete subscription
      const subRes = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const subData = await subRes.json();

      if (subRes.ok && subData.success) {
        soundFx.playSuccess();
        setSuccess(true);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth-change'));
        }
        setTimeout(() => {
          onClose();
        }, 2200);
      } else {
        setError(subData.error || 'Subscription checkout failed');
      }
    } catch (err: any) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || email.split('@')[0],
          email: email.trim(),
          password: password.trim()
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        soundFx.playSuccess();
        setSuccess(true);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth-change'));
        }
        setTimeout(() => {
          onClose();
        }, 2200);
      } else {
        setError(data.error || 'Subscription checkout failed. Please try again.');
      }
    } catch (err) {
      setError('A network error occurred. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0c1c10] via-[#006818] to-[#1a4d26] p-6 text-white text-center relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 w-8 h-8 rounded-full flex items-center justify-center transition-colors font-bold"
          >
            ✕
          </button>
          
          <div className="inline-block bg-[#ea8125] text-white text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm mb-2">
            ⭐ Special Soft Launch Offer
          </div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-1">
            Activate All-Access Pass
          </h3>
          <p className="text-green-100 text-xs md:text-sm font-medium">
            Unlock wellness lectures, masterclasses & exclusive summit live streams.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {success ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-3xl font-bold mx-auto animate-bounce">
                ✓
              </div>
              <h4 className="text-2xl font-black text-gray-900">
                Welcome to HealthSummits.tv All-Access!
              </h4>
              <p className="text-gray-600 text-sm max-w-md mx-auto">
                Your 6-month subscription is now active. All video vaults and virtual summit paywalls have been unlocked.
              </p>
              <div className="text-xs text-green-700 font-bold bg-green-50 py-2 px-4 rounded-lg inline-block">
                🌟 Refreshing your membership pass...
              </div>
            </div>
          ) : (
            <>
              {/* Offer Summary Banner */}
              <div className="bg-gradient-to-br from-[#f6f9f7] to-[#e8f4eb] border-2 border-[#006818]/30 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#006818] block mb-0.5">
                    6-Month Pass
                  </span>
                  <div className="text-3xl font-black text-[#0c1c10]">
                    £1.00 <span className="text-xs font-semibold text-gray-500">/ month</span>
                  </div>
                  <div className="text-xs text-[#006818] font-bold mt-0.5">
                    Billed as a single payment of £6.00 (Reg. £29.94)
                  </div>
                </div>

                <div className="bg-white px-3.5 py-2.5 rounded-xl border border-green-200 text-center shadow-sm shrink-0">
                  <div className="text-[10px] uppercase font-bold text-gray-400">Save</div>
                  <div className="text-xl font-black text-[#ea8125]">80% OFF</div>
                </div>
              </div>

              {/* Perks list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold text-sm">✓</span> Complete Video Vault library access
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold text-sm">✓</span> Live Q&A coach integration
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold text-sm">✓</span> Early-bird summit ticket discounts
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold text-sm">✓</span> Cancel anytime with 1 click
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold border border-red-200">
                  {error}
                </div>
              )}

              {/* 1-Click Fast Social Checkout */}
              {!currentUser && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                    Instant 1-Click Subscribe with:
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSocialSubscribe('google')}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-sm transition-all hover:border-gray-400"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
                        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                        <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1s.7 5.4 1.9 7.8l3.7-2.9z"/>
                        <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"/>
                      </svg>
                      Google Pay
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialSubscribe('facebook')}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </button>
                  </div>

                  <div className="flex items-center gap-3 my-2">
                    <div className="h-px bg-gray-200 flex-1"></div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase">Or with Credit / Debit Card</span>
                    <div className="h-px bg-gray-200 flex-1"></div>
                  </div>
                </div>
              )}

              {/* Checkout Form */}
              <form onSubmit={handleCheckout} className="space-y-4">
                {/* Account Details if not logged in */}
                {!currentUser && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Sarah Connor"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-900 bg-white placeholder-gray-400 outline-none focus:border-[#006818]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="sarah@example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-900 bg-white placeholder-gray-400 outline-none focus:border-[#006818]"
                      />
                    </div>
                  </div>
                )}

                {/* Card Fields */}
                <div className="space-y-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-700">Card Information</span>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold">
                      <span>🔒 256-Bit SSL Encrypted</span>
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      placeholder="Card Number (4532 •••• •••• 8892)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono font-semibold text-gray-900 bg-white placeholder-gray-400 outline-none focus:border-[#006818]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono font-semibold text-gray-900 bg-white placeholder-gray-400 outline-none focus:border-[#006818]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        value={cardCvc}
                        onChange={e => setCardCvc(e.target.value)}
                        placeholder="CVC / CVV"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono font-semibold text-gray-900 bg-white placeholder-gray-400 outline-none focus:border-[#006818]"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#ea8125] hover:bg-[#d3701a] text-white py-3.5 px-4 rounded-xl font-black text-sm shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Activating Subscription...
                    </>
                  ) : (
                    <>
                      🔒 Complete & Activate Pass (£6.00)
                    </>
                  )}
                </button>

                <p className="text-[11px] text-gray-400 text-center">
                  By confirming, you authorize a one-time £6.00 payment for 6 full months of HealthSummits.tv access. Cancel anytime.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
