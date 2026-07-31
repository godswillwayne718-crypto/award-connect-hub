import cover1 from "@/assets/community-cover-1.jpg";
import cover2 from "@/assets/community-cover-2.jpg";
import cover3 from "@/assets/community-cover-3.jpg";
import postImage1 from "@/assets/post-image-1.jpg";

/** Placeholder community content — swap for Lovable Cloud data later. */

export type CommunityCategory =
  | "Leadership"
  | "Expeditions"
  | "Alumni"
  | "Study"
  | "Sustainability"
  | "Centres";

export const CATEGORIES: CommunityCategory[] = [
  "Leadership",
  "Expeditions",
  "Alumni",
  "Study",
  "Sustainability",
  "Centres",
];

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

export interface Moderator {
  id: string;
  name: string;
  role: string;
  country: string;
}

export interface CommunityMember {
  id: string;
  name: string;
  username: string;
  role: string;
  country: string;
  level: "Bronze" | "Silver" | "Gold" | "Completed" | null;
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

const MODS: Record<string, Moderator[]> = {
  leaders: [
    { id: "m1", name: "Amara Okonkwo", role: "Award Leader", country: "Nigeria" },
    { id: "m2", name: "James Whitfield", role: "Assessor", country: "United Kingdom" },
  ],
  aj: [
    { id: "m3", name: "Diego Fernández", role: "Assessor", country: "Chile" },
    { id: "m4", name: "Mei Ling Tan", role: "Award Leader", country: "Singapore" },
  ],
  alumni: [{ id: "m5", name: "Priya Raghavan", role: "Gold alumni", country: "India" }],
  scholar: [{ id: "m6", name: "Dr. Helen Adeyemi", role: "University partner", country: "Ghana" }],
  green: [{ id: "m7", name: "Lucas Silva", role: "Participant", country: "Brazil" }],
  centres: [{ id: "m8", name: "Nairobi Award Centre", role: "Award Centre", country: "Kenya" }],
};

const BASE_RULES = [
  "Be respectful. This is a global network of participants, leaders and partners.",
  "Keep posts relevant to the Award and this community's focus.",
  "No personal data of minors, ever. Protect participant privacy.",
  "Credit sources when sharing resources or templates.",
];

export const COMMUNITIES: Community[] = [
  {
    id: "leaders",
    name: "Award Leaders Global",
    handle: "@awardleaders",
    category: "Leadership",
    description:
      "A peer network for Award Leaders to share programme design, mentoring practice and participant support.",
    members: 12420,
    cover: cover1,
    logoInitials: "AL",
    featured: true,
    rules: BASE_RULES,
    moderators: MODS.leaders,
  },
  {
    id: "aj",
    name: "Adventurous Journey Hub",
    handle: "@ajhub",
    category: "Expeditions",
    description:
      "Route plans, kit lists, safety practice and expedition stories from Bronze through Gold.",
    members: 8110,
    cover: cover2,
    logoInitials: "AJ",
    featured: true,
    rules: BASE_RULES,
    moderators: MODS.aj,
  },
  {
    id: "alumni",
    name: "Alumni Network",
    handle: "@alumni",
    category: "Alumni",
    description:
      "Life after the Award — careers, mentorship and giving back to the next generation.",
    members: 21730,
    cover: cover3,
    logoInitials: "AN",
    featured: true,
    rules: BASE_RULES,
    moderators: MODS.alumni,
  },
  {
    id: "scholar",
    name: "Scholarships & Universities",
    handle: "@scholarships",
    category: "Study",
    description: "Recognition schemes, scholarship deadlines and application guidance worldwide.",
    members: 5340,
    cover: cover1,
    logoInitials: "SU",
    rules: BASE_RULES,
    moderators: MODS.scholar,
  },
  {
    id: "green",
    name: "Green Award Projects",
    handle: "@greenaward",
    category: "Sustainability",
    description: "Climate and conservation service projects run by Award participants globally.",
    members: 3980,
    cover: cover2,
    logoInitials: "GA",
    rules: BASE_RULES,
    moderators: MODS.green,
  },
  {
    id: "centres",
    name: "Licensed Award Centres",
    handle: "@centres",
    category: "Centres",
    description: "Operational support, licensing updates and centre-to-centre collaboration.",
    members: 2160,
    cover: cover3,
    logoInitials: "LC",
    rules: BASE_RULES,
    moderators: MODS.centres,
  },
];

/** Communities the signed-in member has joined by default. */
export const DEFAULT_JOINED = ["leaders", "aj", "alumni"];

export const POSTS: CommunityPost[] = [
  {
    id: "p1",
    communityId: "leaders",
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
    id: "p2",
    communityId: "green",
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
    id: "p3",
    communityId: "aj",
    author: "Adventurous Journey Hub",
    authorMeta: "Community poll · Global",
    time: "1d",
    text: "Planning the next practice journey guide — what should we cover first?",
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
    reactions: { like: 96, celebrate: 12, support: 8 },
    comments: 41,
    shares: 6,
  },
  {
    id: "p4",
    communityId: "alumni",
    author: "Priya Raghavan",
    authorMeta: "Gold alumni · India",
    time: "2d",
    text: "Ten of us are running free CV clinics for Award holders next month. Comment if you'd like a slot — leaders welcome too.",
    body: { type: "text" },
    reactions: { like: 331, celebrate: 74, support: 122 },
    comments: 87,
    shares: 25,
  },
];

const COUNTRIES = ["Kenya", "India", "Brazil", "United Kingdom", "Singapore", "Ghana", "Chile"];
const ROLES = ["Participant", "Award Leader", "Assessor", "Alumni", "Award Centre"];
const LEVELS: CommunityMember["level"][] = ["Bronze", "Silver", "Gold", "Completed", null];

const NAMES = [
  "Amara Okonkwo",
  "James Whitfield",
  "Mei Ling Tan",
  "Diego Fernández",
  "Priya Raghavan",
  "Lucas Silva",
  "Helen Adeyemi",
  "Sofia Rossi",
  "Noah Bergström",
  "Aisha Rahman",
  "Tomás Duarte",
  "Grace Wanjiru",
];

export const MEMBERS: CommunityMember[] = NAMES.map((name, i) => ({
  id: `mem-${i}`,
  name,
  username: name.toLowerCase().replace(/[^a-z]+/g, ""),
  role: ROLES[i % ROLES.length]!,
  country: COUNTRIES[i % COUNTRIES.length]!,
  level: LEVELS[i % LEVELS.length]!,
}));

export function getCommunity(id: string) {
  return COMMUNITIES.find((c) => c.id === id);
}

export function postsFor(id: string) {
  const own = POSTS.filter((p) => p.communityId === id);
  return own.length ? own : POSTS;
}

export function formatMembers(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k members` : `${n} members`;
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
