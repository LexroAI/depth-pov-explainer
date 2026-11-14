import React from "react";
import { useCurrentFrame } from "remotion";

/* Menacing predators, faces LEFT. viewBox 1000 x 400. open 0..1 drops the lower jaw. */

const teeth = (x0: number, x1: number, y: number, n: number, h: number, up: boolean, col = "#F4F1E8") =>
  Array.from({ length: n }).map((_, i) => {
    const x = x0 + ((x1 - x0) * i) / (n - 1);
    const w = 9 + (i % 2) * 3;
    const d = up ? `M${x - w / 2} ${y} L${x} ${y - h * (0.7 + (i % 3) * 0.15)} L${x + w / 2} ${y} Z` : `M${x - w / 2} ${y} L${x} ${y + h * (0.7 + (i % 3) * 0.15)} L${x + w / 2} ${y} Z`;
    return <path key={`${x}-${up}`} d={d} fill={col} stroke="#8F8A7C" strokeWidth={1} />;
  });

export const ScaryShark: React.FC<{ w?: number; open?: number; id?: string; style?: React.CSSProperties }> = ({ w = 1000, open = 0, id = "ss", style }) => {
  const f = useCurrentFrame();
  const tail = Math.sin(f / 6) * 7;
  const jaw = -open * 30;
  return (
    <svg width={w} height={w * 0.4} viewBox="0 0 1000 400" style={{ overflow: "visible", ...style }}>
      <defs>
        <linearGradient id={`${id}-b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1C252B" />
          <stop offset="0.45" stopColor="#4B5A63" />
          <stop offset="0.62" stopColor="#6F7E86" />
          <stop offset="0.66" stopColor="#E3E6E6" />
          <stop offset="1" stopColor="#C9CDCE" />
        </linearGradient>
      </defs>
      {/* tail */}
      <g transform={`rotate(${tail} 820 200)`}>
        <path d="M800 190 C860 140 920 70 990 20 C975 90 950 150 905 205 C950 250 975 300 985 350 C920 300 860 250 800 225 Z" fill="#2A353C" stroke="#0E1418" strokeWidth={3} />
      </g>
      {/* far pectoral */}
      <path d="M360 250 C330 300 300 340 255 372 C300 360 360 320 400 268 Z" fill="#26323A" />
      {/* lower jaw (rotates open) */}
      <g transform={`rotate(${jaw} 250 228)`}>
        <path d="M60 222 C120 236 190 244 250 236 L250 252 C190 262 120 258 70 240 Z" fill="#D9DCDC" stroke="#0E1418" strokeWidth={3} />
        {open > 0.05 && <path d="M70 226 C130 238 190 242 248 236 L248 240 C190 248 130 246 74 232 Z" fill="#9C2A2E" />}
        {open > 0.05 && teeth(84, 236, 230, 11, 30, true)}
      </g>
      {/* mouth interior when open */}
      {open > 0.05 && <path d={`M52 216 C90 ${240 + open * 90} 190 ${250 + open * 70} 252 ${236 + open * 10} L252 226 C200 226 120 220 52 216 Z`} fill="#3A0A0D" />}
      {/* body */}
      <path d="M30 205 C40 180 90 160 170 150 C300 132 430 128 560 140 C680 152 760 170 820 190 L822 222 C760 246 650 266 520 270 C400 274 300 262 250 244 C170 236 100 230 60 222 C40 218 30 212 30 205 Z" fill={`url(#${id}-b)`} stroke="#0E1418" strokeWidth={3} />
      {/* upper teeth */}
      {open > 0.05 && teeth(70, 240, 220, 12, 32, false)}
      {open > 0.05 && <path d="M62 216 C120 226 190 230 250 226" stroke="#B3343A" strokeWidth={6} fill="none" />}
      {/* dorsal fin */}
      <path d="M430 132 C470 90 500 40 520 0 C540 50 560 100 600 142 Z" fill="#26323A" stroke="#0E1418" strokeWidth={3} />
      {/* gills */}
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${290 + i * 18} 170 C${282 + i * 18} 195 ${284 + i * 18} 215 ${294 + i * 18} 235`} stroke="#1A2328" strokeWidth={4} fill="none" />)}
      {/* scars */}
      {[[480, 175, 540, 168], [600, 200, 660, 188], [380, 160, 420, 150]].map((s, i) => <path key={i} d={`M${s[0]} ${s[1]} L${s[2]} ${s[3]}`} stroke="rgba(230,235,235,0.55)" strokeWidth={3} />)}
      {/* near pectoral */}
      <path d="M330 248 C310 300 280 350 230 392 C300 375 380 330 420 262 Z" fill="#33414A" stroke="#0E1418" strokeWidth={3} />
      {/* eye: flat black with a cold glint */}
      <circle cx="140" cy="182" r="11" fill="#030405" />
      <circle cx="136" cy="178" r="3.5" fill="rgba(220,240,255,0.9)" />
      {/* rim light */}
      <path d="M40 200 C120 160 300 132 560 140 C680 152 760 170 820 190" stroke="rgba(170,220,235,0.35)" strokeWidth={4} fill="none" />
    </svg>
  );
};

export const ScaryOrca: React.FC<{ w?: number; open?: number; id?: string; style?: React.CSSProperties }> = ({ w = 1000, open = 0, id = "so", style }) => {
  const f = useCurrentFrame();
  const tail = Math.sin(f / 7) * 8;
  const jaw = -open * 28;
  return (
    <svg width={w} height={w * 0.4} viewBox="0 0 1000 400" style={{ overflow: "visible", ...style }}>
      <defs>
        <linearGradient id={`${id}-b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050607" />
          <stop offset="0.5" stopColor="#15191C" />
          <stop offset="1" stopColor="#0A0C0D" />
        </linearGradient>
      </defs>
      <g transform={`rotate(${tail} 840 230)`}>
        <path d="M830 220 C880 190 940 160 995 150 C980 190 960 215 930 232 C960 250 985 280 995 315 C940 300 880 270 830 248 Z" fill="#0A0C0D" stroke="rgba(150,200,220,0.4)" strokeWidth={3} />
      </g>
      {/* lower jaw */}
      <g transform={`rotate(${jaw} 260 250)`}>
        <path d="M50 236 C120 260 200 268 262 256 L262 276 C200 290 120 286 60 258 Z" fill="#EEF1F2" stroke="#050607" strokeWidth={3} />
        {open > 0.05 && teeth(80, 240, 246, 9, 26, true, "#F6F2E6")}
      </g>
      {open > 0.05 && <path d={`M40 228 C80 ${254 + open * 100} 200 ${266 + open * 70} 262 ${254 + open * 8} L262 244 C200 246 120 240 40 228 Z`} fill="#7A1E2A" />}
      {/* body */}
      <path d="M30 222 C40 170 120 136 240 128 C400 118 560 128 700 162 C760 178 810 200 840 222 L842 250 C780 280 650 300 500 302 C380 304 300 290 262 268 C180 262 100 254 50 240 C36 236 30 230 30 222 Z" fill={`url(#${id}-b)`} stroke="rgba(150,200,220,0.45)" strokeWidth={3} />
      {open > 0.05 && teeth(70, 240, 236, 10, 28, false, "#F6F2E6")}
      {/* white belly + chin */}
      <path d="M60 238 C160 262 260 270 360 282 C460 292 560 290 640 282 C560 300 420 304 330 296 C240 286 140 266 60 246 Z" fill="#EEF1F2" />
      <path d="M520 290 C580 270 640 262 700 268 C660 290 600 300 520 300 Z" fill="#EEF1F2" />
      {/* eye patch + eye */}
      <path d="M180 170 C215 152 265 150 300 162 C280 182 230 190 186 186 Z" fill="#EEF1F2" />
      <circle cx="168" cy="190" r="6" fill="#000" />
      <circle cx="166" cy="188" r="2" fill="rgba(255,255,255,0.8)" />
      {/* saddle patch */}
      <path d="M560 140 C600 132 650 140 690 160 C650 168 600 164 560 150 Z" fill="#6B7378" />
      {/* tall dorsal fin */}
      <path d="M470 130 C500 80 520 20 530 -40 C560 20 590 90 610 140 Z" fill="#0A0C0D" stroke="rgba(150,200,220,0.4)" strokeWidth={3} />
      {/* pectoral */}
      <path d="M300 270 C290 320 270 360 230 395 C300 380 350 340 370 286 Z" fill="#0A0C0D" stroke="rgba(150,200,220,0.35)" strokeWidth={3} />
      {/* sheen */}
      <path d="M60 210 C160 150 400 120 700 162" stroke="rgba(200,230,245,0.25)" strokeWidth={6} fill="none" />
    </svg>
  );
};
