import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { At, FONT, P, Sfx, Show, Tag, clamp, ease, useAt } from "../../lib/core";
import { BlueWhale, Building, Diver, Krill, Stick } from "../../lib/art";
import { DarkSet, OceanSet } from "../../lib/sets";
import { Bars, DepthRuler, OptionsList } from "../../lib/ui";
import { S } from "./shared";

const ITEMS = ["Swim away", "Dive under it", "Wave so it sees you", "Race to the surface"];

const List: React.FC<{ hi: number; struck: number[]; strikeNow?: boolean }> = ({ hi, struck, strikeNow }) => (
  <>
    <DarkSet />
    <OptionsList items={ITEMS} hi={hi} struck={struck} strikeAt={strikeNow ? 4 : -1} />
    {strikeNow && <Sfx at={4} name="strike_line" vol={0.5} />}
    {!strikeNow && <Sfx at={2} name="tick_ui" vol={0.4} />}
  </>
);

const SwimMini: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  return (
    <>
      <OceanSet depth={0.2} krill={1} />
      {Array.from({ length: 40 }).map((_, i) => (
        <At key={i} x={(random(`sw${i}`) * 2200 - f * (2 + (i % 3))) % 2000} y={random(`sy${i}`) * 1000}><Krill w={40 + (i % 4) * 14} /></At>
      ))}
      <At x={760} y={420}><Diver w={420} kick={2} /></At>
      <Bars at={6} x={300} y={760} w={1300} rows={[{ label: "YOU, IN FINS", v: 0.12, color: P.safe }, { label: "A JOGGER", v: 0.3, color: "#8FA9BC" }]} />
      <Tag at={at("b133", 4)} x={960} y={110} text="The swarm is all around you" tone="threat" size={34} />
    </>
  );
};

const DiveMini: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const d = interpolate(f, [0, 50], [22, 520], { ...clamp, easing: ease });
  const warn = f > at("b137") && Math.floor(f / 6) % 2 === 0;
  return (
    <>
      <OceanSet depth={0.75} rays={false} />
      <At x={480} y={260} style={{ rotate: "62deg" }}><BlueWhale w={800} id="dm" /></At>
      <DepthRuler depth={d} x={1640} label={`${Math.round(d)} m`} />
      <Show at={at("b137")} enter="pop">
        <At x={860} y={700} center>
          <div style={{ width: 460, padding: "24px 30px", borderRadius: 18, background: "#0E1B22", border: `3px solid ${warn ? P.danger : "#3A4A54"}`, fontFamily: FONT, fontWeight: 800, color: P.text }}>
            <div style={{ fontSize: 22, letterSpacing: 3, color: P.dim }}>DIVE COMPUTER</div>
            <div style={{ fontSize: 50, color: warn ? P.danger : P.text }}>DEPTH LIMIT!</div>
            <div style={{ fontSize: 24, color: P.dim }}>ASCEND · ASCEND · ASCEND</div>
          </div>
        </At>
      </Show>
      <Sfx at={at("b137")} name="warning_beep" vol={0.5} />
    </>
  );
};

const WaveMini: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const zoom = interpolate(f, [at("b141"), at("b141", 25)], [1, 2.6], { ...clamp, easing: ease });
  return (
    <>
      <OceanSet depth={0.25} krill={0.4} />
      <div style={{ position: "absolute", inset: 0, scale: String(zoom), transformOrigin: "54% 56%" }}>
        <div style={{ position: "absolute", left: 620, top: 220, width: 700, height: 680, borderRadius: "48% 52% 44% 56%", background: "radial-gradient(circle, rgba(232,133,122,0.75), rgba(232,133,122,0.15) 70%, rgba(232,133,122,0))" }} />
        <At x={1300} y={160} style={{ opacity: 0.35 }}><Building w={110} /></At>
        <At x={1010} y={590}><div style={{ width: 16, height: 8, background: P.suit, borderRadius: 4 }} /></At>
        {f > at("b141") && <At x={1018} y={594} center><div style={{ width: 60, height: 60, borderRadius: 99, border: `2px solid ${P.threat}` }} /></At>}
      </div>
      <Tag at={6} x={960} y={110} text="Its target: a building-sized pink cloud" size={32} />
      <Tag at={at("b141", 20)} x={960} y={980} text="You: a dark dot inside it" tone="threat" size={32} />
      <At x={260} y={760}><Stick w={90} pose="panic" /></At>
    </>
  );
};

const RaceMini: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const y = interpolate(f, [0, 60], [700, 120], { ...clamp, easing: ease });
  return (
    <>
      <OceanSet depth={0.1} krill={0.5} />
      <At x={700} y={y} style={{ rotate: "-70deg" }}><Diver w={360} kick={2.5} /></At>
      <At x={1100} y={interpolate(f, [0, 80], [900, 200], clamp)} style={{ rotate: "-60deg" }}><BlueWhale w={800} id="rm" /></At>
      <Tag at={at("b144", 4)} x={960} y={980} text="It surfaces here to breathe" size={30} />
      <Show at={at("b145")} enter="pop">
        <At x={420} y={430} center>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: P.danger, border: `4px solid ${P.danger}`, padding: "10px 26px", borderRadius: 12, background: "rgba(10,10,10,0.6)" }}>⚠ THE BENDS</div>
        </At>
      </Show>
      <Sfx at={0} name="bubbles" vol={0.5} />
      <Sfx at={at("b145")} name="warning_beep" vol={0.45} />
    </>
  );
};

const Verdict: React.FC = () => {
  const at = useAt();
  return (
    <>
      <OceanSet depth={0.3} krill={0.2} />
      <At x={240} y={430}><Diver w={360} kick={0.3} /></At>
      <At x={900} y={200}><BlueWhale w={900} id="vd" swim={0.4} /></At>
      {["Get out of the swarm", "Stay low and calm", "Let it pass"].map((t, i) => (
        <Tag key={t} at={4 + i * 16} x={960} y={760 + i * 70} text={t} tone="safe" size={36} />
      ))}
      <Tag at={at("b148", 4)} x={960} y={110} text="The only option that works" size={32} />
      <Sfx at={4} name="pop_soft" vol={0.4} />
      <Sfx at={20} name="pop_soft" vol={0.4} />
      <Sfx at={36} name="pop_soft" vol={0.4} />
    </>
  );
};

export const Chapter_08: React.FC = () => (
  <>
    <S name="41 Opt1" first="b131" last="b131"><List hi={0} struck={[]} /></S>
    <S name="42 Swim" first="b132" last="b133"><SwimMini /></S>
    <S name="43 X1" first="b134" last="b135"><List hi={1} struck={[0]} strikeNow /></S>
    <S name="44 Dive" first="b136" last="b137"><DiveMini /></S>
    <S name="45 X2" first="b138" last="b139"><List hi={2} struck={[0, 1]} strikeNow /></S>
    <S name="46 Wave" first="b140" last="b141"><WaveMini /></S>
    <S name="47 X3" first="b142" last="b143"><List hi={3} struck={[0, 1, 2]} strikeNow /></S>
    <S name="48 Race" first="b144" last="b145"><RaceMini /></S>
    <S name="49 X4" first="b146" last="b146"><List hi={-1} struck={[0, 1, 2, 3]} strikeNow /></S>
    <S name="50 Verdict" first="b147" last="b149"><Verdict /></S>
  </>
);
