import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  ListChecks, 
  Ticket,
  Share2
} from 'lucide-react';

export const EventDetailsModal: React.FC = () => {
  const { 
    selectedEvent, 
    isDetailModalOpen, 
    setIsDetailModalOpen, 
    openRegistrationFlow, 
    currentUser, 
    registrations,
    openTicketPass,
    showToast
  } = useApp();

  const [imageError, setImageError] = useState(false);

  if (!isDetailModalOpen || !selectedEvent) return null;

  const userRegistration = currentUser 
    ? registrations.find(r => r.eventId === selectedEvent.id && r.studentId === currentUser.id && r.status !== 'Cancelled')
    : undefined;

  // Real-time live count of registered members
  const liveRegisteredCount = registrations.filter(
    r => r.eventId === selectedEvent.id && r.status !== 'Cancelled'
  ).length;

  const isRegistered = !!userRegistration;
  const seatsRemaining = Math.max(0, selectedEvent.totalSeats - liveRegisteredCount);
  const isFull = seatsRemaining === 0;

  const formattedDate = selectedEvent.date === '2026-11-01' 
    ? 'November 1, 2026' 
    : selectedEvent.date === '2026-11-02' 
    ? 'November 2, 2026' 
    : new Date(selectedEvent.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Event link copied to clipboard!', 'info');
    } else {
      showToast(`Share: ${selectedEvent.title}`, 'info');
    }
  };

  const handleClose = () => {
    setIsDetailModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Media Banner */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-900 shrink-0">
          {!imageError && selectedEvent.imageUrl ? (
            <img 
              src={selectedEvent.imageUrl} 
              alt={selectedEvent.title}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 flex items-center justify-center p-8 text-center">
              <span className="text-xl font-bold text-white/90">{selectedEvent.title}</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close & Share buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full backdrop-blur-md transition-colors"
              title="Share event"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="p-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full backdrop-blur-md transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title & Category overlaid at bottom of banner */}
          <div className="absolute bottom-5 left-6 right-6 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-1.5">
              <span>{selectedEvent.category}</span>
              <span aria-hidden="true">·</span>
              <span>Deadline: {selectedEvent.registrationDeadline}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {selectedEvent.title}
            </h2>
          </div>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Key Facts Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-500 font-medium block">Date</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-1">
                <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{formattedDate}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Time</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-1">
                <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">{selectedEvent.time}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Venue</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-1">
                <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">{selectedEvent.venue}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Members Registered</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-1 tabular-nums font-mono">
                <Users className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="text-indigo-600 text-sm font-extrabold">{liveRegisteredCount}</span>
                <span className="text-slate-400 font-normal"> / </span>
                <span className="text-slate-800">{selectedEvent.totalSeats} Total Students</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                {seatsRemaining} Seats Available
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Event Overview
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {selectedEvent.description}
            </p>
          </div>

          {/* Eligibility & Organizers */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
              <h5 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                Eligibility
              </h5>
              <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                {selectedEvent.eligibility}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-600" />
                Organizer Contact
              </h5>
              <p className="text-xs text-slate-800 font-semibold">
                {selectedEvent.organizer}
              </p>
              <a 
                href={`mailto:${selectedEvent.organizerEmail}`}
                className="text-xs text-indigo-600 hover:text-indigo-700 underline mt-0.5 inline-block"
              >
                {selectedEvent.organizerEmail}
              </a>
            </div>
          </div>

          {/* Schedule Breakdown */}
          {selectedEvent.schedule && selectedEvent.schedule.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                Event Schedule & Milestones
              </h4>
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden text-xs">
                {selectedEvent.schedule.map((item, index) => (
                  <div key={index} className="flex items-center px-4 py-2.5 hover:bg-slate-50 transition-colors">
                    <span className="w-32 font-bold font-mono text-indigo-700 shrink-0 tabular-nums">
                      {item.time}
                    </span>
                    <span className="text-slate-700 font-medium">{item.activity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules & Guidelines */}
          {selectedEvent.rules && selectedEvent.rules.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-indigo-600" />
                Rules & Participation Guidelines
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside">
                {selectedEvent.rules.map((rule, idx) => (
                  <li key={idx} className="leading-relaxed pl-1">
                    <span className="font-normal">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Approval Notice */}
          {selectedEvent.requiresApproval && (
            <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Faculty Screening Event:</span> Registrations for this event require administrative review. You will receive a notification upon coordinator confirmation.
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div className="text-xs">
            <span className="text-slate-500 block">Registration Status:</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono font-bold text-slate-900">
                <span className="text-indigo-600 font-extrabold text-sm">{liveRegisteredCount}</span> / {selectedEvent.totalSeats} Total Students Registered
              </span>
              <span className="text-slate-400">·</span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {isRegistered ? 'Enrolled' : isFull ? 'Event Full' : `${seatsRemaining} Seats Remaining`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Back
            </button>

            {isRegistered ? (
              <button
                onClick={() => {
                  handleClose();
                  userRegistration && openTicketPass(userRegistration);
                }}
                className="px-5 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
              >
                <Ticket className="w-4 h-4" />
                <span>View Registration Pass</span>
              </button>
            ) : isFull ? (
              <button
                disabled
                className="px-5 py-2 text-xs font-bold text-slate-400 bg-slate-200 rounded-lg cursor-not-allowed"
              >
                Capacity Reached
              </button>
            ) : (
              <button
                onClick={() => {
                  handleClose();
                  openRegistrationFlow(selectedEvent);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span>Proceed to Register</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
