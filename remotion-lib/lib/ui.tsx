import React from "react";
import { Video } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, interpolateColors, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, P, clamp, ease } from "./core";
import { BRAND } from "./brand";

/** Rows of claims stacked top-right (reference 0:46-0:56). Each row appears at its frame. */
export const TopList: React.FC<{ rows: { at: number; text: string; tone?: "neutral" | "threat" }[]; x?: number; y?: number }> = ({ rows, x = 1180, y = 120 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", flexDirection: "column", gap: 14 }}>
      {rows.map((r, i) => {
        const p = interpolate(f, [r.at, r.at + 12], [0, 1], { ...clamp, easing: ease });
        if (f < r.at) return null;
        return (
          <div
            key={i}
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 30,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: r.tone === "threat" ? "#1A1405" : P.text,
              background: r.tone === "threat" ? P.threat : "rgba(20,32,40,0.82)",
              padding: "12px 26px",
              width: 560,
              opacity: p,
              translate: `${(1 - p) * 60}px 0px`,
            }}
          >
            {r.text}
          </div>
        );
      })}
    </div>
  );
};

/** Measure line that draws from x1 to x2 with a caption below. */
export const MeasureLine: React.FC<{ at: number; x1: number; x2: number; y: number; text: string; dur?: number; color?: string }> = ({ at, x1, x2, y, text, dur = 18, color = P.text }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing: ease });
  if (f < at) return null;
  const xe = x1 + (x2 - x1) * p;
  return (
    <>
      <div style={{ position: "absolute", left: x1, top: y, width: xe - x1, height: 3, background: color }} />
      <div style={{ position: "absolute", left: x1, top: y - 12, width: 3, height: 27, background: color }} />
      <div style={{ position: "absolute", left: xe - 3, top: y - 12, width: 3, height: 27, background: color, opacity: p }} />
      <div style={{ position: "absolute", left: (x1 + x2) / 2, top: y + 22, translate: "-50% 0", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 2, color, opacity: p }}>{text}</div>
    </>
  );
};

/** Horizontal meter filling green->yellow->red. */
export const Meter: React.FC<{ at: number; to: number; x: number; y: number; w?: number; dur?: number; title?: string; value?: string }> = ({ at, to, x, y, w = 900, dur = 40, title, value }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + dur], [0.02, to], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w }}>
      {title ? <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 2, color: P.threat, textAlign: "center", marginBottom: 26 }}>{title}</div> : null}
      <div style={{ height: 34, borderRadius: 17, background: "rgba(255,255,255,0.08)" }}>
        <div style={{ height: 34, borderRadius: 17, width: `${p * 100}%`, background: `linear-gradient(90deg,${P.safe},${P.threat} 60%,${P.danger})`, backgroundSize: `${w}px 34px` }} />
      </div>
      {value ? <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, color: P.text, textAlign: "center", marginTop: 22, opacity: interpolate(f, [at + dur * 0.5, at + dur], [0, 1], clamp) }}>{value}</div> : null}
    </div>
  );
};

/** Two-bar comparison (old vs new, you vs it). */
export const Bars: React.FC<{ at: number; x: number; y: number; w?: number; rows: { label: string; v: number; color: string; delay?: number }[] }> = ({ at, x, y, w = 900, rows }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, display: "flex", flexDirection: "column", gap: 26 }}>
      {rows.map((r, i) => {
        const p = interpolate(f, [at + (r.delay ?? i * 10), at + (r.delay ?? i * 10) + 24], [0, r.v], { ...clamp, easing: ease });
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 260, fontFamily: FONT, fontWeight: 700, fontSize: 28, letterSpacing: 2, color: P.dim, textAlign: "right" }}>{r.label}</div>
            <div style={{ height: 22, width: `${p * (w - 300)}px`, background: r.color, borderRadius: 3 }} />
          </div>
        );
      })}
    </div>
  );
};

