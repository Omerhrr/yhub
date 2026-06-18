// Centralized data for the Yahya Hub clone.
// All prices in NGN (Naira). All times in Africa/Lagos.

export const SITE = {
  name: "Yahya Hub",
  email: "yahyahub6@gmail.com",
  phone: "07043925169",
  social: {
    facebook: "https://www.facebook.com/share/1913yPdrYe/",
    twitter: "https://x.com/YahyaHub",
    linkedin: "https://www.linkedin.com/company/yahyahub/posts",
  },
};

export const LOGO_URL =
  "https://firebasestorage.googleapis.com/v0/b/yahyahub-e7643.firebasestorage.app/o/bookings-n-products%2Flogo%2Flogo.svg?alt=media&token=ab0d0a31-9584-43f1-bc95-2a8c66473a8c";
export const HERO_VIDEO_URL =
  "https://firebasestorage.googleapis.com/v0/b/yahyahub-e7643.firebasestorage.app/o/bookings-n-products%2Fhero%2Fvideo%2Fyahya_hub_commercial.mp4?alt=media&token=24f59eeb-8203-4a75-8763-0c1d4454b9b7";
export const PAYSTACK_LOGO_URL =
  "https://firebasestorage.googleapis.com/v0/b/yahyahub-e7643.firebasestorage.app/o/bookings-n-products%2Flogo%2Fpaystack-logo.png?alt=media&token=361ababc-d652-4a55-b56c-86b87f25f62a";
export const COWORKING_IMG =
  "https://firebasestorage.googleapis.com/v0/b/yahyahub-e7643.firebasestorage.app/o/bookings-n-products%2Fworkspaces%2Fco-working_space.jpeg?alt=media&token=6f46057d-8c94-48ad-a5fb-f1f320bedb6c";
export const EXECUTIVE_IMG =
  "https://firebasestorage.googleapis.com/v0/b/yahya-hub-backed.firebasestorage.app/o/Yahya%20Hub%20Web%20App%2FStatic%20Assets%2Fworkspaces%2Fexecutive-office.jpg?alt=media&token=24266ec3-18df-459a-8057-041db5cbdb41";

export type Amenity = {
  icon: string; // lucide icon name
  label: string;
};

export type Workspace = {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  amenities: Amenity[];
  hourlyRate: number;
  dailyRate: number;
  imageUrl: string;
  bookingEnabled: boolean;
};

