import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { EventCard } from '../components/EventCard';
import { EventCategory } from '../types';
import { 
  Search, 
  Sparkles, 
  Calendar, 
  Users, 
  Award, 
  MapPin, 
  ArrowRight, 
  GraduationCap, 
  CheckCircle2, 
  TrendingUp,
  Layers,
  Mail,
  Phone
} from 'lucide-react';

const CATEGORY_ITEMS: { name: EventCategory; count: string; icon: string }[] = [
  { name: 'Hackathon', count: '1 Live', icon: '💻' },
  { name: 'Cultural Fest', count: '1 Live', icon: '🎭' },
  { name: 'Sports Meet', count: '1 Live', icon: '🏆' },
  { name: 'Technical Workshop', count: '1 Live', icon: '🤖' },
  { name: 'Quiz Competition', count: '1 Live', icon: '🧠' },
  { name: 'Coding Contest', count: '1 Live', icon: '⚡' },
];

export const HomeView: React.FC = () => {
  const { 
    events, 
    searchQuery, 
    setSearchQuery, 
    setActiveTab, 
    setSelectedCategory,
    openEventDetails,
    openRegistrationFlow
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedHomeDate, setSelectedHomeDate] = useState<'all' | 'nov-1' | 'nov-2'>('all');
  const [selectedHomeCategory, setSelectedHomeCategory] = useState<string>('All');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setActiveTab('events');
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedHomeCategory(categoryName);
    const el = document.getElementById('all-events-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setSelectedCategory(categoryName);
      setActiveTab('events');
    }
  };

  // Show all events, with Nov 1, Nov 2, or category filter
  const displayedEvents = useMemo(() => {
    return events.filter((evt) => {
      if (selectedHomeDate === 'nov-1' && evt.date !== '2026-11-01') return false;
      if (selectedHomeDate === 'nov-2' && evt.date !== '2026-11-02') return false;
      if (selectedHomeCategory !== 'All' && evt.category !== selectedHomeCategory) return false;
      return true;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, selectedHomeDate, selectedHomeCategory]);

  const totalSeatsAll = events.reduce((sum, e) => sum + e.totalSeats, 0);
  const totalEnrolledAll = events.reduce((sum, e) => sum + e.registeredCount, 0);

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white pt-16 pb-20 sm:pt-20 sm:pb-28">
        
        {/* Background Image Texture */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
          <img 
            src="/src/assets/images/hero_campus_life_1790528100831.jpg" 
            alt="Campus Architecture" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Ambient glow accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* College Kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-indigo-200 mb-6 shadow-xs">
            <GraduationCap className="w-4 h-4 text-indigo-300" />
            <span>Official University Student Portal · Fall & Spring 2026</span>
          </div>

          {/* Hero Tagline requested: "Discover. Register. Participate." */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none text-balance">
            Discover. Register. Participate.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Your single destination for college hackathons, cultural festivals, sports tournaments, hands-on tech workshops, and competitive programming championships.
          </p>

          {/* Search Events Option */}
          <form 
            onSubmit={handleHeroSearch}
            className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl"
          >
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search events by title, organizer, or venue (e.g. Hackathon, AI, Stadium)..."
                className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 placeholder:text-slate-500 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-colors whitespace-nowrap flex items-center justify-center gap-2"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Popular Search Shortcuts */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400">Popular:</span>
            {['Hackathon', 'Cultural Fest', 'Sports Meet', 'Technical Workshop'].map((tag) => (
              <button
                key={tag}
                onClick={() => handleCategoryClick(tag)}
                className="hover:text-white underline decoration-slate-500 hover:decoration-white transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Metric Stats Banner */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/10 text-left">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums block">
                {events.length}
              </span>
              <span className="text-xs text-slate-300 font-medium">Campus Events Live</span>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums block">
                {totalSeatsAll}
              </span>
              <span className="text-xs text-slate-300 font-medium">Total Student Seats (150 / Event)</span>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono tabular-nums block">
                {totalEnrolledAll}
              </span>
              <span className="text-xs text-slate-300 font-medium">Registered Students</span>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums block">
                Digital Pass
              </span>
              <span className="text-xs text-slate-300 font-medium">QR Gate Entry</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Category Browse Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-1">
              Event Classification
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Browse by Campus Category
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setActiveTab('events');
            }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            <span>View all campus categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORY_ITEMS.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className="p-4 bg-white rounded-xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all text-left flex flex-col justify-between group"
            >
              <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-500 font-mono tabular-nums mt-0.5 block">
                  {events.filter(e => e.category === cat.name).length} active
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. All Campus Events Section (All events on Nov 1 & Nov 2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="all-events-section">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">
              <Calendar className="w-4 h-4" />
              <span>Campus Calendar · Nov 1 & Nov 2, 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              All Campus Events
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              All {events.length} campus events scheduled on <strong>Nov 1 & Nov 2, 2026</strong>. Capacity of 150 students per event. Registered student count updates in real time beside total students.
            </p>
          </div>

          {/* Quick Date Selectors & Directory Link */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                onClick={() => setSelectedHomeDate('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedHomeDate === 'all'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Events ({events.length})
              </button>
              <button
                onClick={() => setSelectedHomeDate('nov-1')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedHomeDate === 'nov-1'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Nov 1 ({events.filter(e => e.date === '2026-11-01').length})
              </button>
              <button
                onClick={() => setSelectedHomeDate('nov-2')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedHomeDate === 'nov-2'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Nov 2 ({events.filter(e => e.date === '2026-11-02').length})
              </button>
            </div>

            <button
              onClick={() => setActiveTab('events')}
              className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 border border-indigo-200"
            >
              <span>Full Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Active category filter banner if chosen from categories */}
        {selectedHomeCategory !== 'All' && (
          <div className="mb-6 flex items-center justify-between p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">Filtering category:</span>
              <span className="font-bold text-indigo-700 bg-white px-2.5 py-0.5 rounded-md border border-indigo-200">
                {selectedHomeCategory}
              </span>
            </div>
            <button
              onClick={() => setSelectedHomeCategory('All')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
            >
              Show all categories
            </button>
          </div>
        )}

        {/* All Events Grid */}
        {displayedEvents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">No events found for this selection</p>
            <button
              onClick={() => {
                setSelectedHomeDate('all');
                setSelectedHomeCategory('All');
              }}
              className="mt-3 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Reset to All Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        )}
      </section>

      {/* 5. How It Works: Student Flow */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How Event Registration Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              From discovering campus happenings to scanned entry with your digital student pass.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-mono font-bold flex items-center justify-center text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Discover Campus Events
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Filter by technical workshops, inter-department sports, grand cultural fests, or competitive coding challenges with real-time seat tracking.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-mono font-bold flex items-center justify-center text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900">
                One-Click Registration
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Provide your College ID and department info. Our system instantly locks your seat and assigns your unique collegiate registration number.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-mono font-bold flex items-center justify-center text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Access Scannable Pass
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                View or print your official pass complete with QR check-in code. Receive timely schedule alerts and notifications directly on your dashboard.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. University Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-300 block mb-2">
              University Student Council
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Ready to showcase your talent or learn modern technologies?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-indigo-100 leading-relaxed">
              Explore hackathons, workshops, and sports tournaments organized by student bodies and faculty councils across campus.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setActiveTab('events');
                }}
                className="px-6 py-3 bg-white text-indigo-900 hover:bg-indigo-50 text-xs font-bold rounded-xl shadow-md transition-colors"
              >
                Browse All Campus Events
              </button>
              <button
                onClick={() => setActiveTab('student-dashboard')}
                className="px-5 py-3 bg-indigo-900/60 hover:bg-indigo-900 text-white text-xs font-semibold rounded-xl border border-indigo-400/30 transition-colors"
              >
                View Student Dashboard
              </button>
            </div>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block opacity-20 pointer-events-none">
            <img 
              src="/src/assets/images/hero_campus_life_1790528100831.jpg" 
              alt="Campus Life" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 7. Administrative Helpdesk Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>On-Campus Inquiries & Registration Support</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Administrative Helpdesk
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Need help with event registrations, physical pass verification, seating queries, or venue directions? Visit our physical desk or connect with our campus coordinator directly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
              <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl flex items-start gap-3">
                <div className="p-2.5 bg-indigo-600/30 text-indigo-400 rounded-xl shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Physical Location</span>
                  <span className="text-sm font-bold text-white block mt-0.5">Near Auditorium</span>
                  <span className="text-[11px] text-slate-400">Main Campus Ground</span>
                </div>
              </div>

              <a 
                href="mailto:lavanyagudditi2008@gmail.com" 
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 p-4 rounded-2xl flex items-start gap-3 transition-colors group"
              >
                <div className="p-2.5 bg-indigo-600/30 text-indigo-400 rounded-xl shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Official Email</span>
                  <span className="text-xs font-bold text-white block mt-0.5 truncate group-hover:text-indigo-300">lavanyagudditi2008@gmail.com</span>
                  <span className="text-[11px] text-slate-400">Click to write email</span>
                </div>
              </a>

              <a 
                href="tel:7382395581" 
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 p-4 rounded-2xl flex items-start gap-3 transition-colors group"
              >
                <div className="p-2.5 bg-emerald-600/30 text-emerald-400 rounded-xl shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Mobile Helpline</span>
                  <span className="text-sm font-bold text-white font-mono block mt-0.5 group-hover:text-emerald-300">7382395581</span>
                  <span className="text-[11px] text-slate-400">Direct phone call</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
