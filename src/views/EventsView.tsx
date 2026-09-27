import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { EventCard } from '../components/EventCard';
import { EventCategory } from '../types';
import { 
  Search, 
  Filter, 
  Calendar, 
  X, 
  SlidersHorizontal, 
  ArrowUpDown,
  CheckCircle2,
  Clock
} from 'lucide-react';

const CATEGORIES: ('All' | EventCategory)[] = [
  'All',
  'Hackathon',
  'Cultural Fest',
  'Sports Meet',
  'Technical Workshop',
  'Quiz Competition',
  'Coding Contest'
];

export const EventsView: React.FC = () => {
  const { 
    events, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    registrations 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'filling-fast' | 'closed'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'nov-1' | 'nov-2'>('all');
  const [sortBy, setSortBy] = useState<'date-asc' | 'date-desc' | 'popular' | 'seats'>('date-asc');

  // Total campus capacity stats
  const totalSeatsAll = events.reduce((sum, e) => sum + e.totalSeats, 0);
  const totalEnrolledAll = registrations.filter(r => r.status !== 'Cancelled').length;

  // Filtered and sorted events
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // Search term
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = evt.title.toLowerCase().includes(q);
        const matchesCategory = evt.category.toLowerCase().includes(q);
        const matchesVenue = evt.venue.toLowerCase().includes(q);
        const matchesOrganizer = evt.organizer.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesVenue && !matchesOrganizer) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'All' && evt.category !== selectedCategory) {
        return false;
      }

      // Status
      const activeCount = registrations.filter(r => r.eventId === evt.id && r.status !== 'Cancelled').length;
      const seatsLeft = evt.totalSeats - activeCount;
      if (statusFilter === 'open' && seatsLeft <= 0) return false;
      if (statusFilter === 'filling-fast' && (seatsLeft > 15 || seatsLeft <= 0)) return false;
      if (statusFilter === 'closed' && seatsLeft > 0) return false;

      // Date filtering specifically for Nov 1 and Nov 2
      if (dateFilter === 'nov-1' && evt.date !== '2026-11-01') return false;
      if (dateFilter === 'nov-2' && evt.date !== '2026-11-02') return false;

      return true;
    }).sort((a, b) => {
      const aCount = registrations.filter(r => r.eventId === a.id && r.status !== 'Cancelled').length;
      const bCount = registrations.filter(r => r.eventId === b.id && r.status !== 'Cancelled').length;
      if (sortBy === 'date-asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'date-desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'popular') {
        return bCount - aCount;
      }
      if (sortBy === 'seats') {
        return (b.totalSeats - bCount) - (a.totalSeats - aCount);
      }
      return 0;
    });
  }, [events, registrations, searchQuery, selectedCategory, statusFilter, dateFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setStatusFilter('all');
    setDateFilter('all');
    setSortBy('date-asc');
  };

  const isFiltered = searchQuery !== '' || selectedCategory !== 'All' || statusFilter !== 'all' || dateFilter !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header & Highlights */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            <span>University Events Directory</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">All Events on Nov 1 & Nov 2, 2026</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Campus Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            All events are scheduled for <strong>Nov 1 & Nov 2, 2026</strong>. Each event has a capacity of <strong>150 students</strong> (total 900 student capacity). Registered members update automatically in real time beside total students.
          </p>
        </div>

        {/* Real-time campus registration tally */}
        <div className="p-4 bg-indigo-50/80 border border-indigo-200/80 rounded-2xl flex items-center gap-4 shrink-0 shadow-xs">
          <div>
            <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider block">
              Total Enrolled Students
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-indigo-900 font-mono tabular-nums">
                {totalEnrolledAll}
              </span>
              <span className="text-xs font-bold text-slate-500">
                / {totalSeatsAll} Total Students (150/event)
              </span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
              {Math.max(0, totalSeatsAll - totalEnrolledAll)} total seats remaining across campus
            </span>
          </div>
        </div>
      </div>

      {/* Administrative Helpdesk Quick Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
              Administrative Helpdesk (Registration Support)
            </div>
            <div className="text-sm font-bold text-white flex flex-wrap items-center gap-2 mt-0.5">
              <span>Location: Near Auditorium</span>
              <span className="text-slate-500 hidden sm:inline">·</span>
              <span className="text-slate-300 font-medium text-xs">For queries regarding event slots, attendance passes & teams</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <a 
            href="mailto:lavanyagudditi2008@gmail.com" 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700"
          >
            <span className="text-indigo-400 font-semibold">Email:</span>
            <span>lavanyagudditi2008@gmail.com</span>
          </a>
          <a 
            href="tel:7382395581" 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 hover:text-white transition-colors border border-emerald-700/50"
          >
            <span className="text-emerald-400 font-semibold">Mobile:</span>
            <span className="font-mono font-bold">7382395581</span>
          </a>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        
        {/* Row 1: Search & Sorting */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event title, organizer, topic or venue..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-sm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-hidden text-xs cursor-pointer"
              >
                <option value="date-asc">Date (Earliest First)</option>
                <option value="date-desc">Date (Latest First)</option>
                <option value="popular">Most Popular</option>
                <option value="seats">Available Seats</option>
              </select>
            </div>

            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Category Segmented Tab Buttons (Allowed as functional filter controls per guidelines) */}
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Filter by Category
          </span>
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Secondary Status & Date Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-500">Seat Status:</span>
            {(['all', 'open', 'filling-fast', 'closed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                  statusFilter === st 
                    ? 'bg-slate-900 text-white font-semibold' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {st === 'filling-fast' ? 'Filling Fast (≤15 Left)' : st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Timeline:</span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-medium text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Dates (Nov 1 & Nov 2)</option>
              <option value="nov-1">Nov 1, 2026 (Day 1)</option>
              <option value="nov-2">Nov 2, 2026 (Day 2)</option>
            </select>
          </div>

        </div>

      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center max-w-lg mx-auto shadow-xs">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No matching campus events</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            We couldn't find any events matching your selected search query or category filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      )}

    </div>
  );
};
