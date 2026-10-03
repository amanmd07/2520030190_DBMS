import React, { useMemo, useState } from "react";

export type Screen = "home" | "explore" | "details" | "seats" | "ticket" | "profile";

export type CategoryName = "All" | "Music" | "Tech" | "Sports" | "Comedy";

export interface EventItem {
  id: string;
  title: string;
  category: "Music" | "Tech" | "Sports" | "Comedy";
  dateFormatted: string;
  dayNumber: string;
  monthShort: string;
  timeRange: string;
  venue: string;
  city: string;
  price: number;
  rating: number;
  ratingsCount: string;
  ageLimit: string;
  headliner: {
    name: string;
    origin: string;
    genre: string;
    image: string;
  };
  image: string;
  description: string;
  isFeatured?: boolean;
}

export interface BookedTicket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  seats: string[];
  totalPaid: number;
  bookingCode: string;
  gate: string;
  zone: string;
  guestName: string;
  status: "confirmed" | "completed" | "cancelled";
  image: string;
}

type IconName =
  | "arrow"
  | "calendar"
  | "chevron"
  | "heart"
  | "home"
  | "location"
  | "moon"
  | "search"
  | "share"
  | "sun"
  | "ticket"
  | "user"
  | "check"
  | "close"
  | "filter"
  | "sparkles"
  | "bell"
  | "shield";

