import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CampusEvent, EventCategory } from '../types';
import { X, Calendar, MapPin, Users, Mail, Image, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const CATEGORIES: EventCategory[] = [
  'Hackathon',
  'Cultural Fest',
  'Sports Meet',
  'Technical Workshop',
  'Quiz Competition',
  'Coding Contest'
];

const PRESET_IMAGES = [
  { label: 'Hackathon Lab', url: '/src/assets/images/event_hackathon_1790528115123.jpg' },
  { label: 'Cultural Fest Stage', url: '/src/assets/images/event_cultural_fest_1790528129756.jpg' },
  { label: 'Athletic Sports Meet', url: '/src/assets/images/event_sports_meet_1790528141904.jpg' },
  { label: 'Robotics & AI Workshop', url: '/src/assets/images/event_tech_workshop_1790528154086.jpg' },
  { label: 'Campus Courtyard', url: '/src/assets/images/hero_campus_life_1790528100831.jpg' }
];

export const CreateEditEventModal: React.FC = () => {
  const { 
    isCreateEventModalOpen, 
    setIsCreateEventModalOpen, 
    editingEvent, 
    saveEventHandler 
  } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Hackathon');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [organizerEmail, setOrganizerEmail] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [totalSeats, setTotalSeats] = useState(150);
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [featured, setFeatured] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);
  
  const [rules, setRules] = useState<string[]>(['Valid college student smart ID card required for entry.']);
  const [newRule, setNewRule] = useState('');

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setCategory(editingEvent.category);
      setShortDescription(editingEvent.shortDescription);
      setDescription(editingEvent.description);
      setDate(editingEvent.date);
      setTime(editingEvent.time);
      setVenue(editingEvent.venue);
      setOrganizer(editingEvent.organizer);
      setOrganizerEmail(editingEvent.organizerEmail);
      setEligibility(editingEvent.eligibility);
      setTotalSeats(editingEvent.totalSeats);
      setRegistrationDeadline(editingEvent.registrationDeadline);
      setImageUrl(editingEvent.imageUrl);
      setFeatured(!!editingEvent.featured);
      setRequiresApproval(!!editingEvent.requiresApproval);
      setRules(editingEvent.rules || []);
    } else {
      // Default clean template
      setTitle('');
      setCategory('Hackathon');
      setShortDescription('');
      setDescription('');
      setDate('2026-11-01');
      setTime('09:00 AM - 05:00 PM');
      setVenue('Main Campus Auditorium');
      setOrganizer('Student Affairs Council');
      setOrganizerEmail('lavanyagudditi2008@gmail.com');
      setEligibility('All enrolled undergraduate & postgraduate students');
      setTotalSeats(150);
      setRegistrationDeadline('2026-10-31');
      setImageUrl(PRESET_IMAGES[0].url);
      setFeatured(false);
      setRequiresApproval(false);
      setRules(['Valid college student smart ID card required for entry.']);
    }
  }, [editingEvent, isCreateEventModalOpen]);

  if (!isCreateEventModalOpen) return null;

  const handleAddRule = () => {
    if (newRule.trim()) {
      setRules([...rules, newRule.trim()]);
      setNewRule('');
    }
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !venue.trim() || !date) return;

    saveEventHandler({
      title: title.trim(),
      category,
      shortDescription: shortDescription.trim() || title.trim(),
      description: description.trim() || shortDescription.trim() || title.trim(),
      date,
      time,
      venue: venue.trim(),
      organizer: organizer.trim() || 'University Events Committee',
      organizerEmail: organizerEmail.trim() || 'events@campus.edu',
      eligibility: eligibility.trim() || 'All students',
      totalSeats: Number(totalSeats) || 50,
      registrationDeadline: registrationDeadline || date,
      imageUrl,
      featured,
      requiresApproval,
      rules,
      schedule: [
        { time: '09:00 AM', activity: 'Registration & Welcome' },
        { time: '11:00 AM', activity: 'Main Event Sessions' },
        { time: '04:30 PM', activity: 'Conclusion & Certificate Distribution' }
      ]
    }, editingEvent ? editingEvent.id : undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              Campus Administrative Desk
            </span>
            <h3 className="text-base font-bold text-white">
              {editingEvent ? 'Edit Campus Event' : 'Create New Campus Event'}
            </h3>
          </div>
          <button 
            onClick={() => setIsCreateEventModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {/* Event Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI Innovation Summit 2026"
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          {/* Category & Total Seats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Seat Capacity (Max Attendees) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={totalSeats}
                onChange={(e) => setTotalSeats(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Date, Time & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Event Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-1.5 mt-1.5">
                <button
                  type="button"
                  onClick={() => setDate('2026-11-01')}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-colors ${
                    date === '2026-11-01' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Nov 1, 2026
                </button>
                <button
                  type="button"
                  onClick={() => setDate('2026-11-02')}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-colors ${
                    date === '2026-11-02' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Nov 2, 2026
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Time Window *
              </label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 10:00 AM - 04:00 PM"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Reg Deadline *
              </label>
              <input
                type="date"
                required
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Venue & Eligibility */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Venue Location *
              </label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Science Auditorium Block C"
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Eligibility Requirements *
              </label>
              <input
                type="text"
                required
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                placeholder="e.g. Open to all students, Year 1-4"
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Organizer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Organizing Society / Dept *
              </label>
              <input
                type="text"
                required
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="e.g. ACM Student Chapter"
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Organizer Contact Email *
              </label>
              <input
                type="email"
                required
                value={organizerEmail}
                onChange={(e) => setOrganizerEmail(e.target.value)}
                placeholder="events@campus.edu"
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Poster Image Preset Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select High-Resolution Poster Asset
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {PRESET_IMAGES.map((img, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setImageUrl(img.url)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all h-16 ${
                    imageUrl === img.url ? 'border-indigo-600 ring-2 ring-indigo-400' : 'border-slate-200 hover:border-slate-300 opacity-75'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-950/70 text-white text-[9px] p-0.5 truncate block text-center">
                    {img.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Short Summary (Card Preview) *
            </label>
            <input
              type="text"
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="1-2 sentences summarizing the highlights..."
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Complete Event Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Full agenda, speaker information, hardware/software details..."
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Rules & Guidelines */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Event Rules & Guidelines
            </label>
            <div className="space-y-1.5 mb-2">
              {rules.map((rule, idx) => (
                <div key={idx} className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs">
                  <span className="flex-1 truncate">{rule}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRule(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                placeholder="Add rule item (e.g. Bring laptops with chargers)..."
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddRule}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Checkboxes: Highlight & Requires Approval */}
          <div className="pt-2 flex flex-wrap gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Spotlight / Pin Event</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={requiresApproval}
                onChange={(e) => setRequiresApproval(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span>Require Faculty Coordinator Approval before Confirmation</span>
            </label>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={() => setIsCreateEventModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{editingEvent ? 'Save Event Changes' : 'Publish Campus Event'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
