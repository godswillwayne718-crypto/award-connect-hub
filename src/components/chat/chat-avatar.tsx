import { PersonAvatar } from "@/components/shared/person-avatar";
import { VerifiedMark } from "@/components/shared/username-badge";

/**
 * Chat avatar = shared TIAN initials avatar plus an online presence dot.
 * Kept as a thin alias so chat screens keep their existing imports.
 */
export const ChatAvatar = PersonAvatar;

export { VerifiedMark };
