import cover1 from "@/assets/community-cover-1.jpg";
import cover2 from "@/assets/community-cover-2.jpg";
import cover3 from "@/assets/community-cover-3.jpg";
import cover4 from "@/assets/community-cover-4.jpg";
import cover5 from "@/assets/community-cover-5.jpg";
import postImage1 from "@/assets/post-image-1.jpg";
import postImage2 from "@/assets/post-image-2.jpg";

/**
 * Placeholder community content. Every export here is typed and read through a
 * small set of accessor functions, so a real backend can replace this module
 * without touching the UI layer.
 */

export type CommunityCategory =
  | "Leadership"
  | "Expeditions"
  | "Alumni"
  | "Study"
  | "Sustainability"
  | "Centres"
  | "Technology";

export const CATEGORIES: CommunityCategory[] = [
  "Leadership",
  "Expeditions",
  "Alumni",
  "Study",
  "Sustainability",
  "Centres",
  "Technology",
];

export type AwardLevel = "Bronze" | "Silver" | "Gold" | "Completed" | null;

export type AwardRole =
  | "Participant"
  | "Award Leader"
  | "Assessor"
  | "Alumni"
  | "Award Centre"
  | "University partner"
  | "Volunteer coordinator";

export interface Moderator {
  id: string;
  name: string;
  role: AwardRole;
  country: string;
}

export interface CommunityMember {
  id: string;
  name: string;
  username: string;
  role: AwardRole;
  country: string;
  level: AwardLevel;
}

export interface Community {
  id: string;
  name: string;
  handle: string;
  category: CommunityCategory;
  description: string;
  members: number;
  cover: string;
  logoInitials: string;
  featured?: boolean;
  rules: string[];
  moderators: Moderator[];
}

export type PostBody =
  | { type: "text" }
  | { type: "image"; image: string; alt: string }
  | { type: "poll"; question: string; options: { id: string; label: string; votes: number }[] };

export interface CommunityPost {
  id: string;
  communityId: string;
  author: string;
  authorMeta: string;
  time: string;
  text: string;
  body: PostBody;
  reactions: { like: number; celebrate: number; support: number };
  comments: number;
  shares: number;
}

const SHARED_RULES = [
  "Be respectful. This is a global network of participants, leaders and partners.",
  "Keep posts relevant to the Award and this community's focus.",
  "Never share personal data about minors. Protect participant privacy.",
  "Credit sources when you share resources, routes or templates.",
];

