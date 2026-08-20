"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SubscriptionModal from "./SubscriptionModal";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  if (pathname === "/lounge") {
    return null;
  }

  return (
    <footer className="bg-white border-t border-[#e0e8e2] pt-16 pb-8">
      <div className="mx-auto w-[90%] max-w-[1200px] px-[15px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Company Info */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <Image src="/logo.png" alt="HealthSummits.tv" width={325} height={80} className="h-16 w-auto" />
            </Link>
            <p className="text-[#5e6d62] text-[0.95rem] leading-relaxed mb-6">
              Premium streaming platform dedicated to leading health and wellbeing summits, webinars, and expert talks.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-[#eaf5eb] flex items-center justify-center text-[#006818] hover:bg-[#006818] hover:text-white transition-colors cursor-pointer" title="Facebook">
                <span className="font-bold">f</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#eaf5eb] flex items-center justify-center text-[#006818] hover:bg-[#006818] hover:text-white transition-colors cursor-pointer" title="X (Twitter)">
                <span className="font-bold">X</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#eaf5eb] flex items-center justify-center text-[#006818] hover:bg-[#006818] hover:text-white transition-colors cursor-pointer" title="YouTube">
                <span className="font-bold">yt</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#eaf5eb] flex items-center justify-center text-[#006818] hover:bg-[#006818] hover:text-white transition-colors cursor-pointer" title="LinkedIn">
                <span className="font-bold">in</span>
              </div>
            </div>
          </div>

          {/* For Viewers */}
          <div>
            <h4 className="font-bold text-[1.1rem] text-[#0c1c10] mb-5">For Viewers</h4>
            <ul className="space-y-3">
              <li><Link href="/events" className="text-[#5e6d62] hover:text-[#006818] transition-colors">UK Events</Link></li>
              <li><Link href="/player" className="text-[#5e6d62] hover:text-[#006818] transition-colors">Live Event Player</Link></li>
              <li><Link href="/free-videos" className="text-[#5e6d62] hover:text-[#006818] transition-colors">Free Video Vault</Link></li>
              <li><Link href="/contact" className="text-[#5e6d62] hover:text-[#006818] transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* For Organisers */}
          <div>
            <h4 className="font-bold text-[1.1rem] text-[#0c1c10] mb-5">For Organisers</h4>
            <ul className="space-y-3">
              <li><Link href="/founder-members" className="text-[#ea8125] font-bold hover:text-[#d3701a] transition-colors">Founder Members Offer (£0)</Link></li>
              <li><Link href="/organiser-register" className="text-[#5e6d62] hover:text-[#006818] transition-colors">Become an Organiser</Link></li>
              <li><Link href="/organiser-register#roadmap" className="text-[#5e6d62] hover:text-[#006818] transition-colors">Roadmap</Link></li>
              <li><Link href="/organiser-register#packages" className="text-[#5e6d62] hover:text-[#006818] transition-colors">Livestream Packages</Link></li>
            </ul>
          </div>

          {/* Membership */}
          <div>
            <h4 className="font-bold text-[1.1rem] text-[#0c1c10] mb-5">Membership</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => setIsSubModalOpen(true)}
                  className="text-[#5e6d62] hover:text-[#006818] transition-colors font-medium text-left"
                >
                  Subscribe (£1/mo)
                </button>
              </li>
              <li><Link href="/#pricing-table" className="text-[#5e6d62] hover:text-[#006818] transition-colors">Compare Options</Link></li>
              <li><Link href="/faq" className="text-[#5e6d62] hover:text-[#006818] transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-[#fafcfb] p-6 rounded-xl border border-[#e0e8e2] mb-8">
          <p className="text-[0.85rem] text-[#5e6d62] leading-relaxed">
            <strong className="text-[#0c1c10]">Medical Disclaimer:</strong> This website contains general information about medical conditions, health, fitness, and treatment options. The content is provided for informational and educational purposes only and should not be considered a substitute for professional medical advice, diagnosis, or treatment. Always consult your doctor or another qualified healthcare professional before making decisions about your health, diet, or treatment plans.
          </p>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#e0e8e2]">
          <p className="text-[#5e6d62] text-[0.9rem] mb-4 md:mb-0">
            &copy; {currentYear} HealthSummits.tv. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-[#5e6d62] hover:text-[#006818] text-[0.9rem] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[#5e6d62] hover:text-[#006818] text-[0.9rem] transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>

      {/* Subscription Paywall Modal */}
      <SubscriptionModal 
        isOpen={isSubModalOpen} 
        onClose={() => setIsSubModalOpen(false)} 
      />
    </footer>
  );
}
