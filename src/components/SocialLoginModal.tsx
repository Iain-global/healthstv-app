"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SocialLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: "google" | "facebook" | null;
}

export default function SocialLoginModal({ isOpen, onClose, provider }: SocialLoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !provider) return null;

  const isGoogle = provider === "google";

  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          email: email.trim() || undefined,
          name: name.trim() || undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth-change"));
        }
        onClose();
        router.refresh();
      } else {
        setError(data.error || "Authentication failed.");
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickOneClick = async () => {
    setLoading(true);
    setError("");

    try {
      const defaultName = isGoogle ? "Google Member" : "Facebook Member";
      const defaultEmail = isGoogle ? "google.member@healthsummits.tv" : "facebook.member@healthsummits.tv";

      const res = await fetch("/api/auth/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          email: defaultEmail,
          name: defaultName
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth-change"));
        }
        onClose();
        router.refresh();
      } else {
        setError(data.error || "Authentication failed.");
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200">
        {/* Header */}
        <div className={`px-6 py-5 flex items-center justify-between ${isGoogle ? 'bg-white border-b border-gray-100' : 'bg-[#1877f2] text-white'}`}>
          <div className="flex items-center gap-3">
            {isGoogle ? (
              <svg width="24" height="24" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.5 24c0-1.61-.15-3.16-.42-4.69H24v9.09h12.75c-.53 2.64-2.01 4.88-4.21 6.39l6.53 5.07C42.9 36.27 46.5 30.73 46.5 24z"></path>
                <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-6.53-5.07c-1.8.12-3.83.94-9.36.94-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            )}
            <div>
              <h3 className={`font-bold text-base ${isGoogle ? 'text-gray-900' : 'text-white'}`}>
                {isGoogle ? "Sign in with Google" : "Continue with Facebook"}
              </h3>
              <p className={`text-xs ${isGoogle ? 'text-gray-500' : 'text-blue-100'}`}>
                To continue to HealthSummits.tv
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className={`p-1.5 rounded-lg text-sm font-bold ${isGoogle ? 'text-gray-400 hover:bg-gray-100' : 'text-white/80 hover:bg-white/10'}`}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg font-medium">
              {error}
            </div>
          )}

          {/* Instant 1-Click Button */}
          <button
            onClick={handleQuickOneClick}
            disabled={loading}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mb-4 ${
              isGoogle 
                ? 'bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-800' 
                : 'bg-[#1877f2] hover:bg-[#166fe5] text-white'
            }`}
          >
            {loading ? "Authenticating..." : `⚡ 1-Click Instant Sign In with ${isGoogle ? "Google" : "Facebook"}`}
          </button>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <span className="relative bg-white px-3 text-xs text-gray-400 uppercase font-bold tracking-wider">or specify details</span>
          </div>

          <form onSubmit={handleSocialSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name</label>
              <input
                type="text"
                placeholder={isGoogle ? "e.g. Sarah Jenkins" : "e.g. John Doe"}
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#006818] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{isGoogle ? "Google Email Address" : "Facebook Email Address"}</label>
              <input
                type="email"
                placeholder={isGoogle ? "you@gmail.com" : "you@facebook.com"}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#006818] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#006818] hover:bg-[#004d11] text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? "Connecting..." : "Confirm & Sign In"}
            </button>
          </form>

          <p className="text-[11px] text-gray-400 text-center mt-4">
            By continuing, you agree to HealthSummits.tv Terms of Service & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}