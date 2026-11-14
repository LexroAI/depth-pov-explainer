import React from "react";
import { random, useCurrentFrame } from "remotion";
import { P } from "./core";

/* =====================================================================
   BLUE WHALE - side view, faces LEFT. viewBox 1000 x 300.
   Flukes are horizontal, so in side view they read as a thin blade.
   mouth: 0 closed .. 1 lunge (lower jaw drops ~30deg, pleated throat balloons).
   ===================================================================== */
const rot = (x: number, y: number, cx: number, cy: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  const dx = x - cx;
  const dy = y - cy;
  return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)];
};
const lerp = (a: number[], b: number[], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

export const BlueWhale: React.FC<{ w?: number; mouth?: number; swim?: number; silhouette?: boolean; tag?: boolean; baleen?: boolean; krillIn?: boolean; style?: React.CSSProperties; id?: string }> = ({
  w = 1400,
  mouth = 0,
  swim = 1,
  silhouette,
  tag,
  baleen,
  krillIn,
  style,
  id = "bw",
}) => {
  const f = useCurrentFrame();
  const und = Math.sin(f / 18) * 5 * swim;
  const H = [480, 182];
  const L = rot(30, 186, H[0], H[1], -mouth * 24);
  const B = [610, 214];
  const C = [(L[0] + B[0]) / 2 - 20, Math.max(L[1], B[1]) + 34 + mouth * 120];
  const body = silhouette ? "#04090D" : `url(#${id}-body)`;
  const dark = silhouette ? "#04090D" : "#2F4558";
  const showBaleen = !silhouette && (baleen || mouth > 0.15);
  return (
    <svg width={w} height={w * 0.3} viewBox="0 0 1000 300" style={{ overflow: "visible", ...style }}>
      <defs>
        <linearGradient id={`${id}-body`} gradientUnits="userSpaceOnUse" x1="0" y1="100" x2="0" y2="222">
          <stop offset="0" stopColor="#33495B" />
          <stop offset="0.4" stopColor="#557489" />
          <stop offset="0.78" stopColor="#86A0B2" />
          <stop offset="1" stopColor="#A9BCC9" />
        </linearGradient>
        <linearGradient id={`${id}-pouch`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B7C8D3" />
          <stop offset="1" stopColor="#7E97A9" />
        </linearGradient>
      </defs>
      {!silhouette && <ellipse cx="470" cy="272" rx="440" ry="18" fill="rgba(0,0,0,0.2)" />}
      {/* tail stock + horizontal fluke (beats up and down) */}
      <g transform={`rotate(${und} 640 170)`}>
        <path d="M540 116 C700 132 800 152 872 164 L872 176 C800 186 700 204 540 216 Z" fill={body} />
        <path d="M748 152 C760 138 774 134 790 136 C784 146 776 152 768 156 Z" fill={dark} />
        <g transform={`rotate(${und * 1.6} 868 170)`}>
          <path d="M860 164 C900 156 950 146 998 142 C996 156 962 172 906 180 C884 182 868 180 860 176 Z" fill={dark} />
          <path d="M870 166 C910 160 950 152 990 148" stroke="rgba(255,255,255,0.12)" strokeWidth={3} fill="none" />
        </g>
      </g>
      {/* open mouth interior */}
      {mouth > 0.02 && <path d={`M24 170 L${H[0]} ${H[1]} L${L[0]} ${L[1]} Z`} fill="#081016" />}
      {krillIn && mouth > 0.3 &&
        Array.from({ length: 22 }).map((_, i) => {
          const t = (f * 0.02 + i / 22) % 1;
          const p = lerp([20 - 80 * (1 - t), 150 + random(`ki${i}`) * 80], [300, 186], t);
          return <ellipse key={i} cx={p[0]} cy={p[1]} rx={5} ry={2.4} fill="#E8857A" opacity={0.85} />;
        })}
      {/* lower jaw + pleated throat pouch */}
      <path d={`M${H[0]} ${H[1]} L${L[0]} ${L[1]} Q${C[0]} ${C[1]} ${B[0]} ${B[1]} Z`} fill={silhouette ? body : `url(#${id}-pouch)`} />
      {!silhouette &&
        Array.from({ length: 14 }).map((_, k) => {
          const t = (k + 1) / 15;
          const s0 = lerp(L, H, 0.02 + t * 0.12);
          const s1 = lerp(B, H, t * 0.35);
          const mid = lerp(lerp(L, H, 0.5), C, t);
          return <path key={k} d={`M${s0[0]} ${s0[1]} Q${mid[0]} ${mid[1]} ${s1[0]} ${s1[1]}`} stroke="#6A8396" strokeWidth={1.6} fill="none" opacity={0.85} />;
        })}
      {!silhouette && <path d={`M${H[0]} ${H[1]} L${L[0]} ${L[1]}`} stroke="#3B5366" strokeWidth={6} strokeLinecap="round" />}
      {/* main body (head top to belly), mouth line as its lower edge */}
      <path
        d="M20 166 C24 134 84 114 176 108 C330 96 500 102 650 124 C676 150 676 190 650 210 C630 214 616 214 604 214 L480 182 C340 182 170 178 26 175 C20 173 18 170 20 166 Z"
        fill={body}
      />
      {showBaleen &&
        Array.from({ length: 46 }).map((_, i) => {
          const p = lerp([30, 173], [470, 182], i / 46);
          const len = 10 + mouth * 34 * Math.sin((i / 46) * Math.PI);
          return <line key={i} x1={p[0]} y1={p[1]} x2={p[0] + 1} y2={p[1] + len} stroke={i % 2 ? "#2A2A24" : "#4A463C"} strokeWidth={4} />;
        })}
      {!silhouette && (
        <g>
          <path d="M34 156 C90 136 170 124 240 120" stroke="#2A3E4F" strokeWidth={3} fill="none" opacity={0.7} />
          <path d="M232 112 C246 104 262 104 274 112" stroke="#2A3E4F" strokeWidth={5} fill="none" />
          {Array.from({ length: 70 }).map((_, i) => (
            <ellipse
              key={i}
              cx={110 + random(`${id}mx${i}`) * 720}
              cy={118 + random(`${id}my${i}`) * 70}
              rx={3 + random(`${id}mr${i}`) * 10}
              ry={2 + random(`${id}mq${i}`) * 4}
              fill={random(`${id}mc${i}`) > 0.72 ? "#A3B9C8" : "#2E4456"}
              opacity={0.3}
            />
          ))}
          <path d="M110 122 C300 104 480 108 640 128" stroke="rgba(255,255,255,0.16)" strokeWidth={7} fill="none" strokeLinecap="round" />
          <ellipse cx="458" cy="170" rx="7" ry="5" fill="#0D1820" />
          <circle cx="460" cy="168.5" r="1.6" fill="#DDE8EE" />
          <path d="M448 162 C455 158 465 158 470 163" stroke="#2A3E4F" strokeWidth={2} fill="none" />
        </g>
      )}
      {/* long pectoral flipper */}
      <g transform={`rotate(${Math.sin(f / 24) * 5 * swim} 520 200)`}>
        <path d="M506 196 C540 232 580 262 636 274 C626 256 592 222 552 196 Z" fill={dark} />
        {!silhouette && <path d="M516 200 C552 230 590 256 630 270" stroke="#B5C7D3" strokeWidth={3} fill="none" opacity={0.55} />}
      </g>
      {tag && (
        <g>
          <rect x="560" y="98" width="34" height="16" rx="5" fill="#E9A23B" />
          <line x1="577" y1="98" x2="577" y2="84" stroke="#333" strokeWidth={2} />
        </g>
      )}
    </svg>
  );
};

/* =====================================================================
   BLUE WHALE - FRONT VIEW LUNGE (coming at camera). viewBox 1000 x 760.
   open: 0..1. Baleen curtain, dark maw, ballooned pleated throat.
   ===================================================================== */
export const BlueWhaleFront: React.FC<{ w?: number; open?: number; style?: React.CSSProperties; krill?: boolean }> = ({ w = 1200, open = 1, style, krill = true }) => {
  const f = useCurrentFrame();
  const o = Math.max(0.05, open);
  const mawH = 80 + o * 260;
  return (
    <svg width={w} height={w * 0.76} viewBox="0 0 1000 760" style={{ overflow: "visible", ...style }}>
      <defs>
        <radialGradient id="bwf-head" cx="0.5" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#6E8CA2" />
          <stop offset="1" stopColor="#2E4456" />
        </radialGradient>
        <radialGradient id="bwf-maw" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#1A1012" />
          <stop offset="1" stopColor="#050709" />
        </radialGradient>
        <linearGradient id="bwf-pouch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9FB4C3" />
          <stop offset="1" stopColor="#5E788C" />
        </linearGradient>
      </defs>
      <path d="M150 360 C80 420 30 520 10 600 C70 560 140 470 200 400 Z" fill="#2F4558" />
      <path d="M850 360 C920 420 970 520 990 600 C930 560 860 470 800 400 Z" fill="#2F4558" />
      <path d={`M150 ${250 + o * 40} C150 ${620 + o * 360} 850 ${620 + o * 360} 850 ${250 + o * 40} Z`} fill="#8CA3B4" />
      <clipPath id="bwf-clip">
        <path d={`M150 ${250 + o * 40} C150 ${620 + o * 360} 850 ${620 + o * 360} 850 ${250 + o * 40} Z`} />
      </clipPath>
      <g clipPath="url(#bwf-clip)">
      {Array.from({ length: 16 }).map((_, i) => {
        const x = 170 + i * 44;
        return <path key={i} d={`M${x} ${300 + o * 40} Q${500 + (x - 500) * 0.7} ${640 + o * 300} ${500 + (x - 500) * 0.12} ${760 + o * 200}`} stroke="#4E677A" strokeWidth={3} fill="none" opacity={0.7} />;
      })}
      </g>
      <path d={`M140 ${240 + o * 40} C200 ${250 + mawH} 800 ${250 + mawH} 860 ${240 + o * 40}`} stroke="#3B5366" strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d={`M160 230 C240 ${230 + mawH * 1.05} 760 ${230 + mawH * 1.05} 840 230 C700 250 300 250 160 230 Z`} fill="url(#bwf-maw)" />
      {Array.from({ length: 60 }).map((_, i) => {
        const x = 175 + i * 11;
        const t = Math.sin((i / 60) * Math.PI);
        return <line key={i} x1={x} y1={236 + (1 - t) * 6} x2={x} y2={236 + 40 + t * (30 + o * 40)} stroke={i % 2 ? "#BDB39C" : "#8C8270"} strokeWidth={6} />;
      })}
      <path d="M120 240 C120 120 300 40 500 40 C700 40 880 120 880 240 C760 214 240 214 120 240 Z" fill="url(#bwf-head)" />
      <path d="M440 70 C470 60 530 60 560 70" stroke="#22323F" strokeWidth={8} fill="none" />
      {Array.from({ length: 40 }).map((_, i) => (
        <ellipse key={i} cx={180 + random(`fh${i}`) * 640} cy={80 + random(`fv${i}`) * 140} rx={4 + random(`fr${i}`) * 9} ry={2 + random(`fq${i}`) * 4} fill={random(`fc${i}`) > 0.7 ? "#A3B9C8" : "#2A3E4F"} opacity={0.35} />
      ))}
      <ellipse cx="150" cy="262" rx="9" ry="6" fill="#0D1820" />
      <ellipse cx="850" cy="262" rx="9" ry="6" fill="#0D1820" />
      {krill &&
        Array.from({ length: 70 }).map((_, i) => {
          const t = (f * 0.018 + random(`kk${i}`)) % 1;
          const a = random(`ka${i}`) * Math.PI * 2;
          const r0 = 520 + random(`kr${i}`) * 300;
          const x = 500 + Math.cos(a) * r0 * (1 - t);
          const y = 300 + Math.sin(a) * r0 * 0.7 * (1 - t);
          return <ellipse key={i} cx={x} cy={y} rx={9 * (1 - t * 0.6)} ry={4 * (1 - t * 0.6)} fill="#E8857A" opacity={0.9 * (1 - t * 0.7)} transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`} />;
        })}
    </svg>
  );
};

/* =====================================================================
   DIVER (brand "you"): suit, stripe, fin and lamp colours come from brand.ts. Faces RIGHT.
   viewBox 400 x 160. Anatomy reads clearly: two legs with knees, torso + BCD,
   neck, round hooded head, framed mask, regulator, two arms with elbows, hand torch.
   ===================================================================== */
export const Diver: React.FC<{ w?: number; beam?: boolean; silhouette?: boolean; xray?: boolean; kick?: number; bubbles?: boolean; style?: React.CSSProperties }> = ({
  w = 420,
  beam = true,
  silhouette,
  xray,
  kick = 1,
  bubbles = true,
  style,
}) => {
  const f = useCurrentFrame();
  const k = Math.sin(f / 7) * 9 * kick;
  const S = silhouette ? "#02070A" : null;
  const near = S ?? (xray ? "rgba(45,210,122,0.22)" : "#353D43"); // near-side limbs, lighter
  const far = S ?? (xray ? "rgba(45,210,122,0.14)" : "#20262A"); // far-side limbs, darker
  const torso = S ?? (xray ? "rgba(45,210,122,0.18)" : "#2B3237");
  const bcd = S ?? (xray ? "rgba(45,210,122,0.1)" : "#181D20");
  const hood = S ?? (xray ? "rgba(45,210,122,0.25)" : "#1C2226");
  const fin = S ?? (xray ? "rgba(45,210,122,0.45)" : P.fin);
  const fin2 = S ?? (xray ? "rgba(45,210,122,0.3)" : P.fin2);
  const teal = S ?? (xray ? "#2DD27A" : P.teal);
  const line = xray ? "rgba(45,210,122,0.55)" : silhouette ? "none" : "#0E1215";
  const lw = xray ? 2 : 1.4;
  /** a two-segment limb (hip->knee->ankle) drawn as a thick tapered stroke */
  const limb = (pts: number[][], width: number, color: string) => (
    <>
      <path d={`M${pts[0][0]} ${pts[0][1]} L${pts[1][0]} ${pts[1][1]} L${pts[2][0]} ${pts[2][1]}`} stroke={line} strokeWidth={width + lw * 2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${pts[0][0]} ${pts[0][1]} L${pts[1][0]} ${pts[1][1]}`} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" />
      <path d={`M${pts[1][0]} ${pts[1][1]} L${pts[2][0]} ${pts[2][1]}`} stroke={color} strokeWidth={width * 0.82} fill="none" strokeLinecap="round" />
    </>
  );
  // legs: hip -> knee -> ankle, kicking out of phase
  const farLeg = [[206, 86], [160, 80 - k * 0.4], [118, 76 - k]];
  const nearLeg = [[206, 94], [160, 100 + k * 0.4], [118, 104 + k]];
  const finShape = (ax: number, ay: number, up: number) =>
    `M${ax + 4} ${ay - 7} L${ax - 70} ${ay - 14 + up} L${ax - 78} ${ay + 2 + up} L${ax - 70} ${ay + 16 + up} L${ax + 4} ${ay + 7} Z`;
  return (
    <div style={{ position: "relative", width: w, height: w * 0.4, ...style }}>
      <svg width={w} height={w * 0.4} viewBox="0 0 400 160" style={{ overflow: "visible", position: "absolute" }}>
        <defs>
          <linearGradient id="beamG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(255,244,194,0.45)" />
            <stop offset="1" stopColor="rgba(255,244,194,0)" />
          </linearGradient>
          <linearGradient id="tankG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F4F6F7" />
            <stop offset="1" stopColor="#AAB3B8" />
          </linearGradient>
        </defs>
        {beam && !silhouette && !xray && <path d="M360 52 L760 -40 L760 150 Z" fill="url(#beamG)" opacity={0.9} />}

        {/* far leg + fin (behind body) */}
        <path d={finShape(farLeg[2][0], farLeg[2][1], -k * 0.3)} fill={fin2} stroke={line} strokeWidth={lw} />
        {limb(farLeg, 15, far)}
        {/* far arm (behind body), reaching forward-down */}
        {limb([[292, 84], [322, 100], [352, 104]], 11, far)}

        {/* tank on the back + valve */}
        {!xray && (
          <g>
            <rect x="214" y="50" width="96" height="24" rx="12" fill={S ?? "url(#tankG)"} stroke={line} strokeWidth={lw} />
            <rect x="306" y="55" width="10" height="13" rx="3" fill={S ?? "#5B6469"} />
          </g>
        )}

        {/* torso */}
        <path d="M200 78 C230 70 280 68 304 74 C314 78 316 96 306 104 C280 110 230 110 200 102 Z" fill={torso} stroke={line} strokeWidth={lw} />
        {xray ? (
          <g>
            <ellipse cx="282" cy="88" rx="18" ry="11" fill="rgba(200,255,220,0.8)" />
            <ellipse cx="256" cy="88" rx="18" ry="11" fill="rgba(200,255,220,0.8)" />
            {Array.from({ length: 6 }).map((_, i) => (
              <path key={i} d={`M${240 + i * 9} 76 C${244 + i * 9} 88 ${244 + i * 9} 96 ${240 + i * 9} 104`} stroke="#9FF5C4" strokeWidth={2} fill="none" />
            ))}
          </g>
        ) : (
          <g>
            {/* BCD vest + teal stripe + weight belt */}
            <path d="M232 74 L298 72 C306 80 306 98 298 106 L232 106 Z" fill={bcd} />
            <rect x="236" y="86" width="64" height="5" rx="2.5" fill={teal} />
            <rect x="210" y="76" width="9" height="30" rx="2" fill={S ?? "#4A5358"} />
          </g>
        )}

        {/* neck */}
        <path d="M300 76 C308 72 318 74 324 80 L320 94 C312 96 304 96 300 94 Z" fill={hood} stroke={line} strokeWidth={lw} />
        {/* head (hood) */}
        <circle cx="332" cy="70" r="17" fill={hood} stroke={line} strokeWidth={lw} />
        {!silhouette && (
          <g>
            {/* mask strap */}
            <path d="M318 64 C326 60 336 60 342 62" stroke="#0B0E10" strokeWidth={4} fill="none" />
            {/* mask: frame + glass + glare */}
            <rect x="337" y="58" width="20" height="16" rx="4" fill="#0B0E10" />
            <rect x="340" y="60.5" width="14.5" height="11" rx="2.5" fill={xray ? "rgba(45,210,122,0.5)" : "#7FC6D8"} />
            <path d="M342 62 L349 62 L343 69 Z" fill="rgba(255,255,255,0.6)" />
            {/* regulator mouthpiece + hose to the tank valve */}
            <circle cx="345" cy="82" r="4.5" fill="#0B0E10" />
            {!xray && <path d="M341 84 C330 92 318 70 314 62" stroke="#0B0E10" strokeWidth={3.2} fill="none" />}
            {/* mask lamp */}
            <rect x="341" y="50" width="12" height="7" rx="2" fill="#3B4248" />
            <circle cx="354" cy="53.5" r="3.6" fill={P.lamp} />
          </g>
        )}

        {/* near leg + fin (in front) */}
        {limb(nearLeg, 16, near)}
        <path d={finShape(nearLeg[2][0], nearLeg[2][1], k * 0.3)} fill={fin} stroke={line} strokeWidth={lw} />
        <path d={`M${nearLeg[2][0] - 8} ${nearLeg[2][1] - 2} L${nearLeg[2][0] - 66} ${nearLeg[2][1] - 6 + k * 0.3}`} stroke="rgba(0,0,0,0.25)" strokeWidth={2} />
        {/* near arm: shoulder -> elbow -> glove holding a small torch */}
        {limb([[296, 90], [326, 104], [358, 100]], 12, near)}
        <circle cx="361" cy="100" r="5.5" fill={S ?? "#0B0E10"} />
        {!silhouette && !xray && (
          <g>
            <rect x="364" y="96" width="16" height="8" rx="3" fill="#C9D1D5" />
            <circle cx="381" cy="100" r="3.6" fill={P.lamp} />
          </g>
        )}
      </svg>
      {bubbles && !silhouette &&
        Array.from({ length: 7 }).map((_, i) => {
          const t = (f + i * 8) % 56;
          const s = (6 + (i % 3) * 4) * (w / 420);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: w * 0.855 + Math.sin((f + i * 17) / 6) * 6,
                top: w * 0.18 - t * 3.4 * (w / 420),
                width: s,
                height: s,
                borderRadius: 40,
                border: "2px solid rgba(225,245,250,0.75)",
                opacity: t < 40 ? 0.9 : (56 - t) / 18,
              }}
            />
          );
        })}
    </div>
  );
};

/* ===================== supporting illustrations ===================== */
type A = { w?: number; style?: React.CSSProperties };

export const Krill: React.FC<A & { flip?: boolean }> = ({ w = 160, style, flip }) => (
  <svg width={w} height={w * 0.45} viewBox="0 0 200 90" style={{ overflow: "visible", scale: flip ? "-1 1" : undefined, ...style }}>
    <path d="M18 50 C30 26 90 18 140 28 C168 34 186 44 184 52 C170 60 120 66 70 64 C40 62 20 60 18 50 Z" fill="#E7887C" />
    <path d="M60 30 C80 24 120 24 140 30" stroke="#F4B2A8" strokeWidth={4} fill="none" />
    {Array.from({ length: 6 }).map((_, i) => (
      <path key={i} d={`M${46 + i * 16} 34 C${44 + i * 16} 46 ${44 + i * 16} 54 ${48 + i * 16} 62`} stroke="#C9665B" strokeWidth={2} fill="none" />
    ))}
    {Array.from({ length: 8 }).map((_, i) => (
      <path key={i} d={`M${60 + i * 12} 62 L${54 + i * 12} 82`} stroke="#D9776B" strokeWidth={2.4} />
    ))}
    <path d="M184 48 L200 30 M184 50 L202 44 M182 54 L198 66" stroke="#E7887C" strokeWidth={2} />
    <path d="M18 50 L2 40 L4 56 Z" fill="#D9776B" />
    <circle cx="166" cy="42" r="6" fill="#1A1414" />
    <circle cx="168" cy="40" r="2" fill="#fff" />
  </svg>
);

export const SchoolBus: React.FC<A> = ({ w = 360, style }) => (
  <svg width={w} height={w * 0.36} viewBox="0 0 300 108" style={{ overflow: "visible", ...style }}>
    <ellipse cx="150" cy="102" rx="140" ry="6" fill="rgba(0,0,0,0.3)" />
    <path d="M8 20 C8 12 14 8 22 8 L262 8 C276 8 284 16 288 30 L296 62 L296 86 L8 86 Z" fill="#E3A928" />
    <rect x="8" y="58" width="288" height="5" fill="#2A2A2A" />
    <rect x="8" y="70" width="288" height="3" fill="#2A2A2A" />
    {Array.from({ length: 9 }).map((_, i) => (
      <rect key={i} x={20 + i * 27} y="18" width="22" height="26" rx="3" fill="#2B3A44" />
    ))}
    <path d="M268 18 L284 18 L290 44 L268 44 Z" fill="#3D5260" />
    <rect x="286" y="66" width="10" height="8" fill="#F5E6A8" />
    <circle cx="60" cy="88" r="14" fill="#1C1C1C" />
    <circle cx="60" cy="88" r="6" fill="#777" />
    <circle cx="240" cy="88" r="14" fill="#1C1C1C" />
    <circle cx="240" cy="88" r="6" fill="#777" />
    <text x="120" y="54" fontSize="10" fontWeight="800" fill="#2A2A2A" fontFamily="sans-serif">SCHOOL BUS</text>
  </svg>
);

export const Elephant: React.FC<A & { tone?: string }> = ({ w = 160, style, tone = "#8E9AA3" }) => (
  <svg width={w} height={w * 0.75} viewBox="0 0 160 120" style={{ overflow: "visible", ...style }}>
    <ellipse cx="80" cy="116" rx="62" ry="4" fill="rgba(0,0,0,0.3)" />
    <path d="M20 60 C20 34 46 22 80 24 C104 26 118 34 124 46 C134 40 150 44 152 60 C154 76 146 92 142 104 L134 104 C136 92 138 80 132 70 L124 74 L124 112 L110 112 L108 84 L56 84 L54 112 L40 112 L38 84 C26 80 20 72 20 60 Z" fill={tone} />
    <path d="M118 40 C108 46 106 66 116 74 C124 70 128 54 124 44 Z" fill="#7A858E" />
    <circle cx="136" cy="54" r="2.4" fill="#1D2329" />
    <path d="M140 64 C146 66 150 64 152 60" stroke="#EDE6D6" strokeWidth={4} strokeLinecap="round" fill="none" />
    <path d="M30 50 C50 40 80 38 100 42" stroke="rgba(255,255,255,0.15)" strokeWidth={4} fill="none" />
  </svg>
);

export const Heart: React.FC<A & { beat?: number }> = ({ w = 300, style, beat = 1 }) => (
  <svg width={w} height={w} viewBox="0 0 200 200" style={{ overflow: "visible", scale: String(beat), ...style }}>
    <path d="M86 34 C86 14 104 8 110 22 L112 46" stroke="#A23B42" strokeWidth={16} fill="none" strokeLinecap="round" />
    <path d="M120 40 C124 20 146 18 150 34" stroke="#3F5F8C" strokeWidth={13} fill="none" strokeLinecap="round" />
    <path d="M100 186 C50 160 22 120 28 84 C34 52 66 40 92 52 C118 36 160 44 170 80 C180 120 150 160 100 186 Z" fill="#B44B52" />
    <path d="M100 60 C96 100 104 140 100 176" stroke="#8C3239" strokeWidth={4} fill="none" />
    <path d="M60 70 C70 64 82 64 90 70" stroke="#E08A8F" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.7} />
    <path d="M120 92 C136 100 140 120 132 136" stroke="#8C3239" strokeWidth={3} fill="none" />
  </svg>
);

