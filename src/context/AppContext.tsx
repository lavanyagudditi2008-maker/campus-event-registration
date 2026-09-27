import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CampusEvent, StudentUser, Registration, NotificationItem } from '../types';
import * as storage from '../services/storage';

export type NavigationTab = 
  | 'home' 
  | 'events' 
  | 'registrations' 
  | 'student-dashboard' 
  | 'admin-dashboard';

interface AppContextType {
  events: CampusEvent[];
  registrations: Registration[];
  notifications: NotificationItem[];
  currentUser: StudentUser | null;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  
  // Modals & Active Selections
  selectedEvent: CampusEvent | null;
  setSelectedEvent: (event: CampusEvent | null) => void;
  isDetailModalOpen: boolean;
  setIsDetailModalOpen: (open: boolean) => void;
  isRegisterModalOpen: boolean;
  setIsRegisterModalOpen: (open: boolean) => void;
  
  selectedRegistration: Registration | null;
  setSelectedRegistration: (reg: Registration | null) => void;
  isTicketModalOpen: boolean;
  setIsTicketModalOpen: (open: boolean) => void;

  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;

  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  
  isCreateEventModalOpen: boolean;
  setIsCreateEventModalOpen: (open: boolean) => void;
  editingEvent: CampusEvent | null;
  setEditingEvent: (event: CampusEvent | null) => void;

