import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { Mic, MicOff, Phone, PhoneOff, Video, VideoOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { nameOf } from "@/lib/identity";
import type { Profile } from "@/lib/directory";
import { cn } from "@/lib/utils";

/**
 * Real one-to-one audio/video calls. Media flows peer-to-peer over WebRTC;
 * the backend's realtime broadcast channels carry the call signalling.
 * Every member listens on `call:<their user id>`.
 */

export type CallMode = "audio" | "video";
type Status = "idle" | "outgoing" | "incoming" | "connected";

interface Peer {
  id: string;
  full_name: string;
  username: string;
}

type Signal =
  | { type: "offer"; from: Peer; sdp: RTCSessionDescriptionInit; mode: CallMode; conversationId: string }
  | { type: "answer"; from: string; sdp: RTCSessionDescriptionInit }
  | { type: "ice"; from: string; candidate: RTCIceCandidateInit }
  | { type: "end"; from: string }
  | { type: "decline"; from: string };

interface CallContextValue {
  status: Status;
  startCall: (peer: Profile, mode: CallMode, conversationId: string) => Promise<void>;
}

const CallContext = createContext<CallContextValue>({
  status: "idle",
  startCall: async () => {},
});

const ICE: RTCConfiguration = {
  iceServers: [
    { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
  ],
};

function clock(total: number) {
  const m = Math.floor(total / 60);
  return `${m}:${String(total % 60).padStart(2, "0")}`;
}

async function logCall(
  conversationId: string,
  senderId: string,
  mode: CallMode,
  outcome: "completed" | "missed" | "declined",
  seconds: number,
) {
  const label = mode === "video" ? "Video call" : "Voice call";
  const body =
    outcome === "completed" ? `${label} · ${clock(seconds)}` : outcome === "missed" ? `Missed ${label.toLowerCase()}` : `${label} declined`;
  await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: senderId,
    body,
    kind: "call",
    call_mode: mode,
    call_outcome: outcome,
    duration_sec: outcome === "completed" ? seconds : null,
  });
  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);
}

