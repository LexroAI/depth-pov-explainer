import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { At, Count, FONT, P, Sfx, Show, Tag, clamp, ease, useAt } from "../../lib/core";
import { BlueWhale, Stick } from "../../lib/art";
import { DarkSet, MapSet, PaperSet } from "../../lib/sets";
import { BigText, Rings } from "../../lib/ui";
import { S } from "./shared";

const COAST = ["M1380 0 C1340 140 1420 260 1400 400 C1380 560 1460 700 1500 840 C1520 940 1560 1020 1600 1080 L1920 1080 L1920 0 Z"];
const HOT = [
  [1300, 420],
  [1350, 640],
  [1150, 300],
];

/** Shared track drawing: 60 tagged whales over 10 years. */
const Tracks: React.FC<{ drawTo: number; hotAt: number }> = ({ drawTo, hotAt }) => {
  const f = useCurrentFrame();
  return (
    <>
      <MapSet land={COAST} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {Array.from({ length: 60 }).map((_, i) => {
          const h = HOT[i % 3];
          const x0 = 1340 + random(`tx${i}`) * 80;
          const y0 = 900 + random(`ty${i}`) * 120;
          const d = `M${x0} ${y0} C${x0 - 300 - random(`a${i}`) * 400} ${y0 - 200} ${h[0] - 200 - random(`b${i}`) * 300} ${h[1] + 100} ${h[0] + (random(`c${i}`) - 0.5) * 60} ${h[1] + (random(`d${i}`) - 0.5) * 60}`;
          const t0 = 4 + i * 1.2;
          const p = drawTo <= 1 ? 1 : interpolate(f, [t0, Math.max(t0 + 1, drawTo + i * 0.6)], [0, 1], clamp);
          return <path key={i} d={d} stroke="rgba(242,194,48,0.55)" strokeWidth={2} fill="none" strokeDasharray="1600" strokeDashoffset={1600 * (1 - p)} />;
        })}
      </svg>
      {HOT.map(([x, y], i) => (
        <Show key={i} at={hotAt + i * 6} enter="pop">
          <Rings x={x} y={y} from={hotAt + i * 6} period={50} n={2} color="rgba(61,220,132,0.7)" max={90} width={3} />
          <At x={x} y={y} center><div style={{ width: 22, height: 22, borderRadius: 99, background: P.safe }} /></At>
        </Show>
      ))}
    </>
  );
};

const Memory: React.FC = () => {
  const at = useAt();
  return (
    <>
      <Tracks drawTo={at("b095")} hotAt={at("b096")} />
      <Tag at={6} x={600} y={110} text="60 tagged whales · 10 years" size={32} />
      <Tag at={at("b095", 4)} x={600} y={180} text="Not this year's food..." size={30} />
      <Tag at={at("b096", 10)} x={600} y={250} text="Where food usually appears, when it usually appears" tone="safe" size={28} />
      <Sfx at={4} name="sonar_ping" vol={0.3} />
      <Sfx at={at("b096")} name="pop_soft" vol={0.35} />
    </>
  );
};

const Bakery: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <DarkSet />
      <div style={{ position: "absolute", left: 620, top: 180, width: 680, height: 600, background: "#2B3A44", borderRadius: 8, boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ height: 90, background: "#B33F48", fontFamily: FONT, fontWeight: 800, fontSize: 56, letterSpacing: 10, color: "#F4E3D7", textAlign: "center", lineHeight: "90px" }}>BAKERY</div>
        <div style={{ position: "absolute", left: 60, top: 150, width: 260, height: 300, background: "rgba(255,230,170,0.25)", border: "6px solid #1E2A31" }} />
        <div style={{ position: "absolute", left: 420, top: 150, width: 170, height: 410, background: "#1E2A31" }} />
        <div style={{ position: "absolute", left: 440, top: 110, width: 130, height: 130, borderRadius: 99, background: "#E9EEF0", border: "6px solid #1E2A31" }}>
          <div style={{ position: "absolute", left: 61, top: 20, width: 6, height: 46, background: "#1E2A31", rotate: "0deg", transformOrigin: "50% 100%" }} />
          <div style={{ position: "absolute", left: 61, top: 64, width: 6, height: 36, background: "#1E2A31", rotate: `${interpolate(f, [0, 30], [150, 210], clamp)}deg`, transformOrigin: "50% 0%" }} />
        </div>
      </div>
      <At x={360} y={560}><Stick w={110} pose="stand" /></At>
      <At x={-80} y={640}><BlueWhale w={520} id="bk" swim={0.5} /></At>
      <Tag at={6} x={960} y={900} text="7:00 a.m. · fresh bread · every day" size={32} />
      <Sfx at={20} name="tick_ui" vol={0.4} />
    </>
  );
};

