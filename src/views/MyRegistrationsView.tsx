import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Registration } from '../types';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  Clock, 
  Trash2, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle2, 
  Search,
  Filter
} from 'lucide-react';

export const MyRegistrationsView: React.FC = () => {
  const { 
    currentUser, 
    registrations, 
    cancelRegistrationHandler, 
    openTicketPass, 
    setActiveTab,
    setIsAuthModalOpen,
    setAuthModalMode,
    openEventDetails,
    events
  } = useApp();

  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Ticket className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Sign in to view registrations</h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Your campus registration history and electronic entrance passes are tied to your student account.
        </p>
        <button
          onClick={() => {
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          }}
          className="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
        >
          Sign In as Student
        </button>
      </div>
    );
  }

  // Get active student registrations
  const studentRegistrations = registrations.filter(r => r.studentId === currentUser.id);

  const filteredRegistrations = studentRegistrations.filter(r => {
    if (filterTab === 'confirmed' && r.status !== 'Confirmed') return false;
    if (filterTab === 'cancelled' && r.status !== 'Cancelled') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.eventTitle.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.eventVenue.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: Registration['status']) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirmed Pass
          </span>
        );
      case 'Pending Approval':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5" />
            Pending Review
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
            Registration Cancelled
          </span>
        );
      case 'Waitlisted':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
            Waitlisted
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            <span>Student Registration Desk</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{currentUser.collegeId}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Event Registrations
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your registered campus events, access digital entry passes with QR codes, or cancel registration.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('events')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Calendar className="w-4 h-4" />
          <span>Browse More Events</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Segmented Filter Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Registrations ({studentRegistrations.length})
          </button>
          <button
            onClick={() => setFilterTab('confirmed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterTab === 'confirmed' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Passes ({studentRegistrations.filter(r => r.status === 'Confirmed').length})
          </button>
          <button
            onClick={() => setFilterTab('cancelled')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterTab === 'cancelled' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cancelled ({studentRegistrations.filter(r => r.status === 'Cancelled').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by event or ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>
      </div>

      {/* Registrations List / Cards */}
      {filteredRegistrations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center max-w-md mx-auto shadow-xs">
          <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No registrations found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {search.trim() 
              ? 'No event registrations matched your search criteria.' 
              : 'You have not registered for any campus events yet.'}
          </p>
          <button
            onClick={() => setActiveTab('events')}
            className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
          >
            Discover Events Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRegistrations.map((reg) => {
            const matchedEvent = events.find(e => e.id === reg.eventId);
            const isCancelled = reg.status === 'Cancelled';

            return (
              <div
                key={reg.id}
                className={`bg-white rounded-xl border transition-all overflow-hidden ${
                  isCancelled 
                    ? 'border-slate-200 opacity-60 bg-slate-50/50' 
                    : 'border-slate-200/90 hover:border-indigo-300 hover:shadow-xs'
                }`}
              >
                <div className="p-5 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  
                  {/* Left: Info */}
                  <div className="space-y-2 flex-1 min-w-0">
                    
                    {/* Metadata line */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-bold text-indigo-700 tabular-nums">
                        {reg.id}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-slate-700">{reg.eventCategory}</span>
                      <span aria-hidden="true">·</span>
                      <span>Enrolled on {new Date(reg.registeredAt).toLocaleDateString()}</span>
                    </div>

                    <h3 
                      onClick={() => matchedEvent && openEventDetails(matchedEvent)}
                      className="text-base sm:text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer truncate"
                    >
                      {reg.eventTitle}
                    </h3>

                    {/* Venue & Time Grid */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium">{reg.eventDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{reg.eventTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{reg.eventVenue}</span>
                      </div>
                    </div>

                    {reg.notes && (
                      <p className="text-[11px] text-slate-500 italic">
                        Note: {reg.notes}
                      </p>
                    )}
                  </div>

                  {/* Right: Status & Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    
                    <div className="self-start sm:self-center">
                      {getStatusBadge(reg.status)}
                    </div>

                    <div className="flex items-center gap-2">
                      {!isCancelled && (
                        <>
                          <button
                            onClick={() => openTicketPass(reg)}
                            className="flex-1 sm:flex-initial px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-indigo-200"
                          >
                            <Ticket className="w-3.5 h-3.5" />
                            <span>View Pass</span>
                          </button>

                          {confirmCancelId === reg.id ? (
                            <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 p-1 rounded-lg">
                              <button
                                onClick={() => {
                                  cancelRegistrationHandler(reg.id);
                                  setConfirmCancelId(null);
                                }}
                                className="px-2.5 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors"
                              >
                                Confirm Cancel
                              </button>
                              <button
                                onClick={() => setConfirmCancelId(null)}
                                className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900"
                              >
                                Abort
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmCancelId(reg.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Cancel registration"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}

                      {isCancelled && (
                        <span className="text-xs text-slate-400 italic">
                          Seat returned to campus pool
                        </span>
                      )}
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
