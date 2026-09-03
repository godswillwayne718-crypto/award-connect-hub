import { useEffect, useRef, useState } from "react";
import { Mic, Pause, Play } from "lucide-react";
import type { Message } from "@/lib/chat-data";
import { cn } from "@/lib/utils";

/** Static waveform bars — deterministic so SSR and client render alike. */
const BARS = [6, 11, 16, 9, 20, 13, 7, 18, 12, 22, 10, 15, 8, 19, 11, 6, 14, 9, 17, 7];

function clock(total: number) {
  const m = Math.floor(total / 60);
  const s = Math.floor(total % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Voice note player used inside a message bubble. */
export function VoiceMessage({ message, mine }: { message: Message; mine: boolean }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const total = message.durationSec ?? 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTime = () => setElapsed(el.currentTime);
    const onEnd = () => {
      setPlaying(false);
      setElapsed(0);
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  if (!message.audioUrl) {
    return (
      <p
        className={cn(
          "flex items-center gap-2 text-[13px] font-semibold",
          mine ? "text-primary-foreground/80" : "text-muted-foreground",
        )}
      >
        <Mic className="size-4" aria-hidden="true" /> Voice message ({clock(total)}) — recording
        not available on this device anymore
      </p>
    );
  }

  const progress = total > 0 ? Math.min(1, elapsed / total) : 0;

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="flex min-w-[190px] items-center gap-3">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause voice message" : "Play voice message"}
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-full transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
          mine ? "bg-primary-foreground/15 text-primary-foreground" : "bg-surface text-primary",
        )}
      >
        {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex h-6 items-center gap-[3px]" aria-hidden="true">
          {BARS.map((h, i) => (
            <span
              key={i}
              style={{ height: `${h}px` }}
              className={cn(
                "w-[3px] rounded-full transition-colors",
                i / BARS.length <= progress
                  ? mine
                    ? "bg-primary-foreground"
                    : "bg-primary"
                  : mine
                    ? "bg-primary-foreground/35"
                    : "bg-border",
              )}
            />
          ))}
        </div>
        <span
          className={cn(
            "mt-0.5 block text-[10.5px] font-bold",
            mine ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {clock(playing || elapsed > 0 ? elapsed : total)}
        </span>
      </div>
      <audio ref={ref} src={message.audioUrl} preload="metadata" className="hidden" />
    </div>
  );
}
