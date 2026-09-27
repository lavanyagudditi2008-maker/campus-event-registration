import { CampusEvent, StudentUser, Registration, NotificationItem } from '../types';
import { INITIAL_EVENTS, INITIAL_STUDENTS, INITIAL_REGISTRATIONS, INITIAL_NOTIFICATIONS } from '../data/initialData';

const STORAGE_KEYS = {
  EVENTS: 'campus_events_data_v5',
  STUDENTS: 'campus_students_data_v5',
  REGISTRATIONS: 'campus_registrations_data_v5',
  NOTIFICATIONS: 'campus_notifications_data_v5',
  CURRENT_USER: 'campus_current_user_v5',
  VERSION: 'campus_version_v5_fresh900'
};

const FRESH_VERSION_TAG = 'fresh_900_students_nov1_nov2_v8';

// Initialize default state if empty in localStorage or if old schema detected
export function initializeStorage(): void {
  try {
    const currentVersion = localStorage.getItem(STORAGE_KEYS.VERSION);

    // If never initialized or old mock data exists, force clean fresh start
    if (currentVersion !== FRESH_VERSION_TAG) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_STUDENTS[0]));
      localStorage.setItem(STORAGE_KEYS.VERSION, FRESH_VERSION_TAG);
      return;
    }

    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_STUDENTS[0]));
    }
  } catch (e) {
    console.error('Failed to initialize storage:', e);
  }
}

// Events with automatic real-time calculation of registered members count
export function getEvents(): CampusEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    const events: CampusEvent[] = raw ? JSON.parse(raw) : INITIAL_EVENTS;
    const registrations = getRegistrations();
    
    // Automatically calculate how many members are registered for each event
    return events.map(evt => {
      const activeMemberCount = registrations.filter(
        r => r.eventId === evt.id && r.status !== 'Cancelled'
      ).length;
      return {
        ...evt,
        registeredCount: activeMemberCount
      };
    });
  } catch {
    return INITIAL_EVENTS;
  }
}

export function saveEvents(events: CampusEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  } catch (e) {
    console.error('Failed to save events:', e);
  }
}

export function createEvent(eventData: Omit<CampusEvent, 'id' | 'registeredCount'>): CampusEvent {
  const events = getEvents();
  const newEvent: CampusEvent = {
    ...eventData,
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    registeredCount: 0
  };
  events.unshift(newEvent);
  saveEvents(events);

  // Broadcast announcement notification
  addNotification({
    userId: 'all',
    title: `New Event: ${newEvent.title}`,
    message: `Registrations are now open for ${newEvent.title} at ${newEvent.venue}.`,
    type: 'announcement',
    eventId: newEvent.id
  });

  return newEvent;
}

export function updateEvent(updatedEvent: CampusEvent): void {
  const events = getEvents();
  const index = events.findIndex(e => e.id === updatedEvent.id);
  if (index !== -1) {
    events[index] = updatedEvent;
    saveEvents(events);

    // Notify registered attendees of event update
    const registrations = getRegistrations().filter(r => r.eventId === updatedEvent.id && r.status !== 'Cancelled');
    registrations.forEach(reg => {
      addNotification({
        userId: reg.studentId,
        title: `Event Updated: ${updatedEvent.title}`,
        message: `The schedule or venue for ${updatedEvent.title} has been updated. Venue: ${updatedEvent.venue}, Date: ${updatedEvent.date}.`,
        type: 'update',
        eventId: updatedEvent.id
      });
    });
  }
}

export function deleteEvent(eventId: string): void {
  const events = getEvents().filter(e => e.id !== eventId);
  saveEvents(events);

  // Notify registered attendees
  const registrations = getRegistrations().filter(r => r.eventId === eventId);
  registrations.forEach(reg => {
    addNotification({
      userId: reg.studentId,
      title: `Event Cancelled: ${reg.eventTitle}`,
      message: `We regret to inform you that ${reg.eventTitle} has been cancelled by the administration.`,
      type: 'update'
    });
  });
}

// Students / Users
export function getStudents(): StudentUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return raw ? JSON.parse(raw) : INITIAL_STUDENTS;
  } catch {
    return INITIAL_STUDENTS;
  }
}

export function saveStudents(students: StudentUser[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students:', e);
  }
}

export function registerStudentUser(userData: Omit<StudentUser, 'id'>): StudentUser {
  const students = getStudents();
  const existing = students.find(s => s.email.toLowerCase() === userData.email.toLowerCase());
  if (existing) {
    throw new Error('A student account with this email address already exists.');
  }

  const newUser: StudentUser = {
    ...userData,
    id: `usr-student-${Date.now()}`
  };
  students.push(newUser);
  saveStudents(students);
  setCurrentUser(newUser);

  addNotification({
    userId: newUser.id,
    title: 'Welcome to Campus Events!',
    message: `Account created for ${newUser.name} (${newUser.collegeId}). Explore campus hackathons, fests, and workshops.`,
    type: 'announcement'
  });

  return newUser;
}

export function getCurrentUser(): StudentUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: StudentUser | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (e) {
    console.error('Failed to set current user:', e);
  }
}

// Registrations
export function getRegistrations(): Registration[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    return raw ? JSON.parse(raw) : INITIAL_REGISTRATIONS;
  } catch {
    return INITIAL_REGISTRATIONS;
  }
}

export function saveRegistrations(registrations: Registration[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
  } catch (e) {
    console.error('Failed to save registrations:', e);
  }
}

