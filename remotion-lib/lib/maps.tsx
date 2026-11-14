import React, { useMemo } from "react";
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { geoGraticule10, geoOrthographic, geoPath, geoNaturalEarth1, geoInterpolate } from "d3-geo";
import { feature } from "topojson-client";
import land50 from "world-atlas/land-50m.json";
import land110 from "world-atlas/land-110m.json";
import { FONT, P, clamp } from "./core";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const L50: any = feature(land50 as any, (land50 as any).objects.land);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const L110: any = feature(land110 as any, (land110 as any).objects.land);
const GRAT = geoGraticule10();

export type Pin = { lon: number; lat: number; label: string; sub?: string; at: number; color?: string; side?: "left" | "right" };
/** camera key: frame, lon, lat, zoom (1 = whole globe ~ 860px tall) */
export type GlobeKey = [number, number, number, number];

const ease = Easing.inOut(Easing.cubic);

/**
 * Cinematic orthographic globe: real coastlines (Natural Earth via world-atlas), atmosphere glow,
 * keyframed spin/zoom, pins that drop with a pulse and a label card, optional great-circle arcs and a heat region.
 */
export const Globe: React.FC<{
  keys: GlobeKey[];
  pins?: Pin[];
  arcs?: { from: [number, number]; to: [number, number]; at: number; dur?: number }[];
  dots?: { lon: number; lat: number; at: number }[];
  cx?: number;
  cy?: number;
  r?: number;
}> = ({ keys, pins = [], arcs = [], dots = [], cx = 960, cy = 560, r = 430 }) => {
  const f = useCurrentFrame();
  const fr = keys.map((k) => k[0]);
  const v = (i: 1 | 2 | 3) => (keys.length > 1 ? interpolate(f, fr, keys.map((k) => k[i]), { ...clamp, easing: ease }) : keys[0][i]);
  const lon = v(1);
  const lat = v(2);
  const zoom = v(3);
  const proj = geoOrthographic()
    .scale(r * zoom)
    .translate([cx, cy])
    .rotate([-lon, -lat])
    .clipAngle(90);
  const path = geoPath(proj);
  const land = zoom > 2.2 ? L50 : L110;
  const rad = r * zoom;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <radialGradient id="gl-ocean" cx="0.38" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#1F6E8C" />
          <stop offset="0.6" stopColor="#0E3B56" />
          <stop offset="1" stopColor="#06192A" />
        </radialGradient>
        <radialGradient id="gl-atm" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.86" stopColor="rgba(120,200,255,0)" />
          <stop offset="0.93" stopColor="rgba(120,200,255,0.35)" />
          <stop offset="1" stopColor="rgba(120,200,255,0)" />
        </radialGradient>
        <radialGradient id="gl-shade" cx="0.35" cy="0.3" r="0.85">
          <stop offset="0.5" stopColor="rgba(0,0,0,0)" />
          <stop offset="1" stopColor="rgba(0,0,0,0.55)" />
        </radialGradient>
      </defs>
      {zoom < 3 && <circle cx={cx} cy={cy} r={rad * 1.12} fill="url(#gl-atm)" />}
      <circle cx={cx} cy={cy} r={rad} fill="url(#gl-ocean)" />
      <path d={path(GRAT) ?? ""} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
      <path d={path(land) ?? ""} fill="#D8C79E" stroke="#8C7A54" strokeWidth={1.2} />
      {zoom < 3 && <circle cx={cx} cy={cy} r={rad} fill="url(#gl-shade)" />}
      {dots.map((d, i) => {
        const p = proj([d.lon, d.lat]);
        const vis = geoPath(proj)({ type: "Point", coordinates: [d.lon, d.lat] });
        if (!p || !vis) return null;
        const o = interpolate(f, [d.at, d.at + 8], [0, 1], clamp);
        return <circle key={i} cx={p[0]} cy={p[1]} r={7 * o} fill={P.safe} stroke="#06210F" strokeWidth={2} style={{ filter: "drop-shadow(0 0 6px #3DDC84)" }} />;
      })}
      {arcs.map((a, i) => {
        const prog = interpolate(f, [a.at, a.at + (a.dur ?? 40)], [0, 1], { ...clamp, easing: ease });
        if (prog <= 0) return null;
        const ip = geoInterpolate(a.from, a.to);
        const coords = Array.from({ length: 40 }).map((_, k) => ip((k / 39) * prog));
        return <path key={i} d={path({ type: "LineString", coordinates: coords }) ?? ""} fill="none" stroke={P.threat} strokeWidth={4} strokeDasharray="14 10" />;
      })}
      {pins.map((p, i) => {
        const xy = proj([p.lon, p.lat]);
        const vis = geoPath(proj)({ type: "Point", coordinates: [p.lon, p.lat] });
        if (!xy || !vis || f < p.at) return null;
        const drop = interpolate(f, [p.at, p.at + 10], [-60, 0], { ...clamp, easing: Easing.out(Easing.back(2)) });
        const pulse = ((f - p.at) % 45) / 45;
        const col = p.color ?? "#E8322E";
        const card = interpolate(f, [p.at + 8, p.at + 20], [0, 1], { ...clamp, easing: ease });
        const right = p.side !== "left";
        return (
          <g key={i}>
            <circle cx={xy[0]} cy={xy[1]} r={10 + pulse * 60} fill="none" stroke={col} strokeWidth={4} opacity={1 - pulse} />
            <g transform={`translate(${xy[0]} ${xy[1] + drop})`}>
              <path d="M0 0 C-14 -22 -22 -32 -22 -44 A22 22 0 1 1 22 -44 C22 -32 14 -22 0 0 Z" fill={col} stroke="#fff" strokeWidth={3} />
              <circle cx={0} cy={-44} r={8} fill="#fff" />
            </g>
            <g opacity={p.label ? card : 0} transform={`translate(${xy[0] + (right ? 40 : -40)} ${xy[1] - 70})`}>
              <rect x={right ? 0 : -420} y={-34} width={420} height={p.sub ? 96 : 60} rx={10} fill="rgba(4,12,18,0.85)" stroke={col} strokeWidth={2} />
              <text x={right ? 20 : -400} y={6} fontFamily={FONT} fontWeight={800} fontSize={34} letterSpacing={2} fill="#fff">{p.label.toUpperCase()}</text>
              {p.sub && <text x={right ? 20 : -400} y={46} fontFamily={FONT} fontWeight={700} fontSize={26} letterSpacing={1.5} fill={P.threat}>{p.sub.toUpperCase()}</text>}
            </g>
          </g>
        );
      })}
    </svg>
  );
};

