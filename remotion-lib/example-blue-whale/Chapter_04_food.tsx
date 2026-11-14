import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { At, Count, FONT, Label, P, Sfx, Show, Tag, clamp, ease, useAt, useEndOf } from "../../lib/core";
import { BlueWhale, Burger, Diver, Elephant, Krill } from "../../lib/art";
import { DarkSet, OceanSet } from "../../lib/sets";
import { Bars, BigText, IconArray, Stamp, StockClip } from "../../lib/ui";
import { S } from "./shared";

/** b044-b046: macro krill vs a finger, then the swarm around you. */
const KrillMacro: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const swarm = interpolate(f, [at("b046"), at("b046", 20)], [0, 1], clamp);
  return (
    <>
      <OceanSet depth={0.2} krill={0.3 + swarm * 0.7} />
      <div style={{ opacity: 1 - swarm }}>
        <At x={420} y={300}>
          <svg width={240} height={640} viewBox="0 0 60 160">
            <rect x="8" y="0" width="44" height="170" rx="22" fill="#E2B796" />
            <rect x="16" y="6" width="28" height="24" rx="10" fill="#F2D6C2" />
            <path d="M8 70 H52 M8 110 H52" stroke="#C49473" strokeWidth={2} />
          </svg>
        </At>
        <At x={760} y={420 + Math.sin(f / 12) * 8}><Krill w={760} /></At>
        <Tag at={6} x={1150} y={300} text="Smaller than your finger" size={32} />
        <Tag at={at("b045", 4)} x={1150} y={800} text="Krill · ~all of its diet" size={30} />
      </div>
      <Show at={at("b046")} enter="fade">
        {Array.from({ length: 26 }).map((_, i) => (
          <At key={i} x={random(`kx${i}`) * 1800 + Math.sin(f / 20 + i) * 20} y={random(`ky${i}`) * 960 + Math.cos(f / 24 + i) * 16}>
            <Krill w={60 + random(`kw${i}`) * 90} flip={i % 2 === 0} />
          </At>
        ))}
        <At x={820} y={480}><Diver w={300} /></At>
        <Tag at={at("b046", 10)} x={960} y={950} text="The pink in your water" size={30} />
      </Show>
      <Sfx at={at("b046")} name="bubbles" vol={0.35} />
    </>
  );
};

/** b047-b050: the 2021 tagging study recalculates the menu. */
const Study: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  return (
    <>
      <OceanSet depth={0.35} krill={0.4} />
      <At x={interpolate(f, [0, 300], [900, 300], clamp)} y={120}><BlueWhale w={1100} tag id="tagged" /></At>
      <Tag at={8} x={460} y={90} text="2021 study · tagged whales" size={28} />
      <Show at={at("b048")} enter="fade">
        <Bars at={at("b048")} x={160} y={560} w={1100} rows={[{ label: "OLD ESTIMATE", v: 0.3, color: "#6E8798" }, { label: "2021 ESTIMATE", v: 0.9, color: P.threat }]} />
        <Tag at={at("b048", 30)} x={1380} y={640} text="~3x more" tone="threat" size={36} />
      </Show>
      <Show at={at("b049")} enter="up" dist={30}><At x={1520} y={430} center><Count at={at("b049")} to={16} prefix="~" suffix=" T/DAY" size={80} sub="eastern North Pacific, feeding season" /></At></Show>
      <IconArray at={at("b050")} n={3} cols={3} x={420} y={790} gap={240} dur={20} render={(i) => <div style={{ width: i === 2 ? 110 : 220, overflow: "hidden" }}><Elephant w={220} tone="#E8857A" /></div>} />
      <Tag at={at("b050", 20)} x={1260} y={900} text="2.5 elephants. Of shrimp." size={32} />
      <Sfx at={at("b048")} name="tick_ui" vol={0.35} />
      <Sfx at={at("b049")} name="counter_roll" vol={0.35} />
      <Sfx at={at("b050")} name="pop_soft" vol={0.35} />
    </>
  );
};

