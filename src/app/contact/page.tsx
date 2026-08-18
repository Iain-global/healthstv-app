"use client";

import React from 'react';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Message sent successfully! Our support agents will contact you shortly.');
    e.currentTarget.reset();
  };

  return (
    <div className="py-16 px-4 bg-[#fafcfb] min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-[#1f2e22] mb-4">Contact Our Team</h1>
          <p className="text-lg text-[#5e6d62] max-w-2xl mx-auto">
            Have questions about an upcoming livestream ticket, subscription account, or hosting an event? Drop us a line.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          
          {/* Left Panel: Support info */}
          <div className="md:col-span-2 bg-[#e8f3ec] p-8 rounded-2xl border border-[#d1e8d9]">
            <h3 className="text-xl font-bold text-[#1f2e22] mb-6">Support Details</h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-bold tracking-wider text-[#ea580c] uppercase mb-1">Email Support</h4>
              <p className="font-medium text-[#1f2e22]">
                <a href="mailto:support@healthsummits.tv" className="hover:text-[#ea580c] transition-colors">support@healthsummits.tv</a>
              </p>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-bold tracking-wider text-[#ea580c] uppercase mb-1">Event Partnerships</h4>
              <p className="font-medium text-[#1f2e22]">
                <a href="mailto:events@healthsummits.tv" className="hover:text-[#ea580c] transition-colors">events@healthsummits.tv</a>
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-bold tracking-wider text-[#ea580c] uppercase mb-1">Support Hours</h4>
              <p className="text-[#5e6d62]">
                Monday - Friday: 09:00 - 17:00 BST<br />
                Saturday (Summit Days): 08:00 - 18:00 BST
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold tracking-wider text-[#ea580c] uppercase mb-1">Response Time</h4>
              <p className="text-[#5e6d62]">
                We aim to reply to all member support requests within 2 hours during normal hours.
              </p>
            </div>
          </div>

          {/* Right Panel: Contact Form */}
          <div className="md:col-span-3 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#1f2e22] mb-6">Send a Direct Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#1f2e22] mb-2" htmlFor="contactName">Your Name</label>
                <input 
                  type="text" 
                  id="contactName" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a8848] focus:border-transparent transition-all" 
                  required 
                  placeholder="Alex Mercer" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#1f2e22] mb-2" htmlFor="contactEmail">Email Address</label>
                <input 
                  type="email" 
                  id="contactEmail" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a8848] focus:border-transparent transition-all" 
                  required 
                  placeholder="alex@gmail.com" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#1f2e22] mb-2" htmlFor="contactSubject">Subject</label>
                <select 
                  id="contactSubject" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a8848] focus:border-transparent transition-all bg-white"
                >
                  <option value="ticket">Livestream Ticket Support</option>
                  <option value="subscription">Membership Account & Billing</option>
                  <option value="business">Business Partnership Inquiries</option>
                  <option value="other">General Support Question</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#1f2e22] mb-2" htmlFor="contactMsg">Message</label>
                <textarea 
                  id="contactMsg" 
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a8848] focus:border-transparent transition-all resize-y" 
                  placeholder="Describe how we can help you today..." 
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-sm"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
