"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountPanel() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',
    country: '',
    password: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/update');
      if (res.status === 401) {
        router.push('/signin');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          name: data.user.name || '',
          email: data.user.email || '',
          telephone: data.user.telephone || '',
          addressLine1: data.user.addressLine1 || '',
          addressLine2: data.user.addressLine2 || '',
          city: data.user.city || '',
          postcode: data.user.postcode || '',
          country: data.user.country || '',
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/auth/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setFormData(prev => ({ ...prev, password: '' })); // clear password field
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/signin');
    router.refresh();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#eaf1ec]">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#eaf1ec]">
      
      <main className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 bg-[#0c1c10] text-white">
                <div className="w-16 h-16 bg-[#e77a25] rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  {formData.name.charAt(0).toUpperCase() || 'U'}
                </div>
                <h2 className="text-xl font-bold">{formData.name}</h2>
                <p className="text-white/70 text-sm">{formData.email}</p>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <button className="text-left px-4 py-3 rounded-lg bg-[#eaf1ec] text-[#006818] font-semibold transition-colors">
                  Profile Settings
                </button>
                <button 
                  onClick={() => alert('Stripe Customer Portal integration coming soon!')}
                  className="text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-semibold transition-colors"
                >
                  Manage Subscriptions
                </button>
                <div className="h-px bg-gray-200 my-2"></div>
                <button onClick={handleLogout} className="text-left px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 font-semibold transition-colors">
                  Log Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-2/3">
            <div className="bg-white rounded-xl shadow-md p-5 md:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h3>
              
              {message.text && (
                <div className={`p-4 rounded-lg mb-6 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-6">
                
                {/* Personal Details */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Personal Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="name">Full Name</label>
                      <input 
                        type="text" id="name" name="name" 
                        value={formData.name} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#006818] focus:ring-1 focus:ring-[#006818] outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="email">Email Address</label>
                      <input 
                        type="email" id="email" name="email" 
                        value={formData.email} readOnly disabled
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="telephone">Telephone Number</label>
                      <input 
                        type="tel" id="telephone" name="telephone" 
                        value={formData.telephone} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#006818] focus:ring-1 focus:ring-[#006818] outline-none" 
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Address */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 mt-8">Billing Address</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="addressLine1">Address Line 1</label>
                      <input 
                        type="text" id="addressLine1" name="addressLine1" 
                        value={formData.addressLine1} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#006818] focus:ring-1 focus:ring-[#006818] outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="addressLine2">Address Line 2 (Optional)</label>
                      <input 
                        type="text" id="addressLine2" name="addressLine2" 
                        value={formData.addressLine2} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#006818] focus:ring-1 focus:ring-[#006818] outline-none" 
                      />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="city">City</label>
                        <input 
                          type="text" id="city" name="city" 
                          value={formData.city} onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#006818] focus:ring-1 focus:ring-[#006818] outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="postcode">Postcode</label>
                        <input 
                          type="text" id="postcode" name="postcode" 
                          value={formData.postcode} onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#006818] focus:ring-1 focus:ring-[#006818] outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="country">Country</label>
                        <input 
                          type="text" id="country" name="country" 
                          value={formData.country} onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#006818] focus:ring-1 focus:ring-[#006818] outline-none" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 mt-8">Security</h4>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="password">New Password</label>
                    <input 
                      type="password" id="password" name="password" 
                      value={formData.password} onChange={handleChange}
                      placeholder="Leave blank to keep current password"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#006818] focus:ring-1 focus:ring-[#006818] outline-none" 
                    />
                    <p className="text-xs text-gray-500 mt-1">Only fill this out if you wish to change your password.</p>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="bg-[#006818] hover:bg-[#005213] text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}
