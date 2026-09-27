import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Printer, 
  Download, 
  GraduationCap, 
  Calendar, 
  MapPin, 
  Clock, 
  QrCode, 
  CheckCircle2, 
  ShieldCheck
} from 'lucide-react';

export const TicketModal: React.FC = () => {
  const { 
    selectedRegistration, 
    isTicketModalOpen, 
    setIsTicketModalOpen,
    showToast
  } = useApp();

  const ticketRef = useRef<HTMLDivElement>(null);

  if (!isTicketModalOpen || !selectedRegistration) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast(`Pass ${selectedRegistration.id} saved to student offline wallet!`, 'success');
  };

  const formattedDate = new Date(selectedRegistration.eventDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-bold">Collegiate Electronic Event Pass</span>
          </div>
          <button 
            onClick={() => setIsTicketModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Pass Container */}
        <div ref={ticketRef} className="p-6 bg-slate-50 printable-pass">
          
          <div className="bg-white rounded-xl border-2 border-dashed border-indigo-200 shadow-sm overflow-hidden relative">
            
            {/* Cutout notches */}
            <div className="absolute top-[68%] -left-3 w-6 h-6 rounded-full bg-slate-50 border-r border-indigo-200 pointer-events-none" />
            <div className="absolute top-[68%] -right-3 w-6 h-6 rounded-full bg-slate-50 border-l border-indigo-200 pointer-events-none" />

            {/* Pass Header */}
            <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 p-5 text-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-200" />
                  <span className="text-xs uppercase tracking-widest font-bold text-indigo-100">
                    CAMPUS ADMISSIONS
                  </span>
                </div>
                <span className="text-[11px] font-mono uppercase bg-white/20 px-2 py-0.5 rounded text-white font-semibold">
                  {selectedRegistration.status}
                </span>
              </div>

              <h3 className="text-lg font-extrabold leading-tight text-white line-clamp-2">
                {selectedRegistration.eventTitle}
              </h3>
              <p className="text-xs text-indigo-200 mt-1 font-medium">
                {selectedRegistration.eventCategory}
              </p>
            </div>

            {/* Pass Event & Student Details */}
            <div className="p-5 space-y-4">
              
              <div className="grid grid-cols-2 gap-3 text-xs border-b border-slate-100 pb-4">
                <div>
                  <span className="text-slate-600 block">Date</span>
                  <div className="flex items-center gap-1 font-bold text-slate-800 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{formattedDate}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-600 block">Time</span>
                  <div className="flex items-center gap-1 font-bold text-slate-800 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="truncate">{selectedRegistration.eventTime}</span>
                  </div>
                </div>

                <div className="col-span-2">
                  <span className="text-slate-600 block">Venue / Room</span>
                  <div className="flex items-center gap-1 font-bold text-slate-800 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">{selectedRegistration.eventVenue}</span>
                  </div>
                </div>
              </div>

              {/* Student Metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs pb-3 border-b border-dashed border-slate-200">
                <div>
                  <span className="text-slate-600 block">Student Attendee</span>
                  <span className="font-bold text-slate-900 text-sm block truncate">
                    {selectedRegistration.studentName}
                  </span>
                  <span className="text-slate-600 text-[11px] block">{selectedRegistration.studentEmail}</span>
                </div>

                <div>
                  <span className="text-slate-600 block">College ID & Year</span>
                  <span className="font-mono font-bold text-slate-900 block">
                    {selectedRegistration.collegeId}
                  </span>
                  <span className="text-slate-600 text-[11px] block">{selectedRegistration.year}</span>
                </div>

                <div className="col-span-2">
                  <span className="text-slate-600 block">Department</span>
                  <span className="font-semibold text-slate-800 block truncate">
                    {selectedRegistration.department}
                  </span>
                </div>
              </div>

              {/* QR Verification Area */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 block">
                    Fast-Track QR Code Check-In
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-700 block">
                    {selectedRegistration.id}
                  </span>
                  <p className="text-[10px] text-slate-600">
                    Present this pass at venue security checkpoint for scanned entry.
                  </p>
                </div>

                {/* Styled SVG QR Code Simulation */}
                <div className="w-20 h-20 bg-white border border-slate-300 rounded-lg p-1.5 flex items-center justify-center shrink-0 shadow-xs">
                  <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                    {/* Corner anchors */}
                    <rect x="5" y="5" width="28" height="28" rx="3" />
                    <rect x="11" y="11" width="16" height="16" fill="white" />
                    <rect x="15" y="15" width="8" height="8" />

                    <rect x="67" y="5" width="28" height="28" rx="3" />
                    <rect x="73" y="11" width="16" height="16" fill="white" />
                    <rect x="77" y="15" width="8" height="8" />

                    <rect x="5" y="67" width="28" height="28" rx="3" />
                    <rect x="11" y="73" width="16" height="16" fill="white" />
                    <rect x="15" y="77" width="8" height="8" />

                    {/* Matrix patterns */}
                    <rect x="40" y="8" width="6" height="6" />
                    <rect x="52" y="8" width="6" height="6" />
                    <rect x="40" y="20" width="6" height="14" />
                    <rect x="52" y="25" width="6" height="6" />
                    <rect x="8" y="42" width="14" height="6" />
                    <rect x="28" y="42" width="8" height="8" />
                    <rect x="42" y="42" width="14" height="14" />
                    <rect x="62" y="42" width="8" height="6" />
                    <rect x="76" y="42" width="16" height="6" />
                    <rect x="42" y="62" width="6" height="18" />
                    <rect x="54" y="62" width="12" height="6" />
                    <rect x="54" y="74" width="8" height="8" />
                    <rect x="72" y="62" width="8" height="18" />
                    <rect x="86" y="72" width="6" height="16" />
                  </svg>
                </div>
              </div>

            </div>

            {/* Micro simulated barcode footer with Helpdesk Contact */}
            <div className="bg-slate-100/90 px-5 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-1 border-t border-slate-200 text-[10px] text-slate-600 font-mono">
              <span className="truncate font-semibold text-slate-700">GATE DESK: NEAR AUDITORIUM · 7382395581</span>
              <span className="text-slate-600">lavanyagudditi2008@gmail.com</span>
            </div>

          </div>

        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-600">
            Keep pass handy on your mobile phone
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save Pass</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