export const GolfCart: React.FC<A> = ({ w = 300, style }) => (
  <svg width={w} height={w * 0.7} viewBox="0 0 200 140" style={{ overflow: "visible", ...style }}>
    <rect x="30" y="20" width="140" height="8" rx="3" fill="#E6EBEE" />
    <rect x="40" y="26" width="5" height="66" fill="#9FAFB9" />
    <rect x="150" y="26" width="5" height="54" fill="#9FAFB9" />
    <path d="M24 92 L176 92 L184 110 L18 110 Z" fill="#E6EBEE" />
    <rect x="60" y="72" width="60" height="20" rx="4" fill="#2F3A42" />
    <circle cx="52" cy="114" r="14" fill="#1C1C1C" />
    <circle cx="152" cy="114" r="14" fill="#1C1C1C" />
  </svg>
);

export const Car: React.FC<A> = ({ w = 340, style }) => (
  <svg width={w} height={w * 0.42} viewBox="0 0 240 100" style={{ overflow: "visible", ...style }}>
    <path d="M10 70 L18 50 C22 42 30 38 40 36 L80 22 C90 18 150 18 162 22 L196 40 C214 42 230 50 232 62 L232 78 L10 78 Z" fill="#5E7C93" />
    <path d="M86 28 L120 26 L120 42 L70 42 Z M128 26 L156 28 L182 42 L128 42 Z" fill="#B7CAD6" />
    <circle cx="58" cy="80" r="16" fill="#1C1C1C" />
    <circle cx="186" cy="80" r="16" fill="#1C1C1C" />
  </svg>
);

