/**
 * Mock chat directory and seeded conversations.
 *
 * Everything here is plain data behind typed interfaces so a real backend
 * (Lovable Cloud / realtime subscriptions) can replace this module without
 * touching a single component. No contact details are ever stored or shown.
 */

import {
  PEOPLE,
  findPerson,
  searchPeople,
  type Person,
  type PersonLevel,
  type PersonRole,
} from "@/lib/people-data";

/** Chat speaks in terms of participants; the directory owns the identity. */
export type ChatParticipant = Person;
export type ChatAwardRole = PersonRole;
export type ChatAwardLevel = PersonLevel;

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

export const PARTICIPANTS: ChatParticipant[] = PEOPLE;

export const findParticipant = findPerson;
export const searchParticipants = (query: string) => searchPeople(query);

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
