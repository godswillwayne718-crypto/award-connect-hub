import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, PhoneOff, Video, VideoOff, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import type { CallMode, ChatParticipant } from "@/lib/chat-data";
import { ChatAvatar } from "@/components/chat/chat-avatar";
import { cn } from "@/lib/utils";

function clock(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Full-screen call experience (MVP). There is no signalling backend yet, so the
 * remote side is simulated: the callee "answers" after a short ring and video
 * mode shows the local camera preview when the browser grants permission.
 */
export function CallOverlay({
  participant,
  mode,
  onEnd,
}: {
  participant: ChatParticipant;
  mode: CallMode;
  onEnd: (durationSec: number) => void;
}) {
  const [connected, setConnected] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [cameraOn, setCameraOn] = useState(mode === "video");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Simulated answer.
  useEffect(() => {
    const t = window.setTimeout(() => setConnected(true), 2200);
    return () => window.clearTimeout(t);
  }, []);

  // Call timer.
  useEffect(() => {
    if (!connected) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [connected]);

  // Local camera preview for video calls.
  useEffect(() => {
    let cancelled = false;
    async function start() {
      if (mode !== "video" || !cameraOn) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        if (!cancelled) toast("Camera unavailable — continuing without video");
      }
    }
    void start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [mode, cameraOn]);

  const end = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onEnd(seconds);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${mode === "video" ? "Video" : "Voice"} call with ${participant.name}`}
      className="fixed inset-0 z-50 flex justify-center bg-foreground/95 backdrop-blur"
    >
      <div className="relative flex h-dvh w-full max-w-md flex-col items-center justify-between px-6 py-10 text-background">
        {mode === "video" && cameraOn ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 size-full object-cover opacity-70"
          />
        ) : null}

        <div className="relative z-10 flex flex-col items-center gap-3 pt-6 text-center">
          <ChatAvatar name={participant.name} size="lg" />
          <div>
            <p className="font-display text-xl font-extrabold tracking-tight">{participant.name}</p>
            <p className="text-[13px] font-semibold opacity-80">@{participant.username}</p>
          </div>
          <p aria-live="polite" className="text-[13px] font-bold opacity-90">
            {connected ? clock(seconds) : "Ringing…"}
          </p>
        </div>

        <div className="relative z-10 mb-4 flex items-center gap-3">
          <CallButton
            label={muted ? "Unmute microphone" : "Mute microphone"}
            active={muted}
            onClick={() => setMuted((v) => !v)}
          >
            {muted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
          </CallButton>
          <CallButton
            label={speaker ? "Turn speaker off" : "Turn speaker on"}
            active={!speaker}
            onClick={() => setSpeaker((v) => !v)}
          >
            {speaker ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
          </CallButton>
          {mode === "video" ? (
            <CallButton
              label={cameraOn ? "Turn camera off" : "Turn camera on"}
              active={!cameraOn}
              onClick={() => setCameraOn((v) => !v)}
            >
              {cameraOn ? <Video className="size-5" /> : <VideoOff className="size-5" />}
            </CallButton>
          ) : null}
          <button
            type="button"
            aria-label="End call"
            onClick={end}
            className="grid size-14 place-items-center rounded-full bg-destructive text-destructive-foreground shadow-lift transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <PhoneOff className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CallButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "grid size-12 place-items-center rounded-full transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        active ? "bg-background text-foreground" : "bg-background/20 text-background",
      )}
    >
      {children}
    </button>
  );
}
