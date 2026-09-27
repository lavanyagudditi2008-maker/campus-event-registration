import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CampusEvent, Registration } from '../types';
import { 
  ShieldCheck, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Search, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  MapPin, 
  Filter, 
  RotateCcw,
  Sparkles,
  ChevronRight,
  Mail,
  Phone
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { 
    currentUser, 
    events, 
    registrations, 
    setIsCreateEventModalOpen, 
    setEditingEvent, 
    deleteEventHandler,
    updateRegistrationStatusHandler,
    quickSwitchToAdmin,
    resetAll,
    openEventDetails,
    showToast
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'events' | 'registrations'>('events');
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [regSearch, setRegSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const isAdmin = currentUser?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Administrator Access</h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          This portal is restricted to faculty coordinators and campus event administrators.
        </p>
        <button
          onClick={() => quickSwitchToAdmin()}
          className="mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Switch to Admin Desk (Prof. Jenkins)</span>
        </button>
      </div>
    );
  }

  // Filtered registrations
  const filteredRegistrations = registrations.filter((r) => {
    if (selectedEventId !== 'all' && r.eventId !== selectedEventId) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (regSearch.trim()) {
      const q = regSearch.toLowerCase();
      return (
        r.studentName.toLowerCase().includes(q) ||
        r.collegeId.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.eventTitle.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate aggregates
  const totalEvents = events.length;
  const totalRegistrations = registrations.filter(r => r.status !== 'Cancelled').length;
  const pendingApprovals = registrations.filter(r => r.status === 'Pending Approval').length;
  const totalCapacity = events.reduce((sum, e) => sum + e.totalSeats, 0);
  const avgOccupancy = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;

  // Export Attendees to CSV
  const handleExportCSV = () => {
    const headers = [
      'Registration ID',
      'Event Name',
      'Student Name',
      'College ID',
      'Student Email',
      'Department',
      'Year',
      'Phone',
      'Status',
      'Registered At'
    ];

    const rows = filteredRegistrations.map(r => [
      `"${r.id}"`,
      `"${r.eventTitle}"`,
      `"${r.studentName}"`,
      `"${r.collegeId}"`,
      `"${r.studentEmail}"`,
      `"${r.department}"`,
      `"${r.year}"`,
      `"${r.phone}"`,
      `"${r.status}"`,
      `"${r.registeredAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campus_event_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredRegistrations.length} attendee records to CSV`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Campus Event Administration Desk</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Organizer Management Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Create and edit campus events, track live participant capacities, and review student registrations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setEditingEvent(null);
              setIsCreateEventModalOpen(true);
            }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>

          <button
            onClick={resetAll}
            className="p-2.5 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            title="Reset to default campus sample data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Administrative Helpdesk Coordinator Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              Administrative Helpdesk Contact
            </div>
            <div className="text-sm font-bold text-white flex flex-wrap items-center gap-2 mt-0.5">
              <span>Location: Near Auditorium</span>
              <span className="text-slate-500 hidden sm:inline">·</span>
              <span className="text-slate-300 font-medium text-xs">Main Campus Ground</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <a 
            href="mailto:lavanyagudditi2008@gmail.com" 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700"
          >
            <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-medium">lavanyagudditi2008@gmail.com</span>
          </a>
          <a 
            href="tel:7382395581" 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 hover:text-white transition-colors border border-emerald-700/50"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-mono font-bold">7382395581</span>
          </a>
        </div>
      </div>

      {/* Aggregate Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Published Events
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 block font-mono tabular-nums">
            {totalEvents}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Active across faculties</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
            Total Registrations
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 block font-mono tabular-nums">
            {totalRegistrations}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Enrolled participants</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
            Average Occupancy
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 block font-mono tabular-nums">
            {avgOccupancy}%
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">{totalCapacity} total seats</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
            Pending Approvals
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 block font-mono tabular-nums">
            {pendingApprovals}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Require faculty check</span>
        </div>

      </div>

      {/* Main Tab Controller: Events List vs Registrations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        
        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 px-6 pt-4 pb-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveAdminTab('events')}
              className={`pb-4 text-xs font-bold transition-colors relative ${
                activeAdminTab === 'events'
                  ? 'text-emerald-700'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Manage Campus Events ({events.length})</span>
              {activeAdminTab === 'events' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveAdminTab('registrations')}
              className={`pb-4 text-xs font-bold transition-colors relative flex items-center gap-1.5 ${
                activeAdminTab === 'registrations'
                  ? 'text-emerald-700'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Student Registrations ({registrations.length})</span>
              {pendingApprovals > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full">
                  {pendingApprovals} pending
                </span>
              )}
              {activeAdminTab === 'registrations' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </button>
          </div>

          {activeAdminTab === 'registrations' && (
            <button
              onClick={handleExportCSV}
              className="mb-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}
        </div>

        {/* Tab 1: Events Management Table */}
        {activeAdminTab === 'events' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-6">Event Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date & Venue</th>
                  <th className="py-3 px-4">Participants / Capacity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((evt) => {
                  const seatsLeft = evt.totalSeats - evt.registeredCount;
                  const percent = Math.round((evt.registeredCount / evt.totalSeats) * 100);

                  return (
                    <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Title & Organizer */}
                      <td className="py-4 px-6 max-w-xs">
                        <span 
                          onClick={() => openEventDetails(evt)}
                          className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer block truncate text-sm"
                        >
                          {evt.title}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate block">
                          Org: {evt.organizer}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-semibold rounded-md">
                          {evt.category}
                        </span>
                      </td>

                      {/* Date & Venue */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{evt.date}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[160px]">{evt.venue}</div>
                      </td>

                      {/* Capacity Meter */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1 font-mono tabular-nums">
                          <span className="font-bold text-slate-800">{evt.registeredCount} enrolled</span>
                          <span>{evt.totalSeats} seats</span>
                        </div>
                        <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              percent >= 100 ? 'bg-rose-500' : percent >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, percent)}%` }}
                          />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {seatsLeft <= 0 ? (
                          <span className="text-rose-700 font-semibold">Capacity Full</span>
                        ) : evt.requiresApproval ? (
                          <span className="text-amber-700 font-semibold">Approval Req</span>
                        ) : (
                          <span className="text-emerald-700 font-semibold">Open Enrollment</span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* View Attendees */}
                          <button
                            onClick={() => {
                              setSelectedEventId(evt.id);
                              setActiveAdminTab('registrations');
                            }}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="View registered students"
                          >
                            <Users className="w-4 h-4" />
                          </button>

                          {/* Edit Event */}
                          <button
                            onClick={() => {
                              setEditingEvent(evt);
                              setIsCreateEventModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit event"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete Event */}
                          {deleteConfirmId === evt.id ? (
                            <div className="inline-flex items-center gap-1 bg-rose-50 border border-rose-200 p-1 rounded-lg">
                              <button
                                onClick={() => {
                                  deleteEventHandler(evt.id);
                                  setDeleteConfirmId(null);
                                }}
                                className="px-2 py-0.5 text-[11px] font-bold text-white bg-rose-600 rounded-md"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-1 text-[11px] text-slate-600"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(evt.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Registrations Management Table */}
        {activeAdminTab === 'registrations' && (
          <div className="p-6 space-y-4">
            
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
              {/* Event Filter dropdown */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Event:</span>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden max-w-xs truncate"
                >
                  <option value="all">All Events ({registrations.length})</option>
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.title} ({registrations.filter(r => r.eventId === evt.id).length})
                    </option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden"
                >
                  <option value="all">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Waitlisted">Waitlisted</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Search Attendee */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={regSearch}
                  onChange={(e) => setRegSearch(e.target.value)}
                  placeholder="Search student, ID, or Reg No..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

            </div>

            {/* Table */}
            <div className="border border-slate-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Registration ID</th>
                    <th className="py-3 px-4">Student Details</th>
                    <th className="py-3 px-4">Department & Year</th>
                    <th className="py-3 px-4">Target Event</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No registrations found matching the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* ID & Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                          <span className="font-bold text-indigo-700 block">{reg.id}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(reg.registeredAt).toLocaleDateString()}
                          </span>
                        </td>

                        {/* Student */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{reg.studentName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{reg.collegeId}</div>
                          <div className="text-[10px] text-slate-400">{reg.studentEmail} · {reg.phone}</div>
                        </td>

                        {/* Dept & Year */}
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-slate-800 block truncate max-w-[180px]">
                            {reg.department}
                          </span>
                          <span className="text-[11px] text-slate-500">{reg.year}</span>
                        </td>

                        {/* Target Event */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <span className="font-semibold text-slate-900 block truncate">
                            {reg.eventTitle}
                          </span>
                          <span className="text-[10px] text-slate-500">{reg.eventCategory} · {reg.eventDate}</span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {reg.status === 'Confirmed' && (
                            <span className="px-2 py-0.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md">
                              Confirmed
                            </span>
                          )}
                          {reg.status === 'Pending Approval' && (
                            <span className="px-2 py-0.5 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-md">
                              Pending Review
                            </span>
                          )}
                          {reg.status === 'Waitlisted' && (
                            <span className="px-2 py-0.5 text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 rounded-md">
                              Waitlisted
                            </span>
                          )}
                          {reg.status === 'Cancelled' && (
                            <span className="px-2 py-0.5 text-[11px] font-bold text-slate-500 bg-slate-100 rounded-md">
                              Cancelled
                            </span>
                          )}
                        </td>

                        {/* Action buttons (Approve / Reject) */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {reg.status !== 'Confirmed' && (
                              <button
                                onClick={() => updateRegistrationStatusHandler(reg.id, 'Confirmed')}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-md border border-emerald-200 transition-colors flex items-center gap-1 text-[11px]"
                                title="Approve registration"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Approve</span>
                              </button>
                            )}

                            {reg.status !== 'Cancelled' && (
                              <button
                                onClick={() => updateRegistrationStatusHandler(reg.id, 'Cancelled')}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded-md border border-rose-200 transition-colors flex items-center gap-1 text-[11px]"
                                title="Reject registration"
                              >
                                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                <span>Reject</span>
                              </button>
                            )}

                            {reg.status !== 'Waitlisted' && reg.status !== 'Cancelled' && (
                              <button
                                onClick={() => updateRegistrationStatusHandler(reg.id, 'Waitlisted')}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md text-[11px]"
                                title="Waitlist registration"
                              >
                                Waitlist
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
