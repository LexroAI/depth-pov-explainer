import React, { createContext, useContext } from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/BarlowCondensed";
import { BRAND } from "./brand";

const { fontFamily } = loadFont("normal", { weights: ["500", "700", "800"], subsets: ["latin"] });
export const FONT = fontFamily;

/** World palette (desaturated navy/teal water) + the channel accents and character colours from brand.ts. */
export const P = {
  deep0: "#163847",
  deep1: "#0B1D27",
  deep2: "#050C12",
  text: "#EEF3F5",
  dim: "rgba(238,243,245,0.55)",
  threat: BRAND.accent.threat as string,
  safe: BRAND.accent.safe as string,
  danger: BRAND.accent.danger as string,
  whale: "#5C7A92",
  whaleLight: "#8FA9BC",
  whaleDark: "#3D566B",
  whaleBelly: "#B9C9D3",
  krill: "#E8857A",
  suit: BRAND.character_colors.suit as string,
  suit2: BRAND.character_colors.suit2 as string,
  teal: BRAND.character_colors.stripe as string,
  fin: BRAND.character_colors.fins as string,
  fin2: BRAND.character_colors.fins_dark as string,
  lamp: BRAND.character_colors.lamp as string,
  paper: "#E8DCC2",
  paperDark: "#BFAE8C",
  ink: "#3A2F24",
  sky0: "#9AA6AC",
  sky1: "#D9D6CC",
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = Easing.bezier(0.22, 1, 0.36, 1);

/* ---------- timing context: beats resolved relative to the current scene ---------- */
type Ctx = { base: number; bf: Record<string, [number, number]> };
const SceneCtx = createContext<Ctx>({ base: 0, bf: {} });

/** Local frame (relative to scene start) at which beat `id` starts, plus an offset in frames. */
export const useAt = () => {
  const { base, bf } = useContext(SceneCtx);
  return (id: string, off = 0) => (bf[id] ? bf[id][0] - base + off : 0);
};
export const useEndOf = () => {
  const { base, bf } = useContext(SceneCtx);
  return (id: string) => (bf[id] ? bf[id][1] - base : 0);
};

/** A persistent scene spanning beats first..last with a blur-dissolve entrance and camera drift. */
export const Scene: React.FC<{
  name: string;
  bf: Record<string, [number, number]>;
  first: string;
  last: string;
  drift?: number; // total scale drift over the scene, e.g. 0.04
  pan?: [number, number]; // px pan over the scene
  children: React.ReactNode;
}> = ({ name, bf, first, last, drift = 0.035, pan = [0, 0], children }) => {
  const from = bf[first][0];
  const to = bf[last][1];
  return (
    <Sequence name={name} from={from} durationInFrames={to - from + 8}>
      <SceneCtx.Provider value={{ base: from, bf }}>
        <SceneBody dur={to - from} drift={drift} pan={pan}>
          {children}
        </SceneBody>
      </SceneCtx.Provider>
    </Sequence>
  );
};

const SceneBody: React.FC<{ dur: number; drift: number; pan: [number, number]; children: React.ReactNode }> = ({ dur, drift, pan, children }) => {
  const f = useCurrentFrame();
  const inP = interpolate(f, [0, 9], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: inP, filter: inP < 1 ? `blur(${(1 - inP) * 10}px)` : undefined }}>
      <AbsoluteFill
        style={{
          scale: String(interpolate(f, [0, Math.max(dur, 1)], [1, 1 + drift], clamp)),
          translate: `${interpolate(f, [0, Math.max(dur, 1)], [0, pan[0]], clamp)}px ${interpolate(f, [0, Math.max(dur, 1)], [0, pan[1]], clamp)}px`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Camera move inside a scene: keyframed scale/translate (origin = transform origin). */
export const Cam: React.FC<{ keys: [number, number, number, number][]; origin?: string; children: React.ReactNode }> = ({ keys, origin = "50% 50%", children }) => {
  const f = useCurrentFrame();
  const fr = keys.map((k) => k[0]);
  const v = (i: 1 | 2 | 3) => (keys.length > 1 ? interpolate(f, fr, keys.map((k) => k[i]), { ...clamp, easing: Easing.inOut(Easing.cubic) }) : keys[0][i]);
  return <AbsoluteFill style={{ transformOrigin: origin, scale: String(v(1)), translate: `${v(2)}px ${v(3)}px` }}>{children}</AbsoluteFill>;
};

export type Enter = "fade" | "pop" | "up" | "down" | "left" | "right" | "blur" | "none";

/** Shows children from local frame `at` (until `until`) with an entrance. */
export const Show: React.FC<{
  at: number;
  until?: number;
  enter?: Enter;
  exit?: "fade" | "none";
  dist?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, until, enter = "fade", exit = "fade", dist = 80, style, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at || (until !== undefined && f > until + 10)) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 15, stiffness: 120 } });
  const lin = interpolate(f - at, [0, 12], [0, 1], { ...clamp, easing: ease });
  const out = until !== undefined && exit === "fade" ? interpolate(f, [until, until + 10], [1, 0], clamp) : 1;
  let tr = "0px 0px";
  let sc = 1;
  let op = lin;
  let blur = 0;
  if (enter === "pop") { sc = interpolate(s, [0, 1], [0.6, 1]); op = Math.min(1, s * 1.5); }
  if (enter === "up") tr = `0px ${(1 - lin) * dist}px`;
  if (enter === "down") tr = `0px ${-(1 - lin) * dist}px`;
  if (enter === "left") tr = `${-(1 - lin) * dist}px 0px`;
  if (enter === "right") tr = `${(1 - lin) * dist}px 0px`;
  if (enter === "blur") blur = (1 - lin) * 14;
  if (enter === "none") op = 1;
  return (
    <AbsoluteFill style={{ opacity: op * out, translate: tr, scale: String(sc), filter: blur ? `blur(${blur}px)` : undefined, ...style }}>
      {children}
    </AbsoluteFill>
  );
};