export const workspaces: Workspace[] = [
  {
    id: "ws-1",
    name: "Program/ Event space",
    description:
      "A space of 50 chairs suitable for an event, webinar or workshop",
    rating: 4.5,
    reviewCount: 10,
    amenities: [
      { icon: "armchair", label: "50 Chair" },
      { icon: "desk", label: "6 Desk" },
      { icon: "projector", label: "Projector" },
      { icon: "whiteboard", label: "Whiteboard" },
    ],
    hourlyRate: 20000,
    dailyRate: 120000,
    imageUrl: COWORKING_IMG,
    bookingEnabled: true,
  },
  {
    id: "ws-2",
    name: "workspace",
    description:
      "A dynamic, shared workspace designed for networking, collaboration, and spontaneous creativity.",
    rating: 4.6,
    reviewCount: 150,
    amenities: [{ icon: "desk", label: "20 Executive Desk" }],
    hourlyRate: 333,
    dailyRate: 3000,
    imageUrl: COWORKING_IMG,
    bookingEnabled: true,
  },
  {
    id: "ws-3",
    name: "Office of One",
    description:
      "A compact, private office perfect for solo entrepreneurs and freelancers seeking focus and productivity.",
    rating: 4.8,
    reviewCount: 75,
    amenities: [{ icon: "desk", label: "Executive Desk" }],
    hourlyRate: 1000,
    dailyRate: 10000,
    imageUrl: EXECUTIVE_IMG,
    bookingEnabled: false,
  },
  {
    id: "ws-4",
    name: "Office of Two",
    description:
      "A private office designed for two, ideal for startups, small teams, or collaborative partners.",
    rating: 4.9,
    reviewCount: 62,
    amenities: [
      { icon: "desk", label: "2 Executive Desk" },
      { icon: "armchair", label: "Single Couches" },
    ],
    hourlyRate: 1000,
    dailyRate: 10000,
    imageUrl: EXECUTIVE_IMG,
    bookingEnabled: true,
  },
  {
    id: "ws-5",
    name: "Office of Three",
    description:
      "A collaborative workspace for a team of three, offering a blend of privacy and open communication.",
    rating: 4.7,
    reviewCount: 45,
    amenities: [
      { icon: "desk", label: "3 Executive Desk" },
      { icon: "sofa", label: "Double Couch" },
    ],
    hourlyRate: 1000,
    dailyRate: 10000,
    imageUrl: EXECUTIVE_IMG,
    bookingEnabled: true,
  },
  {
    id: "ws-6",
    name: "Executive Office",
    description:
      "A premium, spacious office for leaders, featuring top-tier amenities and a commanding view.",
    rating: 4.5,
    reviewCount: 30,
    amenities: [
      { icon: "desk", label: "Executive Desk" },
      { icon: "armchair", label: "2 Single Couches" },
      { icon: "tv", label: "Smart TV" },
      { icon: "whiteboard", label: "Whiteboard" },
    ],
    hourlyRate: 1000,
    dailyRate: 10000,
    imageUrl: EXECUTIVE_IMG,
    bookingEnabled: true,
  },
  {
    id: "ws-7",
    name: "Conference Room",
    description:
      "A fully-equipped room for meetings, presentations, and workshops, designed for professional impact.",
    rating: 4.9,
    reviewCount: 90,
    amenities: [
      { icon: "desk", label: "10 Executive Desk" },
      { icon: "tv", label: "Smart TV" },
    ],
    hourlyRate: 8000,
    dailyRate: 72000,
    imageUrl: COWORKING_IMG,
    bookingEnabled: true,
  },
];

export type Program = {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: string;
  price: number;
  status: "upcoming" | "completed";
  cohort?: string;
  type?: string;
  enrollable: boolean;
};

export const upcomingPrograms: Program[] = [
  {
    id: "prog-adult",
    name: "Adult Classes",
    description:
      "Data Analysis/Data Science, UI/UX, Cybersecurity, AI Automation, Software Engineering. 2 months, 3 days a week",
    category: "Adult Classes",
    duration: "2 months",
    price: 100000,
    status: "upcoming",
    enrollable: true,
  },
  {
    id: "prog-kids",
    name: "Kids Program",
    description:
      "Scratch & Blockly, Graphics Design, Web Development, 3D CAD, Robotics 5 weeks, Monday – Wednesday, 10am – 1pm",
    category: "Kids Program",
    duration: "1 month",
    price: 50000,
    status: "upcoming",
    enrollable: true,
  },
  {
    id: "prog-highschool",
    name: "Highschool Leavers",
    description: "Python Programming. 2 months, 3 days a week",
    category: "Highschool Leavers",
    duration: "2 months",
    price: 100000,
    status: "upcoming",
    enrollable: true,
  },
];

export const completedPrograms: Program[] = [
  {
    id: "prog-gis-3",
    name: "Geographical Information System (GIS)",
    description:
      "Gain practical skills in spatial data analysis, mapping, and geospatial technologies for real-world applications.",
    category: "Geographical Information System (GIS)",
    duration: "0 seconds",
    price: 0,
    status: "completed",
    cohort: "Cohort 3",
    enrollable: false,
  },
  {
    id: "prog-gis-2",
    name: "Geographical Information System (GIS)",
    description:
      "Gain practical skills in spatial data analysis, mapping, and geospatial technologies for real-world applications.",
    category: "Geographical Information System (GIS)",
    duration: "7 days",
    price: 0,
    status: "completed",
    cohort: "Cohort 2",
    enrollable: false,
  },
  {
    id: "prog-gis-1",
    name: "Geographical Information System (GIS)",
    description:
      "Gain practical skills in spatial data analysis, mapping, and geospatial technologies for real-world applications.",
    category: "Geographical Information System (GIS)",
    duration: "7 days",
    price: 2000,
    status: "completed",
    cohort: "Cohort 1",
    enrollable: false,
  },
  {
    id: "prog-ux",
    name: "UX Workshop",
    description:
      "Breaking into Ux Design in Nigeria Learn how to Start, Grow and Thrive",
    category: "UX Workshop",
    duration: "0 seconds",
    price: 0,
    status: "completed",
    type: "Workshop",
    enrollable: false,
  },
];

