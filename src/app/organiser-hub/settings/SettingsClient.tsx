"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SettingsClient() {
  const [profileForm, setProfileForm] = useState({ organization: '', bio: '', profilePhotoUrl: '', subscriptionPrice: '0' });
  const [credentialsForm, setCredentialsForm] = useState({ username: '', password: '' });
  const [saveStatus, setSaveStatus] = useState('');
  const [orgData, setOrgData] = useState<{slug: string, name: string} | null>(null);

  useEffect(() => {
    fetch('/api/organiser/auth').then(r => r.json()).then(data => {
      if (data.authenticated) {
        setOrgData({ slug: data.slug, name: data.name });
        fetch('/api/organiser/profile').then(r => r.json()).then(data => {
          setProfileForm({ 
            organization: data.organization || '', 
            bio: data.bio || '', 
            profilePhotoUrl: data.profilePhotoUrl || '',
            subscriptionPrice: data.subscriptionPrice !== undefined ? data.subscriptionPrice.toString() : '0'
          });
          setCredentialsForm({ username: data.username || '', password: '' });
        });
      } else {
        window.location.href = '/organiser-hub';
      }
    });
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving...');
    const payload: any = { ...profileForm };
    if (credentialsForm.username) payload.username = credentialsForm.username;
    if (credentialsForm.password) payload.password = credentialsForm.password;

    const res = await fetch('/api/organiser/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      setSaveStatus('Saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } else {
      const err = await res.json();
      setSaveStatus(err.error || 'Failed to save');
    }
  };

  if (!orgData) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-[#0c1c10] pt-6 pb-6 border-b-4 border-[#00873a]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center text-white">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#f6821f] text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase">Organiser Hub</span>
              </div>
              <h1 className="text-3xl font-black text-white">Account Settings</h1>
            </div>
            <div className="flex gap-3">
              <Link href="/organiser-hub" className="border border-white hover:bg-white hover:text-[#0c1c10] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-10 max-w-4xl w-full mx-auto px-4">
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-bold text-[#00873a] uppercase tracking-wide text-sm mb-4">Public Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Profile Photo URL</label>
                <input type="url" value={profileForm.profilePhotoUrl} onChange={e => setProfileForm({...profileForm, profilePhotoUrl: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-[#00873a] focus:border-[#00873a]" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Company / Brand Name</label>
                <input type="text" value={profileForm.organization} onChange={e => setProfileForm({...profileForm, organization: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-[#00873a] focus:border-[#00873a]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Bio / Description</label>
                <textarea value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-[#00873a] focus:border-[#00873a] resize-none"></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-bold text-[#00873a] uppercase tracking-wide text-sm mb-4">Audience & Pricing</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Seat Price / Subscription Price (£ GBP)</label>
                <p className="text-xs text-gray-500 mb-2">The global price per seat for visitors to view your exclusive events and videos.</p>
                <input type="number" step="0.01" min="0" value={profileForm.subscriptionPrice} onChange={e => setProfileForm({...profileForm, subscriptionPrice: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-[#00873a] focus:border-[#00873a]" placeholder="15.00 (or 0 for Free)" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-bold text-[#00873a] uppercase tracking-wide text-sm mb-4">Account Security</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Login Username</label>
                <input type="text" value={credentialsForm.username} onChange={e => setCredentialsForm({...credentialsForm, username: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-[#00873a] focus:border-[#00873a]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">New Password (Optional)</label>
                <input type="password" value={credentialsForm.password} onChange={e => setCredentialsForm({...credentialsForm, password: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-[#00873a] focus:border-[#00873a]" placeholder="Leave blank to keep current" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button type="submit" className="bg-[#00873a] hover:bg-[#00682d] text-white px-6 py-3 rounded-lg font-bold shadow-md transition-colors w-full md:w-auto">
              Save Changes
            </button>
            {saveStatus && (
              <span className={`text-sm font-bold ${saveStatus.includes('Failed') ? 'text-red-600' : 'text-green-700'}`}>{saveStatus}</span>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