/** Absolutely positioned box (top-left anchor, px in 1920x1080). */
export const At: React.FC<{ x: number; y: number; w?: number; h?: number; center?: boolean; style?: React.CSSProperties; children: React.ReactNode }> = ({ x, y, w, h, center, style, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, translate: center ? "-50% -50%" : undefined, ...style }}>{children}</div>
);

/** Small in-world label. tone: neutral (white), threat (yellow + underline), safe (green + check). */
export const Label: React.FC<{ text: string; tone?: "neutral" | "threat" | "safe" | "dim"; size?: number; align?: "left" | "center" | "right"; style?: React.CSSProperties }> = ({
  text,
  tone = "neutral",
  size = 32,
  align = "center",
  style,
}) => {
  const color = tone === "threat" ? P.threat : tone === "safe" ? P.safe : tone === "dim" ? P.dim : P.text;
  return (
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, letterSpacing: size * 0.06, textTransform: "uppercase", color, textAlign: align, whiteSpace: "nowrap", textShadow: "0 2px 12px rgba(0,0,0,0.6)", ...style }}>
      {text}
      {tone === "safe" && (
        <span style={{ display: "inline-flex", marginLeft: size * 0.35, width: size * 0.8, height: size * 0.8, borderRadius: size, background: P.safe, color: "#06210F", fontSize: size * 0.6, alignItems: "center", justifyContent: "center", verticalAlign: "middle" }}>✓</span>
      )}
      {tone === "threat" && <div style={{ height: Math.max(2, size * 0.08), background: P.threat, marginTop: size * 0.12, opacity: 0.9 }} />}
    </div>
  );
};

/** Label that appears at a beat, placed at x,y (center anchor). */
export const Tag: React.FC<{ at: number; until?: number; x: number; y: number; text: string; tone?: "neutral" | "threat" | "safe" | "dim"; size?: number; enter?: Enter }> = ({
  at,
  until,
  x,
  y,
  text,
  tone,
  size,
  enter = "up",
}) => (
  <Show at={at} until={until} enter={enter} dist={20}>
    <At x={x} y={y} center>
      <Label text={text} tone={tone} size={size} />
    </At>
  </Show>
);

/** Sound effect placed at a local frame. */
export const Sfx: React.FC<{ at: number; name: string; vol?: number }> = ({ at, name, vol = 0.5 }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={150} layout="none">
    <Audio src={staticFile(`sfx/${name}.mp3`)} volume={vol} />
  </Sequence>
);

/** Number that counts from `from` to `to` starting at local frame `at`. */
export const Count: React.FC<{ at: number; to: number; from?: number; dur?: number; dec?: number; prefix?: string; suffix?: string; size?: number; color?: string; sub?: string }> = ({
  at,
  to,
  from = 0,
  dur = 30,
  dec = 0,
  prefix = "",
  suffix = "",
  size = 96,
  color = P.text,
  sub,
}) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [at, at + dur], [from, to], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ fontFamily: FONT, fontWeight: 800, color, textAlign: "center", textShadow: "0 4px 24px rgba(0,0,0,0.6)" }}>
      <div style={{ fontSize: size, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
        {prefix}
        {v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec })}
        <span style={{ fontSize: size * 0.45 }}>{suffix}</span>
      </div>
      {sub ? <div style={{ fontSize: size * 0.24, letterSpacing: 3, color: P.dim, marginTop: 6, textTransform: "uppercase" }}>{sub}</div> : null}
    </div>
  );
};

export const useT = () => useCurrentFrame();