export function CallProvider({ children }: { children: ReactNode }) {
  const { userId, profile } = useAuth();
  const [status, setStatus] = useState<Status>("idle");
  const [peer, setPeer] = useState<Peer | null>(null);
  const [mode, setMode] = useState<CallMode>("audio");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localRef = useRef<MediaStream | null>(null);
  const pendingOffer = useRef<Extract<Signal, { type: "offer" }> | null>(null);
  const pendingIce = useRef<RTCIceCandidateInit[]>([]);
  const peerChannels = useRef(new Map<string, RealtimeChannel>());
  const ctx = useRef({ peerId: "", conversationId: "", mode: "audio" as CallMode, isCaller: false, connectedAt: 0 });
  const ringTimer = useRef<number | null>(null);
  const statusRef = useRef<Status>("idle");
  statusRef.current = status;

  const channelFor = useCallback(async (id: string) => {
    const existing = peerChannels.current.get(id);
    if (existing) return existing;
    const ch = supabase.channel(`call:${id}`, { config: { broadcast: { self: false } } });
    await new Promise<void>((resolve) => {
      ch.subscribe((s) => {
        if (s === "SUBSCRIBED" || s === "CHANNEL_ERROR" || s === "TIMED_OUT") resolve();
      });
    });
    peerChannels.current.set(id, ch);
    return ch;
  }, []);

  const send = useCallback(
    async (to: string, payload: Signal) => {
      const ch = await channelFor(to);
      await ch.send({ type: "broadcast", event: "signal", payload });
    },
    [channelFor],
  );

  const cleanup = useCallback(() => {
    if (ringTimer.current) window.clearTimeout(ringTimer.current);
    ringTimer.current = null;
    pcRef.current?.close();
    pcRef.current = null;
    localRef.current?.getTracks().forEach((t) => t.stop());
    localRef.current = null;
    pendingOffer.current = null;
    pendingIce.current = [];
    setLocalStream(null);
    setRemoteStream(null);
    setStatus("idle");
    setPeer(null);
    setSeconds(0);
    setMuted(false);
    setCameraOff(false);
  }, []);

  const finish = useCallback(
    (outcome: "completed" | "missed" | "declined") => {
      const c = ctx.current;
      const secs = c.connectedAt ? Math.round((Date.now() - c.connectedAt) / 1000) : 0;
      if (c.isCaller && userId && c.conversationId) {
        void logCall(c.conversationId, userId, c.mode, c.connectedAt ? "completed" : outcome, secs);
      }
      ctx.current.connectedAt = 0;
      cleanup();
    },
    [cleanup, userId],
  );

  const createPc = useCallback(
    (peerId: string) => {
      const pc = new RTCPeerConnection(ICE);
      pc.onicecandidate = (e) => {
        if (e.candidate && userId) void send(peerId, { type: "ice", from: userId, candidate: e.candidate.toJSON() });
      };
      pc.ontrack = (e) => setRemoteStream(e.streams[0] ?? new MediaStream([e.track]));
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "failed") {
          toast.error("The call connection failed.");
          finish("missed");
        }
      };
      pcRef.current = pc;
      return pc;
    },
    [send, userId, finish],
  );

  const getMedia = async (m: CallMode) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: m === "video" });
    localRef.current = stream;
    setLocalStream(stream);
    return stream;
  };

  // Listen for calls addressed to me.
  useEffect(() => {
    if (!userId) return;
    const ch = supabase.channel(`call:${userId}`, { config: { broadcast: { self: false } } });
    ch.on("broadcast", { event: "signal" }, async ({ payload }) => {
      const sig = payload as Signal;
      if (sig.type === "offer") {
        if (statusRef.current !== "idle") {
          void send(sig.from.id, { type: "decline", from: userId });
          return;
        }
        pendingOffer.current = sig;
        ctx.current = { peerId: sig.from.id, conversationId: sig.conversationId, mode: sig.mode, isCaller: false, connectedAt: 0 };
        setPeer(sig.from);
        setMode(sig.mode);
        setStatus("incoming");
        return;
      }
      if (sig.from !== ctx.current.peerId) return;
      if (sig.type === "answer" && pcRef.current) {
        await pcRef.current.setRemoteDescription(sig.sdp);
        for (const c of pendingIce.current) await pcRef.current.addIceCandidate(c).catch(() => {});
        pendingIce.current = [];
        if (ringTimer.current) window.clearTimeout(ringTimer.current);
        ctx.current.connectedAt = Date.now();
        setStatus("connected");
      } else if (sig.type === "ice") {
        const pc = pcRef.current;
        if (pc && pc.remoteDescription) await pc.addIceCandidate(sig.candidate).catch(() => {});
        else pendingIce.current.push(sig.candidate);
      } else if (sig.type === "end") {
        toast("Call ended");
        finish("missed");
      } else if (sig.type === "decline") {
        toast("Call declined");
        finish("declined");
      }
    });
    ch.subscribe();
    const channels = peerChannels.current;
    return () => {
      void supabase.removeChannel(ch);
      channels.forEach((c) => void supabase.removeChannel(c));
      channels.clear();
    };
  }, [userId, send, finish]);

  // Call timer.
  useEffect(() => {
    if (status !== "connected") return;
    const t = window.setInterval(() => {
      setSeconds(Math.round((Date.now() - ctx.current.connectedAt) / 1000));
    }, 1000);
    return () => window.clearInterval(t);
  }, [status]);

  const startCall = useCallback(
    async (target: Profile, m: CallMode, conversationId: string) => {
      if (!userId || !profile) {
        toast.error("Sign in to make calls.");
        return;
      }
      if (statusRef.current !== "idle") return;
      ctx.current = { peerId: target.id, conversationId, mode: m, isCaller: true, connectedAt: 0 };
      setPeer(target);
      setMode(m);
      setStatus("outgoing");
      try {
        const stream = await getMedia(m);
        const pc = createPc(target.id);
        stream.getTracks().forEach((t) => pc.addTrack(t, stream));
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await send(target.id, {
          type: "offer",
          from: { id: userId, full_name: profile.full_name, username: profile.username },
          sdp: offer,
          mode: m,
          conversationId,
        });
        ringTimer.current = window.setTimeout(() => {
          if (statusRef.current === "outgoing") {
            void send(target.id, { type: "end", from: userId });
            toast(`@${target.username} didn't answer`);
            finish("missed");
          }
        }, 35000);
      } catch {
        toast.error("Allow microphone and camera access to call.");
        cleanup();
      }
    },
    [userId, profile, createPc, send, finish, cleanup],
  );

  const accept = async () => {
    const offer = pendingOffer.current;
    if (!offer || !userId) return;
    try {
      const stream = await getMedia(offer.mode);
      const pc = createPc(offer.from.id);
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));
      await pc.setRemoteDescription(offer.sdp);
      for (const c of pendingIce.current) await pc.addIceCandidate(c).catch(() => {});
      pendingIce.current = [];
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await send(offer.from.id, { type: "answer", from: userId, sdp: answer });
      ctx.current.connectedAt = Date.now();
      setStatus("connected");
    } catch {
      toast.error("Allow microphone and camera access to answer.");
      void send(offer.from.id, { type: "decline", from: userId });
      cleanup();
    }
  };

  const decline = () => {
    if (userId && ctx.current.peerId) void send(ctx.current.peerId, { type: "decline", from: userId });
    cleanup();
  };

  const hangUp = () => {
    if (userId && ctx.current.peerId) void send(ctx.current.peerId, { type: "end", from: userId });
    finish("missed");
  };

  const toggleMute = () => {
    const next = !muted;
    localRef.current?.getAudioTracks().forEach((t) => (t.enabled = !next));
    setMuted(next);
  };
  const toggleCamera = () => {
    const next = !cameraOff;
    localRef.current?.getVideoTracks().forEach((t) => (t.enabled = !next));
    setCameraOff(next);
  };

  return (
    <CallContext.Provider value={{ status, startCall }}>
      {children}
      {status !== "idle" && peer ? (
        <CallScreen
          peer={peer}
          mode={mode}
          status={status}
          seconds={seconds}
          muted={muted}
          cameraOff={cameraOff}
          localStream={localStream}
          remoteStream={remoteStream}
          onAccept={() => void accept()}
          onDecline={decline}
          onHangUp={hangUp}
          onToggleMute={toggleMute}
          onToggleCamera={toggleCamera}
        />
      ) : null}
    </CallContext.Provider>
  );
}