export const Bathtub: React.FC<A & { fill?: number }> = ({ w = 320, style, fill = 0.5 }) => (
  <svg width={w} height={w * 0.55} viewBox="0 0 220 120" style={{ overflow: "visible", ...style }}>
    <clipPath id="tubclip">
      <path d="M14 30 L206 30 L194 92 C190 104 182 108 170 108 L50 108 C38 108 30 104 26 92 Z" />
    </clipPath>
    <path d="M14 30 L206 30 L194 92 C190 104 182 108 170 108 L50 108 C38 108 30 104 26 92 Z" fill="#E9EEF0" />
    <rect x="0" y={108 - 78 * fill} width="220" height="120" fill="#B33F48" clipPath="url(#tubclip)" opacity={0.85} />
    <rect x="8" y="24" width="204" height="10" rx="5" fill="#F7FAFB" />
    <path d="M184 24 L184 4 L166 4" stroke="#A8B4BB" strokeWidth={5} fill="none" />
    <rect x="44" y="108" width="10" height="10" fill="#A8B4BB" />
    <rect x="166" y="108" width="10" height="10" fill="#A8B4BB" />
  </svg>
);

export const Human: React.FC<A & { color?: string }> = ({ w = 90, style, color = "#D6DEE3" }) => (
  <svg width={w} height={w * 2.4} viewBox="0 0 50 120" style={{ overflow: "visible", ...style }}>
    <circle cx="25" cy="11" r="9" fill={color} />
    <path d="M12 24 C18 22 32 22 38 24 L42 62 L36 62 L34 116 L27 116 L25 72 L23 116 L16 116 L14 62 L8 62 Z" fill={color} />
  </svg>
);

