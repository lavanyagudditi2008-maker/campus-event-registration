export type EventCategory = 
  | 'Hackathon'
  | 'Cultural Fest'
  | 'Sports Meet'
  | 'Technical Workshop'
  | 'Quiz Competition'
  | 'Coding Contest';

export type RegistrationStatus = 'Confirmed' | 'Pending Approval' | 'Waitlisted' | 'Cancelled';

export interface CampusEvent {
  id: string;
  title: string;
  category: EventCategory;
  description: string;
  shortDescription: string;
  imageUrl: string;
  date: string; // ISO date YYYY-MM-DD
  time: string; // e.g. "09:00 AM - 05:00 PM"
  venue: string;
  organizer: string;
  organizerEmail: string;
  eligibility: string;
  totalSeats: number;
  registeredCount: number;
  featured?: boolean;
  registrationDeadline: string;
  requiresApproval?: boolean;
  rules?: string[];
  schedule?: { time: string; activity: string }[];
}

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  collegeId: string; // e.g. "2024CS108"
  department: string;
  year: string; // "1st Year", "2nd Year", "3rd Year", "4th Year"
  phone: string;
  role: 'student' | 'admin';
  avatar?: string;
}

export interface Registration {
  id: string; // e.g. "REG-HK2026-8921"
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  eventCategory: EventCategory;
  studentId: string;
  studentName: string;
  studentEmail: string;
  collegeId: string;
  department: string;
  year: string;
  phone: string;
  status: RegistrationStatus;
  registeredAt: string; // ISO string
  notes?: string;
}

export interface NotificationItem {
  id: string;
  userId: string; // studentId or 'all'
  title: string;
  message: string;
  type: 'confirmation' | 'reminder' | 'update' | 'announcement';
  eventId?: string;
  timestamp: string;
  read: boolean;
}

export interface EventFilterState {
  searchQuery: string;
  category: string;
  status: 'all' | 'open' | 'filling-fast' | 'closed';
  dateFilter: 'all' | 'upcoming' | 'this-week' | 'this-month';
}
