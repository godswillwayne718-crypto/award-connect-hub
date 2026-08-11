/**
 * Single TIAN participant directory.
 *
 * Chat, Contacts, Status and Community all resolve people through this module,
 * so a person has exactly one identity (@username) across the whole product.
 * Plain data behind typed interfaces — a real backend can replace it without
 * touching a single component. Private contact details are never stored here.
 */
import { MEMBERS, POSTS, type AwardLevel, type AwardRole } from "@/lib/community-data";

export type PersonRole = AwardRole;
export type PersonLevel = AwardLevel;

export interface Person {
  id: string;
  name: string;
  /** Always stored without the leading "@". */
  username: string;
  country: string;
  role: PersonRole;
  level: PersonLevel;
  online: boolean;
  verified: boolean;
  /** Human readable presence used in conversation headers. */
  lastSeen: string;
}

/* ------------------------------------------------------------- username rules */

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 30;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

/** Strips a leading @ and lowercases for case-insensitive comparison. */
export function normalizeUsername(value: string): string {
  return value.trim().replace(/^@+/, "").toLowerCase();
}

export function validateUsername(value: string): string | null {
  const u = normalizeUsername(value);
  if (u.length < USERNAME_MIN || u.length > USERNAME_MAX) {
    return `Username must be ${USERNAME_MIN}–${USERNAME_MAX} characters.`;
  }
  if (!USERNAME_PATTERN.test(u)) {
    return "Use letters, numbers and underscores only.";
  }
  return null;
}

/** Deterministic fallback handle for mock people that only have a name. */
export function usernameFromName(name: string): string {
  const base = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return (base || "tianmember").slice(0, USERNAME_MAX);
}

/* ------------------------------------------------------------------ directory */

/** People with seeded conversations. Ids are stable and used by the chat seed. */
export const CHAT_PEOPLE: Person[] = [
  {
    id: "p-alex",
    name: "Alex Johnson",
    username: "alex01",
    country: "United Kingdom",
    role: "Participant",
    level: "Gold",
    online: true,
    verified: true,
    lastSeen: "Online now",
  },
  {
    id: "p-maria",
    name: "Maria Álvarez",
    username: "maria_award",
    country: "Spain",
    role: "Award Leader",
    level: "Completed",
    online: true,
    verified: true,
    lastSeen: "Online now",
  },
  {
    id: "p-daniel",
    name: "Daniel Osei",
    username: "danieltech",
    country: "Ghana",
    role: "Alumni",
    level: "Completed",
    online: false,
    verified: false,
    lastSeen: "Last seen 2 h ago",
  },
  {
    id: "p-sarah",
    name: "Sarah Whitfield",
    username: "sarahleadership",
    country: "Australia",
    role: "Assessor",
    level: null,
    online: false,
    verified: true,
    lastSeen: "Last seen yesterday",
  },
  {
    id: "p-liam",
    name: "Liam O'Connor",
    username: "liam_expedition",
    country: "Ireland",
    role: "Participant",
    level: "Silver",
    online: true,
    verified: false,
    lastSeen: "Online now",
  },
  {
    id: "p-noor",
    name: "Noor Haddad",
    username: "noor_centre",
    country: "Jordan",
    role: "Award Centre",
    level: null,
    online: false,
    verified: true,
    lastSeen: "Last seen 3 d ago",
  },
  {
    id: "p-ken",
    name: "Kenji Sato",
    username: "kenji_scholar",
    country: "Japan",
    role: "University partner",
    level: null,
    online: false,
    verified: true,
    lastSeen: "Last seen this week",
  },
  {
    id: "p-amara",
    name: "Amara Nwosu",
    username: "amara_volunteer",
    country: "Nigeria",
    role: "Participant",
    level: "Bronze",
    online: true,
    verified: false,
    lastSeen: "Online now",
  },
];

/** Stable pseudo-random flag so mock presence/verification never flickers. */
function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  return h;
}

function personFromCommunity(
  name: string,
  username: string,
  role: PersonRole,
  country: string,
  level: PersonLevel,
): Person {
  const h = hash(username);
  const online = h % 3 === 0;
  return {
    id: `cm-${username}`,
    name,
    username,
    country,
    role,
    level,
    online,
    verified: h % 4 !== 0,
    lastSeen: online ? "Online now" : h % 2 === 0 ? "Last seen today" : "Last seen this week",
  };
}

function parseAuthorMeta(meta: string): { role: PersonRole; country: string; level: PersonLevel } {
  const [rawRole = "", country = "Global"] = meta.split("·").map((s) => s.trim());
  const level: PersonLevel = /gold/i.test(rawRole)
    ? "Completed"
    : /silver/i.test(rawRole)
      ? "Silver"
      : /bronze/i.test(rawRole)
        ? "Bronze"
        : null;
  const role: PersonRole = /alumni/i.test(rawRole)
    ? "Alumni"
    : /assessor/i.test(rawRole)
      ? "Assessor"
      : /centre/i.test(rawRole)
        ? "Award Centre"
        : /university/i.test(rawRole)
          ? "University partner"
          : /leader/i.test(rawRole)
            ? "Award Leader"
            : "Participant";
  return { role, country, level };
}

function buildDirectory(): Person[] {
  const byUsername = new Map<string, Person>();
  const add = (person: Person) => {
    if (!byUsername.has(person.username)) byUsername.set(person.username, person);
  };

  CHAT_PEOPLE.forEach(add);

  MEMBERS.forEach((m) => {
    add(personFromCommunity(m.name, normalizeUsername(m.username), m.role, m.country, m.level));
  });

  POSTS.forEach((post) => {
    // Community-authored polls are not people.
    if (post.authorMeta.startsWith("Community poll")) return;
    const username = usernameFromName(post.author);
    const { role, country, level } = parseAuthorMeta(post.authorMeta);
    add(personFromCommunity(post.author, username, role, country, level));
  });

  return [...byUsername.values()];
}

/** Everyone TIAN knows about, deduplicated by @username. */
export const PEOPLE: Person[] = buildDirectory();

const BY_ID = new Map(PEOPLE.map((p) => [p.id, p]));
const BY_USERNAME = new Map(PEOPLE.map((p) => [p.username.toLowerCase(), p]));
const BY_NAME = new Map(PEOPLE.map((p) => [p.name.toLowerCase(), p]));

export function findPerson(id: string): Person | undefined {
  return BY_ID.get(id);
}

export function findPersonByUsername(username: string): Person | undefined {
  return BY_USERNAME.get(normalizeUsername(username));
}

/** Resolves a community post/moderator display name to a directory person. */
export function findPersonByName(name: string): Person | undefined {
  return BY_NAME.get(name.trim().toLowerCase());
}

export function isUsernameTaken(username: string): boolean {
  return BY_USERNAME.has(normalizeUsername(username));
}

/** Case-insensitive search across name, @username and country. */
export function searchPeople(query: string, pool: Person[] = PEOPLE): Person[] {
  const q = normalizeUsername(query);
  if (!q) return pool;
  return pool.filter(
    (p) =>
      p.username.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.country.toLowerCase().includes(q),
  );
}
