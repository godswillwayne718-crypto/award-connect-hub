import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Private media bucket shared by Status photos/videos and voice notes. */
export const MEDIA_BUCKET = "tian-media";

function extensionOf(file: File) {
  const fromName = file.name.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  const fromType = file.type.split("/").pop();
  return (fromType ?? "bin").toLowerCase();
}

/** Uploads into the signed-in member's own folder and returns the stored path. */
export async function uploadMedia(userId: string, file: File | Blob, ext?: string) {
  const suffix = file instanceof File ? extensionOf(file) : (ext ?? "webm");
  const path = `${userId}/${crypto.randomUUID()}.${suffix}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  return path;
}

export async function signedUrl(path: string, expiresIn = 3600) {
  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}

/** Resolves a stored media path to a temporary viewable URL. */
export function useSignedUrl(path: string | null | undefined) {
  return useQuery({
    queryKey: ["signed-url", path],
    queryFn: () => signedUrl(path as string),
    enabled: Boolean(path),
    staleTime: 50 * 60 * 1000,
  });
}
