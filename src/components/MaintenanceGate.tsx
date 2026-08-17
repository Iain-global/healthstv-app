"use client";

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function MaintenanceGate({ 
  isMaintenance, 
  children 
}: { 
  isMaintenance: boolean, 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  
  if (isMaintenance && !pathname.startsWith('/admin')) {
    return (
      <div className="min-h-screen bg-[#fafcfb] flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg border-t-4 border-orange-500">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🛠️</span>
          </div>
          <h1 className="text-3xl font-black text-[#1f2e22] mb-4">Down for Maintenance</h1>
          <p className="text-[#5e6d62] text-lg mb-8 leading-relaxed">
            HealthSummits.tv is currently undergoing scheduled maintenance to improve the platform. We will be back online shortly. Thank you for your patience!
          </p>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="w-full h-full bg-orange-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