/** Stick figure (reference-style comedy character). pose: stand | point | shrug | panic */
export const Stick: React.FC<A & { pose?: "stand" | "point" | "shrug" | "panic"; color?: string; glasses?: boolean }> = ({ w = 140, style, pose = "stand", color = "#E9EEF0", glasses }) => {
  const f = useCurrentFrame();
  const wob = Math.sin(f / 8) * 4;
  const arms =
    pose === "point" ? "M50 60 L20 78 M50 60 L92 34" : pose === "shrug" ? "M50 60 L26 50 L18 38 M50 60 L74 50 L82 38" : pose === "panic" ? `M50 60 L22 ${30 + wob} M50 60 L78 ${30 - wob}` : "M50 60 L30 96 M50 60 L70 96";
  return (
    <svg width={w} height={w * 1.6} viewBox="0 0 100 160" style={{ overflow: "visible", ...style }}>
      <circle cx="50" cy="26" r="17" fill="none" stroke={color} strokeWidth={6} />
      {glasses && <path d="M38 26 h8 M54 26 h8 M46 26 h8" stroke={color} strokeWidth={3} />}
      <path d={`M50 43 L50 104 ${arms} M50 104 L34 152 M50 104 L66 152`} stroke={color} strokeWidth={6} strokeLinecap="round" fill="none" />
    </svg>
  );
};