/** Pie chart with a dominant slice. */
export const Pie: React.FC<{ at: number; x: number; y: number; r?: number; main: string; minor: string; frac?: number }> = ({ at, x, y, r = 230, main, minor, frac = 0.97 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 30], [0, 1], { ...clamp, easing: ease });
  const a = frac * p * Math.PI * 2;
  const path = `M0 0 L0 ${-r} A${r} ${r} 0 ${a > Math.PI ? 1 : 0} 1 ${Math.sin(a) * r} ${-Math.cos(a) * r} Z`;
  return (
    <svg width={r * 2} height={r * 2} viewBox={`${-r} ${-r} ${r * 2} ${r * 2}`} style={{ position: "absolute", left: x - r, top: y - r, overflow: "visible" }}>
      <circle r={r} fill="#3A6E86" />
      <path d={path} fill="#E8857A" />
      <text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#2A1110" opacity={p}>{main}</text>
      <text x={r * 0.06} y={-r * 0.82} fontFamily={FONT} fontWeight={700} fontSize={20} fill="#E8F2F5" opacity={p}>{minor}</text>
    </svg>
  );
};

/** Icon array: n icons in a grid that appear in sequence; `fade` frame turns the first `keep` icons on and others dim. */
export const IconArray: React.FC<{ at: number; n: number; cols: number; x: number; y: number; gap?: number; dur?: number; dimAt?: number; keep?: number; render: (i: number) => React.ReactNode }> = ({
  at,
  n,
  cols,
  x,
  y,
  gap = 52,
  dur = 30,
  dimAt,
  keep = 0,
  render,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      {Array.from({ length: n }).map((_, i) => {
        const t0 = at + (i / n) * dur;
        if (f < t0) return null;
        const p = interpolate(f, [t0, t0 + 6], [0, 1], clamp);
        const dim = dimAt !== undefined && i >= keep ? interpolate(f, [dimAt + ((n - i) / n) * 30, dimAt + ((n - i) / n) * 30 + 8], [1, 0.12], clamp) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: (i % cols) * gap, top: Math.floor(i / cols) * gap * 0.75, opacity: p * dim, scale: String(0.6 + 0.4 * p) }}>
            {render(i)}
          </div>
        );
      })}
    </div>
  );
};

/** Vertical depth ruler that scrolls as `depth` (m) changes; marker label on the right. */
export const DepthRuler: React.FC<{ depth: number; x?: number; label?: string; color?: string }> = ({ depth, x = 1700, label, color = P.text }) => {
  const pxPerM = 1.4;
  const ticks = [];
  for (let m = Math.floor((depth - 380) / 50) * 50; m <= depth + 380; m += 50) if (m >= 0) ticks.push(m);
  return (
    <div style={{ position: "absolute", left: x, top: 0, width: 200, height: 1080 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 2, height: 1080, background: "rgba(238,243,245,0.3)" }} />
      {ticks.map((m) => (
        <div key={m} style={{ position: "absolute", left: 0, top: 540 + (m - depth) * pxPerM, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: m % 100 === 0 ? 26 : 12, height: 2, background: "rgba(238,243,245,0.45)" }} />
          {m % 100 === 0 && <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 22, color: P.dim }}>{m} m</div>}
        </div>
      ))}
      <div style={{ position: "absolute", left: -250, top: 520, width: 230, textAlign: "right", fontFamily: FONT, fontWeight: 800, fontSize: 44, color }}>
        {label ?? `${Math.round(depth).toLocaleString("en-US")} m`} ▸
      </div>
    </div>
  );
};

