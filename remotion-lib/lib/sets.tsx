import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, random, useCurrentFrame } from "remotion";
import { P, clamp } from "./core";

/** Underwater set: depth 0 (sunlit) .. 1 (abyss), krill 0..1 pink swarm density, dim 0..1 extra darkening. */
export const OceanSet: React.FC<{ depth?: number; krill?: number; rays?: boolean; dimFrom?: number; dimTo?: number; dimAt?: [number, number] }> = ({
  depth = 0.4,
  krill = 0,
  rays = true,
  dimFrom = 0,
  dimTo = 0,
  dimAt,
}) => {
  const f = useCurrentFrame();
  const top = interpolateColors(depth, [0, 0.5, 1], ["#2C6E86", P.deep0, "#071118"]);
  const bot = interpolateColors(depth, [0, 0.5, 1], [P.deep0, P.deep1, P.deep2]);
  const dim = dimAt ? interpolate(f, dimAt, [dimFrom, dimTo], clamp) : dimFrom;
  const rayOp = rays ? interpolate(depth, [0, 0.6], [0.5, 0], clamp) * (1 - dim) : 0;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${top} 0%, ${bot} 85%)` }}>
      <AbsoluteFill style={{ opacity: rayOp }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 80 + i * 220 + Math.sin(f / 70 + i) * 30,
              top: -120,
              width: 70 + (i % 3) * 50,
              height: 1400,
              rotate: `${14 + (i % 3) * 5}deg`,
              transformOrigin: "top center",
              background: "linear-gradient(180deg, rgba(210,240,250,0.32), rgba(210,240,250,0))",
              opacity: 0.35 + 0.35 * Math.sin(f / 45 + i * 1.7),
              filter: "blur(22px)",
            }}
          />
        ))}
      </AbsoluteFill>
      {Array.from({ length: 90 }).map((_, i) => {
        const pink = random(`k${i}`) < krill;
        const sp = 0.12 + random(`s${i}`) * 0.4;
        const y0 = random(`y${i}`) * 1200;
        const y = (((y0 - f * sp) % 1200) + 1200) % 1200 - 60;
        const s = pink ? 5 + random(`z${i}`) * 9 : 2 + random(`z${i}`) * 3;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: random(`x${i}`) * 1920 + Math.sin(f / 35 + i) * 14,
              top: y,
              width: pink ? s * 2.4 : s,
              height: s,
              borderRadius: s,
              rotate: pink ? `${random(`r${i}`) * 180}deg` : undefined,
              background: pink ? "rgba(236,140,128,0.75)" : "rgba(205,232,240,0.28)",
              filter: pink && s > 10 ? "blur(1px)" : undefined,
            }}
          />
        );
      })}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(2,6,9,0.75) 100%)" }} />
      {dim > 0 && <AbsoluteFill style={{ background: "#01060A", opacity: dim }} />}
    </AbsoluteFill>
  );
};

/** Surface split: overcast sky on top, waterline at `line` px, underwater below. */
export const SurfaceSet: React.FC<{ line?: number; tint?: "day" | "dusk" }> = ({ line = 360, tint = "day" }) => {
  const f = useCurrentFrame();
  const sky = tint === "day" ? ["#AEB8BC", "#DCD9CF"] : ["#6B6A66", "#C9B79A"];
  const pts = Array.from({ length: 41 }).map((_, i) => `${i * 48},${line + Math.sin(i * 0.7 + f / 18) * 5}`).join(" ");
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${sky[0]}, ${sky[1]})`, height: line + 20 }} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2A5E72" />
            <stop offset="0.5" stopColor="#14394A" />
            <stop offset="1" stopColor="#081A24" />
          </linearGradient>
        </defs>
        <polygon points={`0,1080 ${pts} 1920,1080`} fill="url(#sea)" />
        <polyline points={pts} stroke="rgba(255,255,255,0.35)" strokeWidth={2} fill="none" />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Sepia paper set for history and documents. */
export const PaperSet: React.FC<{ wood?: boolean }> = ({ wood }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: wood ? "linear-gradient(180deg,#3B2A1E,#24180F)" : `radial-gradient(ellipse at 50% 45%, ${P.paper}, #B9A47E)` }}>
      {!wood &&
        Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: random(`g${i}-${Math.floor(f / 4)}`) * 1920, top: 0, width: 1.5, height: 1080, background: "rgba(58,47,36,0.12)" }} />
        ))}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 65% at 50% 50%, rgba(0,0,0,0) 50%, rgba(30,20,10,0.6) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Plain dark set for text beats and diagrams. */
export const DarkSet: React.FC<{ red?: boolean }> = ({ red }) => (
  <AbsoluteFill style={{ background: red ? "radial-gradient(ellipse at 50% 45%, #5A1C1C, #1A0707)" : `radial-gradient(ellipse at 50% 40%, #12303D, ${P.deep2})` }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 65% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)" }} />
  </AbsoluteFill>
);

/** Green x-ray / scanner set. */
export const XraySet: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#03140C" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: 0.25 }}>
        {Array.from({ length: 25 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 80} y1={0} x2={i * 80} y2={1080} stroke="#2DD27A" strokeWidth={1} />
        ))}
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 80} x2={1920} y2={i * 80} stroke="#2DD27A" strokeWidth={1} />
        ))}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: ((f * 9) % 1300) - 110, height: 110, background: "linear-gradient(180deg, rgba(45,210,122,0), rgba(45,210,122,0.22), rgba(45,210,122,0))" }} />
    </AbsoluteFill>
  );
};

/** Stylised map: dark sea with grid, land drawn by `land` path(s) in a 1920x1080 frame. */
export const MapSet: React.FC<{ land: string[] }> = ({ land }) => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 50%, #123447, #071822)" }}>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      {Array.from({ length: 13 }).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 90} x2={1920} y2={i * 90} stroke="rgba(255,255,255,0.05)" />
      ))}
      {Array.from({ length: 22 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 90} y1={0} x2={i * 90} y2={1080} stroke="rgba(255,255,255,0.05)" />
      ))}
      {land.map((d, i) => (
        <path key={i} d={d} fill="#2E4A3C" stroke="#5F8A6E" strokeWidth={3} />
      ))}
    </svg>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)" }} />
  </AbsoluteFill>
);
