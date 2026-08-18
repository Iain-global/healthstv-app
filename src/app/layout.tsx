import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import MaintenanceGate from "@/components/MaintenanceGate";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "HealthSummits.tv",
  description: "Watch leading health summits live and on demand",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let isMaintenance = false;
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { id: 'MAINTENANCE_MODE' }
    });
    if (setting?.value === 'true') isMaintenance = true;
  } catch (e) {
    // Graceful fallback if DB is unreachable
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fafcfb]">
        <MaintenanceGate isMaintenance={isMaintenance}>
          {children}
        </MaintenanceGate>
      </body>
    </html>
  );
}
