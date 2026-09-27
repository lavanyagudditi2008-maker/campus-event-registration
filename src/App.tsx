import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { EventsView } from './views/EventsView';
import { MyRegistrationsView } from './views/MyRegistrationsView';
import { StudentDashboardView } from './views/StudentDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { EventDetailsModal } from './components/EventDetailsModal';
import { RegistrationModal } from './components/RegistrationModal';
import { TicketModal } from './components/TicketModal';
import { AuthModal } from './components/AuthModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { CreateEditEventModal } from './components/CreateEditEventModal';
import { Toast } from './components/Toast';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Top Navigation */}
      <Navbar />

      {/* Main View Port */}
      <main className="flex-1">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'events' && <EventsView />}
        {activeTab === 'registrations' && <MyRegistrationsView />}
        {activeTab === 'student-dashboard' && <StudentDashboardView />}
        {activeTab === 'admin-dashboard' && <AdminDashboardView />}
      </main>

      {/* Modals & Overlays */}
      <EventDetailsModal />
      <RegistrationModal />
      <TicketModal />
      <AuthModal />
      <NotificationDrawer />
      <CreateEditEventModal />
      <Toast />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
