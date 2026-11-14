import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { At, Count, Label, P, Sfx, Show, Tag, clamp, ease, useAt } from "../../lib/core";
import { Bathtub, BlueWhale, Car, Elephant, GolfCart, Heart, Human } from "../../lib/art";
import { DarkSet, OceanSet } from "../../lib/sets";
import { Balance, BigText, IconArray, Meter, MeasureLine } from "../../lib/ui";
import { S } from "./shared";

/** b017-b025: one scale scene that keeps building. */
const Measure: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const x1 = 210;
  const len = 1440; // 30 m
  const busW = len / 2.5;
  const busOut = interpolate(f, [at("b023"), at("b023", 12)], [1, 0], clamp);
  const hurry = f > at("b025") ? Math.sin(f * 1.3) * 6 : 0;
  return (
    <>
      <OceanSet depth={0.42} krill={0.1} />
      <At x={x1 - 30} y={150}><BlueWhale w={len * 1.06} swim={0.4} /></At>
      <MeasureLine at={at("b018")} x1={x1} x2={x1 + len} y={600} text="~30 M" />
      <Show at={at("b020")} enter="fade">
        <MeasureLine at={at("b020")} x1={x1 + len} x2={x1 + len * (33.6 / 30)} y={600} text="" color={P.threat} />
        <Tag at={at("b020", 6)} x={x1 + len + 70} y={560} text="Record ~33.6 m · 1909" tone="threat" size={26} />
      </Show>
      <div style={{ opacity: busOut }}>
        {[0, 1, 2].map((i) => {
          const t0 = at("b019", i * 10);
          const p = interpolate(f, [t0, t0 + 22], [0, 1], { ...clamp, easing: ease });
          if (f < t0) return null;
          return (
            <div key={i} style={{ position: "absolute", left: x1 + i * busW + (1 - p) * 1400, top: 700, width: i === 2 ? busW / 2 : busW, overflow: "hidden" }}>
              <BusInline w={busW} />
            </div>
          );
        })}
        <Tag at={at("b019", 30)} x={x1 + len / 2} y={940} text="= 2.5 school buses" size={30} />
      </div>
      <Tag at={at("b022", 4)} x={960} y={70} text="Females are the bigger sex" size={30} />
      <Show at={at("b023")} enter="up" dist={30}>
        <At x={1520} y={830} center><Count at={at("b023")} to={190} suffix=" T" size={86} color={P.threat} sub="heaviest on record" /></At>
      </Show>
      <IconArray at={at("b024")} n={30} cols={10} x={x1 + 20} y={720 + hurry} gap={92} dur={40} render={() => <Elephant w={84} />} />
      <Tag at={at("b024", 40)} x={x1 + 470} y={1000} text="≈ 30 African elephants" size={28} />
      <Sfx at={at("b018")} name="tick_ui" vol={0.4} />
      <Sfx at={at("b019")} name="whoosh_soft" vol={0.45} />
      <Sfx at={at("b020")} name="pop_soft" vol={0.4} />
      <Sfx at={at("b023")} name="counter_roll" vol={0.35} />
      <Sfx at={at("b024")} name="pop_soft" vol={0.35} />
      <Sfx at={at("b025")} name="whoosh_soft" vol={0.4} />
    </>
  );
};

const BusInline: React.FC<{ w: number }> = ({ w }) => (
  <div>
    <svg width={w} height={w * 0.36} viewBox="0 0 300 108">
      <path d="M8 20 C8 12 14 8 22 8 L262 8 C276 8 284 16 288 30 L296 62 L296 86 L8 86 Z" fill="#E3A928" />
      <rect x="8" y="58" width="288" height="5" fill="#2A2A2A" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={20 + i * 27} y="18" width="22" height="26" rx="3" fill="#2B3A44" />
      ))}
      <circle cx="60" cy="88" r="14" fill="#1C1C1C" />
      <circle cx="240" cy="88" r="14" fill="#1C1C1C" />
    </svg>
  </div>
);

/** b026-b031: the "car-sized heart" myth vs the preserved heart. */
const HeartMyth: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const carOut = interpolate(f, [at("b031"), at("b031", 16)], [0, 1400], { ...clamp, easing: ease });
  return (
    <>
      <DarkSet />
      <div style={{ position: "absolute", left: 560, top: -100, width: 800, height: 1100, background: "radial-gradient(ellipse 50% 60% at 50% 70%, rgba(255,246,214,0.18), rgba(255,246,214,0))" }} />
      <At x={960} y={980} center><div style={{ width: 520, height: 40, borderRadius: "50%", background: "rgba(0,0,0,0.5)" }} /></At>
      <At x={720} y={440}><Heart w={420} beat={1 + Math.max(0, Math.sin(f / 9)) * 0.03} /></At>
      <Show at={0} until={at("b031")} enter="fade">
        <At x={1120 + carOut} y={760}><Car w={520} style={{ opacity: 0.55 }} /></At>
        <Tag at={6} until={at("b031")} x={1380} y={700} text="Size of a car?" size={32} />
      </Show>
      <Tag at={at("b027", 4)} x={330} y={110} text="Newfoundland · 2014" size={28} />
      <Show at={at("b029")} enter="up" dist={30}><At x={400} y={560} center><Count at={at("b029")} to={180} prefix="~" suffix=" KG" size={84} /></At></Show>
      <Tag at={at("b030", 4)} x={400} y={700} text="Smaller than expected" tone="safe" size={30} />
      <Show at={at("b031", 8)} enter="right" dist={300}><At x={1180} y={720}><GolfCart w={440} /></At></Show>
      <Tag at={at("b031", 20)} x={1400} y={1010} text="Golf cart, not car" tone="safe" size={30} />
      <Sfx at={at("b029")} name="counter_roll" vol={0.35} />
      <Sfx at={at("b031")} name="whoosh_soft" vol={0.45} />
      <Sfx at={8} name="heartbeat_slow" vol={0.5} />
    </>
  );
};