export const Rib: React.FC<A & { people?: boolean }> = ({ w = 360, style, people = true }) => (
  <svg width={w} height={w * 0.4} viewBox="0 0 250 100" style={{ overflow: "visible", ...style }}>
    {people && (
      <g fill="#2B3136">
        <circle cx="96" cy="24" r="9" />
        <rect x="88" y="32" width="16" height="30" rx="5" fill="#E36F3C" />
        <circle cx="150" cy="22" r="9" />
        <rect x="142" y="30" width="16" height="32" rx="5" fill="#E36F3C" />
        <rect x="164" y="20" width="22" height="12" rx="3" fill="#20262A" />
      </g>
    )}
    <path d="M14 60 C14 80 30 88 50 88 L210 88 C232 88 244 76 244 62 L244 56 L14 56 Z" fill="#3C4A52" />
    <path d="M20 58 C20 74 34 80 50 80 L210 80 C228 80 238 72 238 60" fill="none" stroke="#56666F" strokeWidth={6} />
    <rect x="6" y="48" width="16" height="22" rx="3" fill="#20262A" />
    <rect x="40" y="50" width="190" height="8" fill="#E9EEF0" opacity={0.3} />
  </svg>
);

export const WhalingShip: React.FC<A & { ink?: string }> = ({ w = 520, style, ink = P.ink }) => (
  <svg width={w} height={w * 0.5} viewBox="0 0 400 200" style={{ overflow: "visible", ...style }}>
    <path d="M10 140 L390 140 L360 186 L40 186 Z" fill={ink} />
    <rect x="70" y="110" width="250" height="30" fill="#7A6450" />
    {Array.from({ length: 10 }).map((_, i) => (
      <rect key={i} x={80 + i * 24} y={118} width="12" height="10" fill="#D9C9A8" />
    ))}
    <rect x="230" y="60" width="26" height="52" fill={ink} />
    <rect x="226" y="54" width="34" height="8" fill="#B33F48" />
    <path d="M243 54 C230 30 250 20 236 0" stroke="rgba(80,70,60,0.5)" strokeWidth={18} fill="none" strokeLinecap="round" />
    <line x1="120" y1="110" x2="120" y2="40" stroke={ink} strokeWidth={4} />
    <line x1="120" y1="50" x2="60" y2="110" stroke={ink} strokeWidth={2} />
    <path d="M340 140 L380 110 L388 118" stroke={ink} strokeWidth={4} fill="none" />
  </svg>
);