export type EventItem = {
  id: string;
  title: string;
  description: string;
  longWriteUp?: string;
  category: string;
  mode: "Online" | "Physical";
  isMostRecent?: boolean;
  status: "ongoing" | "upcoming" | "past";
  date: string;
  time: string;
  location: string;
  audience: string;
  fee: number;
  instagramUrl: string;
  bookable: boolean;
};

export const homeEvents: EventItem[] = [
  {
    id: "evt-annual-ongoing",
    title: "Annual Tech Conference",
    description:
      "Join us for our biggest event of the year, featuring talks from industry leaders, networking opportunities, and workshops.",
    category: "Conference",
    mode: "Physical",
    status: "ongoing",
    date: "Nov 21, 2026",
    time: "10:00 AM - 01:00 PM",
    location: "Yahya Hub",
    audience: "Tech Professionals",
    fee: 1200,
    instagramUrl: "https://www.instagram.com/yahyahub/",
    bookable: false,
  },
  {
    id: "evt-annual-upcoming",
    title: "Annual Tech Conference",
    description:
      "Join us for our biggest event of the year, featuring talks from industry leaders, networking opportunities, and workshops.",
    category: "Conference",
    mode: "Physical",
    status: "upcoming",
    date: "Oct 26, 2025",
    time: "10:00 AM - 01:00 PM",
    location: "Yahya Hub",
    audience: "Tech Professionals",
    fee: 0,
    instagramUrl: "https://www.instagram.com/yahyahub/",
    bookable: true,
  },
];

