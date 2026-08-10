import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MessagesSquare } from "lucide-react";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageList } from "@/components/chat/message-list";
import { MessageComposer } from "@/components/chat/message-composer";
import { ChatEmptyState } from "@/components/chat/chat-empty-state";
import { Button } from "@/components/ui/button";
import { findParticipant } from "@/lib/chat-data";
import { markRead, sendMessage, useChat, useIsBlocked } from "@/lib/chat-store";

export const Route = createFileRoute("/chats/$chatId")({
  head: () => ({
    meta: [
      { title: "Conversation — TIAN" },
      {
        name: "description",
        content: "A private one-to-one conversation with another Award member on TIAN.",
      },
      { property: "og:title", content: "Conversation — TIAN" },
      { property: "og:description", content: "Private Award messaging on TIAN." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ConversationScreen,
});

function ConversationScreen() {
  const { chatId } = Route.useParams();
  const chat = useChat(chatId);
  const participant = chat ? findParticipant(chat.participantId) : undefined;
  const blocked = useIsBlocked(chat?.participantId ?? "");

  useEffect(() => {
    if (chat) markRead(chat.id);
  }, [chat?.id]);

  if (!chat || !participant) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center bg-background px-6">
        <ChatEmptyState
          icon={MessagesSquare}
          title="Conversation unavailable"
          copy="This chat no longer exists on this device."
          action={
            <Button asChild size="pillAuto" variant="default">
              <Link to="/chats">Back to chats</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-surface">
      <div className="mx-auto flex h-dvh w-full max-w-md flex-col bg-background">
        <ChatHeader participant={participant} />

        {chat.messages.length === 0 ? (
          <div className="flex min-h-0 flex-1 items-center justify-center px-6">
            <ChatEmptyState
              icon={MessagesSquare}
              title="Say hello"
              copy={`Start the conversation with @${participant.username}.`}
            />
          </div>
        ) : (
          <MessageList messages={chat.messages} />
        )}

        <MessageComposer
          onSend={(body) => sendMessage(chat.id, body)}
          disabled={blocked}
          disabledCopy="You blocked this member. Unblock them from the menu to continue."
        />
      </div>
    </div>
  );
}