/** b051-b054: feast-or-famine calendar. */
const Season: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const fast = interpolate(f, [at("b053"), at("b053", 20)], [0, 1], clamp);
  const open = f < at("b054", 14) || Math.floor(f / 3) % 5 === 0;
  return (
    <>
      <DarkSet />
      <At x={960} y={180} center><Label text="One year" size={34} /></At>
      <div style={{ position: "absolute", left: 230, top: 300, width: 1460, display: "flex", flexWrap: "wrap", gap: 6 }}>
        {Array.from({ length: 365 }).map((_, i) => {
          const feed = i >= 150 && i < 250;
          const show = interpolate(f, [4 + i * 0.12, 8 + i * 0.12], [0, 1], clamp);
          const lit = feed ? interpolate(f, [at("b052"), at("b052", 20)], [0.25, 1], clamp) : 0.25 * (1 - fast * 0.6);
          return <div key={i} style={{ width: 28, height: 28, borderRadius: 4, background: feed ? P.safe : "#5C7280", opacity: show * lit }} />;
        })}
      </div>
      <Tag at={at("b052", 10)} x={960} y={760} text="~100 feeding days" tone="safe" size={34} />
      <Tag at={at("b053", 6)} x={960} y={830} text="The rest: fasting" size={30} />
      <Show at={at("b054")} enter="pop">
        <At x={1540} y={160} center>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, letterSpacing: 6, color: open ? "#FF6B5E" : "#5A2A27", border: `5px solid ${open ? "#FF6B5E" : "#5A2A27"}`, borderRadius: 16, padding: "6px 26px", textShadow: open ? "0 0 24px #FF6B5E" : undefined }}>
            {f < at("b054", 24) ? "OPEN" : "CLOSED"}
          </div>
        </At>
      </Show>
      <Sfx at={at("b052")} name="tick_ui" vol={0.35} />
      <Sfx at={at("b054", 22)} name="strike_line" vol={0.4} />
    </>
  );
};

/** b055-b058: a lunge into a dense swarm, the calories, the burgers. */
const Gulp: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const m = interpolate(f, [at("b056", -6), at("b056", 14), at("b057", 10), at("b057", 26)], [0, 1, 1, 0], clamp);
  return (
    <>
      <OceanSet depth={0.25} krill={1} />
      <At x={interpolate(f, [0, at("b056", 14)], [1500, 420], { ...clamp, easing: ease })} y={200}><BlueWhale w={1300} mouth={m} id="gulp" /></At>
      <Show at={at("b056")} enter="up" dist={30}><At x={1500} y={170} center><Count at={at("b056")} to={500} prefix="~" suffix=" KG KRILL" size={66} sub="one mouthful, dense swarm" /></At></Show>
      <Show at={at("b057")} enter="up" dist={30}><At x={1500} y={360} center><Count at={at("b057")} to={450000} prefix="~" suffix=" KCAL" size={60} color={P.threat} /></At></Show>
      <IconArray at={at("b058")} n={80} cols={16} x={260} y={700} gap={86} dur={40} render={() => <Burger w={60} />} />
      <Tag at={at("b058", 40)} x={960} y={1020} text="≈ 800 cheeseburgers · 1 icon = 10" size={28} />
      <Sfx at={at("b056", -6)} name="gulp" vol={0.6} />
      <Sfx at={at("b057")} name="counter_roll" vol={0.35} />
      <Sfx at={at("b058")} name="pop_soft" vol={0.35} />
    </>
  );
};

/** b059-b061: energy return. */
const Returns: React.FC = () => {
  const at = useAt();
  return (
    <>
      <DarkSet />
      <At x={960} y={200} center><Label text="Energy per lunge" size={36} /></At>
      <Bars at={6} x={260} y={330} w={1400} rows={[{ label: "SPENT", v: 0.04, color: "#6E8798" }, { label: "GAINED (UP TO)", v: 0.96, color: P.safe, delay: 14 }]} />
      <Tag at={30} x={960} y={540} text="Up to 240x" tone="safe" size={40} />
      <Show at={at("b060")} enter="up" dist={30}><At x={960} y={720} center><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, color: P.text }}>$1 → $240</div></At></Show>
      <Stamp at={at("b061", 8)} text="NOT AT YOUR BANK" x={1400} y={880} size={48} />
      <Sfx at={6} name="tick_ui" vol={0.35} />
      <Sfx at={at("b061", 8)} name="stamp" vol={0.6} />
    </>
  );
};

const OceanClip: React.FC = () => {
  const end = useEndOf();
  return (
    <>
      <StockClip src="blue-whale/stock/px_304019.mp4" credit="MARIO_KRIMER" dur={end("b062")} />
      <Tag at={10} x={960} y={160} text="Swarms drift. The ocean is enormous." size={32} />
      <Sfx at={0} name="whoosh_soft" vol={0.35} />
    </>
  );
};

const AskHow: React.FC = () => (
  <>
    <DarkSet />
    <BigText at={2} text="SO HOW DOES SOMETHING THIS BIG" size={60} sub="CATCH FOOD THIS SMALL?" subAt={20} />
  </>
);

export const Chapter_04: React.FC = () => (
  <>
    <S name="13 Krill" first="b044" last="b046"><KrillMacro /></S>
    <S name="14 Study" first="b047" last="b050"><Study /></S>
    <S name="15 Season" first="b051" last="b054"><Season /></S>
    <S name="16 Gulp" first="b055" last="b058" drift={0.02}><Gulp /></S>
    <S name="17 Returns" first="b059" last="b061"><Returns /></S>
    <S name="18 Ocean clip" first="b062" last="b062" drift={0}><OceanClip /></S>
    <S name="19 Ask how" first="b063" last="b063"><AskHow /></S>
  </>
);

