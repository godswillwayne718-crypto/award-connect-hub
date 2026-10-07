import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, MessagesSquare, Phone, Video } from "lucide-react";
import { toast } from "sonner";
import { MessageComposer } from "@/components/chat/message-composer";
import { ChatEmptyState } from "@/components/chat/chat-empty-state";
import { DbMessageList } from "@/components/chat/db-message-list";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { RequireAuth } from "@/components/tian/require-auth";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useCalls } from "@/lib/calls";
import { nameOf, presenceLabel } from "@/lib/identity";
import { uploadMedia } from "@/lib/media";
import { markConversationRead, useConversation, useMessages, useSendMessage } from "@/lib/messaging";
import { useBlocked } from "@/lib/social";

export const Route = createFileRoute("/chats/$chatId")({
  head: () => ({
    meta: [
      { title: "Conversation — TIAN" },
      { name: "description", content: "A private one-to-one conversation with another Award member on TIAN." },
      { property: "og:title", content: "Conversation — TIAN" },
      { property: "og:description", content: "Private Award messaging on TIAN." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <RequireAuth>
      <ConversationScreen />
    </RequireAuth>
  ),
});

function ConversationScreen() {
  const { chatId } = Route.useParams();
  const { userId } = useAuth();
  const me = userId!;
  const conv = useConversation(chatId, me);
  const messages = useMessages(chatId, me);
  const send = useSendMessage(chatId, me);
  const blocked = useBlocked(me).data ?? [];
  const { startCall } = useCalls();
  const other = conv.data?.other ?? null;
  const count = messages.data?.length ?? 0;

  useEffect(() => {
    if (count > 0) void markConversationRead(chatId, me);
  }, [chatId, me, count]);

  if (conv.isLoading) {
    return <p className="py-20 text-center text-sm text-muted-foreground">Opening conversation…</p>;
  }

  if (!conv.data || !other) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center bg-background px-6">
        <ChatEmptyState
          icon={MessagesSquare}
          title="Conversation unavailable"
          copy="This chat doesn't exist or you're not part of it."
          action={
            <Button asChild size="pillAuto" variant="default">
              <Link to="/chats">Back to chats</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const isBlocked = blocked.includes(other.id);

  return (
    <div className="w-full bg-surface">
      <div className="mx-auto flex h-dvh w-full max-w-md flex-col bg-background">
        <header className="flex items-center gap-2 border-b border-border px-3 pb-3 pt-5">
          <Link to="/chats" aria-label="Back to chats" className="grid size-10 place-items-center rounded-full hover:bg-surface">
            <ChevronLeft className="size-5" />
          </Link>
          <Link to="/u/$username" params={{ username: other.username }} className="flex min-w-0 flex-1 items-center gap-2.5">
            <PersonAvatar name={nameOf(other)} online={other.online} size="md" />
            <span className="min-w-0">
              <span className="block truncate font-display text-[15px] font-extrabold text-foreground">{nameOf(other)}</span>
              <span className="block truncate text-[11.5px] text-muted-foreground">
                @{other.username} · {isBlocked ? "Blocked" : presenceLabel(other)}
              </span>
            </span>
          </Link>
          <Button
            size="icon"
            variant="ghost"
            className="size-11 rounded-full"
            aria-label={`Voice call ${nameOf(other)}`}
            disabled={isBlocked}
            onClick={() => void startCall(other, "audio", chatId)}
          >
            <Phone className="size-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-11 rounded-full"
            aria-label={`Video call ${nameOf(other)}`}
            disabled={isBlocked}
            onClick={() => void startCall(other, "video", chatId)}
          >
            <Video className="size-5" />
          </Button>
        </header>

        {count === 0 ? (
          <div className="flex min-h-0 flex-1 items-center justify-center px-6">
            <ChatEmptyState icon={MessagesSquare} title="Say hello" copy={`Start the conversation with @${other.username}.`} />
          </div>
        ) : (
          <DbMessageList messages={messages.data ?? []} me={me} />
        )}

        <MessageComposer
          onSend={(body) =>
            send.mutate({ body }, { onError: () => toast.error("Message not sent. Try again.") })
          }
          onVoiceNote={async (url, duration) => {
            try {
              const blob = await (await fetch(url)).blob();
              const path = await uploadMedia(me, blob, "webm");
              await send.mutateAsync({ body: path, kind: "voice", durationSec: duration });
            } catch {
              toast.error("Voice note not sent. Try again.");
            }
          }}
          disabled={isBlocked}
          disabledCopy="You blocked this member. Unblock them to continue."
        />
      </div>
    </div>
  );
}
