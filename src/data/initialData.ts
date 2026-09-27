import { CampusEvent, StudentUser, Registration, NotificationItem } from '../types';

export const INITIAL_EVENTS: CampusEvent[] = [
  {
    id: 'evt-hackathon-2026',
    title: 'CodeSprint 2026: 36-Hour National Campus Hackathon',
    category: 'Hackathon',
    shortDescription: 'Build real-world solutions across AI, Sustainability, and Web3 in an intense 36-hour sprint.',
    description: 'CodeSprint 2026 is the university’s premier competitive programming and innovation hackathon. Over 36 adrenaline-filled hours on Nov 1 & Nov 2, students collaborate in multidisciplinary teams to build high-impact applications. Enjoy unlimited high-speed connectivity, hardware lab access, mentorship from leading tech veterans, and complimentary meals throughout.',
    imageUrl: '/src/assets/images/event_hackathon_1790528115123.jpg',
    date: '2026-11-01',
    time: '09:00 AM (Nov 1) - 09:00 PM (Nov 2)',
    venue: 'Computing Hub, Main Campus Hall B',
    organizer: 'Department of Computer Science & ACM Student Chapter',
    organizerEmail: 'acm-events@campus.edu',
    eligibility: 'Open to all undergraduate & postgraduate students (Teams of 2-4)',
    totalSeats: 150,
    registeredCount: 0,
    featured: true,
    registrationDeadline: '2026-10-31',
    requiresApproval: true,
    rules: [
      'Teams must consist of 2 to 4 registered university students.',
      'All code and design assets must be written during the 36-hour sprint on Nov 1-2.',
      'Open-source libraries and APIs are permitted; pre-built proprietary apps are disqualified.',
      'Hardware projects must bring safety certified breadboards & microcontrollers.'
    ],
    schedule: [
      { time: '09:00 AM (Nov 1)', activity: 'Registration & Welcome Keynote' },
      { time: '11:00 AM (Nov 1)', activity: 'Hacking Begins & Problem Statements Unlocked' },
      { time: '06:00 PM (Nov 1)', activity: 'Mentor Review & Architecture Feedback' },
      { time: '08:00 AM (Nov 2)', activity: 'Interim Progress Checkpoint' },
      { time: '05:00 PM (Nov 2)', activity: 'Code Freeze & Project Submissions' },
      { time: '07:00 PM (Nov 2)', activity: 'Live Pitching & Awards Ceremony' }
    ]
  },
  {
    id: 'evt-cultural-fest-2026',
    title: 'Aura 2026: Annual Campus Cultural & Arts Extravaganza',
    category: 'Cultural Fest',
    shortDescription: 'Two days of vibrant music, drama, fine arts, photography, and live celebrity concerts on Nov 1 & 2.',
    description: 'Aura is the annual flagship cultural extravaganza celebrating student expression, musical prowess, street theater, choreo-nights, and fine art installations across Nov 1 and Nov 2. Features student band showcases, classical and western dance battles, literary debating, and festival food stalls across the campus amphitheater.',
    imageUrl: '/src/assets/images/event_cultural_fest_1790528129756.jpg',
    date: '2026-11-01',
    time: '04:00 PM - 10:30 PM (Nov 1 & Nov 2)',
    venue: 'University Grand Open Air Amphitheater',
    organizer: 'Student Affairs & Cultural Activities Council',
    organizerEmail: 'aura-fest@campus.edu',
    eligibility: 'All students with valid university ID card',
    totalSeats: 150,
    registeredCount: 0,
    featured: true,
    registrationDeadline: '2026-10-31',
    requiresApproval: false,
    rules: [
      'Valid student smart card mandatory for entry at all security gates.',
      'Photography gear allowed in designated media zones only.',
      'Zero tolerance policy for hazardous items or unauthorized sound equipment.'
    ],
    schedule: [
      { time: '04:00 PM (Nov 1)', activity: 'Grand Inauguration & Classical Battle of the Bands' },
      { time: '07:30 PM (Nov 1)', activity: 'Inter-College Choreography Showdown' },
      { time: '04:00 PM (Nov 2)', activity: 'Street Theater, Literary Debates & Art Showcase' },
      { time: '08:30 PM (Nov 2)', activity: 'Headlining Musical Performance & Grand Finale' }
    ]
  },
  {
    id: 'evt-sports-meet-2026',
    title: 'Campus Olympiad: Inter-Department Athletics Championship',
    category: 'Sports Meet',
    shortDescription: 'Compete in track & field, relay races, basketball, badminton, and soccer on Nov 1.',
    description: 'The annual Campus Olympiad brings together the brightest athletes from every academic faculty on Sunday, Nov 1. Cheer on your departmental contingents across sprint heats, 4x100m relays, high jump, shot put, basketball tournaments, and volleyball finals on collegiate-grade synthetic grounds.',
    imageUrl: '/src/assets/images/event_sports_meet_1790528141904.jpg',
    date: '2026-11-01',
    time: '07:30 AM - 06:00 PM (Nov 1)',
    venue: 'Olympic Sports Pavilion & Synthetic Track Complex',
    organizer: 'Directorate of Physical Education & Athletics',
    organizerEmail: 'sports@campus.edu',
    eligibility: 'Enrolled students cleared by Campus Health Center',
    totalSeats: 150,
    registeredCount: 0,
    featured: false,
    registrationDeadline: '2026-10-31',
    requiresApproval: false,
    rules: [
      'Athletic footwear and departmental jerseys are mandatory during events.',
      'Medical clearance certificate required for distance races over 800m.',
      'Decisions made by certified college track referees are final.'
    ],
    schedule: [
      { time: '07:30 AM (Nov 1)', activity: 'March Past & Oath Ceremony' },
      { time: '08:30 AM (Nov 1)', activity: '100m, 400m & 4x100m Track Heats' },
      { time: '01:30 PM (Nov 1)', activity: 'Field Finals (Long Jump, Shot Put, High Jump)' },
      { time: '04:00 PM (Nov 1)', activity: 'Inter-Faculty Relay Championships' },
      { time: '05:30 PM (Nov 1)', activity: 'Trophy Presentation & Best Athlete Honors' }
    ]
  },
  {
    id: 'evt-tech-workshop-2026',
    title: 'Hands-on Generative AI & Autonomous Robotics Workshop',
    category: 'Technical Workshop',
    shortDescription: 'Master transformer architectures, vision-language models, and hardware edge deployment on Nov 2.',
    description: 'An intensive technical masterclass held on Monday, Nov 2, taught by visiting industry engineers and faculty researchers. Attendees will build edge vision pipelines on Raspberry Pi and NVIDIA Jetson kits, fine-tune lightweight open models, and deploy interactive agents directly in classroom cloud sandboxes.',
    imageUrl: '/src/assets/images/event_tech_workshop_1790528154086.jpg',
    date: '2026-11-02',
    time: '10:00 AM - 04:30 PM (Nov 2)',
    venue: 'Robotics & Mechatronics Center, Lab 304',
    organizer: 'Center for Artificial Intelligence & IEEE Student Branch',
    organizerEmail: 'ieee-workshop@campus.edu',
    eligibility: '2nd, 3rd & 4th Year Engineering & Science students with Python basics',
    totalSeats: 150,
    registeredCount: 0,
    featured: true,
    registrationDeadline: '2026-10-31',
    requiresApproval: true,
    rules: [
      'Bring your personal laptop with Google Chrome and VS Code installed.',
      'Cloud compute vouchers and hardware breakout kits will be supplied.',
      'Certificate of mastery issued to participants completing all 3 lab assignments.'
    ],
    schedule: [
      { time: '10:00 AM (Nov 2)', activity: 'Foundations of Modern Multimodal Models' },
      { time: '11:45 AM (Nov 2)', activity: 'Lab 1: Local Inference & Prompt Fine-Tuning' },
      { time: '01:00 PM (Nov 2)', activity: 'Lunch & Networking with Faculty Mentors' },
      { time: '02:00 PM (Nov 2)', activity: 'Lab 2: Interfacing Microcontrollers with Vision APIs' },
      { time: '03:45 PM (Nov 2)', activity: 'Capstone Mini-Project & Certificate Handout' }
    ]
  },
  {
    id: 'evt-quiz-competition-2026',
    title: 'Brainiacs: Inter-Departmental Science & General Quiz',
    category: 'Quiz Competition',
    shortDescription: 'Rapid-fire buzzer rounds testing technology, history, pop culture, and scientific trivia on Nov 1.',
    description: 'Test your lateral thinking, scientific deductive skills, and trivia acumen in Brainiacs 2026 on Sunday afternoon, Nov 1. Moderated by our university quizmaster, rounds span audio-visual puzzles, historical cryptograms, quantum trivia, and high-stakes buzzer elimination showdowns with cash scholarships.',
    imageUrl: '/src/assets/images/hero_campus_life_1790528100831.jpg',
    date: '2026-11-01',
    time: '02:00 PM - 05:30 PM (Nov 1)',
    venue: 'Senate Hall Auditorium, Central Block',
    organizer: 'University Debate & Quiz Society (UDQS)',
    organizerEmail: 'quiz@campus.edu',
    eligibility: 'All students (Duos or Solo participants)',
    totalSeats: 150,
    registeredCount: 0,
    featured: false,
    registrationDeadline: '2026-10-31',
    requiresApproval: false,
    rules: [
      'Mobile devices must be surrendered at the entrance prior to preliminary written round.',
      'Top 6 teams advance from the 30-question prelim to the stage audio-visual round.',
      'Negative marking applies in final buzzer sudden death.'
    ],
    schedule: [
      { time: '02:00 PM (Nov 1)', activity: 'Written Preliminary Round (30 Questions)' },
      { time: '03:00 PM (Nov 1)', activity: 'Prelim Evaluation & Audience Fun Quiz' },
      { time: '03:45 PM (Nov 1)', activity: 'Final Stage Quiz (6 Rounds)' },
      { time: '05:15 PM (Nov 1)', activity: 'Scholarship Presentation' }
    ]
  },
  {
    id: 'evt-coding-contest-2026',
    title: 'ByteStorm: Algorithmic Duel & ICPC Qualifier Cup',
    category: 'Coding Contest',
    shortDescription: 'Solve 7 intricate algorithmic challenges under strict time and memory constraints on Nov 2.',
    description: 'ByteStorm is the official college qualifier for regional collegiate programming contests, taking place on Monday afternoon, Nov 2. Contestants will tackle complex graph algorithms, dynamic programming, number theory, and geometric computational challenges on our low-latency automated grading sandbox.',
    imageUrl: '/src/assets/images/event_hackathon_1790528115123.jpg',
    date: '2026-11-02',
    time: '03:00 PM - 07:00 PM (Nov 2)',
    venue: 'Software Engineering Laboratory Complex, Block 4',
    organizer: 'Competitive Coding Club & CSI Student Chapter',
    organizerEmail: 'coding@campus.edu',
    eligibility: 'All collegiate students (Solo participation)',
    totalSeats: 150,
    registeredCount: 0,
    featured: false,
    registrationDeadline: '2026-10-31',
    requiresApproval: false,
    rules: [
      'Supported languages: C++20, Python 3.12, Java 21, Rust 1.80.',
      'Rankings based on number of solved problems and penalty time for incorrect attempts.',
      'Plagiarism checks run automatically across all submitted solutions.'
    ],
    schedule: [
      { time: '03:00 PM (Nov 2)', activity: 'Sandbox Check & Practice Warm-up Problem' },
      { time: '03:30 PM (Nov 2)', activity: 'ByteStorm Contest Starts (7 Problems)' },
      { time: '06:30 PM (Nov 2)', activity: 'Scoreboard Frozen for Final 30 Mins' },
      { time: '07:00 PM (Nov 2)', activity: 'Contest End & Problem Editorial Walkthrough' }
    ]
  }
];

