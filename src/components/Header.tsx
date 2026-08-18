"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/auth/update')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user);
        }
      })
      .catch(err => console.error(err));
  }, []);

  if (pathname === "/lounge") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e0e8e2] shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
      <div className="mx-auto w-[90%] max-w-[1200px] px-[15px] flex items-center justify-between h-[90px]">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <div className="text-2xl font-black text-[#006818] tracking-tight flex items-center gap-2">
            <span className="bg-gradient-to-br from-[#006818] to-[#004d11] text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
              HTV
            </span>
            HealthSummits
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="font-semibold text-[0.95rem] text-[#1f2e22] hover:text-[#006818] transition-colors py-2">
            Home
          </Link>

          {/* For Viewers Dropdown */}
          <div className="group relative cursor-pointer">
            <div className="font-semibold text-[0.95rem] text-[#1f2e22] hover:text-[#006818] transition-colors py-2 flex items-center gap-1">
              For Viewers <span className="text-[0.7rem]">▼</span>
            </div>
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-[#e0e8e2] rounded-lg shadow-[0_12px_35px_rgba(0,30,10,0.14)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50 py-2">
              <Link href="/events" className="flex items-center gap-2 px-4 py-2.5 text-[0.92rem] font-semibold text-[#1f2e22] hover:bg-[#eaf5eb] hover:text-[#006818] hover:pl-6 transition-all">
                🇬🇧 UK Events & Tickets
              </Link>
              <Link href="/player" className="flex items-center gap-2 px-4 py-2.5 text-[0.92rem] font-semibold text-[#1f2e22] hover:bg-[#eaf5eb] hover:text-[#006818] hover:pl-6 transition-all">
                🎟️ Live Event Player (PIN)
              </Link>
              <Link href="/free-videos" className="flex items-center gap-2 px-4 py-2.5 text-[0.92rem] font-semibold text-[#1f2e22] hover:bg-[#eaf5eb] hover:text-[#006818] hover:pl-6 transition-all">
                🎬 Free Video Vault
              </Link>
            </div>
          </div>

          <Link href="/player" className="font-bold text-[0.95rem] text-[#00873a] flex items-center gap-1.5 transition-colors py-2">
            <span className="w-2 h-2 bg-red-500 rounded-full inline-block animate-pulse"></span>
            Live Player
          </Link>

          {/* For Organisers Dropdown */}
          <div className="group relative cursor-pointer">
            <div className="font-semibold text-[0.95rem] text-[#1f2e22] hover:text-[#006818] transition-colors py-2 flex items-center gap-1">
              For Organisers <span className="text-[0.7rem]">▼</span>
            </div>
            <div className="absolute top-full left-0 mt-2 w-60 bg-white border border-[#e0e8e2] rounded-lg shadow-[0_12px_35px_rgba(0,30,10,0.14)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50 py-2">
              <Link href="/organiser-register" className="flex items-center gap-2 px-4 py-2.5 text-[0.92rem] font-semibold text-[#1f2e22] hover:bg-[#eaf5eb] hover:text-[#006818] hover:pl-6 transition-all">
                Register as Organiser
              </Link>
              <Link href="/organiser-hub" className="flex items-center gap-2 px-4 py-2.5 text-[0.92rem] font-semibold text-[#1f2e22] hover:bg-[#eaf5eb] hover:text-[#006818] hover:pl-6 transition-all">
                Organiser Dashboard
              </Link>
            </div>
          </div>

          <Link href="/contact" className="font-semibold text-[0.95rem] text-[#1f2e22] hover:text-[#006818] transition-colors py-2">
            Contact
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link href="/account" className="flex items-center gap-2 font-semibold text-[0.95rem] text-[#006818] hover:text-[#005213] mr-2">
                <div className="w-8 h-8 bg-[#e77a25] text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                Hello, {user.name ? user.name.split(' ')[0] : 'Member'}
              </Link>
            ) : (
              <>
                <Link href="/signin" className="font-semibold text-[0.95rem] text-[#1f2e22] hover:text-[#006818]">
                  Sign In
                </Link>
                <Link href="/register" className="px-5 py-2.5 border-2 border-[#006818] text-[#006818] font-semibold rounded-lg hover:bg-[#006818] hover:text-white transition-all text-[0.9rem]">
                  Register
                </Link>
              </>
            )}
            <button className="px-5 py-2.5 bg-[#ea8125] text-white font-bold rounded-lg shadow-[0_4px_14px_rgba(234,129,37,0.4)] hover:bg-[#d3701a] hover:shadow-[0_6px_20px_rgba(234,129,37,0.6)] hover:-translate-y-0.5 transition-all text-[0.9rem]">
              Subscribe
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-[#1f2e22]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu (simplified) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#e0e8e2] py-4 px-[5%] shadow-lg absolute w-full left-0">
          <div className="flex flex-col space-y-3">
            <Link href="/" className="font-semibold text-[#1f2e22] py-2 border-b border-gray-100">Home</Link>
            <Link href="/events" className="font-semibold text-[#1f2e22] py-2 border-b border-gray-100">UK Events</Link>
            <Link href="/player" className="font-bold text-[#00873a] py-2 border-b border-gray-100 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span> Live Player
            </Link>
            <Link href="/organiser-hub" className="font-semibold text-[#1f2e22] py-2 border-b border-gray-100">Organiser Dashboard</Link>
            <div className="flex flex-col gap-2 pt-2">
              {user ? (
                <Link href="/account" className="text-center font-semibold text-[#006818] py-2 border-2 border-[#006818] rounded-lg">
                  Hello, {user.name ? user.name.split(' ')[0] : 'Member'} (My Account)
                </Link>
              ) : (
                <>
                  <Link href="/signin" className="text-center font-semibold text-[#1f2e22] py-2">Sign In</Link>
                  <Link href="/register" className="text-center px-4 py-2 border-2 border-[#006818] text-[#006818] font-semibold rounded-lg">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
