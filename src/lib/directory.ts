import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** A real, registered TIAN member. Mirrors the `profiles` table exactly. */
export interface Profile {
  id: string;
  full_name: string;
  username: string;
  email: string | null;
  avatar_url: string | null;
  country: string;
  role: string | null;
  level: string | null;
  centre: string;
  headline: string;
  bio: string;
  interests: string[];
  verified: boolean;
  online: boolean;
  last_seen_at: string;
  created_at: string;
  updated_at: string;
}

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 24;
const USERNAME_PATTERN = /^[a-z0-9_]+$/;

export function normalizeUsername(value: string): string {
  return value.trim().replace(/^@+/, "").toLowerCase();
}

export function validateUsername(value: string): string | null {
  const u = normalizeUsername(value);
  if (u.length < USERNAME_MIN || u.length > USERNAME_MAX) {
    return `Username must be ${USERNAME_MIN}–${USERNAME_MAX} characters.`;
  }
  if (!USERNAME_PATTERN.test(u)) return "Use letters, numbers and underscores only.";
  return null;
}

export function displayName(profile: Pick<Profile, "full_name" | "username">) {
  return profile.full_name.trim() || `@${profile.username}`;
}

/** Debounces any fast-changing value (used for search-as-you-type). */
export function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/** Search the shared directory by name or @username. Backend only. */
export async function searchProfiles(rawQuery: string, excludeIds: string[] = []) {
  const q = rawQuery.trim().replace(/^@+/, "");
  if (q.length < 2) return [];
  const pattern = `%${q.replace(/[%_]/g, "")}%`;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .or(`username.ilike.${pattern},full_name.ilike.${pattern}`)
    .order("username")
    .limit(30);
  if (error) throw error;
  return ((data as Profile[]) ?? []).filter((p) => !excludeIds.includes(p.id));
}

export function useProfileSearch(query: string, excludeIds: string[] = []) {
  const debounced = useDebounced(query);
  const q = debounced.trim().replace(/^@+/, "");
  return {
    ...useQuery({
      queryKey: ["profile-search", q, excludeIds.join(",")],
      queryFn: () => searchProfiles(q, excludeIds),
      enabled: q.length >= 2,
      retry: 1,
    }),
    query: q,
    tooShort: q.length > 0 && q.length < 2,
  };
}

export function useProfileByUsername(username: string) {
  const u = normalizeUsername(username);
  return useQuery({
    queryKey: ["profile-username", u],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .ilike("username", u)
        .maybeSingle();
      if (error) throw error;
      return (data as Profile | null) ?? null;
    },
    enabled: u.length > 0,
  });
}

export function useProfiles(ids: string[]) {
  const key = [...ids].sort().join(",");
  return useQuery({
    queryKey: ["profiles", key],
    queryFn: async () => {
      if (ids.length === 0) return [] as Profile[];
      const { data, error } = await supabase.from("profiles").select("*").in("id", ids);
      if (error) throw error;
      return (data as Profile[]) ?? [];
    },
  });
}

export async function updateMyProfile(userId: string, patch: Partial<Profile>) {
  const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
  if (error) throw error;
}