export const COMMUNITIES: Community[] = [
  {
    id: "leadership",
    name: "Leadership & Personal Development",
    handle: "@leadership",
    category: "Leadership",
    description:
      "A peer network for Award Leaders and mentors: programme design, participant support and reflective practice.",
    members: 12420,
    cover: cover1,
    logoInitials: "LP",
    featured: true,
    rules: [
      ...SHARED_RULES,
      "Share outcomes, not just opinions — tell us what actually worked at your centre.",
    ],
    moderators: [
      { id: "mod-1", name: "Amara Okonkwo", role: "Award Leader", country: "Nigeria" },
      { id: "mod-2", name: "James Whitfield", role: "Assessor", country: "United Kingdom" },
      { id: "mod-3", name: "Mei Ling Tan", role: "Award Leader", country: "Singapore" },
    ],
  },
  {
    id: "expeditions",
    name: "Award Expeditions",
    handle: "@expeditions",
    category: "Expeditions",
    description:
      "Route plans, kit lists, safety practice and Adventurous Journey stories from Bronze through Gold.",
    members: 8110,
    cover: cover2,
    logoInitials: "AE",
    featured: true,
    rules: [
      ...SHARED_RULES,
      "Always post the supervision and risk-assessment context alongside a route.",
      "No unsupervised route recommendations for participants under 16.",
    ],
    moderators: [
      { id: "mod-4", name: "Diego Fernández", role: "Assessor", country: "Chile" },
      { id: "mod-5", name: "Ingrid Halvorsen", role: "Award Leader", country: "Norway" },
    ],
  },
  {
    id: "alumni",
    name: "DofE Alumni Network",
    handle: "@alumni",
    category: "Alumni",
    description:
      "Life after the Award — careers, mentorship, reunions and giving back to the next generation of participants.",
    members: 21730,
    cover: cover3,
    logoInitials: "AN",
    featured: true,
    rules: [
      ...SHARED_RULES,
      "Job and mentoring offers are welcome. Recruitment spam is not.",
    ],
    moderators: [
      { id: "mod-6", name: "Priya Raghavan", role: "Alumni", country: "India" },
      { id: "mod-7", name: "Tomás Duarte", role: "Alumni", country: "Portugal" },
    ],
  },
  {
    id: "scholarships",
    name: "University & Scholarships",
    handle: "@scholarships",
    category: "Study",
    description:
      "Recognition schemes, scholarship deadlines and application guidance from universities that value the Award.",
    members: 5340,
    cover: cover5,
    logoInitials: "US",
    featured: true,
    rules: [
      ...SHARED_RULES,
      "Post the official source link for every scholarship or deadline you share.",
      "No paid agents, consultants or application-writing services.",
    ],
    moderators: [
      { id: "mod-8", name: "Dr. Helen Adeyemi", role: "University partner", country: "Ghana" },
      { id: "mod-9", name: "Sofia Rossi", role: "University partner", country: "Italy" },
    ],
  },
  {
    id: "sustainability",
    name: "Sustainability & Volunteering",
    handle: "@sustainability",
    category: "Sustainability",
    description:
      "Climate, conservation and community service projects run by Award participants and centres worldwide.",
    members: 6980,
    cover: cover2,
    logoInitials: "SV",
    rules: [
      ...SHARED_RULES,
      "Log volunteering hours honestly — assessors read this community too.",
    ],
    moderators: [
      { id: "mod-10", name: "Lucas Silva", role: "Volunteer coordinator", country: "Brazil" },
      { id: "mod-11", name: "Grace Wanjiru", role: "Award Leader", country: "Kenya" },
    ],
  },
  {
    id: "centres",
    name: "Award Centres",
    handle: "@centres",
    category: "Centres",
    description:
      "Operational support for licensed centres: quality assurance, licensing updates and centre-to-centre collaboration.",
    members: 2160,
    cover: cover3,
    logoInitials: "AC",
    rules: [
      ...SHARED_RULES,
      "Centre-to-centre only. Participant queries belong in the other communities.",
    ],
    moderators: [
      { id: "mod-12", name: "Nairobi Award Centre", role: "Award Centre", country: "Kenya" },
      { id: "mod-13", name: "Noah Bergström", role: "Award Centre", country: "Sweden" },
    ],
  },
  {
    id: "technology",
    name: "Technology & Innovation",
    handle: "@technology",
    category: "Technology",
    description:
      "Digital tools, apps and data practice that make running and completing the Award simpler for everyone.",
    members: 4415,
    cover: cover4,
    logoInitials: "TI",
    rules: [
      ...SHARED_RULES,
      "Disclose it clearly when you built or work on the tool you are sharing.",
    ],
    moderators: [
      { id: "mod-14", name: "Aisha Rahman", role: "Award Leader", country: "Malaysia" },
      { id: "mod-15", name: "Marcus Chen", role: "Alumni", country: "Canada" },
    ],
  },
];

/** Communities the signed-in member has joined by default. */
export const DEFAULT_JOINED = ["leadership", "expeditions", "alumni"];