/** ECG trace scrolling; bpm controls spike spacing. */
export const Ecg: React.FC<{ x: number; y: number; w: number; bpm: number; color?: string; title?: string }> = ({ x, y, w, bpm, color = P.safe, title }) => {
  const f = useCurrentFrame();
  const period = (60 / bpm) * 30 * 6; // px between beats (scroll 6px/frame)
  const pts: string[] = [];
  for (let px = 0; px <= w; px += 4) {
    const ph = (((px + f * 6) % period) + period) % period;
    let v = 0;
    if (ph < 10) v = -60 * Math.sin((ph / 10) * Math.PI);
    else if (ph < 18) v = 25 * Math.sin(((ph - 10) / 8) * Math.PI);
    pts.push(`${px},${60 + v}`);
  }
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w }}>
      {title ? <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, letterSpacing: 2, color: P.dim, marginBottom: 6 }}>{title}</div> : null}
      <svg width={w} height={120}>
        <polyline points={pts.join(" ")} stroke={color} strokeWidth={4} fill="none" />
      </svg>
    </div>
  );
};

/** Options list (reference 6:10). highlight index, struck indices. */
export const OptionsList: React.FC<{ items: string[]; hi?: number; struck?: number[]; strikeAt?: number; x?: number; y?: number }> = ({ items, hi = -1, struck = [], strikeAt = -1, x = 640, y = 280 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 640 }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 3, color: P.text, textAlign: "center", marginBottom: 36 }}>YOUR OPTIONS</div>
      {items.map((it, i) => {
        const isStruck = struck.includes(i);
        const animStrike = isStruck && i === struck[struck.length - 1] && strikeAt >= 0 ? interpolate(f, [strikeAt, strikeAt + 10], [0, 1], clamp) : 1;
        return (
          <div
            key={i}
            style={{
              position: "relative",
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 36,
              letterSpacing: 2,
              padding: "12px 24px",
              margin: "8px 0",
              color: isStruck ? P.threat : i === hi ? P.text : P.dim,
              border: i === hi && !isStruck ? `3px solid ${P.threat}` : "3px solid transparent",
              background: i === hi && !isStruck ? "rgba(242,194,48,0.08)" : undefined,
              opacity: isStruck ? 0.75 : 1,
            }}
          >
            {i + 1}. {it}
            {isStruck && <div style={{ position: "absolute", left: 18, top: "52%", height: 4, width: `${animStrike * 90}%`, background: P.threat }} />}
          </div>
        );
      })}
    </div>
  );
};

/** Rubber stamp that slams in at frame `at`. */
export const Stamp: React.FC<{ at: number; text: string; x: number; y: number; color?: string; rot?: number; size?: number }> = ({ at, text, x, y, color = "#D8453B", rot = -8, size = 64 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 9, stiffness: 220 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% -50%",
        rotate: `${rot}deg`,
        scale: String(interpolate(s, [0, 1], [2.2, 1])),
        opacity: Math.min(1, s * 2),
        border: `${size * 0.09}px solid ${color}`,
        color,
        padding: `${size * 0.1}px ${size * 0.35}px`,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: 4,
        mixBlendMode: "normal",
      }}
    >
      {text}
    </div>
  );
};

/** Impact: white flash + shockwave ring + debris, centred at x,y. */
export const Impact: React.FC<{ at: number; x: number; y: number }> = ({ at, x, y }) => {
  const f = useCurrentFrame();
  if (f < at || f > at + 45) return null;
  const t = f - at;
  return (
    <>
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(t, [0, 2, 8], [0, 0.75, 0], clamp) }} />
      <div style={{ position: "absolute", left: x - t * 14, top: y - t * 14, width: t * 28, height: t * 28, borderRadius: 9999, border: "3px solid rgba(255,255,255,0.7)", opacity: interpolate(t, [0, 40], [1, 0], clamp) }} />
      {Array.from({ length: 26 }).map((_, i) => {
        const a = random(`ia${i}`) * Math.PI * 2;
        const sp = 6 + random(`is${i}`) * 14;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.cos(a) * sp * t,
              top: y + Math.sin(a) * sp * t + t * t * 0.15,
              width: 6 + (i % 3) * 4,
              height: 4 + (i % 2) * 4,
              background: i % 3 ? "rgba(230,240,245,0.85)" : "#7A6450",
              rotate: `${t * 20 + i * 30}deg`,
              opacity: interpolate(t, [0, 40], [1, 0], clamp),
            }}
          />
        );
      })}
    </>
  );
};

