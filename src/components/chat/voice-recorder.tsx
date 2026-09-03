import { useEffect, useRef, useState } from "react";
import { Mic, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function clock(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Tap-to-record voice notes. Uses MediaRecorder and keeps the clip as a local
 * object URL — no upload, no backend (MVP).
 */
export function VoiceRecorder({
  onRecorded,
}: {
  onRecorded: (audioUrl: string, durationSec: number) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const keepRef = useRef(true);

  useEffect(() => {
    if (!recording) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [recording]);

  async function start() {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      toast("Recording isn't supported on this device");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      keepRef.current = true;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const keep = keepRef.current;
        const length = seconds;
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        setRecording(false);
        setSeconds(0);
        if (!keep) return;
        if (blob.size < 1024) {
          toast("That recording was too short — hold on a moment longer");
          return;
        }
        onRecorded(URL.createObjectURL(blob), Math.max(1, length));
      };
      recorder.start();
      recorderRef.current = recorder;
      setSeconds(0);
      setRecording(true);
    } catch {
      toast("Microphone access is needed to record a voice note");
    }
  }

  function stop(keep: boolean) {
    keepRef.current = keep;
    recorderRef.current?.stop();
    recorderRef.current = null;
  }

  if (!recording) {
    return (
      <button
        type="button"
        aria-label="Record voice note"
        onClick={() => void start()}
        className="grid size-11 shrink-0 place-items-center rounded-full bg-surface text-primary transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <Mic className="size-[18px]" />
      </button>
    );
  }

  return (
    <div className="flex min-h-11 flex-1 items-center gap-2 rounded-3xl border border-destructive/40 bg-destructive/5 px-3">
      <span className="size-2.5 animate-pulse rounded-full bg-destructive" aria-hidden="true" />
      <span aria-live="polite" className="text-[13px] font-bold text-foreground">
        Recording {clock(seconds)}
      </span>
      <span className="flex-1" />
      <button
        type="button"
        aria-label="Discard recording"
        onClick={() => stop(false)}
        className={cn(
          "grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:text-destructive",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        )}
      >
        <Trash2 className="size-[18px]" />
      </button>
      <button
        type="button"
        aria-label="Send voice note"
        onClick={() => stop(true)}
        className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-lift transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <Send className="size-[16px]" />
      </button>
    </div>
  );
}
