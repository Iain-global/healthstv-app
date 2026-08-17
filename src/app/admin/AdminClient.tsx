"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type OrganiserProfile = any;
type User = any;

type Video = {
  id: number;
  title: string;
  category: string | null;
  isFree: boolean;
  isApproved: boolean;
  videoUrl: string;
  thumbnailUrl: string | null;
  description: string | null;
  organiserId: number;
  organiser?: OrganiserProfile;
  createdAt: string;
  pendingEdits?: any;
};

type Event = {
  id: number;
  title: string;
  format: string | null;
  date: string;
  price: number;
  isApproved: boolean;
  organiser?: OrganiserProfile;
  pendingEdits?: any;
};

export default function AdminClient({ 
  initialVideos, 
  initialEvents,
  organisers, 
  users 
}: { 
  initialVideos: Video[], 
  initialEvents: Event[],
  organisers: OrganiserProfile[], 
  users: User[] 
}) {
  const router = useRouter();
  
  // State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [loginError, setLoginError] = useState(false);
  
  const [activeTab, setActiveTab] = useState("vault");
  const [videos, setVideos] = useState(initialVideos);
  const [events, setEvents] = useState(initialEvents);
  const [logs, setLogs] = useState<any[]>([]);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '' });
  const [passwordStatus, setPasswordStatus] = useState({ error: '', success: '' });

  const TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

  // Initialize from cookie
  useEffect(() => {
    const authCookie = document.cookie.split('; ').find(row => row.startsWith('adminAuth='));
    if (authCookie && authCookie.split('=')[1] === 'true') {
      setIsAuthenticated(true);
      resetAuthCookie();
    }
  }, []);

  const resetAuthCookie = () => {
    const expires = new Date(Date.now() + TIMEOUT_MS).toUTCString();
    document.cookie = `adminAuth=true; expires=${expires}; path=/admin`;
  };

  // Keep session alive on interaction
  useEffect(() => {
    if (!isAuthenticated) return;
    
    let throttleTimeout: NodeJS.Timeout | null = null;
    const handleActivity = () => {
      if (throttleTimeout) return;
      throttleTimeout = setTimeout(() => {
        resetAuthCookie();
        throttleTimeout = null;
      }, 30000); // Refresh cookie max once per 30 seconds
    };

    const events = ['click', 'keypress', 'scroll'];
    events.forEach(e => document.addEventListener(e, handleActivity));
    return () => events.forEach(e => document.removeEventListener(e, handleActivity));
  }, [isAuthenticated]);

  // Fetch Settings and Logs
  useEffect(() => {
    if (activeTab === 'settings' && isAuthenticated) {
      fetch('/api/admin/logs').then(r => r.json()).then(setLogs);
      fetch('/api/admin/settings').then(r => r.json()).then(data => setIsMaintenance(!!data.maintenanceMode));
    }
  }, [activeTab, isAuthenticated]);

  const handleMaintenanceToggle = async () => {
    const newState = !isMaintenance;
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maintenanceMode: newState })
    });
    if (res.ok) {
      setIsMaintenance(newState);
      fetch('/api/admin/logs').then(r => r.json()).then(setLogs);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus({ error: '', success: '' });
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: passwordForm.current, newPassword: passwordForm.new })
    });
    if (res.ok) {
      setPasswordStatus({ error: '', success: 'Password updated successfully!' });
      setPasswordForm({ current: '', new: '' });
      fetch('/api/admin/logs').then(r => r.json()).then(setLogs);
    } else {
      setPasswordStatus({ error: 'Failed to update password. Check current password.', success: '' });
    }
  };

  // Video Modal State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [videoForm, setVideoForm] = useState({
    title: '', category: '', isFree: true, organiserId: '', videoUrl: '', thumbnailUrl: '', description: ''
  });

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        setIsAuthenticated(true);
        setLoginError(false);
        resetAuthCookie();
      } else {
        setLoginError(true);
      }
    } catch (err) {
      setLoginError(true);
    }
  };

  const handleVideoApproval = async (id: number, isApproved: boolean) => {
    try {
      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApproved })
      });
      if (res.ok) {
        setVideos(videos.map(v => {
          if (v.id === id) {
            // Merge pendingEdits back to the video object in state
            if (isApproved && v.pendingEdits) {
              return { ...v, ...v.pendingEdits, isApproved: true, pendingEdits: null };
            }
            return { ...v, isApproved };
          }
          return v;
        }));
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEventApproval = async (id: number, isApproved: boolean) => {
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApproved })
      });
      if (res.ok) {
        setEvents(events.map(e => {
          if (e.id === id) {
            if (isApproved && e.pendingEdits) {
              return { ...e, ...e.pendingEdits, isApproved: true, pendingEdits: null };
            }
            return { ...e, isApproved };
          }
          return e;
        }));
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openVideoModal = (video: Video | null = null) => {
    if (video) {
      setEditingVideo(video);
      setVideoForm({
        title: video.title,
        category: video.category || '',
        isFree: video.isFree,
        organiserId: video.organiserId.toString(),
        videoUrl: video.videoUrl,
        thumbnailUrl: video.thumbnailUrl || '',
        description: video.description || ''
      });
    } else {
      setEditingVideo(null);
      setVideoForm({
        title: '', category: '', isFree: true, organiserId: organisers[0]?.id.toString() || '', videoUrl: '', thumbnailUrl: '', description: ''
      });
    }
    setIsVideoModalOpen(true);
  };

  const saveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingVideo ? 'PUT' : 'POST';
    const body = editingVideo ? { id: editingVideo.id, ...videoForm } : videoForm;

    try {
      const res = await fetch('/api/admin/videos', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        const savedVideo = await res.json();
        if (editingVideo) {
          setVideos(videos.map(v => v.id === savedVideo.id ? savedVideo : v));
        } else {
          setVideos([savedVideo, ...videos]);
        }
        setIsVideoModalOpen(false);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteVideo = async (id: number) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    try {
      const res = await fetch(`/api/admin/videos?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setVideos(videos.filter(v => v.id !== id));
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="bg-[#fafcfb] min-h-screen pt-20 pb-32">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white p-10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border-t-[5px] border-[#d93025]">
            <div className="text-center mb-8">
              <div className="bg-[#fde8e8] text-[#c81e1e] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
              </div>
              <h2 className="text-2xl font-black text-[#1f2e22] mb-1">Admin Security Gate</h2>
              <p className="text-[#5e6d62] text-sm mb-4">Sign in to access platform moderation controls</p>
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg text-left">
                <strong>⚠️ Security Notice:</strong> All login attempts and administrative actions are logged and monitored.
              </div>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-bold text-[#1f2e22] mb-2">Username</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#d93025]"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-[#1f2e22] mb-2">Password</label>
                <input 
                  type="password" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#d93025]"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              {loginError && <p className="text-red-500 text-sm mb-4 font-bold">Invalid credentials</p>}
              <button type="submit" className="w-full bg-[#d93025] hover:bg-[#b91c1c] text-white font-bold py-3.5 rounded-lg transition-colors">
                Sign In as Administrator
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  const liveVideos = videos; // Show all videos in the vault
  const pendingVideos = videos.filter(v => !v.isApproved || v.pendingEdits);
  const pendingOrganisers = organisers.filter(o => !o.isVerified);

  return (
    <>
      <div className="bg-[#1f2e22] py-8 px-4">
        <div className="container mx-auto max-w-[1200px]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-[#d93025] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">Admin Portal</span>
                <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 font-bold">
                  🛡️ Master Administrator
                </span>
              </div>
              <h1 className="text-3xl font-black text-white m-0">Platform Governance & Moderation</h1>
              <p className="text-white/80 text-sm mt-2">Manage organiser authorisations, moderate video lecture submissions, and curate site-wide content.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/free-videos" className="border border-white/30 text-white hover:bg-white/10 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors">
                👁️ View Live Video Vault
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-[1200px] px-4 mt-8">
        
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">👥</div>
            <div>
              <div className="text-2xl font-black text-[#1f2e22]">{organisers.length}</div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wide">Total Organisers</div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-xl font-bold">ℹ️</div>
            <div>
              <div className="text-2xl font-black text-[#1f2e22]">{pendingOrganisers.length}</div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wide">Pending Approvals</div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xl font-bold">📹</div>
            <div>
              <div className="text-2xl font-black text-[#1f2e22]">{pendingVideos.length + events.filter(e => !e.isApproved).length}</div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wide">In Moderation</div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xl font-bold">✓</div>
            <div>
              <div className="text-2xl font-black text-[#1f2e22]">{videos.filter(v => v.isApproved).length}</div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wide">Live Videos</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-2">
          <button 
            onClick={() => setActiveTab('orgs')}
            className={`px-4 py-2.5 font-bold text-sm rounded-t-lg transition-colors flex items-center gap-2 ${activeTab === 'orgs' ? 'bg-white border border-b-0 border-gray-200 text-[#00873a]' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            📋 Organiser Authorisations
            {pendingOrganisers.length > 0 && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-[10px]">{pendingOrganisers.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('mod')}
            className={`px-4 py-2.5 font-bold text-sm rounded-t-lg transition-colors flex items-center gap-2 ${activeTab === 'mod' ? 'bg-white border border-b-0 border-gray-200 text-[#00873a]' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            🎬 Video Moderation
            {pendingVideos.length > 0 && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-[10px]">{pendingVideos.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('event-mod')}
            className={`px-4 py-2.5 font-bold text-sm rounded-t-lg transition-colors flex items-center gap-2 ${activeTab === 'event-mod' ? 'bg-white border border-b-0 border-gray-200 text-[#00873a]' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            📅 Event Moderation
            {events.filter(e => !e.isApproved).length > 0 && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-[10px]">{events.filter(e => !e.isApproved).length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-2.5 font-bold text-sm rounded-t-lg transition-colors flex items-center gap-2 ${activeTab === 'vault' ? 'bg-white border border-b-0 border-gray-200 text-[#00873a]' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            📺 Video Vault Catalog
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 font-bold text-sm rounded-t-lg transition-colors flex items-center gap-2 ${activeTab === 'users' ? 'bg-white border border-b-0 border-gray-200 text-[#00873a]' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            👥 Registered Users
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 font-bold text-sm rounded-t-lg transition-colors flex items-center gap-2 ${activeTab === 'settings' ? 'bg-white border border-b-0 border-gray-200 text-[#00873a]' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            ⚙️ Platform Settings
          </button>
        </div>

        {/* Tab Content: Video Vault */}
        {activeTab === 'vault' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-black text-[#1f2e22]">Live Video Vault Catalog</h2>
                <p className="text-gray-500 text-sm mt-1">Manage public and subscriber video lectures currently streaming on the platform.</p>
              </div>
              <button 
                onClick={() => openVideoModal()}
                className="bg-[#00873a] hover:bg-[#006818] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
              >
                + Add Platform Video
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-y border-gray-200">
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Title</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Category</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Access Tier</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {liveVideos.map(video => (
                    <tr key={video.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#1f2e22]">{video.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{video.organiser?.name || "Platform Staff"}</div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {video.category || "Uncategorized"}
                      </td>
                      <td className="py-4 px-4">
                        {video.isFree ? 
                          <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold border border-green-100">Free</span> : 
                          <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs font-bold border border-orange-100">Subscriber Only</span>
                        }
                      </td>
                      <td className="py-4 px-4">
                        {video.isApproved ? (
                          <span className="text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-bold">✓ Live</span>
                        ) : (
                          <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs font-bold border border-gray-200">👁️ Hidden</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => openVideoModal(video)}
                            className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded text-xs font-bold transition-colors"
                          >
                            Edit
                          </button>
                          {video.isApproved ? (
                            <button 
                              onClick={() => handleVideoApproval(video.id, false)}
                              className="text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded text-xs font-bold transition-colors"
                            >
                              Hide
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleVideoApproval(video.id, true)}
                              className="text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded text-xs font-bold transition-colors"
                            >
                              Show
                            </button>
                          )}
                          <button 
                            onClick={() => deleteVideo(video.id)}
                            className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded text-xs font-bold transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {liveVideos.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">No live videos found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Video Moderation */}
        {activeTab === 'mod' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-black text-[#1f2e22]">Submitted Videos Moderation</h2>
              <p className="text-gray-500 text-sm mt-1">Review recordings submitted by verified organisers before they appear live.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-y border-gray-200">
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Title</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Presenter</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pendingVideos.map(video => (
                    <tr key={video.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#1f2e22]">{video.title}</div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {video.organiser?.name || "Unknown"}
                      </td>
                      <td className="py-4 px-4">
                        {video.pendingEdits ? (
                          <span className="text-orange-700 bg-orange-100 px-2 py-1 rounded-full text-xs font-bold border border-orange-200">Pending Edits</span>
                        ) : (
                          <span className="text-orange-700 bg-orange-100 px-2 py-1 rounded-full text-xs font-bold">Pending Approval</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button className="text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-xs font-bold transition-colors">Preview</button>
                          <button 
                            onClick={() => handleVideoApproval(video.id, true)}
                            className="text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded text-xs font-bold shadow-sm transition-colors"
                          >
                            ✓ Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pendingVideos.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">Queue is empty. All videos approved!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Event Moderation */}
        {activeTab === 'event-mod' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-black text-[#1f2e22]">Submitted Events Moderation</h2>
              <p className="text-gray-500 text-sm mt-1">Review events submitted by verified organisers before they appear live.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-y border-gray-200">
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Event Title</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Organiser</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.filter(e => !e.isApproved || e.pendingEdits).map(evt => (
                    <tr key={evt.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#1f2e22]">{evt.title}</div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {evt.organiser?.name || "Unknown"}
                      </td>
                      <td className="py-4 px-4">
                        {evt.pendingEdits ? (
                          <span className="text-orange-700 bg-orange-100 px-2 py-1 rounded-full text-xs font-bold border border-orange-200">Pending Edits</span>
                        ) : (
                          <span className="text-orange-700 bg-orange-100 px-2 py-1 rounded-full text-xs font-bold">Pending Approval</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => handleEventApproval(evt.id, true)}
                            className="text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded text-xs font-bold shadow-sm transition-colors"
                          >
                            ✓ Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {events.filter(e => !e.isApproved || e.pendingEdits).length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">Queue is empty. All events approved!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Organisers */}
        {activeTab === 'orgs' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-black text-[#1f2e22]">Health Organisers</h2>
              <p className="text-gray-500 text-sm mt-1">Verify summit organizers and medical institutions to unlock uploading.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-y border-gray-200">
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Organiser / Host</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {organisers.map(org => (
                    <tr key={org.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#1f2e22]">{org.name}</div>
                        {org.organization && <div className="text-xs text-green-600 mt-1">{org.organization}</div>}
                      </td>
                      <td className="py-4 px-4">
                        {org.isVerified ? 
                          <span className="text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-bold">✓ Authorised</span> : 
                          <span className="text-orange-700 bg-orange-100 px-2 py-1 rounded-full text-xs font-bold">⏳ New Application</span>
                        }
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Link href={`/organiser/${org.slug}`} className="text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-xs font-bold transition-colors">Profile</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {organisers.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-gray-500">No organisers found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Users */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-black text-[#1f2e22]">Platform Accounts & Viewers</h2>
              <p className="text-gray-500 text-sm mt-1">Overview of registered accounts.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-y border-gray-200">
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Email</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Role</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium">{user.email}</td>
                      <td className="py-4 px-4">
                        <span className="text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs font-bold border border-gray-200">{user.role}</span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#1f2e22] mb-4">Global Site Settings</h2>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div>
                  <div className="font-bold text-[#1f2e22]">Maintenance Mode</div>
                  <div className="text-sm text-gray-500">Enable to show a graceful down page to all visitors. Admin access will remain active.</div>
                </div>
                <button 
                  onClick={handleMaintenanceToggle}
                  className={`px-6 py-2 rounded-full font-bold text-sm transition-colors ${isMaintenance ? 'bg-orange-600 text-white shadow-inner' : 'bg-gray-200 text-gray-600'}`}
                >
                  {isMaintenance ? 'Mode: ACTIVE' : 'Mode: OFF'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#1f2e22] mb-4">Change Admin Password</h2>
              <form onSubmit={handlePasswordChange} className="max-w-md">
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                  <input type="password" required value={passwordForm.current} onChange={e => setPasswordForm({...passwordForm, current: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                  <input type="password" required value={passwordForm.new} onChange={e => setPasswordForm({...passwordForm, new: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                </div>
                {passwordStatus.error && <div className="text-red-600 text-sm mb-3 font-bold">{passwordStatus.error}</div>}
                {passwordStatus.success && <div className="text-green-600 text-sm mb-3 font-bold">{passwordStatus.success}</div>}
                <button type="submit" className="bg-[#1f2e22] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-black transition-colors">Update Password</button>
              </form>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#1f2e22] mb-4">Security Logs</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-y border-gray-200">
                      <th className="py-3 px-4 font-bold text-gray-500">Date/Time</th>
                      <th className="py-3 px-4 font-bold text-gray-500">Event</th>
                      <th className="py-3 px-4 font-bold text-gray-500">IP Address</th>
                      <th className="py-3 px-4 font-bold text-gray-500">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                        <td className="py-3 px-4 font-bold text-gray-700">{log.event}</td>
                        <td className="py-3 px-4 text-gray-500">{log.ipAddress || 'Unknown'}</td>
                        <td className="py-3 px-4 text-gray-600">{log.details}</td>
                      </tr>
                    ))}
                    {logs.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-gray-500">No logs found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Form Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-10">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-xl font-black text-[#1f2e22]">
                {editingVideo ? 'Edit Video' : 'Add Platform Video'}
              </h3>
              <button onClick={() => setIsVideoModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={saveVideo} className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Video Title</label>
                  <input type="text" required value={videoForm.title} onChange={e => setVideoForm({...videoForm, title: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-[#00873a] focus:ring-1 focus:ring-[#00873a] outline-none" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <select value={videoForm.category} onChange={e => setVideoForm({...videoForm, category: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-[#00873a] focus:ring-1 focus:ring-[#00873a] outline-none bg-white">
                    <option value="">Select Category...</option>
                    <option value="Functional Medicine">Functional Medicine</option>
                    <option value="Longevity & Anti-Aging">Longevity & Anti-Aging</option>
                    <option value="Mental Wellbeing">Mental Wellbeing</option>
                    <option value="Holistic Nutrition">Holistic Nutrition</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Access Tier</label>
                  <select value={videoForm.isFree ? 'free' : 'sub'} onChange={e => setVideoForm({...videoForm, isFree: e.target.value === 'free'})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-[#00873a] focus:ring-1 focus:ring-[#00873a] outline-none bg-white">
                    <option value="free">Free (Vault)</option>
                    <option value="sub">Subscriber Only</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Presenter / Organiser</label>
                  <select required value={videoForm.organiserId} onChange={e => setVideoForm({...videoForm, organiserId: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-[#00873a] focus:ring-1 focus:ring-[#00873a] outline-none bg-white">
                    <option value="">Select Presenter...</option>
                    {organisers.map(org => (
                      <option key={org.id} value={org.id}>{org.name} {org.organization ? `(${org.organization})` : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Video Embed URL</label>
                  <input type="url" required value={videoForm.videoUrl} onChange={e => setVideoForm({...videoForm, videoUrl: e.target.value})} placeholder="https://play.webvideocore.net/popplayer.php?..." className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-[#00873a] focus:ring-1 focus:ring-[#00873a] outline-none" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Thumbnail URL (optional)</label>
                  <input type="url" value={videoForm.thumbnailUrl} onChange={e => setVideoForm({...videoForm, thumbnailUrl: e.target.value})} placeholder="https://images.unsplash.com/..." className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-[#00873a] focus:ring-1 focus:ring-[#00873a] outline-none" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea rows={3} value={videoForm.description} onChange={e => setVideoForm({...videoForm, description: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-[#00873a] focus:ring-1 focus:ring-[#00873a] outline-none resize-none"></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsVideoModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-[#00873a] hover:bg-[#006818] rounded-lg shadow-sm transition-colors">
                  {editingVideo ? 'Save Changes' : 'Publish Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
