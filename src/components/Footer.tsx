import React from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, Mail, MapPin, Phone, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setSelectedCategory, quickSwitchToAdmin, quickSwitchToStudent } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                CampusEvents
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official centralized event registration and management platform for collegiate student organizations, hackathons, and athletic meets.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Office of Dean (Student Affairs)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button 
                  onClick={() => setActiveTab('home')} 
                  className="hover:text-white transition-colors"
                >
                  Campus Portal Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setSelectedCategory('All');
                    setActiveTab('events');
                  }} 
                  className="hover:text-white transition-colors"
                >
                  All Campus Events
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('registrations')} 
                  className="hover:text-white transition-colors"
                >
                  My Registrations & Passes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('student-dashboard')} 
                  className="hover:text-white transition-colors"
                >
                  Student Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Event Categories
            </h4>
            <ul className="space-y-1.5 text-xs">
              {['Hackathon', 'Cultural Fest', 'Sports Meet', 'Technical Workshop', 'Quiz Competition', 'Coding Contest'].map(cat => (
                <li key={cat}>
                  <button 
                    onClick={() => {
                      setSelectedCategory(cat);
                      setActiveTab('events');
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Campus Coordinator Contact */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Administrative Helpdesk
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>Near Auditorium, Main Campus Ground</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <a href="mailto:lavanyagudditi2008@gmail.com" className="hover:text-white underline text-slate-300">
                  lavanyagudditi2008@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <a href="tel:7382395581" className="hover:text-white font-mono text-slate-300">
                  7382395581
                </a>
              </div>
            </div>

            <div className="pt-3 flex items-center gap-2 text-[11px]">
              <button
                onClick={() => quickSwitchToAdmin()}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded font-medium transition-colors"
              >
                Coordinator Portal
              </button>
              <button
                onClick={() => quickSwitchToStudent()}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded font-medium transition-colors"
              >
                Student Demo
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Campus Event Registration System. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>University Code of Conduct</span>
            <span>·</span>
            <span>Event Safety Policy</span>
            <span>·</span>
            <span>Student Privacy Guidelines</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
