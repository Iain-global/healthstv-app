"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function OrganiserDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [orgData, setOrgData] = useState<{slug: string, name: string} | null>(null);

  const [videos, setVideos] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  // Modals state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<number | null>(null);
  const [newVideoForm, setNewVideoForm] = useState({ title: '', description: '', thumbnailUrl: '', videoUrl: '', category: '' });
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [newEventForm, setNewEventForm] = useState({ title: '', format: 'Virtual Summit', description: '', date: '', price: '0', ticketingMethod: 'Internal Platform', ticketUrl: '', livestreamUrl: '', imageUrl: '' });

  useEffect(() => {
    fetch('/api/organiser/auth').then(r => r.json()).then(data => {
      if (data.authenticated) {
        setIsAuthenticated(true);
        setOrgData({ slug: data.slug, name: data.name });
        fetchData();
      }
    });
  }, []);

  const fetchData = () => {
    fetch('/api/organiser/videos').then(r => r.json()).then(setVideos);
    fetch('/api/organiser/events').then(r => r.json()).then(setEvents);
  };

  const submitVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = editingVideoId !== null;
    const res = await fetch('/api/organiser/videos', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isEdit ? { id: editingVideoId, ...newVideoForm } : newVideoForm)
    });
    if (res.ok) {
      const saved = await res.json();
      if (isEdit) {
        setVideos(videos.map(v => v.id === saved.id ? saved : v));
        // If it was a live video, show an alert
        if (saved.isApproved && saved.pendingEdits) {
           alert('Your edits have been submitted for moderation. The original version will remain live until approved.');
        }
      } else {
        setVideos([saved, ...videos]);
      }
      setIsVideoModalOpen(false);
      setEditingVideoId(null);
      setNewVideoForm({ title: '', description: '', thumbnailUrl: '', videoUrl: '', category: '' });
    }
  };

  const openVideoModal = (video: any = null) => {
    if (video) {
      setEditingVideoId(video.id);
      // If it has pending edits, pre-fill with those, otherwise use main fields
      const dataToEdit = video.pendingEdits || video;
      setNewVideoForm({
        title: dataToEdit.title || '',
        description: dataToEdit.description || '',
        thumbnailUrl: dataToEdit.thumbnailUrl || '',
        videoUrl: dataToEdit.videoUrl || '',
        category: dataToEdit.category || ''
      });
    } else {
      setEditingVideoId(null);
      setNewVideoForm({ title: '', description: '', thumbnailUrl: '', videoUrl: '', category: '' });
    }
    setIsVideoModalOpen(true);
  };

  const submitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = editingEventId !== null;
    const res = await fetch('/api/organiser/events', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isEdit ? { id: editingEventId, ...newEventForm, price: parseFloat(newEventForm.price) || 0 } : { ...newEventForm, price: parseFloat(newEventForm.price) || 0 })
    });
    if (res.ok) {
      const saved = await res.json();
      if (isEdit) {
        setEvents(events.map(ev => ev.id === saved.id ? saved : ev));
        if (saved.isApproved && saved.pendingEdits) {
          alert('Your edits have been submitted for moderation. The original version will remain live until approved.');
        }
      } else {
        setEvents([saved, ...events]);
      }
      setIsEventModalOpen(false);
      setEditingEventId(null);
      setNewEventForm({ title: '', format: 'Virtual Summit', description: '', date: '', price: '0', ticketingMethod: 'Internal Platform', ticketUrl: '', livestreamUrl: '', imageUrl: '' });
    }
  };

  const openEventModal = (event: any = null) => {
    if (event) {
      setEditingEventId(event.id);
      const dataToEdit = event.pendingEdits || event;
      setNewEventForm({
        title: dataToEdit.title || '',
        format: dataToEdit.format || 'Virtual Summit',
        description: dataToEdit.description || '',
        date: dataToEdit.date || '',
        price: dataToEdit.price !== undefined ? dataToEdit.price.toString() : '0',
        ticketingMethod: dataToEdit.ticketingMethod || 'Internal Platform',
        ticketUrl: dataToEdit.ticketUrl || '',
        livestreamUrl: dataToEdit.livestreamUrl || '',
        imageUrl: dataToEdit.imageUrl || ''
      });
    } else {
      setEditingEventId(null);
      setNewEventForm({ title: '', format: 'Virtual Summit', description: '', date: '', price: '0', ticketingMethod: 'Internal Platform', ticketUrl: '', livestreamUrl: '', imageUrl: '' });
    }
    setIsEventModalOpen(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch('/api/organiser/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      const data = await res.json();
      setIsAuthenticated(true);
      setOrgData({ slug: data.slug, name: 'Organiser' }); // In reality name would come from res if added
      fetchData();
    } else {
      const data = await res.json();
      setLoginError(data.error || "Login failed");
    }
  };

  const handleLogout = async () => {
    await fetch('/api/organiser/auth', { method: 'DELETE' });
    setIsAuthenticated(false);
    setOrgData(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] bg-[#fafcfb] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 md:p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-[#1f2e22] mb-2">Organiser Login</h2>
            <p className="text-gray-500 text-sm">Sign in to manage your virtual summits, tickets, and video library.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email or Username</label>
              <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50" />
            </div>
            {loginError && <div className="text-red-600 text-sm font-bold bg-red-50 p-3 rounded-lg">{loginError}</div>}
            <button type="submit" className="w-full bg-[#f6821f] hover:bg-[#e07015] text-white font-bold py-3 px-4 rounded-xl transition-colors">
              Access Organiser Hub
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
    <div className="min-h-screen bg-[#fafcfb] pb-20">
      <div className="bg-[#1f2e22] text-white pt-10 pb-20 px-4">
        <div className="container mx-auto max-w-[1200px]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-[#f6821f] text-white text-xs font-bold px-2 py-1 rounded">ORGANISER HUB</span>
                <span className="bg-[#00873a] text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">✓ Authorised Host</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black">{orgData?.name} Dashboard</h1>
              <p className="text-gray-300 mt-2">Manage your virtual events, ticket sales, and video library.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/organiser/${orgData?.slug}`} className="border border-white hover:bg-white hover:text-[#0c1c10] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                👁️ View Public Profile
              </Link>
              <Link href="/organiser-hub/settings" className="border border-white hover:bg-white hover:text-[#0c1c10] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                ⚙️ Account Settings
              </Link>
              <button onClick={handleLogout} className="bg-red-900/40 hover:bg-red-800 border border-red-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-[1200px] px-4 -mt-10">
        <div className="w-full space-y-8">
            {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-xl">🗓️</div>
            <div>
              <div className="text-2xl font-black text-[#1f2e22]">{events.length}</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Virtual Events</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-xl">🎟️</div>
            <div>
              <div className="text-2xl font-black text-[#1f2e22]">-</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tickets Booked</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-xl">▶️</div>
            <div>
              <div className="text-2xl font-black text-[#1f2e22]">{videos.length}</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Summit Videos</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-xl">👁️</div>
            <div>
              <div className="text-2xl font-black text-[#1f2e22]">-</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Viewer Interactions</div>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-bold text-[#1f2e22] text-lg flex items-center gap-2">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded uppercase tracking-wider">Ticketing Hub</span>
                Virtual Events & Ticket Sales
              </h2>
              <button onClick={() => openEventModal()} className="bg-[#f6821f] hover:bg-[#e07015] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
                + Upload Virtual Event & Tickets
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200">
                  <th className="py-4 px-6 font-bold text-gray-600">VIRTUAL EVENT & FORMAT</th>
                  <th className="py-4 px-6 font-bold text-gray-600">SCHEDULE / DATE</th>
                  <th className="py-4 px-6 font-bold text-gray-600">TICKET PRICE</th>
                  <th className="py-4 px-6 font-bold text-gray-600">TICKETING METHOD</th>
                  <th className="py-4 px-6 font-bold text-gray-600">STATUS</th>
                  <th className="py-4 px-6 font-bold text-gray-600 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#1f2e22] text-base">{evt.title}</div>
                      <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{evt.format || 'Virtual Summit'}</div>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-700">{evt.date}</td>
                    <td className="py-4 px-6 font-black text-[#1f2e22]">£{Number(evt.price).toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <span className="text-[#00873a] bg-[#00873a]/10 px-2 py-1 rounded text-xs font-bold border border-[#00873a]/20">
                        {evt.ticketingMethod || 'Direct Checkout'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {evt.status === 'ACTIVE' ? (
                        <span className="text-green-700 font-bold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Active & Selling</span>
                      ) : (
                        <span className="text-gray-500 font-bold">Draft</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => openEventModal(evt)} className="text-[#00873a] bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded text-xs font-bold transition-colors">Edit</button>
                        <button className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded text-xs font-bold transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500 bg-gray-50">
                      No events found. Click "+ Upload Virtual Event & Tickets" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Videos Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-[#1f2e22] text-lg">My Summit Videos & Vault Lectures</h2>
            <button onClick={() => openVideoModal()} className="bg-[#f6821f] hover:bg-[#e07015] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
              + Upload New Video Session
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200">
                  <th className="py-4 px-6 font-bold text-gray-600">VIDEO SESSION</th>
                  <th className="py-4 px-6 font-bold text-gray-600">CATEGORY</th>
                  <th className="py-4 px-6 font-bold text-gray-600">SUBMITTED</th>
                  <th className="py-4 px-6 font-bold text-gray-600">MODERATION STATUS</th>
                  <th className="py-4 px-6 font-bold text-gray-600 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {videos.map((vid) => (
                  <tr key={vid.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#1f2e22] text-base">{vid.title}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[#00873a] bg-[#00873a]/10 px-2 py-1 rounded-full text-xs font-bold">
                        {vid.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500">{new Date(vid.createdAt).toISOString().split('T')[0]}</td>
                    <td className="py-4 px-6">
                      {vid.isApproved ? (
                        <span className="text-green-700 bg-green-100 border border-green-200 px-2 py-1 rounded text-xs font-bold flex inline-flex items-center gap-1">
                          ✓ Live on Site
                        </span>
                      ) : (
                        <span className="text-orange-700 bg-orange-100 border border-orange-200 px-2 py-1 rounded text-xs font-bold flex inline-flex items-center gap-1">
                          ⏳ Pending Moderation
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => openVideoModal(vid)} className="text-[#00873a] bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded text-xs font-bold transition-colors">Edit</button>
                        <button className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded text-xs font-bold transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {videos.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500 bg-gray-50">
                      No videos found. Upload a video session to submit it for moderation.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-[#e8f5e9] p-4 text-sm text-[#00873a] flex justify-between items-center border-t border-[#c8e6c9]">
            <div className="flex items-center gap-2">
              <span className="text-lg">🚀</span>
              <div>
                <strong>Automated Ticket Settlements & In-Player Paywalls Active:</strong>
                <br />
                Direct ticket purchases, StreamingVideoProvider in-player paywalls, and subscriber ticket verification are live across all virtual health summits.
              </div>
            </div>
            <a href="/organiser-register#roadmap" className="font-bold hover:underline">View Full Roadmap →</a>
          </div>
        </div>
      </div>

      {/* Upload Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="bg-[#1f2e22] px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">{editingVideoId ? 'Edit Video Session' : 'Upload Video Session'}</h3>
              <button onClick={() => {setIsVideoModalOpen(false); setEditingVideoId(null);}} className="text-white hover:text-gray-300">✕</button>
            </div>
            <form onSubmit={submitVideo} className="p-4 md:p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Video Title</label>
                <input required type="text" value={newVideoForm.title} onChange={e => setNewVideoForm({...newVideoForm, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                  <input required type="text" placeholder="e.g. Longevity, Nutrition" value={newVideoForm.category} onChange={e => setNewVideoForm({...newVideoForm, category: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Thumbnail URL</label>
                  <input type="text" placeholder="https://..." value={newVideoForm.thumbnailUrl} onChange={e => setNewVideoForm({...newVideoForm, thumbnailUrl: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Direct Video URL (.mp4)</label>
                <input required type="text" placeholder="https://..." value={newVideoForm.videoUrl} onChange={e => setNewVideoForm({...newVideoForm, videoUrl: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea rows={3} value={newVideoForm.description} onChange={e => setNewVideoForm({...newVideoForm, description: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => {setIsVideoModalOpen(false); setEditingVideoId(null);}} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#00873a] text-white font-bold rounded-lg hover:bg-[#00682d]">{editingVideoId ? 'Save Changes' : 'Submit for Moderation'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-[#f6821f] px-6 py-4 flex justify-between items-center text-white sticky top-0 z-10">
              <h3 className="font-bold text-lg">{editingEventId ? 'Edit Virtual Event' : 'Upload Virtual Event & Tickets'}</h3>
              <button onClick={() => {setIsEventModalOpen(false); setEditingEventId(null);}} className="text-white hover:text-orange-200">✕</button>
            </div>
            <form onSubmit={submitEvent} className="p-4 md:p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Event Title</label>
                <input required type="text" value={newEventForm.title} onChange={e => setNewEventForm({...newEventForm, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Format</label>
                  <select value={newEventForm.format} onChange={e => setNewEventForm({...newEventForm, format: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="Virtual Summit">Virtual Summit</option>
                    <option value="Hybrid Summit">Hybrid Summit</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Date Schedule</label>
                  <input required type="text" placeholder="e.g. Oct 14-16, 2026" value={newEventForm.date} onChange={e => setNewEventForm({...newEventForm, date: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Banner Image URL</label>
                <input type="text" placeholder="https://..." value={newEventForm.imageUrl} onChange={e => setNewEventForm({...newEventForm, imageUrl: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea rows={3} value={newEventForm.description} onChange={e => setNewEventForm({...newEventForm, description: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"></textarea>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-2">
                <h4 className="font-bold text-[#1f2e22] mb-3">Ticketing & Access</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Ticketing Method</label>
                    <select value={newEventForm.ticketingMethod} onChange={e => setNewEventForm({...newEventForm, ticketingMethod: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option value="Internal Platform">Internal Platform (HealthSummits)</option>
                      <option value="External Link">External Link</option>
                      <option value="Free Registration">Free Registration</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Ticket Price (£)</label>
                    <input type="number" min="0" step="0.01" value={newEventForm.price} onChange={e => setNewEventForm({...newEventForm, price: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Ticket Purchase / Livestream URL</label>
                  <input type="text" placeholder="https://..." value={newEventForm.ticketUrl} onChange={e => setNewEventForm({...newEventForm, ticketUrl: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
                  <p className="text-xs text-gray-500 mt-1">If using external ticketing or a direct livestream link, provide it here.</p>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-200">
                <button type="button" onClick={() => {setIsEventModalOpen(false); setEditingEventId(null);}} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#f6821f] text-white font-bold rounded-lg hover:bg-[#e07015]">{editingEventId ? 'Save Changes' : 'Submit Event'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </div>
    </div>
  );
}