export const Orca: React.FC<A> = ({ w = 300, style }) => (
  <svg width={w} height={w * 0.4} viewBox="0 0 250 100" style={{ overflow: "visible", ...style }}>
    <path d="M10 56 C20 34 70 30 120 34 L136 6 L146 36 C180 40 210 46 226 52 L246 38 L242 56 L248 74 L226 62 C190 74 120 80 70 76 C40 74 14 68 10 56 Z" fill="#14181B" />
    <path d="M14 60 C40 74 100 76 150 68 C120 62 60 62 14 60 Z" fill="#EDEFEF" />
    <ellipse cx="46" cy="46" rx="14" ry="6" fill="#EDEFEF" />
    <path d="M150 40 C162 44 168 50 166 56 C156 52 150 48 150 40 Z" fill="#8D969B" />
  </svg>
);

export const Shark: React.FC<A> = ({ w = 300, style }) => (
  <svg width={w} height={w * 0.4} viewBox="0 0 250 100" style={{ overflow: "visible", ...style }}>
    <path d="M6 56 C30 38 90 34 140 40 L156 6 L168 42 C196 46 214 50 226 54 L248 30 L240 56 L248 82 L226 62 C190 72 110 76 60 72 C30 70 10 64 6 56 Z" fill="#6E7F8A" />
    <path d="M10 60 C50 70 120 72 180 64 C130 60 60 60 10 60 Z" fill="#D7DEE2" />
    <path d="M100 66 L92 86 L112 70 Z" fill="#5C6C76" />
    <circle cx="34" cy="50" r="3" fill="#111" />
    <path d="M24 60 L30 62 L36 60 L42 62" stroke="#F3F3F3" strokeWidth={1.6} fill="none" />
  </svg>
);