export const pastEvents: EventItem[] = [
  {
    id: "pe-1",
    title: "Building Green 101: Engineering, Architecture and Global Opportunities",
    description:
      "A public webinar breaking down the green-building landscape for Nigerian built-environment professionals.",
    longWriteUp:
      "Most built-environment professionals in Nigeria have heard the term 'green building.' Very few have had a clear, structured explanation of what it actually means and where they fit in it. Building Green 101 changed that. The webinar opened with a full anchor-led overview of the green building landscape. Its five key pillars, its areas of specialisation, and why the opportunity is significant for Nigerian professionals right now. Then the speaker took over. Adams Balade Abubakar, a COREN-certified civil engineer, Corporate Member of the Nigerian Society of Engineers, and PhD Candidate at the University of Ottawa, joined live to break down his field: sustainable structural materials, carbon reduction in construction, and his research into cement-free binders.",
    category: "Public Webinar",
    mode: "Online",
    isMostRecent: true,
    status: "past",
    date: "May 23, 2026",
    time: "05:00 PM",
    location: "Google Meet",
    audience:
      "Civil Engineers, Architects, Urban Planners, Students, Built-Environment Professionals",
    fee: 0,
    instagramUrl: "https://www.instagram.com/p/DJL9YXroM5_/",
    bookable: false,
  },
  {
    id: "pe-2",
    title: "Games Night May Edition — Settle The Score",
    description:
      "Two PS5 setups. Two brackets. FC26 and Mortal Kombat. Sixteen tournament slots and real prize money.",
    longWriteUp:
      "May's Games Night was a different beast entirely. Where April was a warm introduction, May delivered on the promise: a proper tournament. Two PS5 setups. Two separate brackets. FC26 on one screen, Mortal Kombat on the other. Sixteen tournament slots. Real prize money built from entry fees. Alongside the brackets, the room played Kahoot, with questions on Nigerian pop culture, football, and gaming, and Werewolf/Mafia for the non-tournament crowd. Two champions were crowned before the afternoon was done, and the room that came in competitive left feeling like a community. The tagline said it best: Two Arenas. Two Champions.",
    category: "Community Tournament",
    mode: "Physical",
    status: "past",
    date: "May 22, 2026",
    time: "03:00 PM",
    location: "Yahya Hub",
    audience: "Gamers, Young Professionals, Students",
    fee: 0,
    instagramUrl: "https://www.instagram.com/p/DJL9YXroM5_/",
    bookable: false,
  },
  {
    id: "pe-3",
    title: "AI in Architecture — Yahya Hub x NIA",
    description:
      "A professional conference unpacking AI's role in architectural practice, co-hosted with the Nigerian Institute of Architects.",
    longWriteUp:
      "AI in Architecture was a first-of-its-kind collaboration between Yahya Hub and the Nigerian Institute of Architects. The conference brought practicing architects into the same room as machine-learning engineers, with the goal of cutting through the hype and showing concrete ways AI is already changing day-to-day architectural work — from generative design iteration to climate-performance simulation and contract-document automation. Panels alternated between live demos of tools and structured Q&A with the audience. The closing keynote addressed the ethical and licensing questions that arise when an AI tool is trained on a portfolio of completed projects, framing them as industry-wide decisions rather than individual ones.",
    category: "Professional Conference",
    mode: "Physical",
    status: "past",
    date: "May 21, 2026",
    time: "11:00 AM",
    location: "Yahya Hub",
    audience: "NIA Members, Architects, Built-Environment Professionals",
    fee: 0,
    instagramUrl: "https://www.instagram.com/yahyahub/",
    bookable: false,
  },
  {
    id: "pe-4",
    title: "Kids Spring Break Tech Bootcamp",
    description:
      "A five-day bootcamp introducing children to block-based coding, digital art, and robotics fundamentals.",
    longWriteUp:
      "The Kids Spring Break Tech Bootcamp was designed for one purpose: to give children a structured, hands-on first encounter with technology beyond passive consumption. Across five days, participants rotated through Scratch and Blockly for block-based programming, Canva and Tux Paint for digital art, and a robotics lab where they built and programmed simple line-following robots. The bootcamp closed with a showcase where each child presented their favourite project to parents and peers. The energy in the room — equal parts pride and chaos — was the entire point.",
    category: "Youth Training",
    mode: "Physical",
    status: "past",
    date: "Apr 15, 2026",
    time: "10:00 AM",
    location: "Yahya Hub",
    audience: "Children and Young Learners",
    fee: 0,
    instagramUrl: "https://www.instagram.com/yahyahub/",
    bookable: false,
  },
  {
    id: "pe-5",
    title: "From Ideas to Impact: Building Resilient Founders",
    description:
      "An entrepreneurial mixer on surviving year one — fundraising, hiring, and the unglamorous middle.",
    longWriteUp:
      "From Ideas to Impact brought together startup founders, grant-seekers, and operators for a candid conversation about the part of entrepreneurship nobody tweets about: the unglamorous middle. Panels covered fundraising strategy in a tight capital environment, hiring for competence over credentials, and the operational discipline that separates founders who survive year one from those who do not. The format was deliberately conversational — short opening remarks, then facilitated round-table discussions where attendees traded specific, hard-won lessons from their own ventures. By the close, every attendee had at least one new contact they could call the following week.",
    category: "Entrepreneurial Mixer",
    mode: "Physical",
    status: "past",
    date: "Apr 10, 2026",
    time: "04:00 PM",
    location: "Yahya Hub",
    audience: "Startup Founders, Entrepreneurs, Grant-Seekers",
    fee: 0,
    instagramUrl: "https://www.instagram.com/yahyahub/",
    bookable: false,
  },
  {
    id: "pe-6",
    title: "Community Games Night",
    description:
      "Our first community games night — board games, FIFA, and pizza, the way a community should meet.",
    longWriteUp:
      "Community Games Night was Yahya Hub's first community-focused event and the prototype for everything that followed. The format was deliberately low-key: a stack of board games, two FIFA setups, and pizza. The point was to give the people who had been working in the space day after day a chance to meet each other as people rather than as the person at the next desk. The room did exactly that. Conversations started over Jenga and continued over pizza, and by the end of the night a community had quietly formed. The room that came in strangers left as regulars.",
    category: "Community Event",
    mode: "Physical",
    status: "past",
    date: "Apr 5, 2026",
    time: "05:00 PM",
    location: "Yahya Hub",
    audience: "Gen Z, Young Professionals, Students",
    fee: 0,
    instagramUrl: "https://www.instagram.com/yahyahub/",
    bookable: false,
  },
  {
    id: "pe-7",
    title: "Beyond the Hype: AI Security from the Ground Up",
    description:
      "A webinar on the security fundamentals every AI-powered product team should have in place before shipping.",
    longWriteUp:
      "Beyond the Hype cut through the noise around AI security by starting from first principles. The webinar walked attendees through the security fundamentals every AI-powered product team should have in place before shipping — from prompt-injection defenses and data-leak prevention, to model-supply-chain integrity and the regulatory landscape that is rapidly catching up to deployment. The speaker, a security engineer who has shipped AI features at scale, anchored every concept to a real production incident. Attendees left with a concrete checklist and a clearer sense of where AI security is genuinely novel versus where it is simply classical security applied to a new surface area.",
    category: "Webinar",
    mode: "Online",
    status: "past",
    date: "Apr 1, 2026",
    time: "06:00 PM",
    location: "Yahya Hub",
    audience: "Tech Professionals, Developers, Founders",
    fee: 0,
    instagramUrl: "https://www.instagram.com/yahyahub/",
    bookable: false,
  },
];

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatarColor: string; // tailwind bg-* class for fallback avatar
};

