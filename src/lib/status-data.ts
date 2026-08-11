import cover1 from "@/assets/community-cover-1.jpg";
import cover2 from "@/assets/community-cover-2.jpg";
import cover4 from "@/assets/community-cover-4.jpg";
import postImage1 from "@/assets/post-image-1.jpg";
import postImage2 from "@/assets/post-image-2.jpg";

/**
 * Status mock content. The shape already supports multiple media items per
 * status so a future backend (and multi-photo posting) needs no model change.
 */
export type StatusKind = "text" | "photo" | "video";

export interface StatusItem {
  id: string;
  kind: StatusKind;
  /** Object URL, data URL or bundled asset. Absent for text statuses. */
  src?: string;
  caption?: string;
  /** Background preset id for text statuses. */
  background?: string;
  /** Alt text for photos. */
  alt?: string;
}

export interface Status {
  id: string;
  authorId: string;
  items: StatusItem[];
  /** ISO timestamp of the newest item. */
  createdAt: string;
}

export const STATUS_MAX_CHARS = 280;

export const TEXT_BACKGROUNDS: { id: string; label: string; className: string }[] = [
  { id: "navy", label: "Navy", className: "bg-navy-gradient text-primary-foreground" },
  { id: "green", label: "Green", className: "bg-accent text-accent-foreground" },
  { id: "gold", label: "Gold", className: "bg-gold text-gold-foreground" },
  { id: "light", label: "Light", className: "bg-surface text-foreground" },
];

export function backgroundClass(id?: string): string {
  return (
    TEXT_BACKGROUNDS.find((b) => b.id === id)?.className ?? TEXT_BACKGROUNDS[0]!.className
  );
}

const HOUR = 3_600_000;
const BASE = Date.UTC(2026, 7, 11, 8, 0, 0);

function ago(hours: number): string {
  return new Date(BASE - hours * HOUR).toISOString();
}

export const SEED_STATUSES: Status[] = [
  {
    id: "s-alex",
    authorId: "p-alex",
    createdAt: ago(1),
    items: [
      {
        id: "s-alex-1",
        kind: "photo",
        src: cover2,
        alt: "Expedition team on a ridge at sunrise",
        caption: "Practice journey done. Brecon in two weeks.",
      },
      {
        id: "s-alex-2",
        kind: "text",
        background: "navy",
        caption: "Kit list going out tonight — shout if you need anything.",
      },
    ],
  },
  {
    id: "s-maria",
    authorId: "p-maria",
    createdAt: ago(3),
    items: [
      {
        id: "s-maria-1",
        kind: "photo",
        src: postImage1,
        alt: "Award participants working together outdoors",
        caption: "Residential week reflections from my Gold group.",
      },
    ],
  },
  {
    id: "s-daniel",
    authorId: "p-daniel",
    createdAt: ago(6),
    items: [
      {
        id: "s-daniel-1",
        kind: "text",
        background: "green",
        caption: "Mentoring session recording is up in Technology & Innovation.",
      },
    ],
  },
  {
    id: "s-noor",
    authorId: "p-noor",
    createdAt: ago(11),
    items: [
      {
        id: "s-noor-1",
        kind: "photo",
        src: cover4,
        alt: "Volunteers planting trees",
        caption: "Centre volunteering day — 240 trees and counting.",
      },
    ],
  },
  {
    id: "s-liam",
    authorId: "p-liam",
    createdAt: ago(20),
    items: [
      {
        id: "s-liam-1",
        kind: "photo",
        src: postImage2,
        alt: "Map and compass on a table",
        caption: "Navigation practice before Silver.",
      },
      {
        id: "s-liam-2",
        kind: "text",
        background: "gold",
        caption: "Bearings at every stile. It works.",
      },
    ],
  },
  {
    id: "s-amara",
    authorId: "p-amara",
    createdAt: ago(30),
    items: [
      {
        id: "s-amara-1",
        kind: "photo",
        src: cover1,
        alt: "Community leadership workshop",
        caption: "First Bronze volunteering shift complete.",
      },
    ],
  },
];