export const Croc: React.FC<A> = ({ w = 300, style }) => (
  <svg width={w} height={w * 0.33} viewBox="0 0 300 100" style={{ overflow: "visible", ...style }}>
    <path d="M4 60 L80 50 C100 40 150 38 180 44 L250 40 L296 56 L250 66 C200 74 120 76 80 70 L4 66 Z" fill="#5E6B47" />
    {Array.from({ length: 10 }).map((_, i) => (
      <path key={i} d={`M${110 + i * 14} 42 l6 -8 l6 8`} fill="#4A5537" />
    ))}
    <circle cx="72" cy="52" r="3" fill="#E3D27A" />
    <path d="M8 62 L76 60" stroke="#E9E2C9" strokeWidth={2} strokeDasharray="4 3" />
  </svg>
);

export const Building: React.FC<A & { color?: string }> = ({ w = 200, style, color = "#9FB0BB" }) => (
  <svg width={w} height={w * 3} viewBox="0 0 100 300" style={{ overflow: "visible", ...style }}>
    <rect x="47" y="0" width="6" height="40" fill={color} />
    <path d="M40 40 L60 40 L62 70 L38 70 Z" fill={color} />
    <rect x="32" y="70" width="36" height="40" fill={color} />
    <rect x="22" y="110" width="56" height="60" fill={color} />
    <rect x="10" y="170" width="80" height="130" fill={color} />
    {Array.from({ length: 30 }).map((_, i) => (
      <rect key={i} x={16 + (i % 6) * 12} y={178 + Math.floor(i / 6) * 22} width="6" height="12" fill="rgba(0,0,0,0.25)" />
    ))}
  </svg>
);