export function createRegistration(data: {
  event: CampusEvent;
  student: StudentUser;
  department: string;
  year: string;
  phone: string;
  notes?: string;
}): Registration {
  const registrations = getRegistrations();
  
  // Check if student is already registered for this event
  const existing = registrations.find(
    r => r.eventId === data.event.id && r.studentId === data.student.id && r.status !== 'Cancelled'
  );
  if (existing) {
    throw new Error('You are already registered for this event.');
  }

  // Check seat capacity
  if (data.event.registeredCount >= data.event.totalSeats) {
    throw new Error('This event has reached full capacity.');
  }

  // Generate unique collegiate registration number
  const prefix = data.event.category.substring(0, 2).toUpperCase();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const regId = `REG-${prefix}-${randomSuffix}`;

  const newRegistration: Registration = {
    id: regId,
    eventId: data.event.id,
    eventTitle: data.event.title,
    eventDate: data.event.date,
    eventTime: data.event.time,
    eventVenue: data.event.venue,
    eventCategory: data.event.category,
    studentId: data.student.id,
    studentName: data.student.name,
    studentEmail: data.student.email,
    collegeId: data.student.collegeId,
    department: data.department,
    year: data.year,
    phone: data.phone,
    status: data.event.requiresApproval ? 'Pending Approval' : 'Confirmed',
    registeredAt: new Date().toISOString(),
    notes: data.notes
  };

  registrations.unshift(newRegistration);
  saveRegistrations(registrations);

  // Increment event registeredCount
  const events = getEvents();
  const eventIdx = events.findIndex(e => e.id === data.event.id);
  if (eventIdx !== -1) {
    events[eventIdx].registeredCount += 1;
    saveEvents(events);
  }

  // Trigger confirmation notification
  addNotification({
    userId: data.student.id,
    title: data.event.requiresApproval ? 'Registration Submitted for Review' : 'Registration Confirmed!',
    message: data.event.requiresApproval
      ? `Your application for ${data.event.title} (ID: ${regId}) has been received and is pending faculty coordinator review.`
      : `You are confirmed for ${data.event.title}! ID: ${regId}. Access your electronic pass anytime in My Registrations.`,
    type: 'confirmation',
    eventId: data.event.id
  });

  return newRegistration;
}

export function cancelRegistration(registrationId: string): void {
  const registrations = getRegistrations();
  const reg = registrations.find(r => r.id === registrationId);
  if (!reg) return;

  reg.status = 'Cancelled';
  saveRegistrations(registrations);

  // Decrement event registered count
  const events = getEvents();
  const eventIdx = events.findIndex(e => e.id === reg.eventId);
  if (eventIdx !== -1 && events[eventIdx].registeredCount > 0) {
    events[eventIdx].registeredCount -= 1;
    saveEvents(events);
  }

  // Send cancellation notice
  addNotification({
    userId: reg.studentId,
    title: 'Registration Cancelled',
    message: `Your registration for ${reg.eventTitle} (${reg.id}) was cancelled. The seat has been freed for fellow students.`,
    type: 'update',
    eventId: reg.eventId
  });
}

export function updateRegistrationStatus(registrationId: string, status: Registration['status']): void {
  const registrations = getRegistrations();
  const reg = registrations.find(r => r.id === registrationId);
  if (!reg) return;

  const oldStatus = reg.status;
  reg.status = status;
  saveRegistrations(registrations);

  // Handle seat counts if changed to or from Cancelled
  if (oldStatus !== 'Cancelled' && status === 'Cancelled') {
    const events = getEvents();
    const eventIdx = events.findIndex(e => e.id === reg.eventId);
    if (eventIdx !== -1 && events[eventIdx].registeredCount > 0) {
      events[eventIdx].registeredCount -= 1;
      saveEvents(events);
    }
  } else if (oldStatus === 'Cancelled' && status !== 'Cancelled') {
    const events = getEvents();
    const eventIdx = events.findIndex(e => e.id === reg.eventId);
    if (eventIdx !== -1) {
      events[eventIdx].registeredCount += 1;
      saveEvents(events);
    }
  }

  // Notify student
  addNotification({
    userId: reg.studentId,
    title: `Registration Status: ${status}`,
    message: `Your registration (${reg.id}) for ${reg.eventTitle} is now marked as ${status}.`,
    type: 'update',
    eventId: reg.eventId
  });
}

// Notifications
export function getNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveNotifications(notifications: NotificationItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch (e) {
    console.error('Failed to save notifications:', e);
  }
}

export function addNotification(item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): NotificationItem {
  const notifs = getNotifications();
  const newNotif: NotificationItem = {
    ...item,
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    read: false
  };
  notifs.unshift(newNotif);
  saveNotifications(notifs);
  return newNotif;
}

export function markNotificationAsRead(id: string): void {
  const notifs = getNotifications();
  const item = notifs.find(n => n.id === id);
  if (item) {
    item.read = true;
    saveNotifications(notifs);
  }
}

export function markAllNotificationsAsRead(userId: string): void {
  const notifs = getNotifications();
  notifs.forEach(n => {
    if (n.userId === userId || n.userId === 'all') {
      n.read = true;
    }
  });
  saveNotifications(notifs);
}

export function clearNotifications(userId: string): void {
  const notifs = getNotifications().filter(n => n.userId !== userId && n.userId !== 'all');
  saveNotifications(notifs);
}

export function resetAllData(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_STUDENTS[0]));
    localStorage.setItem(STORAGE_KEYS.VERSION, FRESH_VERSION_TAG);
  } catch (e) {
    console.error('Failed to reset data:', e);
  }
}
