import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/lib/directory";

/** Contacts and blocks — always keyed by permanent auth user ids. */

export function useContacts(userId: string | null) {
  return useQuery({
    queryKey: ["contacts", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select("contact_user_id, created_at, profile:profiles!contacts_contact_user_id_fkey(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return ((data ?? []) as unknown as { profile: Profile | null }[])
        .map((row) => row.profile)
        .filter((p): p is Profile => Boolean(p));
    },
    enabled: Boolean(userId),
  });
}

export function useBlocked(userId: string | null) {
  return useQuery({
    queryKey: ["blocks", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("blocks").select("blocked_user_id");
      if (error) throw error;
      return ((data ?? []) as { blocked_user_id: string }[]).map((r) => r.blocked_user_id);
    },
    enabled: Boolean(userId),
  });
}

export function useContactMutations(userId: string | null) {
  const qc = useQueryClient();
  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ["contacts", userId] });
  };

  const add = useMutation({
    mutationFn: async (contactUserId: string) => {
      if (!userId) throw new Error("You need to sign in first.");
      const { error } = await supabase
        .from("contacts")
        .upsert({ user_id: userId, contact_user_id: contactUserId });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (contactUserId: string) => {
      if (!userId) throw new Error("You need to sign in first.");
      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("user_id", userId)
        .eq("contact_user_id", contactUserId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { add, remove };
}

export function useBlockMutations(userId: string | null) {
  const qc = useQueryClient();
  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ["blocks", userId] });
  };

  const block = useMutation({
    mutationFn: async (blockedUserId: string) => {
      if (!userId) throw new Error("You need to sign in first.");
      const { error } = await supabase
        .from("blocks")
        .upsert({ user_id: userId, blocked_user_id: blockedUserId });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const unblock = useMutation({
    mutationFn: async (blockedUserId: string) => {
      if (!userId) throw new Error("You need to sign in first.");
      const { error } = await supabase
        .from("blocks")
        .delete()
        .eq("user_id", userId)
        .eq("blocked_user_id", blockedUserId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { block, unblock };
}
