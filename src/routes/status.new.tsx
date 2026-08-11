import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { MobileShell } from "@/components/tian/mobile-shell";
import { Button } from "@/components/ui/button";
import {
  STATUS_MAX_CHARS,
  TEXT_BACKGROUNDS,
  backgroundClass,
  type StatusItem,
} from "@/lib/status-data";
import { publishStatus } from "@/lib/status-store";

export const Route = createFileRoute("/status/new")({
  head: () => ({
    meta: [
      { title: "Add status — TIAN" },
      {
        name: "description",
        content: "Post a 24-hour Award update with text, photos or video to your TIAN network.",
      },
      { property: "og:title", content: "Add status — TIAN" },
      { property: "og:description", content: "Share a 24-hour Award update." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NewStatusScreen,
});

type Draft = Omit<StatusItem, "id">;

function NewStatusScreen() {
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [background, setBackground] = useState(TEXT_BACKGROUNDS[0]!.id);
  const [media, setMedia] = useState<Draft[]>([]);

  const tooLong = caption.length > STATUS_MAX_CHARS;
  const canPost = (media.length > 0 || caption.trim().length > 0) && !tooLong;

  function onPick(files: FileList | null) {
    if (!files) return;
    const picked: Draft[] = Array.from(files).map((file) => ({
      kind: file.type.startsWith("video") ? "video" : "photo",
      src: URL.createObjectURL(file),
      caption: "",
    }));
    setMedia((m) => [...m, ...picked].slice(0, 6));
  }

  function publish() {
    const items: Draft[] =
      media.length > 0
        ? media.map((m, i) => ({ ...m, caption: i === 0 ? caption.trim() : "" }))
        : [{ kind: "text", caption: caption.trim(), background }];
    const id = publishStatus(items);
    if (!id) {
      toast.error("Could not publish your status");
      return;
    }
    toast.success("Status shared for 24 hours");
    void navigate({ to: "/status" });
  }

  return (
    <MobileShell tone="white">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/95 px-4 pb-3 pt-6 backdrop-blur">
        <Link
          to="/status"
          aria-label="Back to status"
          className="grid size-11 shrink-0 place-items-center rounded-full text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="font-display text-xl font-extrabold tracking-tight text-foreground">
          Add status
        </h1>
        <Button
          size="sm"
          variant="default"
          className="ml-auto h-11 rounded-full px-5 text-xs"
          disabled={!canPost}
          onClick={publish}
        >
          Share
        </Button>
      </header>

      <div className="space-y-4 px-4 py-4">
        <div
          className={`rounded-3xl p-4 ${media.length === 0 ? backgroundClass(background) : "border border-border bg-card"}`}
        >
          <label htmlFor="status-caption" className="sr-only">
            Status text
          </label>
          <textarea
            id="status-caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={media.length === 0 ? 5 : 3}
            placeholder="Share an update from your Award journey…"
            className="w-full resize-none bg-transparent text-[15px] font-semibold leading-relaxed outline-none placeholder:text-current/60"
          />
          <p className="mt-1 text-right text-[11px] font-bold opacity-80">
            {caption.length}/{STATUS_MAX_CHARS}
          </p>
        </div>

        {media.length === 0 ? (
          <div className="flex flex-wrap gap-2">
            {TEXT_BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                type="button"
                aria-label={`${bg.label} background`}
                aria-pressed={background === bg.id}
                onClick={() => setBackground(bg.id)}
                className={`size-11 rounded-full ${bg.className} ${background === bg.id ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : ""}`}
              />
            ))}
          </div>
        ) : (
          <ul className="grid grid-cols-3 gap-2">
            {media.map((item, i) => (
              <li key={i} className="relative overflow-hidden rounded-2xl border border-border">
                {item.kind === "video" ? (
                  <video src={item.src} className="aspect-square w-full object-cover" muted />
                ) : (
                  <img src={item.src} alt="" className="aspect-square w-full object-cover" />
                )}
                <button
                  type="button"
                  aria-label="Remove media"
                  onClick={() => setMedia((m) => m.filter((_, idx) => idx !== i))}
                  className="absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-foreground/70 text-background"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-dashed border-border bg-surface px-4 text-[13px] font-bold text-primary">
          <ImagePlus className="size-4" aria-hidden="true" />
          Add photos or video
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            className="sr-only"
            onChange={(e) => onPick(e.target.files)}
          />
        </label>

        <p className="text-center text-[11.5px] text-muted-foreground">
          Updates disappear after 24 hours. Media stays on this device in the MVP.
        </p>
      </div>
    </MobileShell>
  );
}
