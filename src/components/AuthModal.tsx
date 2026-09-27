import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CAMPUS_DEPARTMENTS, STUDY_YEARS } from '../data/initialData';
import * as storage from '../services/storage';
import { 
  X, 
  GraduationCap, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  BookOpen, 
  Phone, 
  Sparkles, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    loginUser, 
    showToast 
  } = useApp();

  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [department, setDepartment] = useState(CAMPUS_DEPARTMENTS[0]);
  const [year, setYear] = useState(STUDY_YEARS[0]);
  const [phone, setPhone] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleQuickDemoStudent = () => {
    const students = storage.getStudents();
    const demo = students.find(s => s.role === 'student') || students[0];
    loginUser(demo);
  };

  const handleQuickDemoAdmin = () => {
    const students = storage.getStudents();
    const demoAdmin = students.find(s => s.role === 'admin');
    if (demoAdmin) {
      loginUser(demoAdmin);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (authModalMode === 'login') {
      // Login validation
      if (!email.trim() || !password.trim()) {
        setErrorMsg('Please provide both university email and password.');
        return;
      }

      // Check registered accounts
      const allUsers = storage.getStudents();
      const matched = allUsers.find(
        u => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (matched) {
        loginUser(matched);
      } else {
        // Allow demo login if user typed an email that's new or prompt signup
        setErrorMsg('No registered campus account found with this email. Click "Sign Up" below or use Demo Presets.');
      }
    } else {
      // Sign up validation
      if (!name.trim()) {
        setErrorMsg('Student full name is required.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('A valid college email address is required (e.g. name@campus.edu).');
        return;
      }
      if (!password || password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
      if (!collegeId.trim()) {
        setErrorMsg('College ID / Registration number is required (e.g. 2024CS108).');
        return;
      }

      try {
        const newUser = storage.registerStudentUser({
          name: name.trim(),
          email: email.trim(),
          collegeId: collegeId.trim(),
          department,
          year,
          phone: phone.trim() || '+1 (555) 000-0000',
          role
        });
        loginUser(newUser);
      } catch (err: any) {
        setErrorMsg(err.message || 'Registration failed.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {authModalMode === 'login' ? 'University Sign In' : 'Create Student Account'}
              </h3>
              <p className="text-xs text-slate-400">Campus Event Portal</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Sign In Box (Handy for evaluation) */}
        <div className="bg-indigo-50/70 border-b border-indigo-100 p-3.5">
          <span className="text-[11px] font-bold text-indigo-950 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            One-Click Demo Credentials
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={handleQuickDemoStudent}
              className="px-2.5 py-1.5 bg-white hover:bg-indigo-50 text-indigo-800 font-semibold rounded-md border border-indigo-200 transition-colors text-left"
            >
              <div className="font-bold">Alex Chen</div>
              <div className="text-[10px] text-indigo-600">Student (2024CS108)</div>
            </button>
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 font-semibold rounded-md border border-emerald-200 transition-colors text-left"
            >
              <div className="font-bold">Admin Helpdesk</div>
              <div className="text-[10px] text-emerald-600 truncate">Near Aud. · 7382395581</div>
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="m-4 mb-0 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          
          {authModalMode === 'signup' && (
            <>
              {/* Account Role Selector */}
              <div className="flex rounded-lg bg-slate-100 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex-1 py-1.5 font-semibold rounded-md transition-colors ${
                    role === 'student' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Student Account
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex-1 py-1.5 font-semibold rounded-md transition-colors ${
                    role === 'admin' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Campus Organizer / Admin
                </button>
              </div>

              {/* Student Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Chen"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* College ID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  College ID / Registration Number *
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={collegeId}
                    onChange={(e) => setCollegeId(e.target.value)}
                    placeholder="e.g. 2024CS108"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Department & Year */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    {CAMPUS_DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Year of Study
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    {STUDY_YEARS.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              University Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@campus.edu"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{authModalMode === 'login' ? 'Sign In to Portal' : 'Register Account'}</span>
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-600">
          {authModalMode === 'login' ? (
            <p>
              New to the campus portal?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setAuthModalMode('signup');
                }}
                className="font-bold text-indigo-600 hover:text-indigo-800 underline"
              >
                Sign up here
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setAuthModalMode('login');
                }}
                className="font-bold text-indigo-600 hover:text-indigo-800 underline"
              >
                Sign in to your account
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
