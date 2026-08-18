"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrganiserRegisterClient() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    website: "",
    niche: "",
    email: "",
    bio: ""
  });
  const [status, setStatus] = useState({ loading: false, error: "", success: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: false });

    try {
      const res = await fetch("/api/organiser/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus({ loading: false, error: "", success: true });
        // The user will see the success message and then they can login
      } else {
        setStatus({ loading: false, error: data.error || "Registration failed", success: false });
      }
    } catch (err) {
      setStatus({ loading: false, error: "Network error occurred", success: false });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#1a3824] to-[#122b1a] text-white pt-24 pb-32 px-4 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00873a] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-500 opacity-5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="container mx-auto max-w-[1200px] relative z-10 text-center">
          <span className="bg-[#f6821f] text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 inline-block">ORGANISER SUPPORT & COMMISSION PRIVILEGES</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight max-w-4xl mx-auto">
            Join the HealthSummits.tv Expert Network
          </h1>
          <p className="text-xl md:text-2xl text-green-50 max-w-3xl mx-auto leading-relaxed">
            Create your verified organiser profile, launch virtual health summits, and sell premium access to our worldwide audience of health seekers and professionals.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-[1200px] px-4 -mt-20 relative z-20 mb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Privileges Card */}
          <div className="lg:w-1/3">
            <div className="bg-[#1f2e22] text-white p-8 rounded-3xl shadow-xl h-full border border-[#2d4031]">
              <div className="bg-white/10 w-24 h-24 rounded-full flex items-center justify-center mb-8 mx-auto border-4 border-[#00873a]/30">
                <span className="text-4xl">🏥</span>
              </div>
              <h2 className="text-2xl font-black text-center mb-8">Founding Organiser Privileges</h2>
              
              <div className="bg-[#00873a]/20 border border-[#00873a]/30 rounded-xl p-4 mb-6">
                <div className="text-[#00873a] font-bold text-xs uppercase tracking-wider mb-2">Exclusive Offer</div>
                <div className="text-sm">Apply now to lock in Founding Host status and lifetime reduced platform fees.</div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex gap-3">
                  <span className="text-[#00873a] font-bold text-lg">✓</span>
                  <span className="text-gray-300">Keep 90% of all Virtual Summit & Event ticket revenues</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#00873a] font-bold text-lg">✓</span>
                  <span className="text-gray-300">Monetize single video lectures in our Vault (Subscribers pool)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#00873a] font-bold text-lg">✓</span>
                  <span className="text-gray-300">Global traffic, marketing & promotion from HealthSummits</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#00873a] font-bold text-lg">✓</span>
                  <span className="text-gray-300">Automated Stripe settlements & In-Player Paywalls</span>
                </li>
              </ul>
              
              <div className="bg-orange-500/10 border border-orange-500/20 text-orange-200 text-xs p-4 rounded-xl leading-relaxed">
                <span className="font-bold text-orange-400">Important:</span> Only verified healthcare professionals, clinics, and health institutions will be approved for hosting.
              </div>
            </div>
          </div>

          {/* Right Column: Registration Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 h-full">
              {status.success ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
                  <h2 className="text-3xl font-black text-[#1f2e22] mb-4">Application Submitted!</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                    Thank you for applying to the Expert Network. Our moderation team will review your credentials shortly.
                  </p>
                  <div className="bg-[#f8f9fa] p-6 rounded-xl text-left border border-gray-200 mb-8">
                    <h3 className="font-bold text-[#1f2e22] mb-2">How to log in:</h3>
                    <p className="text-sm text-gray-600 mb-2">While you await verification, you can log in to your dashboard to set up your profile.</p>
                    <p className="text-sm text-gray-600"><strong>Username:</strong> Your First Name (e.g., if you entered "Dr. Sarah Jenkins", use "sarah")</p>
                    <p className="text-sm text-gray-600"><strong>Password:</strong> Same as your username (you can change this in Account Settings).</p>
                  </div>
                  <Link href="/organiser-hub" className="inline-block bg-[#00873a] hover:bg-[#006818] text-white font-bold py-4 px-8 rounded-xl transition-colors">
                    Go to Organiser Dashboard →
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-[#1f2e22] mb-2">Organiser Registration</h2>
                    <p className="text-gray-500">Apply to become a verified event presenter or institutional host.</p>
                  </div>

                  {status.error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-bold border border-red-100">
                      {status.error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Presenter / Organiser Name *</label>
                        <input 
                          type="text" 
                          required 
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          placeholder="e.g. Dr. Jane Doe"
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-[#00873a] focus:ring-1 focus:ring-[#00873a] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Legal Entity / Business Name</label>
                        <input 
                          type="text" 
                          value={formData.organization}
                          onChange={e => setFormData({...formData, organization: e.target.value})}
                          placeholder="e.g. Health Hub Inc."
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-[#00873a] focus:ring-1 focus:ring-[#00873a] outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Website (Optional)</label>
                        <input 
                          type="url" 
                          value={formData.website}
                          onChange={e => setFormData({...formData, website: e.target.value})}
                          placeholder="https://"
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-[#00873a] focus:ring-1 focus:ring-[#00873a] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Primary Health Sub-Niche</label>
                        <select 
                          required
                          value={formData.niche}
                          onChange={e => setFormData({...formData, niche: e.target.value})}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-[#00873a] focus:ring-1 focus:ring-[#00873a] outline-none bg-white"
                        >
                          <option value="">Select a Niche...</option>
                          <option value="Functional Medicine">Functional Medicine</option>
                          <option value="Longevity & Anti-Aging">Longevity & Anti-Aging</option>
                          <option value="Mental Wellbeing">Mental Wellbeing</option>
                          <option value="Holistic Nutrition">Holistic Nutrition</option>
                          <option value="Integrative Oncology">Integrative Oncology</option>
                          <option value="Gut & Microbiome Health">Gut & Microbiome Health</option>
                          <option value="Other">Other (Please detail in summary)</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Work Email Address *</label>
                        <input 
                          type="email" 
                          required 
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          placeholder="sarah@wellnessinstitute.com"
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-[#00873a] focus:ring-1 focus:ring-[#00873a] outline-none"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Brief Background / Summary / Experience *</label>
                        <textarea 
                          required 
                          rows={4}
                          value={formData.bio}
                          onChange={e => setFormData({...formData, bio: e.target.value})}
                          placeholder="Tell us about your medical background, clinic, or previous events you've hosted..."
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-[#00873a] focus:ring-1 focus:ring-[#00873a] outline-none resize-none"
                        ></textarea>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button 
                        type="submit" 
                        disabled={status.loading}
                        className="w-full bg-[#00873a] hover:bg-[#006818] text-white font-bold py-4 rounded-xl shadow-lg transition-colors text-lg flex justify-center items-center gap-2"
                      >
                        {status.loading ? 'Submitting...' : 'Submit Application & Apply for Founding Host'}
                      </button>
                      <p className="text-center text-xs text-gray-400 mt-4">
                        By applying you agree to our <Link href="#" className="underline hover:text-gray-600">Organiser Agreement & Terms</Link>.
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Model */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-[1200px] px-4 text-center">
          <h2 className="text-3xl font-black text-[#1f2e22] mb-16">The HealthSummits Partnership Model</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="w-16 h-16 bg-green-50 text-[#00873a] rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6">90</div>
              <h3 className="text-lg font-bold text-[#1f2e22] mb-3">90/10 Revenue Split</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Retain 90% of all ticket sales. We reinvest the remaining 10% into server infrastructure, player licensing, and marketing to grow the platform audience.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">💳</div>
              <h3 className="text-lg font-bold text-[#1f2e22] mb-3">Stripe Secure Checkout</h3>
              <p className="text-gray-500 text-sm leading-relaxed">We directly connect your Stripe account to our platform. All ticket revenues bypass our accounts and flow instantly into yours.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-orange-50 text-[#f6821f] rounded-full flex items-center justify-center text-2xl mx-auto mb-6">⚡</div>
              <h3 className="text-lg font-bold text-[#1f2e22] mb-3">Zero Tech Headaches</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Our managed servers and enterprise-grade video player handles thousands of concurrent viewers effortlessly. You just focus on the content.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Packages */}
      <section className="py-20 bg-[#f4f9f5]">
        <div className="container mx-auto max-w-[1000px] px-4">
          <h2 className="text-3xl font-black text-[#1f2e22] text-center mb-16">Streaming Integration Packages</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
              <h3 className="text-xl font-bold text-[#1f2e22] mb-4">Pre-Recorded Upload</h3>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">For independently recorded webinars or past summit vaults that you want to put behind a ticketing paywall.</p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-sm text-gray-600"><span className="text-green-500">✓</span> 50GB Video Vault Storage</li>
                <li className="flex gap-3 text-sm text-gray-600"><span className="text-green-500">✓</span> In-player Viewer Authentication</li>
                <li className="flex gap-3 text-sm text-gray-600"><span className="text-green-500">✓</span> No Livestream server bandwidth</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-[#00873a] relative transform md:-translate-y-4 flex flex-col">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00873a] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
              <h3 className="text-xl font-bold text-[#1f2e22] mb-4">Stream Assist</h3>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">For live broadcasting via Zoom, OBS or any RTMP-compatible stream directly to our player framework.</p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-sm text-gray-600"><span className="text-green-500">✓</span> RTMP Ingest Server Keys</li>
                <li className="flex gap-3 text-sm text-gray-600"><span className="text-green-500">✓</span> 1080p 60fps streaming</li>
                <li className="flex gap-3 text-sm text-gray-600"><span className="text-green-500">✓</span> Unlimited concurrent viewers</li>
                <li className="flex gap-3 text-sm text-gray-600"><span className="text-green-500">✓</span> Auto-recording to vault</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
              <h3 className="text-xl font-bold text-[#1f2e22] mb-4">End-to-End Livestream</h3>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">For major conference venues requiring hardware encoder integration and custom API webhook workflows.</p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-sm text-gray-600"><span className="text-green-500">✓</span> Dedicated AWS MediaLive node</li>
                <li className="flex gap-3 text-sm text-gray-600"><span className="text-green-500">✓</span> Professional onsite consulting</li>
                <li className="flex gap-3 text-sm text-gray-600"><span className="text-green-500">✓</span> TV-broadcast standard delivery</li>
                <li className="flex gap-3 text-sm text-gray-600"><span className="text-green-500">✓</span> Private 24/7 technical channel</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="py-20 bg-white border-t border-gray-200">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-[#1f2e22] mb-4">Roadmap</h2>
            <p className="text-gray-500">What we're building next to help you scale your health education.</p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#00873a]"></div>
              <div className="flex justify-between items-start mb-4">
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded">PHASE 1 (Q3 2026) - COMPLETED</span>
                <span className="text-xs font-bold text-[#f6821f] uppercase">Prioritised by Organisers</span>
              </div>
              <h3 className="text-xl font-bold text-[#1f2e22] mb-3">Organisers' Home Page (LinkedIn for Health Experts)</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">A public profile and professional network dedicated to health practitioners, researchers, and event hosts.</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-6">
                <li className="flex gap-2"><span className="text-green-500">✓</span> Dedicated Organiser Landing Page</li>
                <li className="flex gap-2"><span className="text-green-500">✓</span> Auto-Curated Content Portfolios</li>
                <li className="flex gap-2"><span className="text-green-500">✓</span> Centralised ticketing & e-commerce</li>
                <li className="flex gap-2"><span className="text-green-500">✓</span> Peer Reviews and Endorsements</li>
                <li className="flex gap-2"><span className="text-green-500">✓</span> Featured on our Weekly Newsletter</li>
                <li className="flex gap-2"><span className="text-green-500">✓</span> Public SEO Indexed Discoverability</li>
              </ul>
              <div className="flex gap-3">
                <button className="bg-[#f6821f] text-white px-4 py-2 rounded-lg text-sm font-bold">Apply as Founding Organiser</button>
                <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold">Preview Live Implementations</button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-green-300"></div>
              <div className="flex justify-between items-start mb-4">
                <span className="bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded border border-green-200">PHASE 2 (IN PROGRESS)</span>
              </div>
              <h3 className="text-xl font-bold text-[#1f2e22] mb-3">Our Virtual Lounge for online delegates</h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">A dedicated live chat and engagement space that surrounds your video player alongside speaking agenda and speaker bios.</p>
              <button className="border border-green-600 text-green-700 px-4 py-2 rounded-lg text-sm font-bold">Preview Virtual Lounge Beta</button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden opacity-75">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#f6821f]"></div>
              <div className="flex justify-between items-start mb-4">
                <span className="bg-orange-50 text-orange-700 text-xs font-bold px-2.5 py-1 rounded border border-orange-200">PHASE 3 (PENDING - OCT 2026)</span>
                <span className="text-xs text-gray-400">Phase 3 Gateway</span>
              </div>
              <h3 className="text-xl font-bold text-[#1f2e22] mb-3">Event Organiser Dashboard & Ticket Commerce</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">CMS tools to manage uploaded files, track player analytics, link Stripe accounts and edit ticketing methodology.</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-6">
                <li className="flex gap-2"><span className="text-[#f6821f]">•</span> Upload pre-recorded Vault videos</li>
                <li className="flex gap-2"><span className="text-[#f6821f]">•</span> Tie into Subscriptions & All Access passes</li>
                <li className="flex gap-2"><span className="text-[#f6821f]">•</span> Edit/hide/delete your own videos</li>
                <li className="flex gap-2"><span className="text-[#f6821f]">•</span> Analytics & Revenue Tracking</li>
                <li className="flex gap-2"><span className="text-[#f6821f]">•</span> Submit events for front-page inclusion</li>
                <li className="flex gap-2"><span className="text-[#f6821f]">•</span> Seamlessly onboard with Stripe Connect</li>
              </ul>
              <button className="bg-[#00873a] text-white px-4 py-2 rounded-lg text-sm font-bold">Sign up to private Beta Waitlist</button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden opacity-60">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-purple-500"></div>
              <div className="flex justify-between items-start mb-4">
                <span className="bg-purple-50 text-purple-700 text-xs font-bold px-2.5 py-1 rounded border border-purple-200">PHASE 4 (NOV 2026)</span>
                <span className="text-xs text-gray-400">Phase 4 Gateway</span>
              </div>
              <h3 className="text-xl font-bold text-[#1f2e22] mb-3">Mobile Apps, HealthSummits AI & 24/7 Channel</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">Native iOS & Android apps, machine-transcription of all talks, and a non-stop streaming channel for public discovery.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 font-bold text-[#1f2e22] mb-2"><span className="text-green-500">🤖</span> HealthSummits AI Search</div>
                  <div className="text-xs text-gray-500">Users can semantic search across transcripts to find the exact video and timestamp for their health concern.</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 font-bold text-[#1f2e22] mb-2"><span className="text-blue-500">📱</span> iOS & Android Native Apps</div>
                  <div className="text-xs text-gray-500">Push notifications, background audio playing, offline downloads for commuting, and smart device casting.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