/** Flat world (Natural Earth projection) with a coloured range overlay drawn as a band of latitudes. */
export const FlatWorld: React.FC<{ fillOceanBand?: [number, number]; reveal?: number; dots?: { lon: number; lat: number; at: number }[] }> = ({ fillOceanBand, reveal = 1, dots = [] }) => {
  const f = useCurrentFrame();
  const proj = useMemo(() => geoNaturalEarth1().scale(330).translate([960, 560]), []);
  const path = geoPath(proj);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d={path({ type: "Sphere" }) ?? ""} fill="#0E3B56" stroke="rgba(120,200,255,0.3)" strokeWidth={2} />
      {fillOceanBand && (
        <path
          d={
            path({
              type: "Polygon",
              coordinates: [
                [
                  ...Array.from({ length: 73 }).map((_, i) => [-180 + i * 5, fillOceanBand[1]]),
                  ...Array.from({ length: 73 }).map((_, i) => [180 - i * 5, fillOceanBand[0]]),
                  [-180, fillOceanBand[1]],
                ],
              ],
            }) ?? ""
          }
          fill="rgba(232,50,46,0.32)"
          opacity={reveal}
        />
      )}
      <path d={path(GRAT) ?? ""} fill="none" stroke="rgba(255,255,255,0.06)" />
      <path d={path(L110) ?? ""} fill="#D8C79E" stroke="#8C7A54" strokeWidth={1} />
      {dots.map((d, i) => {
        const p = proj([d.lon, d.lat]);
        if (!p) return null;
        const o = interpolate(f, [d.at, d.at + 8], [0, 1], clamp);
        return <circle key={i} cx={p[0]} cy={p[1]} r={9 * o} fill={P.safe} stroke="#06210F" strokeWidth={2} />;
      })}
    </svg>
  );
};
