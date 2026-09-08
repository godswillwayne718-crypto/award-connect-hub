import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/lib/directory";

/** Persistent one-to-one conversations and messages, stored in the backend. */

export interface Conversation {
  id: string;
  user_a: string;
  user_b: string;
  created_at: string;
  last_message_at: string;
}

export interface DbMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  kind: "text" | "voice" | "call";
  duration_sec: number | null;
  call_mode: "audio" | "video" | null;
  call_outcome: string | null;
  read_at: string | null;
  created_at: string;
}

export function otherUserId(conversation: Conversation, me: string) {
  return conversation.user_a === me ? conversation.user_b : conversation.user_a;
}

/** Finds the single conversation for a pair, or creates it. Never duplicates. */
export async function openConversation(me: string, other: string): Promise<string> {
  if (me === other) throw new Error("You cannot message yourself.");
  const [a, b] = me < other ? [me, other] : [other, me];

  const { data: existing, error: findError } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_a", a)
    .eq("user_b", b)
    .maybeSingle();
  if (findError) throw findError;
  if (existing) return (existing as { id: string }).id;

  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_a: a, user_b: b })
    .select("id")
    .single();
  if (error) {
    // Lost the race: the other device created it a moment earlier.
    const { data: retry } = await supabase
      .from("conversations")
      .select("id")
      .eq("user_a", a)
      .eq("user_b", b)
      .maybeSingle();
    if (retry) return (retry as { id: string }).id;
    throw error;
  }
  return (data as { id: string }).id;
}

export interface InboxEntry {
  conversation: Conversation;
  other: Profile;
  lastMessage: DbMessage | null;
  unread: number;
}

export function useInbox(me: string | null) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["inbox", me],
    queryFn: async (): Promise<InboxEntry[]> => {
      if (!me) return [];
      const { data: conversations, error } = await supabase
        .from("conversations")
        .select("*")
        .order("last_message_at", { ascending: false });
      if (error) throw error;
      const list = (conversations ?? []) as Conversation[];
      if (list.length === 0) return [];

      const otherIds = list.map((c) => otherUserId(c, me));
      const [{ data: profiles }, { data: messages }] = await Promise.all([
        supabase.from("profiles").select("*").in("id", otherIds),
        supabase
          .from("messages")
          .select("*")
          .in(
            "conversation_id",
            list.map((c) => c.id),
          )
          .order("created_at", { ascending: false }),
      ]);

      const byId = new Map((((profiles ?? []) as Profile[]) || []).map((p) => [p.id, p]));
      const msgs = ((messages ?? []) as DbMessage[]) || [];

      return list
        .map((conversation) => {
          const other = byId.get(otherUserId(conversation, me));
          if (!other) return null;
          const mine = msgs.filter((m) => m.conversation_id === conversation.id);
          return {
            conversation,
            other,
            lastMessage: mine[0] ?? null,
            unread: mine.filter((m) => m.sender_id !== me && !m.read_at).length,
          } satisfies InboxEntry;
        })
        .filter((e): e is InboxEntry => Boolean(e));
    },
    enabled: Boolean(me),
  });

  // Live inbox updates for new messages in any of my conversations.
  useEffect(() => {
    if (!me) return;
    const channel = supabase
      .channel(`inbox-${me}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => {
        void qc.invalidateQueries({ queryKey: ["inbox", me] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, () => {
        void qc.invalidateQueries({ queryKey: ["inbox", me] });
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [me, qc]);

  return query;
}

export function useUnreadTotal(me: string | null) {
  const { data } = useInbox(me);
  return (data ?? []).reduce((n, e) => n + e.unread, 0);
}

export function useConversation(conversationId: string, me: string | null) {
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .maybeSingle();
      if (error) throw error;
      const conversation = (data as Conversation | null) ?? null;
      if (!conversation || !me) return null;
      const { data: profile, error: pErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", otherUserId(conversation, me))
        .maybeSingle();
      if (pErr) throw pErr;
      return { conversation, other: (profile as Profile | null) ?? null };
    },
    enabled: Boolean(conversationId && me),
  });
}

export function useMessages(conversationId: string, me: string | null) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return ((data ?? []) as DbMessage[]) || [];
    },
    enabled: Boolean(conversationId),
  });

  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          void qc.invalidateQueries({ queryKey: ["messages", conversationId] });
          void qc.invalidateQueries({ queryKey: ["inbox", me] });
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [conversationId, qc, me]);

  return query;
}

export function useSendMessage(conversationId: string, me: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      body: string;
      kind?: DbMessage["kind"];
      durationSec?: number;
      callMode?: "audio" | "video";
      callOutcome?: string;
    }) => {
      if (!me) throw new Error("You need to sign in first.");
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: me,
        body: input.body,
        kind: input.kind ?? "text",
        duration_sec: input.durationSec ?? null,
        call_mode: input.callMode ?? null,
        call_outcome: input.callOutcome ?? null,
      });
      if (error) throw error;
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["messages", conversationId] });
      void qc.invalidateQueries({ queryKey: ["inbox", me] });
    },
  });
}

/** Marks the other person's messages as read. */
export async function markConversationRead(conversationId: string, me: string) {
  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .neq("sender_id", me)
    .is("read_at", null);
}