export const POSTS: CommunityPost[] = [
  // Leadership & Personal Development
  {
    id: "p-lead-1",
    communityId: "leadership",
    author: "Amara Okonkwo",
    authorMeta: "Award Leader · Nigeria",
    time: "2h",
    text: "Our centre restructured how we run Skills check-ins — fortnightly 15-minute voice notes instead of monthly forms. Drop-off fell by a third this term.",
    body: { type: "text" },
    reactions: { like: 214, celebrate: 48, support: 19 },
    comments: 32,
    shares: 11,
  },
  {
    id: "p-lead-2",
    communityId: "leadership",
    author: "Mei Ling Tan",
    authorMeta: "Award Leader · Singapore",
    time: "9h",
    text: "Reminder for new leaders: the hardest part of the Gold Residential isn't logistics, it's the first conversation with parents. Happy to share the briefing deck we use.",
    body: { type: "text" },
    reactions: { like: 168, celebrate: 21, support: 57 },
    comments: 44,
    shares: 23,
  },
  {
    id: "p-lead-3",
    communityId: "leadership",
    author: "Leadership & Personal Development",
    authorMeta: "Community poll · Global",
    time: "1d",
    text: "Planning next quarter's leader clinics. What should we cover first?",
    body: {
      type: "poll",
      question: "Which clinic would help your centre most?",
      options: [
        { id: "o1", label: "Recruiting adult volunteers", votes: 318 },
        { id: "o2", label: "Supporting participants with SEND", votes: 522 },
        { id: "o3", label: "Assessor reports that pass first time", votes: 264 },
        { id: "o4", label: "Retention between Bronze and Silver", votes: 411 },
      ],
    },
    reactions: { like: 96, celebrate: 12, support: 8 },
    comments: 41,
    shares: 6,
  },
  {
    id: "p-lead-4",
    communityId: "leadership",
    author: "James Whitfield",
    authorMeta: "Assessor · United Kingdom",
    time: "3d",
    text: "Assessor perspective: the strongest Gold reports I read this year all had one thing in common — the participant wrote about a setback and what changed afterwards.",
    body: { type: "text" },
    reactions: { like: 402, celebrate: 63, support: 31 },
    comments: 58,
    shares: 37,
  },

  // Award Expeditions
  {
    id: "p-exp-1",
    communityId: "expeditions",
    author: "Diego Fernández",
    authorMeta: "Assessor · Chile",
    time: "4h",
    text: "Practice journey in the Andes foothills this weekend. Sunrise on day two, all six navigating unaided by the final leg.",
    body: {
      type: "image",
      image: postImage2,
      alt: "A hiker with a backpack on a mountain ridge at sunrise",
    },
    reactions: { like: 634, celebrate: 208, support: 44 },
    comments: 71,
    shares: 29,
  },
  {
    id: "p-exp-2",
    communityId: "expeditions",
    author: "Award Expeditions",
    authorMeta: "Community poll · Global",
    time: "1d",
    text: "Building the next practice journey guide — what should we write first?",
    body: {
      type: "poll",
      question: "Which topic matters most right now?",
      options: [
        { id: "o1", label: "Navigation without GPS", votes: 412 },
        { id: "o2", label: "Lightweight kit on a budget", votes: 638 },
        { id: "o3", label: "Group risk assessment", votes: 291 },
        { id: "o4", label: "Nutrition and hydration", votes: 174 },
      ],
    },
    reactions: { like: 118, celebrate: 14, support: 9 },
    comments: 52,
    shares: 12,
  },
  {
    id: "p-exp-3",
    communityId: "expeditions",
    author: "Ingrid Halvorsen",
    authorMeta: "Award Leader · Norway",
    time: "2d",
    text: "Kit tip that saves groups the most weight: one shared stove per three participants, not per tent. We shaved 1.8kg per person last season.",
    body: { type: "text" },
    reactions: { like: 287, celebrate: 33, support: 25 },
    comments: 46,
    shares: 61,
  },

  // DofE Alumni Network
  {
    id: "p-alum-1",
    communityId: "alumni",
    author: "Priya Raghavan",
    authorMeta: "Gold alumni · India",
    time: "6h",
    text: "Ten of us are running free CV clinics for Award holders next month. Comment if you'd like a slot — leaders are welcome too.",
    body: { type: "text" },
    reactions: { like: 331, celebrate: 74, support: 122 },
    comments: 87,
    shares: 25,
  },
  {
    id: "p-alum-2",
    communityId: "alumni",
    author: "Tomás Duarte",
    authorMeta: "Gold alumni · Portugal",
    time: "1d",
    text: "Eight years after my Gold expedition I still use the same planning habit at work: agree the turnaround time before you set off. Interviewers love that story.",
    body: { type: "text" },
    reactions: { like: 245, celebrate: 51, support: 18 },
    comments: 29,
    shares: 14,
  },
  {
    id: "p-alum-3",
    communityId: "alumni",
    author: "DofE Alumni Network",
    authorMeta: "Community poll · Global",
    time: "4d",
    text: "Planning the first global alumni meet-up. Where should we host it?",
    body: {
      type: "poll",
      question: "Host city for the 2026 alumni meet-up?",
      options: [
        { id: "o1", label: "Nairobi", votes: 731 },
        { id: "o2", label: "London", votes: 688 },
        { id: "o3", label: "Kuala Lumpur", votes: 502 },
        { id: "o4", label: "São Paulo", votes: 447 },
      ],
    },
    reactions: { like: 204, celebrate: 96, support: 22 },
    comments: 133,
    shares: 48,
  },

  // University & Scholarships
  {
    id: "p-sch-1",
    communityId: "scholarships",
    author: "Dr. Helen Adeyemi",
    authorMeta: "University partner · Ghana",
    time: "3h",
    text: "Applications for the Commonwealth Award Recognition Bursary close on 30 September. Gold holders get an automatic interview shortlist — official link in the comments.",
    body: { type: "text" },
    reactions: { like: 489, celebrate: 143, support: 37 },
    comments: 96,
    shares: 154,
  },
  {
    id: "p-sch-2",
    communityId: "scholarships",
    author: "Sofia Rossi",
    authorMeta: "University partner · Italy",
    time: "2d",
    text: "Admissions tip: put the Award in your personal statement as evidence, not as a title. One specific paragraph about your Service section beats a list of achievements.",
    body: { type: "text" },
    reactions: { like: 356, celebrate: 42, support: 28 },
    comments: 61,
    shares: 88,
  },
  {
    id: "p-sch-3",
    communityId: "scholarships",
    author: "University & Scholarships",
    authorMeta: "Community poll · Global",
    time: "5d",
    text: "Next live Q&A session — pick the theme.",
    body: {
      type: "poll",
      question: "What should the next admissions Q&A cover?",
      options: [
        { id: "o1", label: "Writing the personal statement", votes: 604 },
        { id: "o2", label: "Funding and bursaries", votes: 812 },
        { id: "o3", label: "Studying abroad logistics", votes: 355 },
      ],
    },
    reactions: { like: 121, celebrate: 19, support: 11 },
    comments: 38,
    shares: 17,
  },

  // Sustainability & Volunteering
  {
    id: "p-sus-1",
    communityId: "sustainability",
    author: "Lucas Silva",
    authorMeta: "Gold participant · Brazil",
    time: "5h",
    text: "Day three of our Residential Project: 1,200 native seedlings planted with the local school. Photos from this morning.",
    body: { type: "image", image: postImage1, alt: "Participants planting seedlings together" },
    reactions: { like: 512, celebrate: 187, support: 64 },
    comments: 76,
    shares: 40,
  },
  {
    id: "p-sus-2",
    communityId: "sustainability",
    author: "Grace Wanjiru",
    authorMeta: "Award Leader · Kenya",
    time: "1d",
    text: "Our participants ran a repair café for their Service section — 84 items fixed, nothing sent to landfill. Full how-to guide is free if any centre wants to copy it.",
    body: { type: "text" },
    reactions: { like: 398, celebrate: 121, support: 46 },
    comments: 54,
    shares: 72,
  },
  {
    id: "p-sus-3",
    communityId: "sustainability",
    author: "Sustainability & Volunteering",
    authorMeta: "Community poll · Global",
    time: "3d",
    text: "Choosing the focus for this year's global service week.",
    body: {
      type: "poll",
      question: "Which theme for Global Service Week?",
      options: [
        { id: "o1", label: "Coastal and river clean-ups", votes: 466 },
        { id: "o2", label: "Tree planting and rewilding", votes: 589 },
        { id: "o3", label: "Food security projects", votes: 402 },
        { id: "o4", label: "Digital skills for elders", votes: 233 },
      ],
    },
    reactions: { like: 88, celebrate: 17, support: 13 },
    comments: 27,
    shares: 9,
  },

  // Award Centres
  {
    id: "p-cen-1",
    communityId: "centres",
    author: "Nairobi Award Centre",
    authorMeta: "Award Centre · Kenya",
    time: "7h",
    text: "Quality assurance visit passed with no actions. Biggest change we made: one shared evidence folder per participant instead of email threads. Happy to share the structure.",
    body: { type: "text" },
    reactions: { like: 176, celebrate: 88, support: 14 },
    comments: 33,
    shares: 21,
  },
  {
    id: "p-cen-2",
    communityId: "centres",
    author: "Noah Bergström",
    authorMeta: "Award Centre · Sweden",
    time: "2d",
    text: "Licensing renewal season. If your centre is running short of trained assessors, the regional office is now pairing smaller centres for joint assessment days.",
    body: { type: "text" },
    reactions: { like: 143, celebrate: 12, support: 62 },
    comments: 26,
    shares: 35,
  },
  {
    id: "p-cen-3",
    communityId: "centres",
    author: "Award Centres",
    authorMeta: "Community poll · Global",
    time: "6d",
    text: "What is your centre's biggest operational blocker this term?",
    body: {
      type: "poll",
      question: "Biggest blocker right now?",
      options: [
        { id: "o1", label: "Volunteer recruitment", votes: 291 },
        { id: "o2", label: "Funding and fees", votes: 344 },
        { id: "o3", label: "Expedition supervision cover", votes: 218 },
        { id: "o4", label: "Record keeping and admin", votes: 187 },
      ],
    },
    reactions: { like: 64, celebrate: 5, support: 21 },
    comments: 44,
    shares: 8,
  },

  // Technology & Innovation
  {
    id: "p-tech-1",
    communityId: "technology",
    author: "Aisha Rahman",
    authorMeta: "Award Leader · Malaysia",
    time: "1h",
    text: "We replaced our paper activity logs with a shared offline-first form. Participants in low-connectivity areas can still record sessions and sync later — completion evidence went up noticeably.",
    body: { type: "text" },
    reactions: { like: 231, celebrate: 66, support: 17 },
    comments: 39,
    shares: 44,
  },
  {
    id: "p-tech-2",
    communityId: "technology",
    author: "Marcus Chen",
    authorMeta: "Gold alumni · Canada",
    time: "1d",
    text: "Built a small route-planning checker that flags missing supervision details before submission. Open source, no accounts, no data stored. Feedback from leaders very welcome.",
    body: { type: "text" },
    reactions: { like: 312, celebrate: 104, support: 26 },
    comments: 68,
    shares: 57,
  },
  {
    id: "p-tech-3",
    communityId: "technology",
    author: "Technology & Innovation",
    authorMeta: "Community poll · Global",
    time: "4d",
    text: "What should the community build together next?",
    body: {
      type: "poll",
      question: "Pick the next community build",
      options: [
        { id: "o1", label: "Shared kit-list generator", votes: 274 },
        { id: "o2", label: "Assessor report templates", votes: 388 },
        { id: "o3", label: "Offline activity log app", votes: 431 },
      ],
    },
    reactions: { like: 77, celebrate: 22, support: 10 },
    comments: 31,
    shares: 12,
  },
];