export const yhConnectTestimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Finding a reliable architect was a nightmare until I found YH Connect. The whole process was seamless and professional.",
    name: "Amina Jibril",
    role: "Homeowner & Client",
    avatarColor: "bg-rose-500",
  },
  {
    id: "t2",
    quote:
      "As a freelance engineer, YH Connect has been a game-changer. I get consistent, high-quality projects without the hassle of marketing.",
    name: "David Okon",
    role: "Structural Engineer",
    avatarColor: "bg-emerald-500",
  },
  {
    id: "t3",
    quote:
      "The project management handover feature is brilliant. Yahya Hub managed our entire office renovation flawlessly.",
    name: "Fatima Bello",
    role: "Startup Founder",
    avatarColor: "bg-amber-500",
  },
];

// Status cards on the hero
export const statusCards = [
  {
    id: "network",
    title: "Network Status",
    icon: "signal",
    badge: { label: "Operational", variant: "green" as const },
    primary: "99.0% uptime",
    secondary: "Starlink connection active",
  },
  {
    id: "power",
    title: "Power Systems",
    icon: "zap",
    badge: { label: "Operational", variant: "green" as const },
    primary: "100% capacity",
    secondary: "Backup solar ready",
  },
  {
    id: "climate",
    title: "Climate Control",
    icon: "thermometer",
    badge: { label: "Operational", variant: "green" as const },
    primary: "26°C average",
    secondary: "Optimal temperature maintained",
  },
  {
    id: "workspace",
    title: "Workspace",
    icon: "briefcase-business",
    badge: { label: "hours", variant: "yellow" as const },
    primary: "10 hours to close",
    secondary: "Open 9:00 AM - 8:00 PM",
  },
];

export function formatNaira(amount: number): string {
  if (amount === 0) return "Free";
  return "₦" + amount.toLocaleString("en-NG");
}