const MemoryRecap: React.FC = () => (
  <>
    <Tracks drawTo={1} hotAt={0} />
    <Tag at={6} x={600} y={110} text="Memory, at the scale of an ocean" tone="safe" size={34} />
  </>
);

/** b099-b102: earwax plug layers like tree rings; ~110 years. */
const Earplug: React.FC<{ pollute?: boolean; pAt?: number }> = ({ pollute, pAt = 0 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 360, top: 230, width: 1200, height: 340 }}>
      {Array.from({ length: 34 }).map((_, i) => {
        const p = interpolate(f, [4 + i * 1.5, 10 + i * 1.5], [0, 1], clamp);
        const bad = pollute && [6, 7, 14, 15, 16, 22, 27].includes(i) ? interpolate(f, [pAt + i, pAt + i + 10], [0, 1], clamp) : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: i * 34,
              top: 20 + Math.sin(i * 0.4) * 6,
              width: 34,
              height: 300,
              borderRadius: 14,
              background: bad ? `rgba(60,40,30,${0.5 + bad * 0.5})` : i % 2 ? "#C9A86A" : "#A5844C",
              opacity: p,
            }}
          />
        );
      })}
    </div>
  );
};

const Age: React.FC = () => {
  const at = useAt();
  return (
    <>
      <DarkSet />
      <Earplug />
      <Tag at={6} x={960} y={130} text="Earwax plug · one layer after another" size={32} />
      <Show at={at("b101")} enter="fade">
        <At x={360} y={600} w={1200} h={10} style={{ background: `linear-gradient(90deg, ${P.threat}, rgba(242,194,48,0))` }}>{null}</At>
        <Tag at={at("b101", 4)} x={960} y={660} text="Count the layers = estimate age" size={28} />
      </Show>
      <Show at={at("b102")} enter="up" dist={30}><At x={960} y={830} center><Count at={at("b102")} to={110} prefix="~" suffix=" YEARS" size={96} color={P.threat} sub="oldest found · 2025 study" /></At></Show>
      <Sfx at={at("b101")} name="tick_ui" vol={0.35} />
      <Sfx at={at("b102")} name="counter_roll" vol={0.35} />
    </>
  );
};

const Ww1: React.FC = () => (
  <>
    <PaperSet />
    <At x={960} y={520} center>
      <div style={{ width: 860, padding: "40px 50px", background: "#EFE5CF", boxShadow: "0 24px 60px rgba(0,0,0,0.45)", rotate: "-1.5deg", fontFamily: "Georgia, serif", color: "#2C251C" }}>
        <div style={{ fontSize: 64, fontWeight: 700, textAlign: "center", borderBottom: "4px double #2C251C", paddingBottom: 12 }}>THE DAILY TIDE</div>
        <div style={{ fontSize: 26, textAlign: "center", margin: "10px 0 24px" }}>1916 · WAR IN EUROPE</div>
        <div style={{ display: "flex", gap: 30 }}>
          <div style={{ flex: 1 }}>{Array.from({ length: 7 }).map((_, i) => <div key={i} style={{ height: 8, background: "#BBAE93", margin: "12px 0", width: `${95 - (i % 3) * 12}%` }} />)}</div>
          <div style={{ width: 300, height: 170, background: "#D8CBB0", display: "flex", alignItems: "center", justifyContent: "center" }}><BlueWhale w={260} id="np" silhouette /></div>
        </div>
      </div>
    </At>
    <Tag at={10} x={960} y={950} text="Some whales alive today may have been born around here" size={30} />
    <Sfx at={0} name="paper_slide" vol={0.5} />
  </>
);