export const INITIAL_STUDENTS: StudentUser[] = [
  {
    id: 'usr-student-alex',
    name: 'Alex Chen',
    email: 'alex.chen@campus.edu',
    collegeId: '2024CS108',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    phone: '+1 (555) 234-5678',
    role: 'student'
  },
  {
    id: 'usr-student-priya',
    name: 'Priya Sharma',
    email: 'priya.s@campus.edu',
    collegeId: '2023EC042',
    department: 'Electronics & Communication',
    year: '4th Year',
    phone: '+1 (555) 345-6789',
    role: 'student'
  },
  {
    id: 'usr-student-marcus',
    name: 'Marcus Vance',
    email: 'marcus.v@campus.edu',
    collegeId: '2025ME019',
    department: 'Mechanical Engineering',
    year: '2nd Year',
    phone: '+1 (555) 456-7890',
    role: 'student'
  },
  {
    id: 'usr-admin-helpdesk',
    name: 'Prof. Lavanya Gudditi',
    email: 'lavanyagudditi2008@gmail.com',
    collegeId: 'ADMIN-AUD-01',
    department: 'Administrative Helpdesk (Near Auditorium)',
    year: 'Campus Coordinator',
    phone: '7382395581',
    role: 'admin'
  }
];

export const INITIAL_REGISTRATIONS: Registration[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-welcome',
    userId: 'all',
    title: 'Campus Event Portal Live',
    message: 'Welcome to the newly launched Campus Event Registration System! 6 campus events are open for enrollment with 150 seats each (900 total student capacity). Register early to secure your spot.',
    type: 'announcement',
    timestamp: '2026-09-27T08:00:00Z',
    read: false
  }
];

export const CAMPUS_DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electronics & Communication',
  'Information Technology',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical & Electronics',
  'Biotechnology & Bio-Engineering',
  'School of Management & Business',
  'Applied Physics & Mathematics'
];

export const STUDY_YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Postgraduate / Research Scholar'
];