/** Screen shake offset helper wrapper. */
export const Shake: React.FC<{ at: number; amp?: number; children: React.ReactNode }> = ({ at, amp = 14, children }) => {
  const f = useCurrentFrame();
  const t = f - at;
  const k = t >= 0 && t < 10 ? (1 - t / 10) * amp : 0;
  return <AbsoluteFill style={{ translate: `${Math.sin(t * 2.7) * k}px ${Math.cos(t * 3.1) * k}px` }}>{children}</AbsoluteFill>;
};

/** Expanding rings from a point (sonar / low-frequency hum). */
export const Rings: React.FC<{ x: number; y: number; from?: number; color?: string; period?: number; max?: number; n?: number; arc?: boolean; width?: number }> = ({
  x,
  y,
  from = 0,
  color = "rgba(238,243,245,0.6)",
  period = 90,
  max = 1600,
  n = 4,
  arc,
  width = 3,
}) => {
  const f = useCurrentFrame();
  if (f < from) return null;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const t = (f - from + (i * period) / n) % period;
        const r = interpolate(t, [0, period], [20, max]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - r,
              top: y - r,
              width: r * 2,
              height: r * 2,
              borderRadius: 9999,
              border: `${width}px solid ${color}`,
              clipPath: arc ? "inset(0 0 0 50%)" : undefined,
              opacity: interpolate(t, [0, period], [0.9, 0]),
            }}
          />
        );
      })}
    </>
  );
};

/** Trading card (reference 0:30). */
export const Card: React.FC<{ at: number; x: number; y: number; title: string; caption?: string; captionTone?: "safe" | "threat"; children: React.ReactNode }> = ({ at, x, y, title, caption, captionTone = "safe", children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 14 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 360,
        height: 460,
        translate: "-50% -50%",
        rotate: `${interpolate(s, [0, 1], [12, 0])}deg`,
        scale: String(interpolate(s, [0, 1], [0.7, 1])),
        opacity: s,
        background: "linear-gradient(180deg,#183441,#0C1D26)",
        border: "2px solid rgba(238,243,245,0.25)",
        borderRadius: 18,
        boxShadow: "0 30px 70px rgba(0,0,0,0.6)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "30px 0",
      }}
    >
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 3, color: P.text }}>{title}</div>
      {children}
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 2, color: captionTone === "safe" ? P.safe : P.threat, opacity: caption ? 1 : 0 }}>{caption ?? "-"}</div>
    </div>
  );
};

/** Balance scale tipping toward the heavier side. tilt in degrees (negative = left heavier). */
export const Balance: React.FC<{ x: number; y: number; tilt: number; left: React.ReactNode; right: React.ReactNode }> = ({ x, y, tilt, left, right }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 900, height: 600, translate: "-50% 0" }}>
    <div style={{ position: "absolute", left: 440, top: 120, width: 20, height: 420, background: "#5F6E78" }} />
    <div style={{ position: "absolute", left: 360, top: 530, width: 180, height: 22, background: "#5F6E78", borderRadius: 6 }} />
    <div style={{ position: "absolute", left: 50, top: 110, width: 800, height: 12, background: "#8193A0", rotate: `${tilt}deg`, transformOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", left: -40, top: 12, width: 1, height: 1 }}>
        <div style={{ position: "absolute", left: -100, bottom: -230, width: 280, display: "flex", justifyContent: "center", rotate: `${-tilt}deg` }}>{left}</div>
      </div>
      <div style={{ position: "absolute", right: -40, top: 12, width: 1, height: 1 }}>
        <div style={{ position: "absolute", left: -180, bottom: -230, width: 280, display: "flex", justifyContent: "center", rotate: `${-tilt}deg` }}>{right}</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 436, top: 104, width: 28, height: 28, borderRadius: 14, background: P.threat }} />
  </div>
);