const Pollution: React.FC = () => {
  const at = useAt();
  return (
    <>
      <DarkSet />
      <Earplug pollute pAt={at("b105")} />
      <Tag at={at("b105", 6)} x={960} y={660} text="Dark layers = pollution, year by year" tone="threat" size={30} />
      <Show at={at("b106")} enter="up" dist={40}><At x={960} y={830} center><div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 60, color: P.paper }}>A diary, written in earwax.</div></At></Show>
      <Sfx at={at("b105")} name="scan_beep" vol={0.35} />
    </>
  );
};

/** b107-b111: songs dropping in pitch for decades. */
const Songs: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const p = interpolate(f, [8, at("b109")], [0, 1], { ...clamp, easing: ease });
  const x0 = 260;
  const x1 = 1660;
  return (
    <>
      <DarkSet />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <line x1={x0} y1={820} x2={x1} y2={820} stroke="rgba(238,243,245,0.3)" strokeWidth={2} />
        <line x1={x0} y1={260} x2={x0} y2={820} stroke="rgba(238,243,245,0.3)" strokeWidth={2} />
        <path d={`M${x0} 330 C${x0 + 500} 380 ${x0 + 900} 520 ${x1} 610`} stroke={P.threat} strokeWidth={6} fill="none" strokeDasharray="1600" strokeDashoffset={1600 * (1 - p)} />
        {Array.from({ length: 30 }).map((_, i) => {
          const x = x0 + i * 46;
          const y = 330 + (i / 30) * 280 * p;
          return <path key={i} d={`M${x} ${y} q 12 -18 23 0 t 23 0`} stroke="rgba(238,243,245,0.25)" strokeWidth={2} fill="none" opacity={p} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: x0, top: 840, fontFamily: FONT, fontWeight: 600, fontSize: 26, color: P.dim }}>1960s</div>
      <div style={{ position: "absolute", left: x1 - 80, top: 840, fontFamily: FONT, fontWeight: 600, fontSize: 26, color: P.dim }}>2010s</div>
      <div style={{ position: "absolute", left: 120, top: 520, rotate: "-90deg", fontFamily: FONT, fontWeight: 600, fontSize: 26, color: P.dim }}>PITCH</div>
      <Tag at={4} x={960} y={150} text="Blue whale songs · worldwide" size={32} />
      <Tag at={at("b109", 4)} x={1500} y={540} text="-30%+ in some song types" tone="threat" size={30} />
      <Tag at={at("b110", 4)} x={960} y={960} text="Nobody knows exactly why" size={30} />
      <Tag at={at("b111", 4)} x={960} y={1020} text="Idea: more whales, less need to shout" tone="safe" size={28} />
      <Sfx at={4} name="whale_moan" vol={0.4} />
    </>
  );
};

const AskPeople: React.FC = () => (
  <>
    <DarkSet />
    <BigText at={2} text="BIG. OLD. GOOD AT REMEMBERING." size={64} sub="HAS IT EVER TURNED ON PEOPLE?" subAt={50} />
    <Sfx at={50} name="riser_tension" vol={0.35} />
  </>
);

export const Chapter_06: React.FC = () => (
  <>
    <S name="29 Memory" first="b093" last="b096"><Memory /></S>
    <S name="30 Bakery" first="b097" last="b097"><Bakery /></S>
    <S name="31 Memory recap" first="b098" last="b098"><MemoryRecap /></S>
    <S name="32 Age" first="b099" last="b102"><Age /></S>
    <S name="33 WW1" first="b103" last="b103"><Ww1 /></S>
    <S name="34 Pollution" first="b104" last="b106"><Pollution /></S>
    <S name="35 Songs" first="b107" last="b111"><Songs /></S>
    <S name="36 Ask people" first="b112" last="b113"><AskPeople /></S>
  </>
);