  toast: { text: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;

  // Business Actions
  openEventDetails: (event: CampusEvent) => void;
  openRegistrationFlow: (event: CampusEvent) => void;
  openTicketPass: (reg: Registration) => void;
  submitRegistration: (event: CampusEvent, details: { department: string; year: string; phone: string; notes?: string }) => Registration;
  cancelRegistrationHandler: (registrationId: string) => void;
  updateRegistrationStatusHandler: (registrationId: string, status: Registration['status']) => void;
  saveEventHandler: (eventData: Omit<CampusEvent, 'id' | 'registeredCount'>, existingId?: string) => void;
  deleteEventHandler: (eventId: string) => void;
  loginUser: (user: StudentUser) => void;
  logoutUser: () => void;
  quickSwitchToStudent: (studentId?: string) => void;
  quickSwitchToAdmin: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refreshData: () => void;
  resetAll: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [currentUser, setCurrentUserState] = useState<StudentUser | null>(null);
  
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modals
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CampusEvent | null>(null);

  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(prev => (prev?.text === text ? null : prev));
    }, 4000);
  }, []);

  const refreshData = useCallback(() => {
    setEvents(storage.getEvents());
    setRegistrations(storage.getRegistrations());
    setNotifications(storage.getNotifications());
    setCurrentUserState(storage.getCurrentUser());
  }, []);

  useEffect(() => {
    storage.initializeStorage();
    refreshData();
  }, [refreshData]);

  const openEventDetails = (event: CampusEvent) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const openRegistrationFlow = (event: CampusEvent) => {
    if (!currentUser) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      showToast('Please sign in to register for campus events', 'info');
      return;
    }
    // Check if already registered
    const existing = registrations.find(
      r => r.eventId === event.id && r.studentId === currentUser.id && r.status !== 'Cancelled'
    );
    if (existing) {
      setSelectedRegistration(existing);
      setIsTicketModalOpen(true);
      showToast('You are already registered! Viewing your registration pass.', 'info');
      return;
    }

    if (event.registeredCount >= event.totalSeats) {
      showToast('Sorry, this event is currently full.', 'error');
      return;
    }

    setSelectedEvent(event);
    setIsRegisterModalOpen(true);
  };

  const openTicketPass = (reg: Registration) => {
    setSelectedRegistration(reg);
    setIsTicketModalOpen(true);
  };

  const submitRegistration = (
    event: CampusEvent,
    details: { department: string; year: string; phone: string; notes?: string }
  ): Registration => {
    if (!currentUser) {
      throw new Error('You must be signed in to register.');
    }
    try {
      const reg = storage.createRegistration({
        event,
        student: currentUser,
        department: details.department,
        year: details.year,
        phone: details.phone,
        notes: details.notes
      });
      refreshData();
      showToast(`Successfully registered! Registration ID: ${reg.id}`, 'success');
      return reg;
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
      throw err;
    }
  };

  const cancelRegistrationHandler = (registrationId: string) => {
    storage.cancelRegistration(registrationId);
    refreshData();
    showToast('Registration cancelled. Seat freed for other participants.', 'info');
  };

  const updateRegistrationStatusHandler = (registrationId: string, status: Registration['status']) => {
    storage.updateRegistrationStatus(registrationId, status);
    refreshData();
    showToast(`Registration status updated to "${status}"`, 'success');
  };

  const saveEventHandler = (
    eventData: Omit<CampusEvent, 'id' | 'registeredCount'>,
    existingId?: string
  ) => {
    if (existingId) {
      const existing = events.find(e => e.id === existingId);
      if (existing) {
        const updated: CampusEvent = {
          ...eventData,
          id: existingId,
          registeredCount: existing.registeredCount
        };
        storage.updateEvent(updated);
        showToast('Event details updated successfully', 'success');
      }
    } else {
      storage.createEvent(eventData);
      showToast('New campus event created and announced!', 'success');
    }
    refreshData();
    setIsCreateEventModalOpen(false);
    setEditingEvent(null);
  };

  const deleteEventHandler = (eventId: string) => {
    storage.deleteEvent(eventId);
    refreshData();
    showToast('Event removed from campus catalog', 'info');
  };

  const loginUser = (user: StudentUser) => {
    storage.setCurrentUser(user);
    setCurrentUserState(user);
    setIsAuthModalOpen(false);
    showToast(`Signed in as ${user.name} (${user.role.toUpperCase()})`, 'success');
  };

  const logoutUser = () => {
    storage.setCurrentUser(null);
    setCurrentUserState(null);
    showToast('Signed out of campus portal', 'info');
  };

  const quickSwitchToStudent = (studentId?: string) => {
    const students = storage.getStudents();
    const target = studentId 
      ? students.find(s => s.id === studentId) 
      : students.find(s => s.role === 'student');
    if (target) {
      loginUser(target);
      setActiveTab('student-dashboard');
    }
  };

  const quickSwitchToAdmin = () => {
    const students = storage.getStudents();
    const admin = students.find(s => s.role === 'admin');
    if (admin) {
      loginUser(admin);
      setActiveTab('admin-dashboard');
    }
  };

  const markAsRead = (id: string) => {
    storage.markNotificationAsRead(id);
    refreshData();
  };

  const markAllAsRead = () => {
    if (currentUser) {
      storage.markAllNotificationsAsRead(currentUser.id);
      refreshData();
      showToast('All notifications marked as read', 'info');
    }
  };

  const resetAll = () => {
    storage.resetAllData();
    refreshData();
    showToast('Restored fresh system: 900 total student seats (150 per event) and 0 registrations', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        events,
        registrations,
        notifications,
        currentUser,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedEvent,
        setSelectedEvent,
        isDetailModalOpen,
        setIsDetailModalOpen,
        isRegisterModalOpen,
        setIsRegisterModalOpen,
        selectedRegistration,
        setSelectedRegistration,
        isTicketModalOpen,
        setIsTicketModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isNotificationOpen,
        setIsNotificationOpen,
        isCreateEventModalOpen,
        setIsCreateEventModalOpen,
        editingEvent,
        setEditingEvent,
        toast,
        showToast,
        openEventDetails,
        openRegistrationFlow,
        openTicketPass,
        submitRegistration,
        cancelRegistrationHandler,
        updateRegistrationStatusHandler,
        saveEventHandler,
        deleteEventHandler,
        loginUser,
        logoutUser,
        quickSwitchToStudent,
        quickSwitchToAdmin,
        markAsRead,
        markAllAsRead,
        refreshData,
        resetAll
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
