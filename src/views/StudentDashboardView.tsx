import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  Calendar, 
  Ticket, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  MapPin, 
  BookOpen, 
  TrendingUp, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const StudentDashboardView: React.FC = () => {
  const { 
    currentUser, 
    registrations, 
    events, 
    setActiveTab, 
    openTicketPass, 
    openEventDetails,
    setIsAuthModalOpen,
    setAuthModalMode,
    quickSwitchToStudent
  } = useApp();

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Student Sign In Required</h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Sign in to access your personal campus student dashboard, event metrics, and scheduled passes.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => quickSwitchToStudent()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Load Demo Student (Alex Chen)
          </button>
          <button
            onClick={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Custom Sign In
          </button>
        </div>
      </div>
    );
  }

  // Student registrations
  const studentRegs = registrations.filter(r => r.studentId === currentUser.id);
  const activeRegs = studentRegs.filter(r => r.status === 'Confirmed');
  
  // Classify upcoming vs past
  const now = new Date();
  const upcomingRegs = activeRegs.filter(r => new Date(r.eventDate) >= now);
  const completedRegs = activeRegs.filter(r => new Date(r.eventDate) < now);

  // Recommendations: events not registered for
  const registeredEventIds = new Set(studentRegs.filter(r => r.status !== 'Cancelled').map(r => r.eventId));
  const recommendedEvents = events.filter(e => !registeredEventIds.has(e.id)).slice(0, 3);

  // Next scheduled event
  const nextEventReg = upcomingRegs[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl font-extrabold text-white shadow-inner shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-300">
                <span>Student Academic Portal</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{currentUser.collegeId}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
                Welcome back, {currentUser.name}
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                {currentUser.department} · {currentUser.year}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('events')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Browse Campus Events</span>
            </button>
            <button
              onClick={() => setActiveTab('registrations')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-colors flex items-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>My Passes</span>
            </button>
          </div>

        </div>
      </div>

      {/* 3 Metric Cards requested in specification: Total, Upcoming, Completed */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Metric 1: Total Registered */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Total Registered Events
            </span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 block font-mono tabular-nums">
              {studentRegs.length}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {activeRegs.length} active passes enrolled
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Upcoming Events */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
              Upcoming Events
            </span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 block font-mono tabular-nums">
              {upcomingRegs.length}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Scheduled on your calendar
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Completed Events */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Completed Events
            </span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 block font-mono tabular-nums">
              {completedRegs.length}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Archived participation records
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Grid: Upcoming Schedule & Quick Pass Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Schedule Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Your Registered Event Schedule
            </h2>
            <button
              onClick={() => setActiveTab('registrations')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Manage all ({studentRegs.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {upcomingRegs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
              <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No upcoming events scheduled</p>
              <p className="text-xs text-slate-500 mt-1">Register for an upcoming hackathon, workshop, or athletic meet.</p>
              <button
                onClick={() => setActiveTab('events')}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Browse Events
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingRegs.map((reg) => (
                <div 
                  key={reg.id} 
                  className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-indigo-300 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-bold text-indigo-600 tabular-nums">{reg.id}</span>
                      <span>·</span>
                      <span>{reg.eventCategory}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      {reg.eventTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {reg.eventDate}
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {reg.eventVenue}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => openTicketPass(reg)}
                    className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition-colors shrink-0 flex items-center gap-1.5 self-end sm:self-auto"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>View Pass</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Quick Access Action Shortcuts */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mt-6">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Quick Shortcuts
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setActiveTab('events')}
                className="p-3 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-colors"
              >
                <Calendar className="w-4 h-4 text-indigo-600 mb-1" />
                <span className="text-xs font-bold text-slate-900 block">Catalog</span>
                <span className="text-[10px] text-slate-500">Discover new events</span>
              </button>

              <button
                onClick={() => setActiveTab('registrations')}
                className="p-3 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-colors"
              >
                <Ticket className="w-4 h-4 text-indigo-600 mb-1" />
                <span className="text-xs font-bold text-slate-900 block">Tickets</span>
                <span className="text-[10px] text-slate-500">Print digital passes</span>
              </button>

              <button
                onClick={() => {
                  const ev = events.find(e => e.category === 'Hackathon');
                  if (ev) openEventDetails(ev);
                }}
                className="p-3 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-colors col-span-2 sm:col-span-1"
              >
                <Sparkles className="w-4 h-4 text-amber-600 mb-1" />
                <span className="text-xs font-bold text-slate-900 block">Hackathon</span>
                <span className="text-[10px] text-slate-500">CodeSprint 2026</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Recommended for You */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Recommended Events</span>
            </h2>
          </div>

          <div className="space-y-3">
            {recommendedEvents.map((evt) => (
              <div 
                key={evt.id}
                className="bg-white rounded-xl border border-slate-200/90 p-4 hover:border-indigo-300 transition-colors shadow-2xs space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-indigo-600">{evt.category}</span>
                  <span className="font-mono tabular-nums">{evt.date}</span>
                </div>

                <h4 
                  onClick={() => openEventDetails(evt)}
                  className="text-xs font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
                >
                  {evt.title}
                </h4>

                <p className="text-[11px] text-slate-600 line-clamp-2">
                  {evt.shortDescription}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-mono tabular-nums text-[11px]">
                    {evt.totalSeats - evt.registeredCount} seats left
                  </span>
                  <button
                    onClick={() => openEventDetails(evt)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Academic Verification Badge */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950">
            <div className="flex items-center gap-2 font-bold mb-1">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Verified Student Standing</span>
            </div>
            <p className="text-[11px] text-indigo-800/90 leading-relaxed">
              Enrolled through the Office of Student Affairs. Event participation credits are logged to your collegiate transcript.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
