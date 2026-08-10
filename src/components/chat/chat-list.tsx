import type { Chat } from "@/lib/chat-data";
import { ChatRow } from "@/components/chat/chat-row";

/** Inbox list. Rendering is data-driven so a backend can feed it directly. */
export function ChatList({ chats }: { chats: Chat[] }) {
  return (
    <ul className="space-y-1">
      {chats.map((chat, i) => (
        <ChatRow key={chat.id} chat={chat} index={i} />
      ))}
    </ul>
  );
}