export function useCalls() {
  return useContext(CallContext);
}

function StreamVideo({ stream, muted, className }: { stream: MediaStream | null; muted?: boolean; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);
  return <video ref={ref} autoPlay playsInline muted={muted} className={className} />;
}

function CallScreen(props: {
  peer: Peer;
  mode: CallMode;
  status: Status;
  seconds: number;
  muted: boolean;
  cameraOff: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onAccept: () => void;
  onDecline: () => void;
  onHangUp: () => void;
  onToggleMute: () => void;
  onToggleCamera: () => void;
}) {
  const { peer, mode, status, seconds } = props;
  const name = nameOf(peer);
  const showRemoteVideo = mode === "video" && status === "connected" && props.remoteStream;
  const label =
    status === "incoming"
      ? `Incoming ${mode === "video" ? "video" : "voice"} call`
      : status === "outgoing"
        ? "Calling…"
        : clock(seconds);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${mode === "video" ? "Video" : "Voice"} call with ${name}`}
      className="fixed inset-0 z-[100] flex flex-col bg-primary text-primary-foreground"
    >
      {/* Remote stream always mounted so audio plays for voice calls too. */}
      <StreamVideo
        stream={props.remoteStream}
        className={cn("absolute inset-0 size-full object-cover", showRemoteVideo ? "" : "pointer-events-none opacity-0")}
      />

      {!showRemoteVideo ? (
        <div className="relative flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <PersonAvatar name={name} size="lg" className="scale-150" />
          <div className="mt-6">
            <p className="font-display text-2xl font-extrabold">{name}</p>
            <p className="text-sm opacity-80">@{peer.username}</p>
          </div>
          <p className="text-sm font-semibold opacity-90" aria-live="polite">
            {label}
          </p>
        </div>
      ) : (
        <div className="relative flex flex-1 items-start justify-center pt-8">
          <span className="rounded-full bg-primary/60 px-3 py-1 text-sm font-bold">{name} · {label}</span>
        </div>
      )}

      {mode === "video" && props.localStream ? (
        <StreamVideo
          stream={props.localStream}
          muted
          className="absolute right-4 top-4 h-40 w-28 rounded-2xl border-2 border-primary-foreground/40 object-cover"
        />
      ) : null}

      <div className="relative flex items-center justify-center gap-5 px-6 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-6">
        {status === "incoming" ? (
          <>
            <RoundButton label="Decline" onClick={props.onDecline} className="bg-destructive text-destructive-foreground">
              <PhoneOff />
            </RoundButton>
            <RoundButton label="Accept" onClick={props.onAccept} className="bg-accent text-accent-foreground">
              {mode === "video" ? <Video /> : <Phone />}
            </RoundButton>
          </>
        ) : (
          <>
            <RoundButton label={props.muted ? "Unmute" : "Mute"} onClick={props.onToggleMute} className="bg-primary-foreground/15">
              {props.muted ? <MicOff /> : <Mic />}
            </RoundButton>
            {mode === "video" ? (
              <RoundButton label={props.cameraOff ? "Turn camera on" : "Turn camera off"} onClick={props.onToggleCamera} className="bg-primary-foreground/15">
                {props.cameraOff ? <VideoOff /> : <Video />}
              </RoundButton>
            ) : null}
            <RoundButton label="End call" onClick={props.onHangUp} className="bg-destructive text-destructive-foreground">
              <PhoneOff />
            </RoundButton>
          </>
        )}
      </div>
    </div>
  );
}

function RoundButton({ label, onClick, className, children }: { label: string; onClick: () => void; className?: string; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn("grid size-16 place-items-center rounded-full transition-transform active:scale-95 [&_svg]:size-6", className)}
    >
      {children}
    </button>
  );
}