const initialEvents: EventItem[] = [
  // ================= HYDERABAD =================
  {
    id: "hyd-neon-pulse",
    title: "Neon Pulse Live",
    category: "Music",
    dateFormatted: "Saturday, 28 June 2025",
    dayNumber: "28",
    monthShort: "JUN",
    timeRange: "7:30 PM – 11:30 PM",
    venue: "HITEX Exhibition Center, Madhapur",
    city: "Hyderabad",
    price: 1499,
    rating: 4.8,
    ratingsCount: "2.4k",
    ageLimit: "16+",
    headliner: {
      name: "Aria Voss",
      origin: "Berlin",
      genre: "Electronic / Synthwave",
      image: "https://images.unsplash.com/photo-1782737382701-1a63009882b0?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1764510377280-0d0b4c8f89e7?auto=format&fit=crop&w=1200&q=88",
    description:
      "Step into a world where sound meets light. Neon Pulse brings together global electronic artists, immersive kinetic lasers, holographic visuals, and a high-energy crowd in Hyderabad.",
    isFeatured: true,
  },
  {
    id: "hyd-sunburn-arena",
    title: "Sunburn Arena EDM Fest",
    category: "Music",
    dateFormatted: "Monday, 14 July 2025",
    dayNumber: "14",
    monthShort: "JUL",
    timeRange: "5:00 PM – 11:00 PM",
    venue: "GMR Arena, Shamshabad",
    city: "Hyderabad",
    price: 2199,
    rating: 4.9,
    ratingsCount: "4.1k",
    ageLimit: "18+",
    headliner: {
      name: "Martin Garrix & Friends",
      origin: "Amsterdam",
      genre: "Progressive House / EDM",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=85",
    description:
      "The world's premier dance music experience returns to Hyderabad with massive stadium pyro, international headliners, and an electrifying open-air arena experience.",
    isFeatured: false,
  },
  {
    id: "hyd-future-shift",
    title: "Future Shift Hyderabad",
    category: "Tech",
    dateFormatted: "Saturday, 05 July 2025",
    dayNumber: "05",
    monthShort: "JUL",
    timeRange: "10:00 AM – 6:00 PM",
    venue: "HICC Novotel Arena, Hitec City",
    city: "Hyderabad",
    price: 899,
    rating: 4.9,
    ratingsCount: "1.8k",
    ageLimit: "All Ages",
    headliner: {
      name: "Dr. Elena Rostova",
      origin: "San Francisco",
      genre: "AI Architecture & Robotics",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=85",
    description:
      "The premier future technology and artificial intelligence symposium in Hyderabad. Connect with 3,000+ engineers, product pioneers, and venture founders demoing real-time intelligent agents.",
    isFeatured: false,
  },
  {
    id: "hyd-devcon",
    title: "Hyderabad Cloud & Web3 DevCon",
    category: "Tech",
    dateFormatted: "Saturday, 19 July 2025",
    dayNumber: "19",
    monthShort: "JUL",
    timeRange: "9:30 AM – 5:30 PM",
    venue: "T-Hub Phase 2, Knowledge City",
    city: "Hyderabad",
    price: 599,
    rating: 4.8,
    ratingsCount: "1.2k",
    ageLimit: "18+",
    headliner: {
      name: "Vikram Reddy",
      origin: "Hyderabad",
      genre: "Distributed Systems & Cloud",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=85",
    description:
      "Join Hyderabad's largest developer summit at T-Hub with keynotes on scalable Kubernetes, Rust systems, and decentralized data pipelines.",
    isFeatured: false,
  },
  {
    id: "hyd-marathon",
    title: "Hyderabad Night Run 10K",
    category: "Sports",
    dateFormatted: "Thursday, 10 July 2025",
    dayNumber: "10",
    monthShort: "JUL",
    timeRange: "8:00 PM – 11:00 PM",
    venue: "Gachibowli Stadium, Gachibowli",
    city: "Hyderabad",
    price: 799,
    rating: 4.9,
    ratingsCount: "3.5k",
    ageLimit: "All Ages",
    headliner: {
      name: "Coach Rajesh & RunClub",
      origin: "Hyderabad",
      genre: "Endurance Athletics",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1000&q=85",
    description:
      "Experience the glow of illuminated race tracks under Hyderabad's night sky. Includes timing chip, finisher medal, neon running kit, and live DJ party.",
    isFeatured: false,
  },
  {
    id: "hyd-comedy-fest",
    title: "Hyderabad Laugh Riot",
    category: "Comedy",
    dateFormatted: "Wednesday, 16 July 2025",
    dayNumber: "16",
    monthShort: "JUL",
    timeRange: "7:30 PM – 9:30 PM",
    venue: "Shilpakala Vedika, Hitec City",
    city: "Hyderabad",
    price: 699,
    rating: 4.9,
    ratingsCount: "2.9k",
    ageLimit: "16+",
    headliner: {
      name: "Anubhav Singh Bassi",
      origin: "Meerut",
      genre: "Narrative Standup Comedy",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1000&q=85",
    description:
      "A hilarious two-hour special of fresh anecdotes about college days, courtrooms, friendships, and relatable life mishaps in Hyderabad.",
    isFeatured: false,
  },
  {
    id: "hyd-pun-intended",
    title: "Pun Intended Hyderabad",
    category: "Comedy",
    dateFormatted: "Saturday, 09 August 2025",
    dayNumber: "09",
    monthShort: "AUG",
    timeRange: "6:30 PM – 8:00 PM",
    venue: "Heart Cup Coffee, Jubilee Hills",
    city: "Hyderabad",
    price: 499,
    rating: 4.8,
    ratingsCount: "1.1k",
    ageLimit: "16+",
    headliner: {
      name: "Biswa Kalyan Rath",
      origin: "Odisha",
      genre: "Intelligent / Philosophy Comedy",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=1000&q=85",
    description:
      "A fast-paced philosophical deep dive into everyday absurdity, physics analogies, and dry wit in Jubilee Hills.",
    isFeatured: false,
  },

  // ================= BENGALURU =================
  {
    id: "blr-silicon-beats",
    title: "Silicon Beats EDM Night",
    category: "Music",
    dateFormatted: "Saturday, 19 July 2025",
    dayNumber: "19",
    monthShort: "JUL",
    timeRange: "6:00 PM – 11:30 PM",
    venue: "Manpho Convention Centre, Manyata",
    city: "Bengaluru",
    price: 1899,
    rating: 4.9,
    ratingsCount: "3.7k",
    ageLimit: "18+",
    headliner: {
      name: "KSHMR Live",
      origin: "California",
      genre: "Orchestral EDM & Big Room",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=88",
    description:
      "Bengaluru's biggest electronic music night combining Indian classical instruments with thunderous electronic synths and laser shows.",
    isFeatured: true,
  },
  {
    id: "blr-rock-symphony",
    title: "Rock Symphony Bengaluru",
    category: "Music",
    dateFormatted: "Friday, 08 August 2025",
    dayNumber: "08",
    monthShort: "AUG",
    timeRange: "7:00 PM – 10:30 PM",
    venue: "Phoenix Arena, Whitefield",
    city: "Bengaluru",
    price: 999,
    rating: 4.7,
    ratingsCount: "1.9k",
    ageLimit: "All Ages",
    headliner: {
      name: "Indian Ocean & Thermal",
      origin: "New Delhi",
      genre: "Fusion Rock",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1000&q=85",
    description:
      "Pioneering fusion rock meets live orchestral strings in a high-octane celebration of timeless anthems in Whitefield.",
    isFeatured: false,
  },
  {
    id: "blr-ai-summit",
    title: "Generative AI Summit Bengaluru",
    category: "Tech",
    dateFormatted: "Saturday, 02 August 2025",
    dayNumber: "02",
    monthShort: "AUG",
    timeRange: "9:00 AM – 5:30 PM",
    venue: "KTPO Trade Center, Whitefield",
    city: "Bengaluru",
    price: 1299,
    rating: 4.8,
    ratingsCount: "1.5k",
    ageLimit: "18+",
    headliner: {
      name: "Andrew & Team",
      origin: "Palo Alto",
      genre: "LLM Agents & Multi-Modal",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1000&q=85",
    description:
      "Hands-on masterclasses on building autonomous AI agents, fine-tuning reasoning models, and production vector architectures in India's Silicon Valley.",
    isFeatured: false,
  },
  {
    id: "blr-kabaddi",
    title: "Pro Kabaddi Arena Clash",
    category: "Sports",
    dateFormatted: "Friday, 15 August 2025",
    dayNumber: "15",
    monthShort: "AUG",
    timeRange: "7:00 PM – 10:30 PM",
    venue: "Kanteerava Indoor Stadium, Sampangi",
    city: "Bengaluru",
    price: 549,
    rating: 4.7,
    ratingsCount: "2.8k",
    ageLimit: "All Ages",
    headliner: {
      name: "Bengaluru Bulls Squad",
      origin: "Bengaluru",
      genre: "Pro Contact Sports",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1000&q=85",
    description:
      "Intense mat action, super raids, and electric crowd cheers as top franchises clash in the championship league playoffs at Kanteerava.",
    isFeatured: false,
  },
  {
    id: "blr-standup",
    title: "Standup Unfiltered Bengaluru",
    category: "Comedy",
    dateFormatted: "Saturday, 12 July 2025",
    dayNumber: "12",
    monthShort: "JUL",
    timeRange: "8:00 PM – 9:45 PM",
    venue: "The Comedy Club, Koramangala",
    city: "Bengaluru",
    price: 499,
    rating: 4.7,
    ratingsCount: "950",
    ageLimit: "18+",
    headliner: {
      name: "Rahul Dua & Friends",
      origin: "New Delhi",
      genre: "Observational Standup",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1000&q=85",
    description:
      "Get ready for non-stop laughter as top standup comics bring brand new, unreleased sets exploring startup life and Koramangala traffic.",
    isFeatured: false,
  },

  // ================= MUMBAI =================
  {
    id: "mum-coastal-wave",
    title: "Mumbai Coastal Soundwave",
    category: "Music",
    dateFormatted: "Saturday, 05 July 2025",
    dayNumber: "05",
    monthShort: "JUL",
    timeRange: "6:30 PM – 11:30 PM",
    venue: "Jio World Garden, BKC",
    city: "Mumbai",
    price: 1699,
    rating: 4.9,
    ratingsCount: "4.5k",
    ageLimit: "16+",
    headliner: {
      name: "Ritviz & Nucleya",
      origin: "Mumbai / Goa",
      genre: "Desi Bass & Electronica",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=88",
    description:
      "Mumbai's signature open-air music festival featuring pulsating bass, brass sections, food alleys, and experiential art domes in BKC.",
    isFeatured: true,
  },
  {
    id: "mum-cybershield",
    title: "CyberShield Global Expo Mumbai",
    category: "Tech",
    dateFormatted: "Friday, 22 August 2025",
    dayNumber: "22",
    monthShort: "AUG",
    timeRange: "9:00 AM – 6:00 PM",
    venue: "Jio World Convention Centre, BKC",
    city: "Mumbai",
    price: 1499,
    rating: 4.9,
    ratingsCount: "2.1k",
    ageLimit: "18+",
    headliner: {
      name: "Sarah Lin & SecOps",
      origin: "Singapore",
      genre: "Zero Trust & Red Teaming",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=85",
    description:
      "Asia's premier cybersecurity and threat intelligence summit featuring live hacking villages and zero-day research presentations in Mumbai.",
    isFeatured: false,
  },
  {
    id: "mum-ipl-park",
    title: "Championship Fan Park Mumbai",
    category: "Sports",
    dateFormatted: "Friday, 18 July 2025",
    dayNumber: "18",
    monthShort: "JUL",
    timeRange: "6:30 PM – 11:00 PM",
    venue: "Wankhede Fan Pavilion, Marine Lines",
    city: "Mumbai",
    price: 699,
    rating: 4.9,
    ratingsCount: "3.2k",
    ageLimit: "Family Friendly",
    headliner: {
      name: "DJ Shadow Mumbai",
      origin: "Mumbai",
      genre: "Stadium Anthems & Live Beats",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=85",
    description:
      "Giant 4K stadium screen live match broadcast with surround sound, cheerleaders, food trucks, and pre-match DJ set at Wankhede.",
    isFeatured: false,
  },
  {
    id: "mum-canvas-comedy",
    title: "Canvas Comedy Special Mumbai",
    category: "Comedy",
    dateFormatted: "Friday, 25 July 2025",
    dayNumber: "25",
    monthShort: "JUL",
    timeRange: "8:00 PM – 10:00 PM",
    venue: "Canvas Laugh Club, Lower Parel",
    city: "Mumbai",
    price: 699,
    rating: 4.8,
    ratingsCount: "2.3k",
    ageLimit: "18+",
    headliner: {
      name: "Kenny Sebastian",
      origin: "Bengaluru / Mumbai",
      genre: "Musical Standup Comedy",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1000&q=85",
    description:
      "Musical standup and hilarious observational jokes about Mumbai local trains, monsoon woes, and everyday relationships in Lower Parel.",
    isFeatured: false,
  },

  // ================= GOA =================
  {
    id: "goa-sunburn-beach",
    title: "Goa Beachfront Sunburn",
    category: "Music",
    dateFormatted: "Saturday, 12 July 2025",
    dayNumber: "12",
    monthShort: "JUL",
    timeRange: "4:00 PM – 11:30 PM",
    venue: "Vagator Hilltop Arena, Vagator",
    city: "Goa",
    price: 1999,
    rating: 4.9,
    ratingsCount: "5.2k",
    ageLimit: "18+",
    headliner: {
      name: "Above & Beyond",
      origin: "London",
      genre: "Trance & Progressive",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=88",
    description:
      "Dance with the Arabian sea breeze under vibrant sunset hues as world trance pioneers take over Vagator Cliff with hypnotic melodies.",
    isFeatured: true,
  },
  {
    id: "goa-indie-acoustic",
    title: "Sunset Acoustic Sessions Goa",
    category: "Music",
    dateFormatted: "Saturday, 26 July 2025",
    dayNumber: "26",
    monthShort: "JUL",
    timeRange: "5:30 PM – 9:00 PM",
    venue: "Curties Beach Lounge, Anjuna",
    city: "Goa",
    price: 1199,
    rating: 4.9,
    ratingsCount: "1.1k",
    ageLimit: "16+",
    headliner: {
      name: "Prateek & The Echoes",
      origin: "Jaipur",
      genre: "Indie Folk & Acoustic",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=85",
    description:
      "A serene beachfront musical gathering under the coastal sunset with soulful acoustic guitars and bonfire mocktails.",
    isFeatured: false,
  },
  {
    id: "goa-nomad-tech",
    title: "Goa Remote Tech & Nomad Con",
    category: "Tech",
    dateFormatted: "Wednesday, 20 August 2025",
    dayNumber: "20",
    monthShort: "AUG",
    timeRange: "10:00 AM – 5:00 PM",
    venue: "Panjim Convention Hall, Miramar",
    city: "Goa",
    price: 799,
    rating: 4.8,
    ratingsCount: "820",
    ageLimit: "18+",
    headliner: {
      name: "Digital Nomad Collective",
      origin: "Lisbon / Goa",
      genre: "Async Teams & AI Tools",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=85",
    description:
      "The ultimate conference for remote software engineers, solopreneurs, and AI founders building while living on the coast.",
    isFeatured: false,
  },
  {
    id: "goa-beach-volleyball",
    title: "Goa Beach Volleyball Pro Cup",
    category: "Sports",
    dateFormatted: "Sunday, 17 August 2025",
    dayNumber: "17",
    monthShort: "AUG",
    timeRange: "3:00 PM – 8:00 PM",
    venue: "Baga Beach Sports Zone, Baga",
    city: "Goa",
    price: 399,
    rating: 4.7,
    ratingsCount: "1.4k",
    ageLimit: "All Ages",
    headliner: {
      name: "Goa Coastal Spikers",
      origin: "Goa",
      genre: "Beach Volleyball Tour",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1000&q=85",
    description:
      "Sun, sand, and spikes! High-energy beach volleyball tournament with international doubles squads and DJ sound system.",
    isFeatured: false,
  },
  {
    id: "goa-comedy-roast",
    title: "Goa Sun & Sarcasm Special",
    category: "Comedy",
    dateFormatted: "Saturday, 23 August 2025",
    dayNumber: "23",
    monthShort: "AUG",
    timeRange: "8:00 PM – 10:00 PM",
    venue: "Cohiba Lounge, Candolim",
    city: "Goa",
    price: 599,
    rating: 4.8,
    ratingsCount: "980",
    ageLimit: "18+",
    headliner: {
      name: "Neville Shah & Friends",
      origin: "Mumbai",
      genre: "Dark & Observational Humor",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1000&q=85",
    description:
      "Intimate evening of beachside comedy, sharp crowd work, and holiday vacation roasts at Candolim.",
    isFeatured: false,
  },

  // ================= DELHI =================
  {
    id: "del-capital-beats",
    title: "Capital Beats Music Festival",
    category: "Music",
    dateFormatted: "Saturday, 05 July 2025",
    dayNumber: "05",
    monthShort: "JUL",
    timeRange: "5:00 PM – 10:30 PM",
    venue: "JLN Stadium, Pragati Vihar",
    city: "Delhi",
    price: 1599,
    rating: 4.9,
    ratingsCount: "4.8k",
    ageLimit: "16+",
    headliner: {
      name: "Divine & Gully Gang",
      origin: "Mumbai / Delhi",
      genre: "Hip-Hop & Urban Beats",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=88",
    description:
      "The capital's biggest live hip-hop and electronic music showcase featuring massive stage production and high-octane energy at JLN.",
    isFeatured: true,
  },
  {
    id: "del-national-ai",
    title: "National AI & Robotics Expo",
    category: "Tech",
    dateFormatted: "Saturday, 19 July 2025",
    dayNumber: "19",
    monthShort: "JUL",
    timeRange: "9:30 AM – 6:00 PM",
    venue: "Bharat Mandapam, Pragati Maidan",
    city: "Delhi",
    price: 999,
    rating: 4.9,
    ratingsCount: "3.1k",
    ageLimit: "All Ages",
    headliner: {
      name: "India AI Mission Keynote",
      origin: "New Delhi",
      genre: "Sovereign AI & Semiconductor",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=85",
    description:
      "Experience humanoid robotics demonstrations, sovereign language model releases, and deeptech investor pitches at Bharat Mandapam.",
    isFeatured: false,
  },
  {
    id: "del-half-marathon",
    title: "Delhi Midnight Half Marathon",
    category: "Sports",
    dateFormatted: "Sunday, 10 August 2025",
    dayNumber: "10",
    monthShort: "AUG",
    timeRange: "10:00 PM – 2:00 AM",
    venue: "India Gate Circuit, Central Delhi",
    city: "Delhi",
    price: 899,
    rating: 4.8,
    ratingsCount: "2.6k",
    ageLimit: "All Ages",
    headliner: {
      name: "Delhi Runners Guild",
      origin: "New Delhi",
      genre: "Midnight Street Marathon",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1000&q=85",
    description:
      "Run past majestic illuminated monuments on wide, cool capital avenues with live cheer stations, glow sticks, and post-run refreshments.",
    isFeatured: false,
  },
  {
    id: "del-roast-special",
    title: "Delhi Roast & Crowd Work",
    category: "Comedy",
    dateFormatted: "Sunday, 27 July 2025",
    dayNumber: "27",
    monthShort: "JUL",
    timeRange: "8:00 PM – 10:00 PM",
    venue: "NCPA Auditorium, Connaught Place",
    city: "Delhi",
    price: 599,
    rating: 4.8,
    ratingsCount: "1.7k",
    ageLimit: "18+",
    headliner: {
      name: "Samay Raina & Gang",
      origin: "Delhi",
      genre: "Dark Humor & Crowd Work",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1000&q=85",
    description:
      "Uncensored crowd interactions, spontaneous roast battles, and unscripted comedy madness in Connaught Place.",
    isFeatured: false,
  },

  // ================= PUNE =================
  {
    id: "pun-valley-music",
    title: "Pune Valley Music Festival",
    category: "Music",
    dateFormatted: "Saturday, 12 July 2025",
    dayNumber: "12",
    monthShort: "JUL",
    timeRange: "5:00 PM – 10:30 PM",
    venue: "Mahalaxmi Lawns, Karve Nagar",
    city: "Pune",
    price: 1299,
    rating: 4.8,
    ratingsCount: "2.8k",
    ageLimit: "16+",
    headliner: {
      name: "When Chai Met Toast",
      origin: "Kochi",
      genre: "Indie Pop & Sunshine Folk",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=88",
    description:
      "Feel the cool monsoon breeze with feel-good acoustic melodies, joyful singalongs, food trucks, and artisan stalls in Karve Nagar.",
    isFeatured: true,
  },
  {
    id: "pun-software-summit",
    title: "Pune Software Architecture Summit",
    category: "Tech",
    dateFormatted: "Saturday, 26 July 2025",
    dayNumber: "26",
    monthShort: "JUL",
    timeRange: "9:30 AM – 5:30 PM",
    venue: "Auto Cluster Center, Pimpri",
    city: "Pune",
    price: 699,
    rating: 4.8,
    ratingsCount: "1.3k",
    ageLimit: "18+",
    headliner: {
      name: "Pune Tech Council",
      origin: "Pune",
      genre: "Microservices & Edge Cloud",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1000&q=85",
    description:
      "Deep dive sessions into microservices resilience, event-driven streaming with Apache Kafka, and enterprise cloud migrations.",
    isFeatured: false,
  },
  {
    id: "pun-monsoon-marathon",
    title: "Pune Monsoon 10K Run",
    category: "Sports",
    dateFormatted: "Sunday, 03 August 2025",
    dayNumber: "03",
    monthShort: "AUG",
    timeRange: "6:00 AM – 9:30 AM",
    venue: "Pashan Lake Track, Pashan",
    city: "Pune",
    price: 599,
    rating: 4.8,
    ratingsCount: "1.9k",
    ageLimit: "All Ages",
    headliner: {
      name: "Sahyadri Trail Runners",
      origin: "Pune",
      genre: "Scenic Lake Marathon",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1000&q=85",
    description:
      "Breathe fresh monsoon air as you sprint along scenic lakeside greenery with timing mats, medals, and hot breakfast.",
    isFeatured: false,
  },
  {
    id: "pun-laugh-lounge",
    title: "Koregaon Laugh Lounge Pune",
    category: "Comedy",
    dateFormatted: "Friday, 08 August 2025",
    dayNumber: "08",
    monthShort: "AUG",
    timeRange: "8:00 PM – 9:30 PM",
    venue: "The Blue Room, Koregaon Park",
    city: "Pune",
    price: 499,
    rating: 4.7,
    ratingsCount: "1.1k",
    ageLimit: "16+",
    headliner: {
      name: "Gaurav Kapoor",
      origin: "Delhi / Mumbai",
      genre: "Everyday Observational Standup",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1000&q=85",
    description:
      "Relatable stories about corporate appraisals, gym memberships, and family WhatsApp groups in a cozy Koregaon Park venue.",
    isFeatured: false,
  },

  // ================= CHENNAI =================
  {
    id: "chn-coastal-gala",
    title: "Chennai Coastal Music Gala",
    category: "Music",
    dateFormatted: "Saturday, 19 July 2025",
    dayNumber: "19",
    monthShort: "JUL",
    timeRange: "6:00 PM – 10:30 PM",
    venue: "YMCA Grounds, Nandanam",
    city: "Chennai",
    price: 1399,
    rating: 4.9,
    ratingsCount: "3.4k",
    ageLimit: "All Ages",
    headliner: {
      name: "Sid Sriram Live",
      origin: "Chennai / Fremont",
      genre: "Carnatic Soul & R&B",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=88",
    description:
      "A magical evening of soulful melodies, acoustic violins, and chart-topping film anthems echoing under the Chennai sky.",
    isFeatured: true,
  },
  {
    id: "chn-saas-titans",
    title: "AI & SaaS Titans Summit Chennai",
    category: "Tech",
    dateFormatted: "Friday, 08 August 2025",
    dayNumber: "08",
    monthShort: "AUG",
    timeRange: "9:00 AM – 5:30 PM",
    venue: "ITC Grand Chola, Guindy",
    city: "Chennai",
    price: 1199,
    rating: 4.8,
    ratingsCount: "1.6k",
    ageLimit: "18+",
    headliner: {
      name: "Chennai SaaS Pioneers",
      origin: "Chennai",
      genre: "B2B SaaS & AI Growth",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=85",
    description:
      "India's SaaS capital convenes to share playbook strategies on scaling cross-border ARR, AI product workflows, and enterprise retention.",
    isFeatured: false,
  },
  {
    id: "chn-marina-run",
    title: "Chennai Marina Sunset Run 10K",
    category: "Sports",
    dateFormatted: "Sunday, 27 July 2025",
    dayNumber: "27",
    monthShort: "JUL",
    timeRange: "5:30 PM – 8:30 PM",
    venue: "Marina Beach Promenade, Triplicane",
    city: "Chennai",
    price: 649,
    rating: 4.8,
    ratingsCount: "2.1k",
    ageLimit: "All Ages",
    headliner: {
      name: "Chennai Coastal Runners",
      origin: "Chennai",
      genre: "Beachfront 10K Challenge",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=85",
    description:
      "Sprint alongside the waves on the world's second-longest beach with refreshing sea breeze, hydration points, and medal presentation.",
    isFeatured: false,
  },
  {
    id: "chn-tanglish-comedy",
    title: "Chennai Tanglish Comedy Night",
    category: "Comedy",
    dateFormatted: "Saturday, 02 August 2025",
    dayNumber: "02",
    monthShort: "AUG",
    timeRange: "7:30 PM – 9:30 PM",
    venue: "Bay 146, Mylapore",
    city: "Chennai",
    price: 499,
    rating: 4.9,
    ratingsCount: "1.4k",
    ageLimit: "16+",
    headliner: {
      name: "Alex in Wonderland & Co",
      origin: "Chennai",
      genre: "Musical Standup & Tanglish Wit",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85",
    },
    image: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1000&q=85",
    description:
      "Super funny cultural observations, Tamil cinema spoofs, and musical comedy in the heart of Mylapore.",
    isFeatured: false,
  },
];

const iconPaths: Record<IconName, React.ReactNode> = {
  arrow: <path d="m15 18-6-6 6-6" />,
  calendar: (
    <>
      <path d="M8 2v4M16 2v4M3 10h18" />
      <rect x="3" y="4" width="18" height="18" rx="3" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  heart: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
  ),
  home: (
    <>
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v11h14V9M9 20v-6h6v6" />
    </>
  ),
  location: (
    <>
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.2 10.8 7.5-4.4M8.2 13.2l7.5 4.4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  ticket: (
    <>
      <path d="M2 9a3 3 0 0 0 0 6v4h20v-4a3 3 0 0 0 0-6V5H2Z" />
      <path d="M13 5v2M13 10v4M13 17v2" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 22a8 8 0 0 1 16 0" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  filter: <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />,
  sparkles: <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />,
  bell: <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      {iconPaths[name]}
    </svg>
  );
}

const categoriesList = [
  { name: "Music" as const, symbol: "♫", color: "violet" },
  { name: "Tech" as const, symbol: "⌁", color: "cyan" },
  { name: "Sports" as const, symbol: "◉", color: "lime" },
  { name: "Comedy" as const, symbol: "☺", color: "orange" },
];

const availableCities = ["All Cities", "Hyderabad", "Bengaluru", "Mumbai", "Goa", "Delhi", "Pune", "Chennai"];

function BottomNav({
  active,
  go,
}: {
  active: Screen;
  go: (screen: Screen) => void;
}) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <button
        className={active === "home" ? "nav-item active" : "nav-item"}
        onClick={() => go("home")}
      >
        <Icon name="home" />
        <span>Home</span>
      </button>
      <button
        className={active === "explore" ? "nav-item active" : "nav-item"}
        onClick={() => go("explore")}
      >
        <Icon name="search" />
        <span>Explore</span>
      </button>
      <button
        className={active === "ticket" ? "nav-item active" : "nav-item"}
        onClick={() => go("ticket")}
      >
        <Icon name="ticket" />
        <span>Tickets</span>
      </button>
      <button
        className={active === "profile" ? "nav-item active" : "nav-item"}
        onClick={() => go("profile")}
      >
        <Icon name="user" />
        <span>Profile</span>
      </button>
    </nav>
  );
}

function QrCode() {
  const cells = useMemo(() => {
    const finder = (x: number, y: number, ox: number, oy: number) => {
      const dx = x - ox;
      const dy = y - oy;
      return (
        dx >= 0 &&
        dx < 7 &&
        dy >= 0 &&
        dy < 7 &&
        (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4))
      );
    };
    return Array.from({ length: 441 }, (_, index) => {
      const x = index % 21;
      const y = Math.floor(index / 21);
      return (
        finder(x, y, 0, 0) ||
        finder(x, y, 14, 0) ||
        finder(x, y, 0, 14) ||
        ((x * 7 + y * 11 + x * y) % 5 < 2 &&
          !((x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)))
      );
    });
  }, []);
  return (
    <div className="qr-code" aria-label="Booking QR code">
      {cells.map((dark, i) => (
        <i className={dark ? "dark" : ""} key={i} />
      ))}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [dark, setDark] = useState(true);

  // App State
  const [events] = useState<EventItem[]>(initialEvents);
  const [currentCity, setCurrentCity] = useState("Hyderabad");
  const [selectedCategory, setSelectedCategory] = useState<CategoryName>("All");
  const [activeEvent, setActiveEvent] = useState<EventItem>(initialEvents[0]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>(["C4", "C5"]);
  const [savedEventIds, setSavedEventIds] = useState<string[]>(["neon-pulse"]);
  const [followedArtists, setFollowedArtists] = useState<string[]>(["Aria Voss"]);
  
  // Modals & Search state
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCheckoutSheet, setShowCheckoutSheet] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [readMoreExpanded, setReadMoreExpanded] = useState(false);
  const [ticketsTab, setTicketsTab] = useState<"upcoming" | "past">("upcoming");

  // Toast System
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // User Tickets List
  const [tickets, setTickets] = useState<BookedTicket[]>([
    {
      id: "TICK-001",
      eventId: "neon-pulse",
      eventTitle: "Neon Pulse Live",
      eventDate: "28 JUNE 2025",
      eventTime: "7:30 PM",
      venue: "HITEX Arena, Madhapur",
      seats: ["C4", "C5"],
      totalPaid: 2998,
      bookingCode: "NPL-8X42-190",
      gate: "Gate 03",
      zone: "Platinum",
      guestName: "Arjun Mehta",
      status: "confirmed",
      image: "https://images.unsplash.com/photo-1771918846209-c536b01e2729?auto=format&fit=crop&w=800&q=85",
    },
    {
      id: "TICK-000",
      eventId: "future-shift",
      eventTitle: "Future Shift 2024",
      eventDate: "14 NOV 2024",
      eventTime: "10:00 AM",
      venue: "HICC Novotel Arena",
      seats: ["A12"],
      totalPaid: 899,
      bookingCode: "FS-7712-A09",
      gate: "Gate 01",
      zone: "Delegate",
      guestName: "Arjun Mehta",
      status: "completed",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=85",
    },
  ]);

  const [activeTicket, setActiveTicket] = useState<BookedTicket>(tickets[0]);

  // Handlers
  const handleOpenEvent = (event: EventItem) => {
    setActiveEvent(event);
    setSelectedSeats(["C4"]);
    setReadMoreExpanded(false);
    setScreen("details");
  };

  const handleToggleSave = (eventId: string) => {
    if (savedEventIds.includes(eventId)) {
      setSavedEventIds((prev) => prev.filter((id) => id !== eventId));
      showToast("Removed from Saved");
    } else {
      setSavedEventIds((prev) => [...prev, eventId]);
      showToast("Saved to Favorites!");
    }
  };

  const handleToggleFollow = (artistName: string) => {
    if (followedArtists.includes(artistName)) {
      setFollowedArtists((prev) => prev.filter((name) => name !== artistName));
      showToast(`Unfollowed ${artistName}`);
    } else {
      setFollowedArtists((prev) => [...prev, artistName]);
      showToast(`Following ${artistName}!`);
    }
  };

  const handleShare = async (title: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} on Luma`,
          text: `Check out ${title} on Luma Event App!`,
          url: window.location.href,
        });
      } catch {
        // user cancelled share
      }
    } else {
      navigator.clipboard.writeText(`${title} - ${window.location.href}`);
      showToast("Event link copied to clipboard!");
    }
  };

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === "LUMA20") {
      setPromoDiscount(0.2);
      showToast("Coupon LUMA20 applied: 20% OFF!");
    } else if (promoCode.trim().toUpperCase() === "VIP50") {
      setPromoDiscount(0.5);
      showToast("VIP code applied: 50% OFF!");
    } else if (promoCode.trim().length > 0) {
      showToast("Invalid promo code. Try 'LUMA20'");
    }
  };

  const handleConfirmBooking = () => {
    const subtotal = selectedSeats.length * activeEvent.price;
    const discountAmount = Math.round(subtotal * promoDiscount);
    const finalAmount = subtotal - discountAmount + 99; // + booking fee

    const randomId = `LUM-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 900)}`;
    const newTicket: BookedTicket = {
      id: `TICK-${Date.now()}`,
      eventId: activeEvent.id,
      eventTitle: activeEvent.title,
      eventDate: activeEvent.dayNumber + " " + activeEvent.monthShort + " 2025",
      eventTime: activeEvent.timeRange.split("–")[0].trim(),
      venue: activeEvent.venue,
      seats: selectedSeats,
      totalPaid: finalAmount,
      bookingCode: randomId,
      gate: "Gate 02",
      zone: selectedSeats.some((s) => s.startsWith("A") || s.startsWith("B")) ? "VIP Gold" : "Platinum",
      guestName: "Arjun Mehta",
      status: "confirmed",
      image: activeEvent.image,
    };

    setTickets((prev) => [newTicket, ...prev]);
    setActiveTicket(newTicket);
    setShowCheckoutSheet(false);
    showToast("Booking Confirmed! Pass Generated.");
    setScreen("ticket");
  };

  const handleCancelTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: "cancelled" } : t))
    );
    showToast("Ticket cancelled successfully.");
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchCity = currentCity === "All Cities" || ev.city.toLowerCase() === currentCity.toLowerCase();
      const matchCategory = selectedCategory === "All" || ev.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.headliner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.city.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCity && matchCategory && matchSearch;
    });
  }, [events, currentCity, selectedCategory, searchQuery]);

  const featuredEvent = useMemo(() => {
    if (currentCity !== "All Cities") {
      const cityFeatured = events.find(
        (e) => e.city.toLowerCase() === currentCity.toLowerCase() && e.isFeatured
      );
      if (cityFeatured) return cityFeatured;
      const cityFirst = events.find(
        (e) => e.city.toLowerCase() === currentCity.toLowerCase()
      );
      if (cityFirst) return cityFirst;
    }
    return events.find((e) => e.isFeatured) || events[0];
  }, [events, currentCity]);

  const seatRows = ["A", "B", "C", "D", "E", "F", "G"];
  const soldSeats = new Set(["A2", "A7", "B5", "B8", "C1", "C6", "D3", "D9", "E2", "E7", "F4", "F8", "G1", "G6"]);

  const toggleSeat = (seat: string) => {
    if (soldSeats.has(seat)) return;
    setSelectedSeats((current) =>
      current.includes(seat) ? current.filter((item) => item !== seat) : [...current, seat]
    );
  };

  const subtotal = selectedSeats.length * activeEvent.price;
  const discountAmount = Math.round(subtotal * promoDiscount);
  const grandTotal = subtotal - discountAmount + (selectedSeats.length > 0 ? 99 : 0);

  return (
    <div className={dark ? "app dark" : "app light"}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast-msg">
            <span className="toast-icon">✦</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Prototype Navigation Sidebar */}
      <aside className="prototype-nav">
        <div className="brand-mark">L</div>
        <div className="prototype-copy">
          <strong>Luma</strong>
          <span>Event discovery, reimagined.</span>
        </div>
        <div className="screen-tabs">
          {(["home", "explore", "details", "seats", "ticket", "profile"] as Screen[]).map(
            (item, index) => (
              <button
                className={screen === item ? "active" : ""}
                key={item}
                onClick={() => setScreen(item)}
              >
                <span>0{index + 1}</span>
                {item === "seats"
                  ? "Seats"
                  : item === "ticket"
                  ? "Ticket Pass"
                  : item[0].toUpperCase() + item.slice(1)}
              </button>
            )
          )}
        </div>
        <button
          className="theme-toggle"
          aria-label="Toggle color mode"
          onClick={() => setDark((value) => !value)}
        >
          <Icon name={dark ? "sun" : "moon"} />
          <span>{dark ? "Light mode" : "Dark mode"}</span>
        </button>
      </aside>

      {/* Main Mobile Screen Frame */}
      <div className="phone-shell">
        <div className="phone-status">
          <span>9:41</span>
          <div>
            <i />
            <i />
            <b />
          </div>
        </div>

        {/* ========================================================
            SCREEN 1: HOME SCREEN
        ======================================================== */}
        {screen === "home" && (
          <div className="screen with-nav">
            <header className="home-header">
              <div>
                <p className="eyebrow">DISCOVER IN</p>
                <button
                  className="location-button"
                  onClick={() => setShowLocationModal(true)}
                  aria-label="Select City"
                >
                  {currentCity} <span>⌄</span>
                </button>
              </div>
              <div
                className="avatar"
                style={{ cursor: "pointer" }}
                onClick={() => setScreen("profile")}
                aria-label="Profile"
              >
                AM
              </div>
            </header>

            <main className="home-content">
              {/* Search Box Trigger */}
              <button
                className="search-box"
                onClick={() => setShowSearchModal(true)}
                aria-label="Open search"
              >
                <Icon name="search" size={21} />
                <span>Search events, artists or venues</span>
              </button>

              {/* Featured Event Section */}
              <section>
                <div className="section-heading">
                  <h2>Featured Events</h2>
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setScreen("explore");
                    }}
                  >
                    See all
                  </button>
                </div>
                <button
                  className="feature-card"
                  onClick={() => handleOpenEvent(featuredEvent)}
                  aria-label={`Featured: ${featuredEvent.title}`}
                >
                  <img src={featuredEvent.image} alt={featuredEvent.title} />
                  <div className="feature-shade" />
                  <div className="feature-badge">FEATURED</div>
                  <div className="feature-copy">
                    <p>
                      {featuredEvent.dayNumber} {featuredEvent.monthShort} ·{" "}
                      {featuredEvent.venue.split(",")[0].toUpperCase()}
                    </p>
                    <h3>{featuredEvent.title}</h3>
                    <span>{featuredEvent.description.slice(0, 50)}...</span>
                  </div>
                  <div
                    className="feature-arrow"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEvent(featuredEvent);
                    }}
                  >
                    <Icon name="chevron" size={18} />
                  </div>
                </button>
              </section>

              {/* Browse Categories Section */}
              <section>
                <div className="section-heading">
                  <h2>Browse Categories</h2>
                </div>
                <div className="categories">
                  <button
                    className={`category ${selectedCategory === "All" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("All")}
                  >
                    <span className="category-icon" style={{ background: "var(--accent)" }}>
                      ★
                    </span>
                    <span>All</span>
                  </button>
                  {categoriesList.map((category) => (
                    <button
                      className={`category ${category.color} ${
                        selectedCategory === category.name ? "active" : ""
                      }`}
                      key={category.name}
                      onClick={() =>
                        setSelectedCategory(
                          selectedCategory === category.name ? "All" : category.name
                        )
                      }
                    >
                      <span className="category-icon">{category.symbol}</span>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Recommended For You Section */}
              <section>
                <div className="section-heading">
                  <h2>Recommended for you</h2>
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setScreen("explore");
                    }}
                  >
                    View all
                  </button>
                </div>

                <div className="event-list">
                  {filteredEvents.map((event) => (
                    <button
                      className="event-card"
                      key={event.id}
                      onClick={() => handleOpenEvent(event)}
                    >
                      <img src={event.image} alt={event.title} />
                      <div className="event-info">
                        <div className="date-box">
                          <b>{event.dayNumber}</b>
                          <span>{event.monthShort}</span>
                        </div>
                        <div>
                          <h3>{event.title}</h3>
                          <p>
                            {event.timeRange.split("–")[0]} · {event.venue.split(",")[0]}
                          </p>
                          <strong>From ₹{event.price.toLocaleString("en-IN")}</strong>
                        </div>
                      </div>
                    </button>
                  ))}
                  {filteredEvents.length === 0 && (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px 0", color: "var(--muted)", fontSize: "11px" }}>
                      No events found matching current filters.
                    </div>
                  )}
                </div>
              </section>
            </main>
          </div>
        )}

        {/* ========================================================
            SCREEN 2: EXPLORE SCREEN
        ======================================================== */}
        {screen === "explore" && (
          <div className="screen explore-screen with-nav">
            <div className="explore-header">
              <h1>Explore Events</h1>
              <p style={{ margin: "4px 0 12px", color: "var(--muted)", fontSize: "11px" }}>
                Find live concerts, tech expos, comedy specials & matches.
              </p>
            </div>

            {/* Live Search Input */}
            <div className="search-input-wrapper">
              <Icon name="search" size={18} />
              <input
                type="text"
                placeholder="Search events, genres, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="categories" style={{ marginBottom: "14px" }}>
              <button
                className={`category ${selectedCategory === "All" ? "active" : ""}`}
                onClick={() => setSelectedCategory("All")}
              >
                <span className="category-icon" style={{ background: "var(--accent)" }}>★</span>
                <span>All</span>
              </button>
              {categoriesList.map((cat) => (
                <button
                  className={`category ${cat.color} ${selectedCategory === cat.name ? "active" : ""}`}
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  <span className="category-icon">{cat.symbol}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* City Selector & Info */}
            <div className="explore-filters-bar">
              <select
                className="filter-select"
                value={currentCity}
                onChange={(e) => setCurrentCity(e.target.value)}
              >
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    📍 {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Events Grid */}
            <div className="event-list" style={{ marginTop: "12px" }}>
              {filteredEvents.map((event) => (
                <button
                  className="event-card"
                  key={event.id}
                  onClick={() => handleOpenEvent(event)}
                >
                  <img src={event.image} alt={event.title} />
                  <div className="event-info">
                    <div className="date-box">
                      <b>{event.dayNumber}</b>
                      <span>{event.monthShort}</span>
                    </div>
                    <div>
                      <h3>{event.title}</h3>
                      <p>
                        {event.timeRange.split("–")[0]} · {event.city}
                      </p>
                      <strong>From ₹{event.price.toLocaleString("en-IN")}</strong>
                    </div>
                  </div>
                </button>
              ))}
              {filteredEvents.length === 0 && (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 0", color: "var(--muted)", fontSize: "12px" }}>
                  <p>No events found for "{searchQuery}" in {currentCity}.</p>
                  <button
                    className="location-item"
                    style={{ margin: "10px auto", maxWidth: "160px" }}
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                      setCurrentCity("All Cities");
                    }}
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 3: DETAILS SCREEN
        ======================================================== */}
        {screen === "details" && (
          <div className="screen detail-screen">
            <div className="detail-hero">
              <img src={activeEvent.image} alt={activeEvent.title} />
              <div className="hero-overlay" />
              <div className="detail-actions">
                <button aria-label="Back" onClick={() => setScreen("home")}>
                  <Icon name="arrow" />
                </button>
                <div>
                  <button
                    aria-label="Share"
                    onClick={() => handleShare(activeEvent.title)}
                  >
                    <Icon name="share" />
                  </button>
                  <button
                    aria-label="Save"
                    onClick={() => handleToggleSave(activeEvent.id)}
                    style={{
                      color: savedEventIds.includes(activeEvent.id) ? "var(--accent)" : "white",
                    }}
                  >
                    <Icon name="heart" />
                  </button>
                </div>
              </div>
              <div className="detail-label">
                <span /> {activeEvent.category.toUpperCase()} · LIVE EXPERIENCE
              </div>
            </div>

            <main className="detail-content">
              <h1>{activeEvent.title}</h1>
              <div className="rating-row">
                <span className="rating">★ {activeEvent.rating}</span>
                <span>{activeEvent.ratingsCount} ratings</span>
                <span className="age">{activeEvent.ageLimit}</span>
              </div>

              <div className="info-stack">
                <div className="info-row">
                  <span className="info-icon">
                    <Icon name="calendar" />
                  </span>
                  <div>
                    <strong>{activeEvent.dateFormatted}</strong>
                    <p>{activeEvent.timeRange}</p>
                  </div>
                </div>
                <div className="info-row">
                  <span className="info-icon">
                    <Icon name="location" />
                  </span>
                  <div>
                    <strong>{activeEvent.venue}</strong>
                    <p>{activeEvent.city}, India</p>
                  </div>
                  <Icon name="chevron" size={18} />
                </div>
              </div>

              <div className="divider" />
              <section className="about">
                <h2>About the event</h2>
                <p>
                  {readMoreExpanded
                    ? activeEvent.description +
                      " Featuring state-of-the-art acoustics, VIP hospitality lounges, immersive stage production, and dedicated merchandise booths. Book your tickets early to ensure prime seating tiers."
                    : activeEvent.description}
                </p>
                <button onClick={() => setReadMoreExpanded((v) => !v)}>
                  {readMoreExpanded ? "Read less" : "Read more"}
                </button>
              </section>

              {/* Headliner Artist Card */}
              <section className="artist-card">
                <img src={activeEvent.headliner.image} alt={activeEvent.headliner.name} />
                <div>
                  <span>HEADLINER</span>
                  <strong>{activeEvent.headliner.name}</strong>
                  <p>
                    {activeEvent.headliner.origin} · {activeEvent.headliner.genre}
                  </p>
                </div>
                <button
                  onClick={() => handleToggleFollow(activeEvent.headliner.name)}
                  style={{
                    background: followedArtists.includes(activeEvent.headliner.name)
                      ? "var(--accent)"
                      : "var(--surface-2)",
                    color: followedArtists.includes(activeEvent.headliner.name)
                      ? "#101117"
                      : "var(--text)",
                  }}
                >
                  {followedArtists.includes(activeEvent.headliner.name) ? "Following" : "Follow"}
                </button>
              </section>
            </main>

            <div className="sticky-cta">
              <div>
                <span>Starts from</span>
                <strong>₹{activeEvent.price.toLocaleString("en-IN")}</strong>
              </div>
              <button onClick={() => setScreen("seats")}>
                Book Now <Icon name="chevron" size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 4: SEATS SCREEN
        ======================================================== */}
        {screen === "seats" && (
          <div className="screen seat-screen">
            <header className="simple-header">
              <button aria-label="Back" onClick={() => setScreen("details")}>
                <Icon name="arrow" />
              </button>
              <div>
                <h1>Select seats</h1>
                <p>
                  {activeEvent.title} · {activeEvent.dayNumber} {activeEvent.monthShort}
                </p>
              </div>
              <button
                className="help"
                onClick={() =>
                  showToast("Tap any available seat to select or deselect.")
                }
              >
                ?
              </button>
            </header>

            <main className="seat-content">
              <div className="screen-display">
                <div />
                <span>STAGE</span>
              </div>
              <p className="stage-note">All eyes this way</p>

              <div className="seat-map">
                {seatRows.map((row) => (
                  <div className="seat-row" key={row}>
                    <span>{row}</span>
                    {Array.from({ length: 9 }, (_, index) => {
                      const seat = `${row}${index + 1}`;
                      const state = soldSeats.has(seat)
                        ? "sold"
                        : selectedSeats.includes(seat)
                        ? "selected"
                        : "";
                      return (
                        <button
                          aria-label={`Seat ${seat}${state ? `, ${state}` : ", available"}`}
                          className={`seat ${state} ${index === 4 ? "aisle" : ""}`}
                          disabled={state === "sold"}
                          key={seat}
                          onClick={() => toggleSeat(seat)}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                    <span>{row}</span>
                  </div>
                ))}
              </div>

              <div className="legend">
                <span>
                  <i className="available" />
                  Available
                </span>
                <span>
                  <i className="selected" />
                  Selected
                </span>
                <span>
                  <i className="sold" />
                  Sold
                </span>
              </div>
            </main>

            <div className="seat-sheet">
              <div className="grabber" />
              <div className="selection-summary">
                <div>
                  <span>
                    {selectedSeats.length || 0}{" "}
                    {selectedSeats.length === 1 ? "ticket" : "tickets"} selected
                  </span>
                  <strong>
                    {selectedSeats.length ? selectedSeats.join(", ") : "Choose your seats"}
                  </strong>
                </div>
                <div>
                  <span>Subtotal</span>
                  <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
                </div>
              </div>
              <button
                disabled={!selectedSeats.length}
                onClick={() => setShowCheckoutSheet(true)}
              >
                Continue to Checkout <Icon name="chevron" size={18} />
              </button>
              <p>Taxes and venue convenience fee calculated at checkout</p>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 5: TICKET PASS SCREEN
        ======================================================== */}
        {screen === "ticket" && (
          <div className="screen ticket-screen with-nav">
            <header className="simple-header ticket-header">
              <button aria-label="Back" onClick={() => setScreen("home")}>
                <Icon name="arrow" />
              </button>
              <div>
                <h1>Your Ticket</h1>
                <p>Ready for venue entry</p>
              </div>
              <button
                aria-label="Share ticket"
                onClick={() => handleShare(activeTicket.eventTitle)}
              >
                <Icon name="share" />
              </button>
            </header>

            <main className="ticket-content">
              <div className="ticket-status">
                <i /> BOOKING CONFIRMED
              </div>
              <div className="pass">
                <div className="pass-event">
                  <img src={activeTicket.image} alt={activeTicket.eventTitle} />
                  <div>
                    <span>{activeTicket.eventDate.toUpperCase()}</span>
                    <h2>{activeTicket.eventTitle}</h2>
                    <p>
                      {activeTicket.venue} · {activeTicket.eventTime}
                    </p>
                  </div>
                </div>
                <div className="perforation">
                  <span />
                  <i />
                  <span />
                </div>
                <div className="pass-code">
                  <QrCode />
                  <strong>Scan at entry gate</strong>
                  <p>Keep the code clearly visible at scanner</p>
                </div>
                <div className="ticket-meta">
                  <div>
                    <span>GUEST</span>
                    <strong>{activeTicket.guestName}</strong>
                  </div>
                  <div>
                    <span>SEATS</span>
                    <strong>{activeTicket.seats.join(", ")}</strong>
                  </div>
                  <div>
                    <span>ZONE</span>
                    <strong>{activeTicket.zone}</strong>
                  </div>
                  <div>
                    <span>GATE</span>
                    <strong>{activeTicket.gate}</strong>
                  </div>
                </div>
                <div className="booking-id">
                  <span>BOOKING ID</span>
                  <strong>{activeTicket.bookingCode}</strong>
                </div>
              </div>
              <p className="ticket-hint">
                Present this digital pass at the venue entrance. Works offline too.
              </p>
            </main>
          </div>
        )}

        {/* ========================================================
            SCREEN 6: PROFILE & TICKETS MANAGEMENT
        ======================================================== */}
        {screen === "profile" && (
          <div className="screen profile-screen with-nav">
            <div className="profile-card">
              <div className="profile-avatar-large">AM</div>
              <div className="profile-details">
                <h2>Arjun Mehta</h2>
                <p>arjun.mehta@example.com</p>
                <span className="badge-vip">★ VIP MEMBER</span>
              </div>
            </div>

            {/* Profile Quick Stats */}
            <div className="profile-stats-row">
              <div className="stat-box">
                <strong>{tickets.length}</strong>
                <span>Tickets</span>
              </div>
              <div className="stat-box">
                <strong>{savedEventIds.length}</strong>
                <span>Saved</span>
              </div>
              <div className="stat-box">
                <strong>{followedArtists.length}</strong>
                <span>Following</span>
              </div>
            </div>

            {/* User Bookings Management Tab */}
            <h3 style={{ margin: "0 0 10px", fontSize: "14px" }}>My Bookings</h3>
            <div className="tab-toggle-group">
              <button
                className={`tab-toggle-btn ${ticketsTab === "upcoming" ? "active" : ""}`}
                onClick={() => setTicketsTab("upcoming")}
              >
                Upcoming ({tickets.filter((t) => t.status === "confirmed").length})
              </button>
              <button
                className={`tab-toggle-btn ${ticketsTab === "past" ? "active" : ""}`}
                onClick={() => setTicketsTab("past")}
              >
                History ({tickets.filter((t) => t.status !== "confirmed").length})
              </button>
            </div>

            {/* Ticket Cards List */}
            <div style={{ marginBottom: "24px" }}>
              {tickets
                .filter((t) =>
                  ticketsTab === "upcoming"
                    ? t.status === "confirmed"
                    : t.status !== "confirmed"
                )
                .map((t) => (
                  <div className="ticket-history-card" key={t.id}>
                    <div className="ticket-history-top">
                      <div>
                        <h3>{t.eventTitle}</h3>
                        <p>
                          {t.eventDate} · {t.seats.join(", ")}
                        </p>
                      </div>
                      <span
                        className={`ticket-status-badge ${
                          t.status === "confirmed" ? "confirmed" : "completed"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <div className="ticket-history-actions">
                      <button
                        className="btn-view-pass"
                        onClick={() => {
                          setActiveTicket(t);
                          setScreen("ticket");
                        }}
                      >
                        View Digital Pass
                      </button>
                      {t.status === "confirmed" && (
                        <button
                          className="btn-cancel-ticket"
                          onClick={() => handleCancelTicket(t.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              {tickets.filter((t) =>
                ticketsTab === "upcoming" ? t.status === "confirmed" : t.status !== "confirmed"
              ).length === 0 && (
                <div style={{ textAlign: "center", padding: "16px", color: "var(--muted)", fontSize: "11px" }}>
                  No {ticketsTab} bookings found.
                </div>
              )}
            </div>

            {/* Preferences / Settings Menu */}
            <h3 style={{ margin: "0 0 10px", fontSize: "14px" }}>Preferences</h3>
            <div className="profile-menu">
              <div
                className="profile-menu-item"
                onClick={() => setDark((prev) => !prev)}
              >
                <div className="profile-menu-left">
                  <Icon name={dark ? "sun" : "moon"} size={16} />
                  <span>Theme: {dark ? "Dark Mode" : "Light Mode"}</span>
                </div>
                <Icon name="chevron" size={14} />
              </div>

              <div
                className="profile-menu-item"
                onClick={() => setShowLocationModal(true)}
              >
                <div className="profile-menu-left">
                  <Icon name="location" size={16} />
                  <span>Preferred City: {currentCity}</span>
                </div>
                <Icon name="chevron" size={14} />
              </div>

              <div
                className="profile-menu-item"
                onClick={() => showToast("Notifications enabled for booking updates!")}
              >
                <div className="profile-menu-left">
                  <Icon name="bell" size={16} />
                  <span>Push Notifications</span>
                </div>
                <span style={{ color: "var(--accent)", fontSize: "10px", fontWeight: 700 }}>ON</span>
              </div>

              <div
                className="profile-menu-item"
                onClick={() => showToast("Account security verified & active.")}
              >
                <div className="profile-menu-left">
                  <Icon name="shield" size={16} />
                  <span>Security & Privacy</span>
                </div>
                <Icon name="chevron" size={14} />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL 1: LOCATION PICKER
        ======================================================== */}
        {showLocationModal && (
          <div className="modal-backdrop" onClick={() => setShowLocationModal(false)}>
            <div
              className="bottom-modal-sheet"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Select Location</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowLocationModal(false)}
                >
                  ✕
                </button>
              </div>
              <div className="location-list">
                {availableCities.map((city) => (
                  <button
                    className={`location-item ${currentCity === city ? "selected" : ""}`}
                    key={city}
                    onClick={() => {
                      setCurrentCity(city);
                      setShowLocationModal(false);
                      showToast(`Location set to ${city}`);
                    }}
                  >
                    <span>📍 {city}</span>
                    {currentCity === city && <Icon name="check" size={16} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL 2: LIVE SEARCH OVERLAY
        ======================================================== */}
        {showSearchModal && (
          <div className="search-modal-container">
            <div className="modal-header" style={{ marginBottom: "12px" }}>
              <h3>Search Events</h3>
              <button
                className="close-btn"
                onClick={() => setShowSearchModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="search-input-wrapper">
              <Icon name="search" size={18} />
              <input
                autoFocus
                type="text"
                placeholder="Search artists, tech summits, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Popular Search Tag Pills */}
            <div className="search-tags">
              {["Neon Pulse", "AI Summit", "Electronic", "Comedy", "Hyderabad", "Bengaluru"].map(
                (tag) => (
                  <button
                    className="search-tag-chip"
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                  >
                    #{tag}
                  </button>
                )
              )}
            </div>

            {/* Live Search Results */}
            <div className="event-list">
              {filteredEvents.map((event) => (
                <button
                  className="event-card"
                  key={event.id}
                  onClick={() => {
                    setShowSearchModal(false);
                    handleOpenEvent(event);
                  }}
                >
                  <img src={event.image} alt={event.title} />
                  <div className="event-info">
                    <div className="date-box">
                      <b>{event.dayNumber}</b>
                      <span>{event.monthShort}</span>
                    </div>
                    <div>
                      <h3>{event.title}</h3>
                      <p>
                        {event.timeRange.split("–")[0]} · {event.city}
                      </p>
                      <strong>From ₹{event.price.toLocaleString("en-IN")}</strong>
                    </div>
                  </div>
                </button>
              ))}
              {filteredEvents.length === 0 && (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "30px 0", color: "var(--muted)", fontSize: "11px" }}>
                  No matching events found. Try another search.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL 3: CHECKOUT & PAYMENT BOTTOM SHEET
        ======================================================== */}
        {showCheckoutSheet && (
          <div className="modal-backdrop" onClick={() => setShowCheckoutSheet(false)}>
            <div
              className="bottom-modal-sheet"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Order Summary & Payment</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowCheckoutSheet(false)}
                >
                  ✕
                </button>
              </div>

              <div style={{ fontSize: "12px", marginBottom: "8px" }}>
                <strong>{activeEvent.title}</strong>
                <p style={{ margin: "2px 0 0", color: "var(--muted)", fontSize: "10px" }}>
                  Seats: {selectedSeats.join(", ")} · {activeEvent.dateFormatted}
                </p>
              </div>

              {/* Promo Code Input */}
              <div className="promo-input-group">
                <input
                  type="text"
                  placeholder="PROMO CODE (e.g. LUMA20)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button onClick={applyPromo}>Apply</button>
              </div>

              {/* Price Breakdown */}
              <div className="checkout-breakdown">
                <div className="checkout-row">
                  <span>Tickets ({selectedSeats.length} × ₹{activeEvent.price})</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="checkout-row" style={{ color: "var(--accent)" }}>
                    <span>Promo Discount ({promoDiscount * 100}%)</span>
                    <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="checkout-row">
                  <span>Booking & Handling Fee</span>
                  <span>₹99</span>
                </div>
                <div className="checkout-row total">
                  <span>Total Amount</span>
                  <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div style={{ fontSize: "11px", fontWeight: 700, marginBottom: "8px" }}>
                Select Payment Method
              </div>
              <div className="payment-method-selector">
                <button
                  className={`pay-method-btn ${paymentMethod === "upi" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("upi")}
                >
                  <span>⚡ Instant UPI</span>
                </button>
                <button
                  className={`pay-method-btn ${paymentMethod === "card" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <span>💳 Card / NetBanking</span>
                </button>
              </div>

              <button
                className="seat-sheet"
                style={{
                  position: "static",
                  height: "48px",
                  borderRadius: "14px",
                  background: "var(--accent)",
                  color: "#101117",
                  fontWeight: 800,
                  fontSize: "12px",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: "pointer",
                  border: "none",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                }}
                onClick={handleConfirmBooking}
              >
                Pay ₹{grandTotal.toLocaleString("en-IN")} & Confirm Booking
              </button>
            </div>
          </div>
        )}

        {/* Persistent Bottom Navigation pinned to bottom of phone frame */}
        {(screen === "home" || screen === "explore" || screen === "ticket" || screen === "profile") && (
          <BottomNav active={screen} go={setScreen} />
        )}

        <div className="home-indicator" />
      </div>
    </div>
  );
}