export const Sun: React.FC<A & { glow?: number }> = ({ w = 220, style, glow = 1 }) => (
  <div style={{ width: w, height: w, borderRadius: w, background: `radial-gradient(circle, rgba(255,250,232,${0.95 * glow}) 0%, rgba(255,246,214,${0.6 * glow}) 35%, rgba(255,246,214,0) 70%)`, ...style }} />
);

export const Paper: React.FC<A & { title: string; lines?: [string, string][]; rot?: number; foot?: string }> = ({ w = 520, style, title, lines = [], rot = -2, foot }) => (
  <div style={{ width: w, padding: "40px 46px", background: "#F2EBDC", boxShadow: "0 20px 60px rgba(0,0,0,0.55)", rotate: `${rot}deg`, fontFamily: "Georgia, serif", color: "#2C251C", ...style }}>
    <div style={{ fontFamily: "sans-serif", fontWeight: 800, fontSize: w * 0.05, letterSpacing: 1.5, textAlign: "center", marginBottom: 24 }}>{title}</div>
    {lines.map(([k, v], i) => (
      <div key={i} style={{ display: "flex", gap: 18, fontSize: w * 0.034, margin: "10px 0" }}>
        <span style={{ fontFamily: "sans-serif", fontWeight: 800, width: w * 0.28, flexShrink: 0 }}>{k}</span>
        <span>{v}</span>
      </div>
    ))}
    {lines.length === 0 &&
      Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ height: 8, background: "#CFC4AE", margin: "14px 0", width: `${90 - (i % 3) * 15}%` }} />)}
    {foot ? <div style={{ fontFamily: "sans-serif", fontSize: w * 0.03, textAlign: "center", marginTop: 20, fontWeight: 700 }}>{foot}</div> : null}
  </div>
);

export const Plate: React.FC<A> = ({ w = 400, style }) => (
  <svg width={w} height={w * 0.4} viewBox="0 0 200 80" style={{ overflow: "visible", ...style }}>
    <ellipse cx="100" cy="44" rx="98" ry="34" fill="#E9EEF0" />
    <ellipse cx="100" cy="42" rx="70" ry="22" fill="#D3DCE1" />
  </svg>
);

export const Burger: React.FC<A> = ({ w = 40, style }) => (
  <svg width={w} height={w * 0.8} viewBox="0 0 50 40" style={style}>
    <path d="M4 18 C4 4 46 4 46 18 Z" fill="#D9A55B" />
    <rect x="3" y="18" width="44" height="5" rx="2" fill="#7DBB5A" />
    <rect x="4" y="23" width="42" height="6" rx="2" fill="#7A4A32" />
    <path d="M4 30 L46 30 C46 37 4 37 4 30 Z" fill="#D9A55B" />
  </svg>
);
