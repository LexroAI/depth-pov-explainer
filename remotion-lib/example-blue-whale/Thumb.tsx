import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FONT } from "../../lib/core";

type Word = { t: string; red?: boolean };

/**
 * YouTube thumbnail rules (from user review):
 * - text near the top edge with a clear margin (never cramped or bleeding off)
 * - 2-3 words preferred, 4 max; ONE key word in red (YOU or the most important word), the rest white
 * - text never covers the subjects; the image is shifted down to open a dark band for the text
 * - a curved red arrow points at the tiny "you" diver
 */
export const Thumb: React.FC<{ words: Word[]; shift?: number; arrow?: { from: [number, number]; to: [number, number]; bend: [number, number] } }> = ({
  words,
  shift = 170,
  arrow = { from: [430, 150], to: [168, 448], bend: [140, 230] },
}) => {
  const [x1, y1] = arrow.from;
  const [x2, y2] = arrow.to;
  const [cx, cy] = arrow.bend;
  const ang = Math.atan2(y2 - cy, x2 - cx);
  const h = 34;
  const p1 = [x2 - h * Math.cos(ang - 0.45), y2 - h * Math.sin(ang - 0.45)];
  const p2 = [x2 - h * Math.cos(ang + 0.45), y2 - h * Math.sin(ang + 0.45)];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Img src={staticFile("thumbs/blue-whale.png")} style={{ position: "absolute", left: 0, top: shift, width: 1280, height: 720, objectFit: "cover" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: shift - 2, height: 90, background: "linear-gradient(180deg, #000, rgba(0,0,0,0))" }} />
      <div
        style={{
          position: "absolute",
          top: 44,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 104,
          lineHeight: 1,
          letterSpacing: 3,
          textTransform: "uppercase",
          textShadow: "0 6px 22px rgba(0,0,0,0.9)",
        }}
      >
        {words.map((w, i) => (
          <span key={i} style={{ color: w.red ? "#E8322E" : "#FFFFFF", marginRight: i < words.length - 1 ? 26 : 0 }}>
            {w.t}
          </span>
        ))}
      </div>
      <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <path d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`} stroke="#000" strokeOpacity={0.6} strokeWidth={20} fill="none" strokeLinecap="round" />
        <path d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`} stroke="#E8322E" strokeWidth={12} fill="none" strokeLinecap="round" />
        <path d={`M${x2} ${y2} L${p1[0]} ${p1[1]} M${x2} ${y2} L${p2[0]} ${p2[1]}`} stroke="#E8322E" strokeWidth={12} strokeLinecap="round" />
      </svg>
    </AbsoluteFill>
  );
};
