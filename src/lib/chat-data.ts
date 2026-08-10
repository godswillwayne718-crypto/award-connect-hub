/**
 * Mock chat directory and seeded conversations.
 *
 * Everything here is plain data behind typed interfaces so a real backend
 * (Lovable Cloud / realtime subscriptions) can replace this module without
 * touching a single component. No contact details are ever stored or shown.
 */

export type ChatAwardRole =
  | "Participant"
  | "Award Leader"
  | "Assessor"
  | "Alumni"
  | "Award Centre"
  | "University partner";

export type ChatAwardLevel = "Bronze" | "Silver" | "Gold" | "Completed" | null;

export interface ChatParticipant {
  id: string;
  name: string;
  username: string;
  country: string;
  role: ChatAwardRole;
  level: ChatAwardLevel;
  online: boolean;
  verified: boolean;
  /** Human readable presence used in the conversation header. */
  lastSeen: string;
}

export type MessageStatus = "sent" | "delivered" | "read";

export interface Message {
  id: string;
  chatId: string;
  /** "me" is the signed-in user; anything else is a participant id. */
  authorId: string;
  body: string;
  /** ISO timestamp. */
  sentAt: string;
  status: MessageStatus;
}

export interface Chat {
  id: string;
  participantId: string;
  messages: Message[];
  unread: number;
  /** Locally created chats are pinned to the top until they have activity. */
  createdAt: string;
}

export const ME = "me";

export const PARTICIPANTS: ChatParticipant[] = [
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

export function findParticipant(id: string): ChatParticipant | undefined {
  return PARTICIPANTS.find((p) => p.id === id);
}

export function searchParticipants(query: string): ChatParticipant[] {
  const q = query.trim().toLowerCase().replace(/^@/, "");
  if (!q) return PARTICIPANTS;
  return PARTICIPANTS.filter(
    (p) =>
      p.username.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.country.toLowerCase().includes(q),
  );
}

/** Fixed reference point keeps seeded timestamps stable between renders. */
const DAY = 86_400_000;
const BASE = Date.UTC(2026, 7, 10, 9, 0, 0);

function at(daysAgo: number, hour: number, minute = 0): string {
  const d = new Date(BASE - daysAgo * DAY);
  d.setUTCHours(hour, minute, 0, 0);
  return d.toISOString();
}

function thread(
  chatId: string,
  participantId: string,
  lines: [author: "me" | "them", body: string, sentAt: string][],
): Message[] {
  return lines.map(([author, body, sentAt], i) => ({
    id: `${chatId}-m${i + 1}`,
    chatId,
    authorId: author === "me" ? ME : participantId,
    body,
    sentAt,
    status: "read" as MessageStatus,
  }));
}

export const SEED_CHATS: Chat[] = [
  {
    id: "c-alex",
    participantId: "p-alex",
    unread: 2,
    createdAt: at(3, 9),
    messages: thread("c-alex", "p-alex", [
      ["them", "Hey! Are you joining the expedition this weekend?", at(0, 10, 38)],
      ["me", "Thinking about it — is the Brecon route confirmed?", at(0, 10, 40)],
      ["them", "Yes, confirmed this morning. Kit list goes out tonight.", at(0, 10, 41)],
      ["them", "Let me know by Friday so I can add you to the group.", at(0, 10, 42)],
    ]),
  },
  {
    id: "c-maria",
    participantId: "p-maria",
    unread: 0,
    createdAt: at(6, 9),
    messages: thread("c-maria", "p-maria", [
      ["them", "Congratulations on finishing your Residential section!", at(1, 15, 12)],
      ["me", "Thank you! It was the best week of the whole Award.", at(1, 15, 20)],
      ["them", "I'd love you to share a short reflection with my group.", at(1, 15, 24)],
      ["me", "Happy to. Send me a date and I'll prepare something.", at(1, 15, 31)],
    ]),
  },
  {
    id: "c-daniel",
    participantId: "p-daniel",
    unread: 1,
    createdAt: at(9, 9),
    messages: thread("c-daniel", "p-daniel", [
      ["me", "Did the mentoring session recording work out?", at(2, 11, 5)],
      ["them", "It did — I'll upload it to the Technology community tomorrow.", at(2, 11, 40)],
    ]),
  },
  {
    id: "c-sarah",
    participantId: "p-sarah",
    unread: 0,
    createdAt: at(14, 9),
    messages: thread("c-sarah", "p-sarah", [
      ["them", "Your assessment paperwork has been received.", at(5, 8, 15)],
      ["me", "Brilliant, thanks for confirming.", at(5, 8, 22)],
      ["them", "I'll be in touch once the panel has reviewed it.", at(5, 8, 25)],
    ]),
  },
  {
    id: "c-liam",
    participantId: "p-liam",
    unread: 0,
    createdAt: at(21, 9),
    messages: thread("c-liam", "p-liam", [
      ["them", "Any tips for the practice journey navigation?", at(9, 19, 2)],
      ["me", "Take bearings at every stile — saved us twice last year.", at(9, 19, 30)],
    ]),
  },
];
