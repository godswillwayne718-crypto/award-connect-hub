import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/lib/directory";
import { uploadMedia } from "@/lib/media";

/** 24-hour Status updates, stored in the shared backend. */

export type StatusKind = "text" | "photo" | "video";
export type StatusPrivacy = "everyone" | "contacts" | "verified";

export interface DbStatus {
  id: string;
  user_id: string;
  kind: StatusKind;
  body: string;
  media_url: string | null;
  background: string | null;
  privacy: StatusPrivacy;
  created_at: string;
  expires_at: string;
}

export interface StatusWithAuthor extends DbStatus {
  author: Profile;
}

export const PRIVACY_LABEL: Record<StatusPrivacy, string> = {
  everyone: "Everyone",
  contacts: "My Contacts",
  verified: "Verified Award Members",
};

export const PRIVACY_HINT: Record<StatusPrivacy, string> = {
  everyone: "Any TIAN member can see your updates",
  contacts: "Only members you have added as contacts",
  verified: "Only verified Award accounts",
};

/** My own live statuses, newest first. */
export function useMyStatuses(me: string | null) {
  return useQuery({
    queryKey: ["my-statuses", me],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("statuses")
        .select("*")
        .eq("user_id", me as string)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false });
      if (error) throw error;
      return ((data ?? []) as DbStatus[]) || [];
    },
    enabled: Boolean(me),
  });
}

/**
 * Everyone else's live statuses. Visibility is enforced by the backend
 * itself — the database only returns rows this member is allowed to see.
 */
export function useStatusFeed(me: string | null) {
  return useQuery({
    queryKey: ["status-feed", me],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("statuses")
        .select("*, author:profiles!statuses_user_id_fkey(*)")
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false });
      if (error) throw error;
      return ((data ?? []) as unknown as StatusWithAuthor[])
        .filter((s) => s.author && s.user_id !== me);
    },
    enabled: Boolean(me),
  });
}

export function useStatus(statusId: string) {
  return useQuery({
    queryKey: ["status", statusId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("statuses")
        .select("*, author:profiles!statuses_user_id_fkey(*)")
        .eq("id", statusId)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as StatusWithAuthor | null) ?? null;
    },
    enabled: Boolean(statusId),
  });
}

export function usePublishStatus(me: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      body: string;
      background?: string;
      privacy: StatusPrivacy;
      file?: File | null;
    }) => {
      if (!me) throw new Error("You need to sign in first.");
      let kind: StatusKind = "text";
      let mediaPath: string | null = null;
      if (input.file) {
        kind = input.file.type.startsWith("video") ? "video" : "photo";
        mediaPath = await uploadMedia(me, input.file);
      }
      const { data, error } = await supabase
        .from("statuses")
        .insert({
          user_id: me,
          kind,
          body: input.body,
          media_url: mediaPath,
          background: input.background ?? null,
          privacy: input.privacy,
        })
        .select("id")
        .single();
      if (error) throw error;
      return (data as { id: string }).id;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["my-statuses", me] });
      void qc.invalidateQueries({ queryKey: ["status-feed", me] });
    },
  });
}

export function useDeleteStatus(me: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (statusId: string) => {
      const { error } = await supabase.from("statuses").delete().eq("id", statusId);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["my-statuses", me] });
    },
  });
}

/** Records that I have seen a status (ignores duplicates). */
export async function markStatusViewed(statusId: string, me: string) {
  await supabase.from("status_views").upsert(
    { status_id: statusId, viewer_id: me },
    { onConflict: "status_id,viewer_id", ignoreDuplicates: true },
  );
}

/** How many members have opened one of my statuses. */
export function useStatusViewCount(statusId: string | null) {
  return useQuery({
    queryKey: ["status-views", statusId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("status_views")
        .select("*", { count: "exact", head: true })
        .eq("status_id", statusId as string);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: Boolean(statusId),
  });
}

/** Which statuses I have already opened, so the feed can dim them. */
export function useViewedStatusIds(me: string | null) {
  return useQuery({
    queryKey: ["status-viewed", me],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("status_views")
        .select("status_id")
        .eq("viewer_id", me as string);
      if (error) throw error;
      return ((data ?? []) as { status_id: string }[]).map((r) => r.status_id);
    },
    enabled: Boolean(me),
  });
}
