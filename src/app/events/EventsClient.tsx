"use client";

import { useState } from "react";
import Image from "next/image";

type EventType = {
  id: number;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  imageUrl: string | null;
  price: number;
  organiserId: number;
  createdAt: Date;
  format?: string | null;
  ticketingMethod?: string | null;
  ticketUrl?: string | null;
  organiser?: {
    name: string;
    organization: string | null;
  } | null;
};

export default function EventsClient({ initialEvents }: { initialEvents: EventType[] }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date-desc");

  // Filter events based on search
  const filteredEvents = initialEvents.filter(event => 
    event.title.toLowerCase().includes(search.toLowerCase()) || 
    (event.description ? event.description.toLowerCase().includes(search.toLowerCase()) : false)
  );

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    // Default to created date or actual date logic
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <>
      {/* Live Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e0e8e2] mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/2">
          <input 
            type="text" 
            placeholder="Search summits, topics or speakers..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-[#e0e8e2] rounded-lg focus:outline-none focus:border-[#006818] focus:ring-1 focus:ring-[#006818]"
          />
        </div>
        <div className="w-full md:w-auto flex gap-4">
          <select className="px-4 py-3 border border-[#e0e8e2] rounded-lg focus:outline-none focus:border-[#006818] bg-white text-[#1f2e22] min-w-[200px]">
            <option value="all">All Event Types</option>
            <option value="summit">Summits & Conferences</option>
            <option value="webinar">Webinars & Lectures</option>
            <option value="workshop">Workshops</option>
          </select>
          <select 
            className="px-4 py-3 border border-[#e0e8e2] rounded-lg focus:outline-none focus:border-[#006818] bg-white text-[#1f2e22] min-w-[180px]"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="date-desc">Date: Soonest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Event Cards Grid */}
      {sortedEvents.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">
          No events found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border border-[#e0e8e2] overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col">
              {/* Card Image */}
              <div 
                className="h-56 bg-cover bg-center relative" 
                style={{ backgroundImage: `url('${event.imageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop'}')` }}
              >
                <div className="absolute top-4 right-4 bg-[#006818] text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm">
                  Live Broadcast
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-6 flex-grow flex flex-col">
                <div className="text-[#ea8125] text-xs font-bold uppercase tracking-wider mb-2">
                  {event.date}
                </div>
                <h3 className="text-xl font-bold text-[#0c1c10] mb-3 leading-tight line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-[#5e6d62] text-sm line-clamp-3 mb-4">
                  {event.description}
                </p>
                <div className="text-xs text-gray-500 mt-auto font-medium">
                  Organised by <span className="text-[#006818] font-bold">{event.organiser?.organization || event.organiser?.name || "Platform Organiser"}</span>
                </div>
              </div>
              
              {/* Card Footer */}
              <div className="px-6 py-5 border-t border-[#e0e8e2] bg-[#fafcfb] flex justify-between items-center">
                <span className="text-xl font-bold text-[#006818]">£{event.price.toFixed(2)}</span>
                <button className="bg-[#ea8125] hover:bg-[#d3701a] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
                  Book Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
