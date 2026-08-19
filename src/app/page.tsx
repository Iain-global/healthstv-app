import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[#006818] py-24 lg:py-32 overflow-hidden flex items-center justify-center min-h-[600px]">
        {/* Background Overlay */}
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: "url('/banner.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1c10] to-transparent opacity-80"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-block border border-[#ea8125] text-[#ea8125] font-bold px-6 py-2 rounded-full mb-6 tracking-wide text-sm bg-[#0c1c10]/50 backdrop-blur-sm">
            Watch Live, Learn for Life
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight font-heading">
            Discover the Future of Natural Health
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-body">
            Stream live health summits, connect with leading wellness experts, and access a premium video library on demand.
          </p>
          {/* Quick Registration & Social Login Options */}
          <div className="flex flex-col items-center">
            <div className="flex flex-wrap justify-center items-center gap-3 mb-3">
              <Link 
                href="/register" 
                className="bg-[#006818] hover:bg-[#004d11] text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-transform hover:-translate-y-0.5 text-center text-sm sm:text-base border border-white/20"
              >
                Register here to view!
              </Link>
              <button className="bg-[#1877f2] hover:bg-[#166fe5] text-white px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5 text-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </button>
            </div>
            
            <div className="flex justify-center items-center mb-3">
              <button className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5 text-sm">
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.5 24c0-1.61-.15-3.16-.42-4.69H24v9.09h12.75c-.53 2.64-2.01 4.88-4.21 6.39l6.53 5.07C42.9 36.27 46.5 30.73 46.5 24z"></path>
                  <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-6.53-5.07c-1.8.12-3.83.94-9.36.94-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                Google Sign In
              </button>
            </div>

            <p className="text-xs text-gray-300 font-medium">
              No payment or credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-white py-20 border-b-4 border-[#006818]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0c1c10] leading-tight font-heading">
                Your better <br />
                <span className="text-[#c19b4e]">Health journey <br />Starts here!</span>
              </h2>
            </div>
            <div className="text-[#5e6d62] space-y-6 text-lg font-body">
              <p className="italic font-serif text-xl text-[#1f2e22]">
                Join us as we launch Health Summits TV and help shape the future of Natural Health through video.
              </p>
              <p>
                Discover trusted talks, practical programmes and live expert events—created to help you make positive, lasting changes to your health.
              </p>
              <p>
                Watch Podcasts and videos from expert speakers from not just here in the UK but around the World.
              </p>
              
              <div className="pt-6 flex flex-wrap items-center gap-4">
                <Link href="/register" className="bg-[#006818] hover:bg-[#004d11] text-white px-6 py-3 rounded-lg font-bold shadow-md transition-colors text-center">
                  Register here to view!
                </Link>
                <button className="bg-[#1877f2] hover:bg-[#166fe5] text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-sm transition-transform hover:-translate-y-0.5 text-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Continue with Facebook
                </button>
                <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-sm transition-transform hover:-translate-y-0.5 text-sm">
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.5 24c0-1.61-.15-3.16-.42-4.69H24v9.09h12.75c-.53 2.64-2.01 4.88-4.21 6.39l6.53 5.07C42.9 36.27 46.5 30.73 46.5 24z"></path>
                    <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-6.53-5.07c-1.8.12-3.83.94-9.36.94-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                  Google Sign In
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">No payment or credit card required</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section className="bg-[#eaf5eb] py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0c1c10] mb-4 font-heading">Experience HealthSummits.tv</h2>
            <div className="w-16 h-1 bg-[#ea8125] mx-auto rounded mb-4"></div>
            <p className="text-[#5e6d62] max-w-2xl mx-auto">Select the path that fits your lifestyle. Subscribe for full access or browse individual webinars.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Tier 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#e0e8e2] flex flex-col">
              <h3 className="text-xl font-bold text-[#0c1c10] mb-2 font-heading">Buy Virtual Tickets</h3>
              <div className="text-2xl font-bold text-[#006818] mb-4">Live events</div>
              <p className="text-[#5e6d62] text-sm mb-6 flex-grow">Watch live health summits from anywhere in the world.</p>
              <ul className="space-y-3 mb-8 text-sm font-medium text-[#1f2e22]">
                <li className="flex gap-2"><span className="text-[#006818]">✓</span> Live summit transmission</li>
                <li className="flex gap-2"><span className="text-[#006818]">✓</span> Multi-device compatibility</li>
                <li className="flex gap-2"><span className="text-[#006818]">✓</span> 30-day replay window</li>
              </ul>
              <Link href="/events" className="block text-center border-2 border-[#006818] text-[#006818] hover:bg-[#006818] hover:text-white px-6 py-3 rounded-lg font-bold transition-colors">
                Secure My Virtual Seats
              </Link>
            </div>

            {/* Tier 2: Best Value */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-[#006818] flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#006818] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Best Value
              </div>
              <h3 className="text-xl font-bold text-[#0c1c10] mb-2 font-heading">Subscribe & Enjoy</h3>
              <div className="text-4xl font-black text-[#006818] mb-4">£1.00 <span className="text-base font-medium text-gray-500">/ month</span></div>
              <p className="text-[#5e6d62] text-sm mb-6 flex-grow">Get six months of premium membership. Regularly £4.99/mo.</p>
              <ul className="space-y-3 mb-8 text-sm font-medium text-[#1f2e22]">
                <li className="flex gap-2"><span className="text-[#006818]">✓</span> <strong>Complete library access</strong></li>
                <li className="flex gap-2"><span className="text-[#006818]">✓</span> Live QA session integration</li>
                <li className="flex gap-2"><span className="text-[#006818]">✓</span> Early-bird ticket discounts</li>
                <li className="flex gap-2"><span className="text-[#006818]">✓</span> Cancel anytime</li>
              </ul>
              <button className="w-full bg-[#ea8125] hover:bg-[#d3701a] text-white px-6 py-3 rounded-lg font-bold shadow-md transition-colors">
                Activate All-Access Membership
              </button>
            </div>

            {/* Tier 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#e0e8e2] flex flex-col">
              <h3 className="text-xl font-bold text-[#0c1c10] mb-2 font-heading">Watch On Demand</h3>
              <div className="text-2xl font-bold text-[#006818] mb-4">Library access</div>
              <p className="text-[#5e6d62] text-sm mb-6 flex-grow">Missed a summit? Grab individual video bundles.</p>
              <ul className="space-y-3 mb-8 text-sm font-medium text-[#1f2e22]">
                <li className="flex gap-2"><span className="text-[#006818]">✓</span> Single session video bundle</li>
                <li className="flex gap-2"><span className="text-[#006818]">✓</span> No recurring fee required</li>
                <li className="flex gap-2"><span className="text-[#006818]">✓</span> Lifetime playback support</li>
              </ul>
              <Link href="/free-videos" className="block text-center border-2 border-[#006818] text-[#006818] hover:bg-[#006818] hover:text-white px-6 py-3 rounded-lg font-bold transition-colors">
                Explore Free Wellness Replays
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0c1c10] mb-4 font-heading">Membership Comparisons</h2>
            <div className="w-16 h-1 bg-[#ea8125] mx-auto rounded"></div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#eaf5eb] text-[#0c1c10] font-bold border-b border-[#c1e6c6]">
                  <th className="py-4 px-6 text-left w-3/5">What you receive</th>
                  <th className="py-4 px-6 text-center w-1/5">Free Viewer</th>
                  <th className="py-4 px-6 text-center w-1/5">HSTV Subscriber</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e8e2]">
                {[
                  ["Create a free account", true, true],
                  ["Watch selected free health and wellbeing videos", true, true],
                  ["Receive the HSTV newsletter", true, true],
                  ["Discover upcoming online and in-person events", true, true],
                  ["Watch premium talks, interviews and documentaries", false, true],
                  ["Access the full subscriber video library", false, true],
                  ["Watch regular live Meet the Experts sessions", "Selected sessions", true],
                  ["Submit questions during live expert sessions", false, true],
                  ["Watch session replays on demand", "Limited", true],
                  ["Access exclusive subscriber-only programmes", false, true],
                  ["Enjoy early access to selected new releases", false, true],
                  ["Receive discounts on virtual event tickets", false, true],
                  ["Receive offers from selected health and wellbeing partners", "Limited", true],
                  ["Cancel your subscription at any time", false, true],
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-[#fafcfb] transition-colors">
                    <td className="py-4 px-6 text-[#1f2e22] text-sm md:text-base font-medium">{row[0]}</td>
                    <td className="py-4 px-6 text-center">
                      {row[1] === true ? <span className="text-[#128e73] font-bold">✓</span> : 
                       row[1] === false ? <span className="text-gray-300 font-bold">—</span> : 
                       <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">{row[1]}</span>}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {row[2] === true ? <span className="text-[#128e73] font-bold">✓</span> : 
                       row[2] === false ? <span className="text-gray-300 font-bold">—</span> : 
                       <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">{row[2]}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