/** b032-b033: each beat pushes half a bathtub. */
const Pump: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const beat = (f % 40) < 6 ? 1.06 : 1;
  const fill = interpolate(f, [at("b033"), at("b033", 30)], [0, 0.5], clamp);
  return (
    <>
      <DarkSet />
      <At x={360} y={300}><Heart w={460} beat={beat} /></At>
      <At x={960} y={360}><Count at={at("b032", 4)} to={80} prefix="~" suffix=" L" size={110} color={P.threat} sub="per heartbeat (estimate)" /></At>
      <Show at={at("b033")} enter="up" dist={40}><At x={1100} y={640}><Bathtub w={520} fill={fill} /></At></Show>
      <Tag at={at("b033", 10)} x={1360} y={980} text="½ a bathtub, every beat" size={30} />
      <Sfx at={0} name="heartbeat_slow" vol={0.55} />
      <Sfx at={40} name="heartbeat_slow" vol={0.45} />
      <Sfx at={at("b033")} name="heartbeat_slow" vol={0.55} />
    </>
  );
};

/** b034-b036: tongue vs elephant on a balance. */
const Tongue: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const tilt = interpolate(f, [at("b035"), at("b035", 30)], [0, -9], { ...clamp, easing: ease });
  return (
    <>
      <DarkSet />
      <Balance
        x={960}
        y={260}
        tilt={tilt}
        left={
          <svg width={260} height={130} viewBox="0 0 200 100">
            <path d="M10 60 C10 26 190 26 190 60 C190 86 150 96 100 96 C50 96 10 86 10 60 Z" fill="#D58A92" />
            <path d="M100 40 L100 90" stroke="#B5646E" strokeWidth={4} />
          </svg>
        }
        right={f > at("b035") ? <Elephant w={230} /> : <div />}
      />
      <At x={960} y={130} center><Count at={at("b034", 4)} to={2.7} dec={1} prefix="~" suffix=" T" size={90} sub="tongue (sources vary)" /></At>
      <Tag at={at("b035", 30)} x={960} y={960} text="Heavier than an adult Asian elephant" size={30} />
      <Tag at={at("b036", 2)} x={960} y={1020} text="Living in its mouth" tone="threat" size={28} />
      <Sfx at={at("b035", 6)} name="impact_heavy" vol={0.3} />
    </>
  );
};

/** b037-b041: mother and calf; daily gain and milk. */
const Calf: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 400], [1200, 260], clamp);
  return (
    <>
      <OceanSet depth={0.3} krill={0.05} />
      <At x={x} y={230}><BlueWhale w={1100} swim={0.6} id="mom" /></At>
      <At x={x + 260} y={520}><BlueWhale w={420} swim={1.2} id="calf" /></At>
      <Show at={at("b038")} enter="up" dist={30}><At x={1500} y={150} center><Count at={at("b038")} to={90} prefix="+" suffix=" KG/DAY" size={70} color={P.threat} /></At></Show>
      <IconArray at={at("b039")} n={7} cols={7} x={240} y={760} gap={80} dur={40} render={() => <Human w={52} />} />
      <Tag at={at("b039", 10)} x={530} y={1010} text="≈ one adult human, every day" size={28} />
      <Show at={at("b040")} enter="up" dist={30}><At x={1460} y={720} center><Count at={at("b040")} to={400} prefix="~" suffix=" L MILK/DAY" size={58} /></At></Show>
      <Show at={at("b041")} enter="fade"><Meter at={at("b041")} to={0.5} x={1100} y={830} w={720} value="~50% FAT" /></Show>
      <Sfx at={at("b038")} name="counter_roll" vol={0.35} />
      <Sfx at={at("b039")} name="pop_soft" vol={0.35} />
      <Sfx at={at("b041")} name="tick_ui" vol={0.35} />
    </>
  );
};

const AskFood: React.FC = () => {
  const at = useAt();
  return (
    <>
      <DarkSet />
      <BigText at={4} text="SOMETHING THIS BIG HAS TO EAT." size={64} sub="WHAT DOES IT EAT?" subAt={at("b043")} />
      <At x={960} y={1000} center><Label text="" /></At>
      <Sfx at={at("b043")} name="pop_soft" vol={0.4} />
    </>
  );
};

export const Chapter_03: React.FC = () => (
  <>
    <S name="07 Measure" first="b017" last="b025" drift={0.03}><Measure /></S>
    <S name="08 Heart myth" first="b026" last="b031"><HeartMyth /></S>
    <S name="09 Pump" first="b032" last="b033"><Pump /></S>
    <S name="10 Tongue" first="b034" last="b036"><Tongue /></S>
    <S name="11 Calf" first="b037" last="b041"><Calf /></S>
    <S name="12 Ask food" first="b042" last="b043"><AskFood /></S>
  </>
);