/** Stock clip, graded to the palette, with on-screen credit. */
export const StockClip: React.FC<{ src: string; credit: string; source?: string; trim?: number; dur: number; zoom?: [number, number]; bright?: number }> = ({ src, credit, source = "PIXABAY", trim = 0, dur, zoom = [1.04, 1.12], bright = 0.78 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ scale: String(interpolate(f, [0, dur], zoom, clamp)) }}>
        <Video src={staticFile(src)} muted trimBefore={Math.round(trim * fps)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `saturate(0.7) brightness(${bright}) contrast(1.08)` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,20,30,0.25), rgba(5,20,30,0.5))", mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)" }} />
      <div style={{ position: "absolute", left: 40, bottom: 30, fontFamily: FONT, fontWeight: 600, fontSize: 20, letterSpacing: 1.5, color: "rgba(238,243,245,0.7)" }}>FOOTAGE: {credit}{source ? ` / ${source}` : ""}</div>
    </AbsoluteFill>
  );
};

/** Brand dive-computer HUD (signature frame), small, top-left. */
export const DiveHud: React.FC<{ depth: number; air: number; time: number }> = ({ depth, air, time }) => {
  const f = useCurrentFrame();
  const a = air - (f / 30) * 0.95;
  const t = time + f / 30;
  return (
    <div style={{ position: "absolute", left: 60, top: 54, fontFamily: FONT, fontWeight: 700, fontSize: 24, letterSpacing: 2, color: P.text, background: "rgba(4,12,18,0.55)", border: "1.5px solid rgba(61,220,132,0.45)", borderRadius: 12, padding: "10px 16px", lineHeight: 1.35, width: 190 }}>
      <div style={{ color: P.safe, fontSize: 16, letterSpacing: 3, opacity: Math.floor(f / 15) % 2 ? 1 : 0.5 }}>● DIVE LOG 01</div>
      <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: P.dim }}>DEPTH</span><span>{depth} M</span></div>
      <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: P.dim }}>AIR</span><span style={{ color: a < 1500 ? P.threat : P.safe }}>{Math.round(a)}</span></div>
      <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: P.dim }}>TIME</span><span>{String(Math.floor(t / 60)).padStart(2, "0")}:{String(Math.floor(t % 60)).padStart(2, "0")}</span></div>
    </div>
  );
};

/** Big centred text beat on dark (reference "NO LIGHT." / "SOUND."). */
export const BigText: React.FC<{ at: number; text: string; sub?: string; subAt?: number; tone?: "neutral" | "threat"; size?: number }> = ({ at, text, sub, subAt, tone = "neutral", size = 84 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 10], [0, 1], { ...clamp, easing: ease });
  const q = subAt !== undefined ? interpolate(f, [subAt, subAt + 10], [0, 1], { ...clamp, easing: ease }) : 0;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, letterSpacing: 4, color: tone === "threat" ? P.threat : P.text, opacity: p, filter: `blur(${(1 - p) * 8}px)`, textAlign: "center" }}>{text}</div>
      {sub ? <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size * 0.42, letterSpacing: 3, color: P.threat, opacity: q, marginTop: 18 }}>{sub}</div> : null}
    </AbsoluteFill>
  );
};

export const colorAt = (t: number, a: string, b: string) => interpolateColors(t, [0, 1], [a, b]);

/** Small channel wordmark, bottom-right, last 10 s of the video. */
export const ChannelBug: React.FC<{ name?: string }> = ({ name = BRAND.channel_name.toUpperCase() }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", right: 70, bottom: 60, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 6, color: P.text, opacity: interpolate(f, [0, 20], [0, 0.85], clamp), display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 16, height: 16, borderRadius: 8, background: P.threat }} />
      {name}
    </div>
  );
};
