import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CAMPUS_DEPARTMENTS, STUDY_YEARS } from '../data/initialData';
import { Registration } from '../types';
import { 
  X, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Ticket, 
  GraduationCap, 
  Phone, 
  Mail, 
  User, 
  BookOpen, 
  ArrowRight
} from 'lucide-react';

export const RegistrationModal: React.FC = () => {
  const { 
    selectedEvent, 
    isRegisterModalOpen, 
    setIsRegisterModalOpen, 
    currentUser, 
    submitRegistration,
    openTicketPass,
    setActiveTab,
    registrations
  } = useApp();

  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedRegistration, setConfirmedRegistration] = useState<Registration | null>(null);

  useEffect(() => {
    if (currentUser) {
      setDepartment(currentUser.department || CAMPUS_DEPARTMENTS[0]);
      setYear(currentUser.year || STUDY_YEARS[2]);
      setPhone(currentUser.phone || '+1 (555) 234-5678');
    }
    setErrors({});
    setConfirmedRegistration(null);
  }, [currentUser, selectedEvent, isRegisterModalOpen]);

  if (!isRegisterModalOpen || !selectedEvent) return null;

  // Real-time count of registered members for this event
  const liveRegisteredCount = registrations.filter(
    r => r.eventId === selectedEvent.id && r.status !== 'Cancelled'
  ).length;

  const eventDateFormatted = selectedEvent.date === '2026-11-01' 
    ? 'Nov 1, 2026' 
    : selectedEvent.date === '2026-11-02' 
    ? 'Nov 2, 2026' 
    : selectedEvent.date;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!department) errs.department = 'Please select your department';
    if (!year) errs.year = 'Please select your year of study';
    if (!phone || phone.length < 8) errs.phone = 'Valid phone number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const reg = submitRegistration(selectedEvent, {
        department,
        year,
        phone,
        notes
      });
      setConfirmedRegistration(reg);
    } catch (err) {
      // handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsRegisterModalOpen(false);
    setConfirmedRegistration(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-indigo-400">
              Campus Event Registration
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {confirmedRegistration ? 'Registration Successful' : 'Event Entry Form'}
            </h3>
          </div>
          <button 
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Event Card Summary */}
        <div className="px-6 py-3.5 bg-indigo-50/60 border-b border-indigo-100 flex items-center justify-between gap-4 text-xs">
          <div className="truncate">
            <span className="font-bold text-indigo-950 block truncate">{selectedEvent.title}</span>
            <div className="flex items-center gap-2 text-indigo-700/80 mt-0.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {selectedEvent.date === '2026-11-01' ? 'Nov 1, 2026' : selectedEvent.date === '2026-11-02' ? 'Nov 2, 2026' : selectedEvent.date}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5" />
                {selectedEvent.venue}
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-white text-indigo-900 font-semibold rounded-md border border-indigo-200 shrink-0">
            {selectedEvent.category}
          </span>
        </div>

        {/* Live Automatic Member Count beside Total Students */}
        <div className="px-6 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-600" />
            <span>Members Registered:</span>
          </span>
          <span className="font-mono tabular-nums text-xs">
            <strong className="text-indigo-600 text-sm font-extrabold">
              {registrations.filter(r => r.eventId === selectedEvent.id && r.status !== 'Cancelled').length}
            </strong>
            <span className="text-slate-400 font-normal"> / </span>
            <span className="font-bold text-slate-800">{selectedEvent.totalSeats} Total Students</span>
            <span className="ml-1 text-[11px] text-emerald-600 font-semibold">
              ({Math.max(0, selectedEvent.totalSeats - registrations.filter(r => r.eventId === selectedEvent.id && r.status !== 'Cancelled').length)} seats left)
            </span>
          </span>
        </div>

        {/* Content Area */}
        {confirmedRegistration ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-slate-900">
                You're Officially Registered!
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                A confirmation has been saved to your campus profile and dispatched to your student email.
              </p>
            </div>

            {/* Registration Pass Ticket Badge */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left max-w-md mx-auto shadow-xs">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200 text-xs">
                <span className="text-slate-500 uppercase tracking-wider font-semibold">Registration ID</span>
                <span className="font-mono font-bold text-indigo-700 text-sm">{confirmedRegistration.id}</span>
              </div>
              <div className="pt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Student Name</span>
                  <span className="font-semibold text-slate-800">{confirmedRegistration.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">College ID</span>
                  <span className="font-semibold text-slate-800">{confirmedRegistration.collegeId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Department</span>
                  <span className="font-semibold text-slate-800 truncate block">{confirmedRegistration.department}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Status</span>
                  <span className="font-bold text-emerald-700">{confirmedRegistration.status}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">Updated Event Registrations:</span>
                  <span className="font-mono font-bold text-indigo-700">
                    {registrations.filter(r => r.eventId === selectedEvent.id && r.status !== 'Cancelled').length} / {selectedEvent.totalSeats} Total Students
                  </span>
                </div>
              </div>

              {/* Administrative Helpdesk info on confirmation */}
              <div className="mt-3 pt-2.5 border-t border-slate-200 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-1">
                <span>Administrative Helpdesk: Near Auditorium</span>
                <span className="font-medium text-slate-700">
                  <a href="mailto:lavanyagudditi2008@gmail.com" className="hover:text-indigo-600 underline">lavanyagudditi2008@gmail.com</a> · <a href="tel:7382395581" className="hover:text-indigo-600 font-mono">7382395581</a>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  handleClose();
                  openTicketPass(confirmedRegistration);
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                <span>View Campus Digital Pass</span>
              </button>

              <button
                onClick={() => {
                  handleClose();
                  setActiveTab('registrations');
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>My Registrations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Registration Input Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Student Readonly Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Student Name</label>
                <div className="flex items-center gap-2 font-semibold text-slate-800">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentUser?.name || 'Guest Student'}</span>
                </div>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">College ID / Reg No.</label>
                <div className="flex items-center gap-2 font-semibold text-slate-800 font-mono">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentUser?.collegeId || '2024CS108'}</span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-500 block mb-1">Student University Email</label>
                <div className="flex items-center gap-2 font-semibold text-slate-800">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentUser?.email || 'student@campus.edu'}</span>
                </div>
              </div>
            </div>

            {/* Department Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Department / Faculty *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                {CAMPUS_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 text-xs text-rose-600">{errors.department}</p>
              )}
            </div>

            {/* Year & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Year of Study *
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  {STUDY_YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                {errors.year && (
                  <p className="mt-1 text-xs text-rose-600">{errors.year}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Contact Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Additional Notes or Team details */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Team Name / Dietary or Special Requirements (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Team: Apex Hackers, Vegetarian lunch requested..."
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Helpdesk Support Note */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-slate-700">Helpdesk (Near Auditorium):</span>
              <div className="flex items-center gap-2">
                <a href="tel:7382395581" className="font-mono text-indigo-600 font-bold hover:underline">7382395581</a>
                <span className="text-slate-400">·</span>
                <a href="mailto:lavanyagudditi2008@gmail.com" className="text-indigo-600 hover:underline">lavanyagudditi2008@gmail.com</a>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span>Processing Registration...</span>
                ) : (
                  <span>Submit Registration</span>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
