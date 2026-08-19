"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { soundFx } from '@/lib/audio';

export default function OrganiserDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [orgData, setOrgData] = useState<{slug: string, name: string} | null>(null);

  const [videos, setVideos] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  // Floating Toasts State
  const [toasts, setToasts] = useState<{ id: string; title: string; message: string; type: 'info' | 'success' | 'warning' }[]>([]);

  const addToast = (title: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6500);
  };

  // Modals state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<number | null>(null);
  const [newVideoForm, setNewVideoForm] = useState({ title: '', description: '', thumbnailUrl: '', videoUrl: '', category: '', isFree: true, price: '4.99' });
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [newEventForm, setNewEventForm] = useState({ title: '', format: 'Virtual Summit', description: '', date: '', endDate: '', startTime: '10:00', endTime: '16:00', price: '0', isPriceFrom: false, ticketingMethod: 'Internal Platform', ticketUrl: '', livestreamUrl: '', imageUrl: '' });
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleFileUpload = async (file: File, target: 'event' | 'video') => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        if (target === 'event') {
          setNewEventForm(prev => ({ ...prev, imageUrl: data.url }));
        } else {
          setNewVideoForm(prev => ({ ...prev, thumbnailUrl: data.url }));
        }
        addToast('📷 Image Uploaded', 'Image uploaded successfully and attached to your event!', 'success');
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    fetch('/api/organiser/auth').then(r => r.json()).then(data => {
      if (data.authenticated) {
        setIsAuthenticated(true);
        setOrgData({ slug: data.slug, name: data.name });
        fetchData();
      }
    });
  }, []);

  // Real-time EventSource Stream Listener
  useEffect(() => {
    if (!isAuthenticated) return;

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/realtime/stream');

      // Video Approved by Admin
      eventSource.addEventListener('video:approved', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          if (data.video) {
            setVideos(prev => {
              const idx = prev.findIndex(v => v.id === data.video.id);
              if (idx >= 0) {
                soundFx.playSuccess(); // Uplifting chime!
                addToast(
                  '🎉 Video Approved & Live!',
                  `"${data.video.title}" has been approved by admin and is now live on site.`,
                  'success'
                );
                const next = [...prev];
                next[idx] = data.video;
                return next;
              }
              return prev;
            });
          }
        } catch (err) {
          console.error('Error handling video:approved:', err);
        }
      });

      // Video Rejected by Admin
      eventSource.addEventListener('video:rejected', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          if (data.video) {
            setVideos(prev => {
              const idx = prev.findIndex(v => v.id === data.video.id);
              if (idx >= 0) {
                addToast(
                  'ℹ️ Video Edits Reviewed',
                  `Pending edits for "${data.video.title}" were dismissed by admin.`,
                  'warning'
                );
                const next = [...prev];
                next[idx] = data.video;
                return next;
              }
              return prev;
            });
          }
        } catch (err) {
          console.error(err);
        }
      });

      // Event Approved by Admin
      eventSource.addEventListener('event:approved', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          if (data.event) {
            setEvents(prev => {
              const idx = prev.findIndex(ev => ev.id === data.event.id);
              if (idx >= 0) {
                soundFx.playSuccess();
                addToast(
                  '🎉 Event Approved & Live!',
                  `"${data.event.title}" is now active on the summit schedule.`,
                  'success'
                );
                const next = [...prev];
                next[idx] = data.event;
                return next;
              }
              return prev;
            });
          }
        } catch (err) {
          console.error(err);
        }
      });
    } catch (err) {
      console.error('SSE error in OrganiserDashboard:', err);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [isAuthenticated]);

  const fetchData = () => {
    fetch('/api/organiser/videos').then(r => r.json()).then(setVideos);
    fetch('/api/organiser/events').then(r => r.json()).then(setEvents);
  };

  const submitVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = editingVideoId !== null;
    const payload = {
      title: newVideoForm.title,
      description: newVideoForm.description,
      thumbnailUrl: newVideoForm.thumbnailUrl,
      videoUrl: newVideoForm.videoUrl,
      category: newVideoForm.category,
      isFree: newVideoForm.isFree,
      price: newVideoForm.isFree ? 0 : (parseFloat(newVideoForm.price) || 0)
    };
    const res = await fetch('/api/organiser/videos', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isEdit ? { id: editingVideoId, ...payload } : payload)
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
      setNewVideoForm({ title: '', description: '', thumbnailUrl: '', videoUrl: '', category: '', isFree: true, price: '4.99' });
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
        category: dataToEdit.category || '',
        isFree: dataToEdit.isFree !== undefined ? Boolean(dataToEdit.isFree) : true,
        price: dataToEdit.price !== undefined ? dataToEdit.price.toString() : '4.99'
      });
    } else {
      setEditingVideoId(null);
      setNewVideoForm({ title: '', description: '', thumbnailUrl: '', videoUrl: '', category: '', isFree: true, price: '4.99' });
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
      setNewEventForm({ title: '', format: 'Virtual Summit', description: '', date: '', endDate: '', startTime: '10:00', endTime: '16:00', price: '0', isPriceFrom: false, ticketingMethod: 'Internal Platform', ticketUrl: '', livestreamUrl: '', imageUrl: '' });
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
        endDate: dataToEdit.endDate || '',
        startTime: dataToEdit.startTime || '10:00',
        endTime: dataToEdit.endTime || '16:00',
        price: dataToEdit.price !== undefined ? dataToEdit.price.toString() : '0',
        isPriceFrom: dataToEdit.isPriceFrom !== undefined ? Boolean(dataToEdit.isPriceFrom) : false,
        ticketingMethod: dataToEdit.ticketingMethod || 'Internal Platform',
        ticketUrl: dataToEdit.ticketUrl || '',
        livestreamUrl: dataToEdit.livestreamUrl || '',
        imageUrl: dataToEdit.imageUrl || ''
      });
    } else {
      setEditingEventId(null);
      setNewEventForm({ title: '', format: 'Virtual Summit', description: '', date: '', endDate: '', startTime: '10:00', endTime: '16:00', price: '0', isPriceFrom: false, ticketingMethod: 'Internal Platform', ticketUrl: '', livestreamUrl: '', imageUrl: '' });
    }
    setIsEventModalOpen(true);
  };

  const duplicateEvent = (event: any) => {
    setEditingEventId(null);
    const dataToCopy = event.pendingEdits || event;
    setNewEventForm({
      title: `${dataToCopy.title || ''} (Copy)`,
      format: dataToCopy.format || 'Virtual Summit',
      description: dataToCopy.description || '',
      date: dataToCopy.date || '',
      endDate: dataToCopy.endDate || '',
      startTime: dataToCopy.startTime || '10:00',
      endTime: dataToCopy.endTime || '16:00',
      price: dataToCopy.price !== undefined ? dataToCopy.price.toString() : '0',
      isPriceFrom: dataToCopy.isPriceFrom !== undefined ? Boolean(dataToCopy.isPriceFrom) : false,
      ticketingMethod: dataToCopy.ticketingMethod || 'Internal Platform',
      ticketUrl: dataToCopy.ticketUrl || '',
      livestreamUrl: dataToCopy.livestreamUrl || '',
      imageUrl: dataToCopy.imageUrl || ''
    });
    setIsEventModalOpen(true);
    addToast('📋 Event Cloned', `Copied details from "${event.title}". Adjust any fields and submit!`, 'info');
  };

  const duplicateVideo = (video: any) => {
    setEditingVideoId(null);
    const dataToCopy = video.pendingEdits || video;
    setNewVideoForm({
      title: `${dataToCopy.title || ''} (Copy)`,
      description: dataToCopy.description || '',
      thumbnailUrl: dataToCopy.thumbnailUrl || '',
      videoUrl: dataToCopy.videoUrl || '',
      category: dataToCopy.category || '',
      isFree: dataToCopy.isFree !== undefined ? Boolean(dataToCopy.isFree) : true,
      price: dataToCopy.price !== undefined ? dataToCopy.price.toString() : '4.99'
    });
    setIsVideoModalOpen(true);
    addToast('📋 Video Cloned', `Copied details from "${video.title}". Make adjustments and submit!`, 'info');
  };

  const handleDeleteEvent = async (event: any) => {
    if (!confirm(`Are you sure you want to delete "${event.title}"?`)) return;
    try {
      const res = await fetch(`/api/organiser/events?id=${event.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setEvents(prev => prev.filter(e => e.id !== event.id));
        addToast('🗑️ Event Deleted', `"${event.title}" has been deleted.`, 'info');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete event');
      }
    } catch (err) {
      console.error('Delete event error:', err);
      alert('Error deleting event');
    }
  };

  const handleDeleteVideo = async (video: any) => {
    if (!confirm(`Are you sure you want to delete "${video.title}"?`)) return;
    try {
      const res = await fetch(`/api/organiser/videos?id=${video.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setVideos(prev => prev.filter(v => v.id !== video.id));
        addToast('🗑️ Video Deleted', `"${video.title}" has been deleted.`, 'info');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete video');
      }
    } catch (err) {
      console.error('Delete video error:', err);
      alert('Error deleting video');
    }
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
              <input 
                type="text" 
                required 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 bg-white font-semibold outline-none focus:border-[#f6821f] focus:ring-1 focus:ring-[#f6821f]" 
                placeholder="e.g. your username or email"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 bg-white font-semibold outline-none focus:border-[#f6821f] focus:ring-1 focus:ring-[#f6821f]" 
                placeholder="••••••••"
              />
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
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-gray-900 font-bold text-sm">
                        <span>📅</span> {evt.date} {evt.endDate && evt.endDate !== evt.date ? `– ${evt.endDate}` : ''}
                      </div>
                      {(evt.startTime || evt.endTime) && (
                        <div className="text-xs text-[#f6821f] font-bold mt-1 flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded border border-orange-200/60 w-fit">
                          <span>⏰</span> {evt.startTime || 'Start'} {evt.endTime ? `– ${evt.endTime}` : ''}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 font-black text-[#1f2e22]">
                      {evt.isPriceFrom ? <span className="text-xs font-bold text-gray-500 mr-1">From</span> : null}
                      £{Number(evt.price).toFixed(2)}
                    </td>
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
                      <div className="flex gap-2 justify-end items-center">
                        <button 
                          onClick={() => duplicateEvent(evt)} 
                          className="text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1"
                          title="Duplicate Virtual Event"
                        >
                          📋 Duplicate
                        </button>
                        <button onClick={() => openEventModal(evt)} className="text-[#00873a] bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded text-xs font-bold transition-colors">Edit</button>
                        <button onClick={() => handleDeleteEvent(evt)} className="text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded text-xs font-bold transition-colors">Delete</button>
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
                  <th className="py-4 px-6 font-bold text-gray-600">ACCESS & PRICING</th>
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
                      {vid.isFree ? (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                          🟢 Free Access
                        </span>
                      ) : (
                        <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                          🔒 PPV (£{Number(vid.price || 0).toFixed(2)})
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[#00873a] bg-[#00873a]/10 px-2 py-1 rounded-full text-xs font-bold">
                        {vid.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500">{new Date(vid.createdAt).toISOString().split('T')[0]}</td>
                    <td className="py-4 px-6">
                      {vid.pendingEdits ? (
                        <span className="text-orange-700 bg-orange-100 border border-orange-200 px-2.5 py-1 rounded text-xs font-bold inline-flex items-center gap-1">
                          ⏳ Edits Pending Moderation
                        </span>
                      ) : vid.isApproved ? (
                        <span className="text-green-700 bg-green-100 border border-green-200 px-2.5 py-1 rounded text-xs font-bold inline-flex items-center gap-1">
                          ✓ Live on Site
                        </span>
                      ) : (
                        <span className="text-orange-700 bg-orange-100 border border-orange-200 px-2.5 py-1 rounded text-xs font-bold inline-flex items-center gap-1">
                          ⏳ Pending Moderation
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex gap-2 justify-end items-center">
                        <button 
                          onClick={() => duplicateVideo(vid)} 
                          className="text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1"
                          title="Duplicate Video Session"
                        >
                          📋 Duplicate
                        </button>
                        <button onClick={() => openVideoModal(vid)} className="text-[#00873a] bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded text-xs font-bold transition-colors">Edit</button>
                        <button onClick={() => handleDeleteVideo(vid)} className="text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded text-xs font-bold transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {videos.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500 bg-gray-50">
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
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-[#1f2e22] px-6 py-4 flex justify-between items-center text-white sticky top-0 z-10">
              <h3 className="font-bold text-lg">{editingVideoId ? 'Edit Video Session' : 'Upload Video Session'}</h3>
              <button onClick={() => {setIsVideoModalOpen(false); setEditingVideoId(null);}} className="text-white hover:text-gray-300">✕</button>
            </div>
            <form onSubmit={submitVideo} className="p-4 md:p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Video Title</label>
                <input required type="text" value={newVideoForm.title} onChange={e => setNewVideoForm({...newVideoForm, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 bg-white font-medium focus:ring-1 focus:ring-[#00873a] outline-none" />
              </div>

              {/* Access & Monetization Mode */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Access & Monetization Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`cursor-pointer border rounded-xl p-3.5 flex items-center gap-3 transition-all ${newVideoForm.isFree ? 'border-[#00873a] bg-green-50/60 ring-2 ring-[#00873a]/30' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name="accessType" 
                      checked={newVideoForm.isFree} 
                      onChange={() => setNewVideoForm({ ...newVideoForm, isFree: true })} 
                      className="text-[#00873a] focus:ring-[#00873a]" 
                    />
                    <div>
                      <div className="font-bold text-sm text-[#1f2e22]">🟢 Free Access</div>
                      <div className="text-xs text-gray-500">Publicly available to all viewers</div>
                    </div>
                  </label>
                  <label className={`cursor-pointer border rounded-xl p-3.5 flex items-center gap-3 transition-all ${!newVideoForm.isFree ? 'border-[#ea8125] bg-orange-50/60 ring-2 ring-[#ea8125]/30' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name="accessType" 
                      checked={!newVideoForm.isFree} 
                      onChange={() => setNewVideoForm({ ...newVideoForm, isFree: false })} 
                      className="text-[#ea8125] focus:ring-[#ea8125]" 
                    />
                    <div>
                      <div className="font-bold text-sm text-[#1f2e22]">🔒 Pay-Per-View (PPV)</div>
                      <div className="text-xs text-gray-500">30s preview then paywall</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Price input when PPV is selected */}
              {!newVideoForm.isFree && (
                <div className="bg-orange-50/80 border border-orange-200 rounded-xl p-4">
                  <label className="block text-sm font-bold text-orange-950 mb-1.5">Set PPV Ticket Price (£ GBP)</label>
                  <div className="relative max-w-xs">
                    <span className="absolute left-3.5 top-2 font-bold text-gray-500">£</span>
                    <input 
                      required 
                      type="number" 
                      step="0.01" 
                      min="0.50" 
                      placeholder="4.99" 
                      value={newVideoForm.price} 
                      onChange={e => setNewVideoForm({ ...newVideoForm, price: e.target.value })} 
                      className="w-full pl-8 pr-4 py-2 border border-orange-300 bg-white rounded-lg focus:ring-2 focus:ring-[#ea8125] outline-none font-bold text-gray-900" 
                    />
                  </div>
                  <p className="text-xs text-orange-800 mt-2">
                    💡 Viewers can watch a <strong>30-second teaser</strong> before the in-player paywall prompts them to unlock the full session.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                  <input required type="text" placeholder="e.g. Longevity, Nutrition" value={newVideoForm.category} onChange={e => setNewVideoForm({...newVideoForm, category: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 bg-white font-medium focus:ring-1 focus:ring-[#00873a] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Thumbnail Image</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="https://... or upload" 
                      value={newVideoForm.thumbnailUrl} 
                      onChange={e => setNewVideoForm({...newVideoForm, thumbnailUrl: e.target.value})} 
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 bg-white font-medium text-xs focus:ring-1 focus:ring-[#00873a] outline-none" 
                    />
                    <label className="bg-[#00873a] hover:bg-[#006818] text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0 shadow-xs">
                      {uploadingImage ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span>📁 Upload</span>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        disabled={uploadingImage}
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'video');
                        }} 
                      />
                    </label>
                  </div>
                  {newVideoForm.thumbnailUrl && (
                    <div className="mt-2 relative w-full h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                      <img src={newVideoForm.thumbnailUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setNewVideoForm(prev => ({ ...prev, thumbnailUrl: '' }))}
                        className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Direct Video URL (.mp4 or Embed)</label>
                <input required type="text" placeholder="https://..." value={newVideoForm.videoUrl} onChange={e => setNewVideoForm({...newVideoForm, videoUrl: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 bg-white font-medium focus:ring-1 focus:ring-[#00873a] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea rows={3} value={newVideoForm.description} onChange={e => setNewVideoForm({...newVideoForm, description: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 bg-white font-medium resize-none focus:ring-1 focus:ring-[#00873a] outline-none"></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => {setIsVideoModalOpen(false); setEditingVideoId(null);}} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-[#00873a] text-white font-bold rounded-lg hover:bg-[#00682d] shadow-sm transition-colors">{editingVideoId ? 'Save Changes' : 'Submit for Moderation'}</button>
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
                <input required type="text" value={newEventForm.title} onChange={e => setNewEventForm({...newEventForm, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 bg-white font-medium focus:ring-1 focus:ring-[#f6821f] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Format</label>
                <select value={newEventForm.format} onChange={e => setNewEventForm({...newEventForm, format: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white font-medium focus:ring-1 focus:ring-[#f6821f] outline-none">
                  <option value="Virtual Summit">Virtual Summit</option>
                  <option value="Hybrid Summit">Hybrid Summit</option>
                  <option value="Webinar">Webinar</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>

              {/* Event Dates: Start Date & End Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200/70">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                    <span>📅</span> Start Date (Calendar)
                  </label>
                  <input 
                    required 
                    type="date" 
                    value={newEventForm.date} 
                    onChange={e => setNewEventForm({...newEventForm, date: e.target.value, endDate: newEventForm.endDate || e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white font-semibold text-sm focus:ring-1 focus:ring-[#f6821f] outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                    <span>📅</span> End Date (Calendar)
                  </label>
                  <input 
                    type="date" 
                    value={newEventForm.endDate || newEventForm.date} 
                    min={newEventForm.date}
                    onChange={e => setNewEventForm({...newEventForm, endDate: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white font-semibold text-sm focus:ring-1 focus:ring-[#f6821f] outline-none" 
                  />
                </div>
              </div>

              {/* Start & Finish Times */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-orange-50/60 p-3.5 rounded-xl border border-orange-200/70">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                    <span>⏰</span> Start Time
                  </label>
                  <input 
                    type="time" 
                    value={newEventForm.startTime} 
                    onChange={e => setNewEventForm({...newEventForm, startTime: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white font-semibold text-sm focus:ring-1 focus:ring-[#f6821f] outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                    <span>🏁</span> Finish Time
                  </label>
                  <input 
                    type="time" 
                    value={newEventForm.endTime} 
                    onChange={e => setNewEventForm({...newEventForm, endTime: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white font-semibold text-sm focus:ring-1 focus:ring-[#f6821f] outline-none" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Banner Image</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="https://... or click Upload Image" 
                    value={newEventForm.imageUrl} 
                    onChange={e => setNewEventForm({...newEventForm, imageUrl: e.target.value})} 
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 bg-white font-medium focus:ring-1 focus:ring-[#f6821f] outline-none" 
                  />
                  <label className="bg-[#f6821f] hover:bg-[#e07015] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0 shadow-xs">
                    {uploadingImage ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <span>📁</span> Upload Image
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      disabled={uploadingImage}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'event');
                      }} 
                    />
                  </label>
                </div>
                {newEventForm.imageUrl && (
                  <div className="mt-2 relative w-full h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                    <img src={newEventForm.imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setNewEventForm(prev => ({ ...prev, imageUrl: '' }))}
                      className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold transition-colors"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea rows={3} value={newEventForm.description} onChange={e => setNewEventForm({...newEventForm, description: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 bg-white font-medium resize-none"></textarea>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-2">
                <h4 className="font-bold text-[#1f2e22] mb-3">Ticketing & Access</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Ticketing Method</label>
                    <select value={newEventForm.ticketingMethod} onChange={e => setNewEventForm({...newEventForm, ticketingMethod: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white font-medium">
                      <option value="Internal Platform">Internal Platform (HealthSummits)</option>
                      <option value="External Link">External Link</option>
                      <option value="Free Registration">Free Registration</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-bold text-gray-700">Ticket Price (£)</label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-[#f6821f] select-none hover:text-[#e07015] bg-orange-50 px-2 py-0.5 rounded border border-orange-200/70">
                        <input 
                          type="checkbox" 
                          checked={newEventForm.isPriceFrom} 
                          onChange={e => setNewEventForm({...newEventForm, isPriceFrom: e.target.checked})} 
                          className="w-3.5 h-3.5 text-[#f6821f] rounded focus:ring-[#f6821f] cursor-pointer" 
                        />
                        <span>Prefix &ldquo;From&rdquo;</span>
                      </label>
                    </div>
                    <div className="relative flex items-center">
                      {newEventForm.isPriceFrom && (
                        <span className="absolute left-3 text-xs font-bold text-gray-500 pointer-events-none">
                          From £
                        </span>
                      )}
                      <input 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        value={newEventForm.price} 
                        onChange={e => setNewEventForm({...newEventForm, price: e.target.value})} 
                        className={`w-full py-2 border border-gray-300 rounded-lg text-gray-900 bg-white font-medium focus:ring-1 focus:ring-[#f6821f] outline-none ${newEventForm.isPriceFrom ? 'pl-16 pr-3' : 'px-4'}`} 
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-bold text-gray-700">Ticket Purchase / Livestream URL</label>
                  </div>
                  <input 
                    type="text" 
                    placeholder="https://..." 
                    value={newEventForm.ticketUrl} 
                    onChange={e => setNewEventForm({...newEventForm, ticketUrl: e.target.value})} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 bg-white font-medium focus:ring-1 focus:ring-[#f6821f] outline-none" 
                  />
                  
                  {/* Tick Option for Default Player URL */}
                  <div className="flex flex-col gap-1.5 mt-2.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none bg-orange-50/70 hover:bg-orange-50 p-2.5 rounded-lg border border-orange-200/80 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={newEventForm.ticketUrl === 'https://healthv2.deploybox.uk/player'}
                        onChange={e => {
                          if (e.target.checked) {
                            setNewEventForm(prev => ({ ...prev, ticketUrl: 'https://healthv2.deploybox.uk/player' }));
                          } else if (newEventForm.ticketUrl === 'https://healthv2.deploybox.uk/player') {
                            setNewEventForm(prev => ({ ...prev, ticketUrl: '' }));
                          }
                        }}
                        className="w-4 h-4 text-[#f6821f] rounded focus:ring-[#f6821f] cursor-pointer" 
                      />
                      <span className="text-xs font-bold text-[#1f2e22]">
                        ✓ Use Platform Player URL: <code className="text-[#f6821f] font-mono bg-white px-1.5 py-0.5 rounded border border-orange-200 font-bold">https://healthv2.deploybox.uk/player</code>
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none bg-blue-50/70 hover:bg-blue-50 p-2.5 rounded-lg border border-blue-200/80 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={newEventForm.ticketUrl.includes('it=ao1uksns7egw')}
                        onChange={e => {
                          const hstvUrl = 'https://play.webvideocore.net/popplayer.php?it=ao1uksns7egw&is_link=1&w=720&h=405&pause=1&title=HealthSummits.tv&skin=3&repeat=&brandNW=1&start_volume=100&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D11838096%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&play_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute&floating_player=none&share_options=1';
                          if (e.target.checked) {
                            setNewEventForm(prev => ({ ...prev, ticketUrl: hstvUrl }));
                          } else if (newEventForm.ticketUrl === hstvUrl) {
                            setNewEventForm(prev => ({ ...prev, ticketUrl: '' }));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" 
                      />
                      <span className="text-xs font-bold text-blue-900">
                        ✓ Use HealthSummits.tv Live Player URL (<span className="text-blue-700">Menopause Cafe 16:9 Stream</span>)
                      </span>
                    </label>
                  </div>

                  <p className="text-xs text-gray-500 mt-1.5">If using external ticketing or a direct livestream link, provide it here.</p>
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

      {/* Floating Real-Time Toast Notifications Container */}
      <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-3 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#1f2e22] text-white p-4 rounded-xl shadow-2xl border border-white/15 flex items-start gap-3 animate-in slide-in-from-top-5 duration-200"
          >
            <div className="w-8 h-8 rounded-full bg-[#00873a] text-white flex items-center justify-center font-bold text-sm shrink-0">
              ✓
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-black uppercase tracking-wider text-green-400 mb-0.5">
                {toast.title}
              </div>
              <div className="text-xs text-gray-200 leading-snug">
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-gray-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      </div>
    </div>
    </div>
  );
}
