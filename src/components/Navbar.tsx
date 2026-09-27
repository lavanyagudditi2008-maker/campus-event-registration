import React from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import { 
  Calendar, 
  GraduationCap, 
  Bell, 
  User, 
  ShieldCheck, 
  LogOut, 
  Ticket, 
  LayoutDashboard,
  Search,
  Menu,
  X,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    notifications, 
    setIsNotificationOpen, 
    setIsAuthModalOpen, 
    setAuthModalMode, 
    logoutUser, 
    quickSwitchToStudent, 
    quickSwitchToAdmin,
    registrations
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const unreadCount = notifications.filter(n => 
    !n.read && (currentUser ? (n.userId === currentUser.id || n.userId === 'all') : true)
  ).length;

  const myActiveRegistrations = currentUser 
    ? registrations.filter(r => r.studentId === currentUser.id && r.status !== 'Cancelled').length
    : 0;

  const navLinks: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'events', label: 'All Events', icon: <Calendar className="w-4 h-4" /> },
    { 
      id: 'registrations', 
      label: 'My Registrations', 
      icon: <Ticket className="w-4 h-4" />,
      badge: myActiveRegistrations > 0 ? myActiveRegistrations : undefined 
    },
    { id: 'student-dashboard', label: 'Student Portal', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'admin-dashboard', label: 'Admin Desk', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const handleNavClick = (tabId: NavigationTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Administrative Helpdesk Top Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="inline-flex items-center gap-1 font-bold text-indigo-400 uppercase tracking-wider text-[10px] bg-indigo-950/70 px-2 py-0.5 rounded border border-indigo-800/60">
              <MapPin className="w-3 h-3 text-indigo-400" />
              Administrative Helpdesk
            </span>
            <span className="text-white font-medium">Near Auditorium</span>
            <span className="text-slate-500 hidden md:inline">·</span>
            <span className="text-slate-400 hidden md:inline">All Events Scheduled Nov 1 & Nov 2 (150 Seats/Event)</span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <a 
              href="mailto:lavanyagudditi2008@gmail.com" 
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Mail className="w-3 h-3 text-indigo-400" />
              <span className="text-slate-200 underline font-medium">lavanyagudditi2008@gmail.com</span>
            </a>
            <span className="text-slate-600">|</span>
            <a 
              href="tel:7382395581" 
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span className="font-mono font-bold text-white">7382395581</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Brand Mark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  CampusEvents
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-600 -mt-1">
                  University Portal
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Clean single line typography) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap relative ${
                    isActive 
                      ? 'text-indigo-700 bg-indigo-50 font-semibold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {item.label}
                  {item.badge !== undefined && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold text-white bg-indigo-600 rounded-full tabular-nums">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Notifications Button */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors"
              title="Campus Notifications"
              aria-label="Campus Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white tabular-nums ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Quick Demo Switcher (Student vs Admin) */}
            <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => quickSwitchToStudent()}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  currentUser?.role === 'student'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student View
              </button>
              <button
                onClick={() => quickSwitchToAdmin()}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  currentUser?.role === 'admin'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin Desk
              </button>
            </div>

            {/* User Profile or Sign In */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200">
                <button
                  onClick={() => {
                    if (currentUser.role === 'admin') {
                      setActiveTab('admin-dashboard');
                    } else {
                      setActiveTab('student-dashboard');
                    }
                  }}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-lg hover:bg-slate-100 transition-colors text-left"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    currentUser.role === 'admin' 
                      ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300' 
                      : 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-300'
                  }`}>
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-slate-600 capitalize">
                      {currentUser.role === 'admin' ? 'Coordinator' : currentUser.collegeId}
                    </p>
                  </div>
                </button>

                <button
                  onClick={logoutUser}
                  className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                >
                  Join Portal
                </button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-lg text-left ${
                activeTab === item.id ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                {item.icon}
                {item.label}
              </span>
              {item.badge !== undefined && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-600 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
            <span className="text-xs text-slate-600">Quick mode:</span>
            <button
              onClick={() => {
                quickSwitchToStudent();
                setMobileMenuOpen(false);
              }}
              className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700"
            >
              Student
            </button>
            <button
              onClick={() => {
                quickSwitchToAdmin();
                setMobileMenuOpen(false);
              }}
              className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700"
            >
              Admin Desk
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
