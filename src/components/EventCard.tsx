import React, { useState } from 'react';
import { CampusEvent } from '../types';
import { useApp } from '../context/AppContext';
import { Calendar, MapPin, Clock, Users, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface EventCardProps {
  event: CampusEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { openEventDetails, openRegistrationFlow, currentUser, registrations, openTicketPass } = useApp();
  const [imageError, setImageError] = useState(false);

  const userRegistration = currentUser 
    ? registrations.find(r => r.eventId === event.id && r.studentId === currentUser.id && r.status !== 'Cancelled')
    : undefined;

  // Real-time automatic calculation of registered members
  const registeredMembersCount = registrations.filter(
    r => r.eventId === event.id && r.status !== 'Cancelled'
  ).length;

  const isRegistered = !!userRegistration;
  const seatsRemaining = Math.max(0, event.totalSeats - registeredMembersCount);
  const isFull = seatsRemaining === 0;
  const isFillingFast = seatsRemaining <= 15 && !isFull && registeredMembersCount > 0;
  const percentFilled = Math.min(100, Math.round((registeredMembersCount / event.totalSeats) * 100));

  // Date formatting with emphasis on Nov 1 and Nov 2
  const formattedDate = event.date === '2026-11-01' 
    ? 'Nov 1, 2026' 
    : event.date === '2026-11-02' 
    ? 'Nov 2, 2026' 
    : new Date(event.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

  return (
    <article className="group bg-white rounded-xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      
      {/* Poster Media with Fallback */}
      <div 
        onClick={() => openEventDetails(event)}
        className="relative h-48 w-full bg-slate-100 overflow-hidden cursor-pointer"
      >
        {!imageError && event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-900 flex flex-col items-center justify-center p-6 text-center text-white">
            <Calendar className="w-8 h-8 text-indigo-300 mb-2 opacity-80" />
            <span className="text-xs uppercase tracking-wider font-semibold text-indigo-200">
              {event.category}
            </span>
            <p className="text-sm font-bold text-white/90 line-clamp-1 mt-1">
              {event.title}
            </p>
          </div>
        )}

        {/* Gradient scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* Top Kicker Over Image */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-medium text-white drop-shadow-sm pointer-events-none">
          <span className="bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-md text-white font-medium">
            {event.category}
          </span>
          {isRegistered ? (
            <span className="bg-emerald-600/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-white font-semibold flex items-center gap-1 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Registered
            </span>
          ) : isFull ? (
            <span className="bg-rose-600/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-white font-semibold">
              Sold Out
            </span>
          ) : isFillingFast ? (
            <span className="bg-amber-600/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-white font-semibold">
              {seatsRemaining} Seats Left
            </span>
          ) : null}
        </div>

        {/* Date badge on bottom edge */}
        <div className="absolute bottom-2.5 left-3 text-white text-xs font-semibold flex items-center gap-1.5 drop-shadow-md pointer-events-none bg-slate-950/70 backdrop-blur-xs px-2.5 py-1 rounded-md">
          <Calendar className="w-3.5 h-3.5 text-indigo-300" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata clean line without pills */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
            <span className="truncate max-w-[200px]">{event.organizer}</span>
            <span aria-hidden="true">·</span>
            <span>{event.time.split('-')[0].trim()}</span>
          </div>

          <h3 
            onClick={() => openEventDetails(event)}
            className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {event.title}
          </h3>

          <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {event.shortDescription || event.description}
          </p>

          {/* Venue & Details */}
          <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.eligibility}</span>
            </div>
          </div>
        </div>

        {/* Footer Capacity & Action */}
        <div className="mt-5 pt-3 border-t border-slate-100">
          
          {/* Real-Time Live Registration Counter: Members Registered beside Total Students */}
          <div className="mb-3 p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Members Registered:</span>
              </span>
              <span className="font-mono tabular-nums text-xs">
                <strong className="text-indigo-600 text-sm font-extrabold">{registeredMembersCount}</strong>
                <span className="text-slate-400 font-normal"> / </span>
                <span className="font-bold text-slate-800">{event.totalSeats} Total Students</span>
              </span>
            </div>

            {/* Capacity progress bar */}
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mt-2">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  isFull ? 'bg-rose-500' : isFillingFast ? 'bg-amber-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${percentFilled}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1.5 font-medium">
              <span>{seatsRemaining} Seats Available</span>
              <span className="text-indigo-600 font-semibold">{percentFilled}% Capacity Filled</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => openEventDetails(event)}
              className="flex-1 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 rounded-lg transition-colors text-center"
            >
              Details
            </button>

            {isRegistered ? (
              <button
                onClick={() => userRegistration && openTicketPass(userRegistration)}
                className="flex-1 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <span>View Pass</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            ) : isFull ? (
              <button
                disabled
                className="flex-1 px-3 py-2 text-xs font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded-lg cursor-not-allowed text-center"
              >
                Capacity Full
              </button>
            ) : (
              <button
                onClick={() => openRegistrationFlow(event)}
                className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1"
              >
                <span>Register Now</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </article>
  );
};