type MemberSeed = [name: string, role: AwardRole, country: string, level: AwardLevel];

const MEMBER_SEEDS: Record<string, MemberSeed[]> = {
  leadership: [
    ["Amara Okonkwo", "Award Leader", "Nigeria", "Completed"],
    ["James Whitfield", "Assessor", "United Kingdom", null],
    ["Mei Ling Tan", "Award Leader", "Singapore", "Gold"],
    ["Fatima Al-Mansouri", "Award Leader", "United Arab Emirates", "Silver"],
    ["Peter Nkemdirim", "Participant", "Nigeria", "Bronze"],
    ["Clara Meyer", "Assessor", "Germany", null],
    ["Rosa Delgado", "Award Leader", "Mexico", "Gold"],
    ["Daniel Kariuki", "Participant", "Kenya", "Silver"],
  ],
  expeditions: [
    ["Diego Fernández", "Assessor", "Chile", null],
    ["Ingrid Halvorsen", "Award Leader", "Norway", "Completed"],
    ["Ravi Sharma", "Participant", "India", "Gold"],
    ["Emily Carter", "Participant", "Australia", "Silver"],
    ["Kwame Mensah", "Award Leader", "Ghana", "Gold"],
    ["Yuki Tanaka", "Participant", "Japan", "Bronze"],
    ["Sean O'Donnell", "Assessor", "Ireland", null],
  ],
  alumni: [
    ["Priya Raghavan", "Alumni", "India", "Completed"],
    ["Tomás Duarte", "Alumni", "Portugal", "Completed"],
    ["Nadia Haddad", "Alumni", "Jordan", "Completed"],
    ["Michael Osei", "Alumni", "Ghana", "Completed"],
    ["Laura Bianchi", "Alumni", "Italy", "Completed"],
    ["Chen Wei", "Alumni", "China", "Completed"],
    ["Zanele Dlamini", "Alumni", "South Africa", "Completed"],
    ["Oliver Grant", "Alumni", "New Zealand", "Completed"],
  ],
  scholarships: [
    ["Dr. Helen Adeyemi", "University partner", "Ghana", null],
    ["Sofia Rossi", "University partner", "Italy", null],
    ["Anjali Menon", "Participant", "India", "Gold"],
    ["Ethan Brooks", "Participant", "United States", "Silver"],
    ["Mariam Sesay", "Alumni", "Sierra Leone", "Completed"],
    ["Nils Andersson", "University partner", "Sweden", null],
  ],
  sustainability: [
    ["Lucas Silva", "Volunteer coordinator", "Brazil", "Gold"],
    ["Grace Wanjiru", "Award Leader", "Kenya", "Completed"],
    ["Marta Nowak", "Participant", "Poland", "Silver"],
    ["Kofi Boateng", "Participant", "Ghana", "Bronze"],
    ["Elena Petrova", "Volunteer coordinator", "Bulgaria", "Gold"],
    ["Isabella Cruz", "Participant", "Philippines", "Silver"],
    ["Ahmed Farouk", "Award Leader", "Egypt", "Completed"],
  ],
  centres: [
    ["Nairobi Award Centre", "Award Centre", "Kenya", null],
    ["Noah Bergström", "Award Centre", "Sweden", null],
    ["St. Andrew's Academy", "Award Centre", "United Kingdom", null],
    ["Colegio San Martín", "Award Centre", "Argentina", null],
    ["Bright Future Centre", "Award Centre", "India", null],
    ["Lagos Youth Trust", "Award Centre", "Nigeria", null],
  ],
  technology: [
    ["Aisha Rahman", "Award Leader", "Malaysia", "Completed"],
    ["Marcus Chen", "Alumni", "Canada", "Completed"],
    ["Sara Lindqvist", "Participant", "Finland", "Gold"],
    ["Victor Adeyemi", "Participant", "Nigeria", "Silver"],
    ["Hannah Klein", "Assessor", "Austria", null],
    ["Rahul Verma", "Alumni", "India", "Completed"],
  ],
};

function toUsername(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

const MEMBERS_BY_COMMUNITY: Record<string, CommunityMember[]> = Object.fromEntries(
  Object.entries(MEMBER_SEEDS).map(([communityId, seeds]) => [
    communityId,
    seeds.map(([name, role, country, level], i) => ({
      id: `${communityId}-mem-${i}`,
      name,
      username: toUsername(name),
      role,
      country,
      level,
    })),
  ]),
);

/** Flat list, used for global search surfaces. */
export const MEMBERS: CommunityMember[] = Object.values(MEMBERS_BY_COMMUNITY).flat();

export function getCommunity(id: string) {
  return COMMUNITIES.find((c) => c.id === id);
}

export function postsFor(id: string) {
  return POSTS.filter((p) => p.communityId === id);
}

export function membersFor(id: string): CommunityMember[] {
  return MEMBERS_BY_COMMUNITY[id] ?? [];
}

export function formatMembers(n: number) {
  return `${formatCount(n)} member${n === 1 ? "" : "s"}`;
}

export function formatCount(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : `${n}`;
}

export function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("") || "T"
  );
}
