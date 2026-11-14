import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { At, Count, FONT, Label, P, Sfx, Show, Tag, clamp, ease, useAt, useEndOf } from "../../lib/core";
import { BlueWhale, Diver, Krill, Plate, Stick, Sun, WhalingShip } from "../../lib/art";
import { DarkSet, MapSet, OceanSet, PaperSet, SurfaceSet } from "../../lib/sets";
import { Bars, DiveHud, IconArray, Pie, Rings, Stamp, StockClip } from "../../lib/ui";
import { S, hud } from "./shared";
import { BRAND } from "../../lib/brand";

/* ============================ TWIST 1 ============================ */
const Menu: React.FC = () => {
  const at = useAt();
  return (
    <>
      <DarkSet />
      <At x={960} y={110} center><Label text="What blue whales eat" size={36} /></At>
      <Pie at={4} x={720} y={560} r={260} main="KRILL" minor="other" frac={0.97} />
      <At x={1380} y={470} center><Count at={20} to={0} size={130} suffix="%" sub="humans · not on the menu" color={P.safe} /></At>
      <Tag at={at("b151", 6)} x={1380} y={760} text="Can't even swallow you" tone="safe" size={32} />
      <Sfx at={4} name="tick_ui" vol={0.35} />
    </>
  );
};

const Eye: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  return (
    <>
      <OceanSet depth={0.3} krill={0.3} />
      <At x={interpolate(f, [0, at("b155", 40)], [-200, -3600], clamp)} y={-560}><BlueWhale w={5200} id="eye" swim={0.2} /></At>
      <Tag at={at("b153", 4)} x={960} y={130} text="Not a hunter. A planet, passing by." size={36} />
      <Show at={at("b154")} enter="fade">
        <At x={960} y={900} center>
          <div style={{ position: "relative" }}>
            <Label text="Danger: its interest in you" size={36} tone="dim" />
            <div style={{ position: "absolute", left: 0, top: "48%", height: 5, width: `${interpolate(f, [at("b154", 10), at("b154", 22)], [0, 100], clamp)}%`, background: P.threat }} />
          </div>
        </At>
      </Show>
      <Tag at={at("b155", 4)} x={960} y={980} text="Danger: its total lack of interest" tone="threat" size={38} />
      <Sfx at={0} name="whoosh_deep" vol={0.45} />
      <Sfx at={at("b154", 10)} name="strike_line" vol={0.45} />
    </>
  );
};

const Leave: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  return (
    <>
      <OceanSet depth={0.25} krill={0.15} />
      <div style={{ position: "absolute", left: -200, top: 120, width: 900, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,133,122,0.55), rgba(232,133,122,0))" }} />
      <At x={interpolate(f, [0, 120], [300, 1200], clamp)} y={480}><Diver w={380} /></At>
      <At x={-300} y={200}><BlueWhale w={1000} mouth={0.5 + 0.5 * Math.sin(f / 25)} id="lv" /></At>
      <Tag at={at("b157", 4)} x={1300} y={980} text="It keeps eating" tone="safe" size={32} />
      <Sfx at={0} name="bubbles" vol={0.4} />
    </>
  );
};

/* ============================ TWIST 2 ============================ */
const Arrow: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const flip = interpolate(f, [at("b159"), at("b159", 16)], [0, 180], { ...clamp, easing: ease });
  return (
    <>
      <DarkSet />
      <At x={160} y={400}><BlueWhale w={800} id="ar" swim={0.4} /></At>
      <At x={1500} y={330}><Stick w={130} pose="stand" /></At>
      <Tag at={4} x={1565} y={300} text="You" size={30} />
      <At x={1210} y={500} center><div style={{ width: 300, height: 10, background: P.danger, rotate: `${flip}deg` }}><div style={{ position: "absolute", right: -18, top: -14, borderLeft: `30px solid ${P.danger}`, borderTop: "19px solid transparent", borderBottom: "19px solid transparent" }} /></div></At>
      <Tag at={at("b159", 16)} x={960} y={900} text="The danger has always gone the other way" tone="threat" size={36} />
      <Sfx at={at("b159")} name="whoosh_soft" vol={0.5} />
    </>
  );
};

const Whaling: React.FC = () => {
  const at = useAt();
  return (
    <>
      <PaperSet />
      <At x={120} y={110}><WhalingShip w={520} /></At>
      <Tag at={6} x={380} y={420} text="Antarctic: ~330,000 caught" size={30} />
      <IconArray
        at={at("b161")}
        n={240}
        cols={24}
        x={760}
        y={120}
        gap={44}
        dur={30}
        dimAt={at("b161", 40)}
        keep={0}
        render={(i) => <div style={{ width: 36, height: 14, borderRadius: 8, background: i === 0 ? "#B33F48" : "#3A2F24" }} />}
      />
      <Tag at={at("b161", 4)} x={1270} y={980} text="239,000 → ~360 by 1973 · 1 icon = 1,000" size={28} />
      <Tag at={at("b162", 4)} x={380} y={600} text="Fewer than the seats on a jumbo jet" tone="threat" size={30} />
      <Sfx at={at("b161", 40)} name="low_hum" vol={0.35} />
    </>
  );
};

const Today: React.FC = () => {
  const at = useAt();
  return (
    <>
      <DarkSet />
      <At x={560} y={400} center><Count at={4} to={4000} prefix="~" size={120} sub="Antarctic blue whales today" /></At>
      <Tag at={at("b164", 4)} x={560} y={580} text="~2% of what once lived there" tone="threat" size={32} />
      <Show at={at("b165")} enter="fade">
        <At x={1420} y={400} center><Count at={at("b165")} to={25000} from={10000} prefix="10,000 - " size={70} sub="blue whales worldwide (IUCN)" /></At>
        <Tag at={at("b165", 8)} x={1420} y={580} text="Endangered" tone="threat" size={32} />
      </Show>
      <Sfx at={4} name="counter_roll" vol={0.35} />
    </>
  );
};

const ShipClip: React.FC = () => {
  const end = useEndOf();
  return (
    <>
      <StockClip src="blue-whale/stock/b166_23215.mp4" credit="BELLERGY" dur={end("b166")} />
      <Tag at={8} x={960} y={150} text="Today's big threat: ships" tone="threat" size={36} />
      <Sfx at={0} name="boat_motor" vol={0.3} />
    </>
  );
};

const Strikes: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <MapSet land={["M1180 0 C1150 200 1240 360 1210 520 C1180 700 1290 860 1310 1080 L1920 1080 L1920 0 Z"]} />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: 300, top: 380 + i * 140, width: 900, height: 2, background: "rgba(238,243,245,0.35)", backgroundImage: "repeating-linear-gradient(90deg, rgba(238,243,245,0.6) 0 18px, transparent 18px 32px)" }} />
      ))}
      {Array.from({ length: 18 }).map((_, i) => (
        <At key={i} x={340 + random(`st${i}`) * 820} y={370 + (i % 3) * 140 - 14}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: P.danger, opacity: interpolate(f, [6 + i * 3, 12 + i * 3], [0, 1], clamp) }}>✕</div>
        </At>
      ))}
      <Tag at={8} x={700} y={140} text="US West Coast shipping lanes" size={30} />
      <At x={700} y={860} center><Count at={10} to={18} prefix="~" suffix=" / YEAR" size={86} color={P.threat} sub="blue whales killed by ship strikes (2017 estimate)" /></At>
      <Sfx at={8} name="impact_heavy" vol={0.25} />
    </>
  );
};

const Careful: React.FC = () => {
  const end = useEndOf();
  return (
    <>
      <StockClip src="blue-whale/stock/px_340813.mp4" credit="TONYDIAS7" dur={end("b168")} />
      <Tag at={6} x={960} y={150} text="You're not the one who should be scared" size={34} />
    </>
  );
};

const NoaaPair: React.FC = () => {
  const end = useEndOf();
  return (
    <>
      <StockClip src="blue-whale/stock/noaa_bw_pair.mp4" credit="NOAA FISHERIES" source="" bright={1.0} trim={1.6} dur={end("b165")} zoom={[1.1, 1.18]} />
      <Tag at={6} x={960} y={150} text="~10,000-25,000 blue whales left worldwide" tone="threat" size={32} />
      <Tag at={20} x={960} y={220} text="Endangered (IUCN)" size={26} />
    </>
  );
};

const NoaaEntangled: React.FC = () => {
  const end = useEndOf();
  return (
    <>
      <StockClip src="blue-whale/stock/noaa_bw_entangled.mp4" credit="NOAA FISHERIES, NOAA MMHSRP PERMIT #18786" source="" trim={1} dur={end("b169")} zoom={[1.02, 1.08]} />
      <Tag at={4} x={960} y={150} text="You're the one who should be careful" tone="safe" size={34} />
      <Tag at={10} x={960} y={930} text="Real blue whale tangled in line · California, 2016" size={26} />
    </>
  );
};

/* ============================ ECOSYSTEM ============================ */
const Pump: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const cloud = interpolate(f, [at("b172"), at("b172", 40)], [0, 1], clamp);
  const bloom = interpolate(f, [at("b174"), at("b174", 50)], [0, 1], clamp);
  return (
    <>
      <SurfaceSet line={300} />
      <At x={140} y={300}><BlueWhale w={900} id="pm" swim={0.4} /></At>
      {Array.from({ length: 14 }).map((_, i) => (
        <At key={i} x={1100 + (i % 5) * 120} y={640 + Math.floor(i / 5) * 90}>
          <div style={{ position: "relative" }}>
            <Krill w={80} />
            {f > at("b171") && <div style={{ position: "absolute", left: 50, top: -12, fontFamily: FONT, fontWeight: 800, fontSize: 18, color: "#F4E3D7", background: "#8C6A5C", borderRadius: 6, padding: "1px 6px" }}>Fe</div>}
          </div>
        </At>
      ))}
      <div style={{ position: "absolute", left: 980, top: 320, width: 420 * cloud, height: 160 * cloud, borderRadius: "50%", background: "radial-gradient(circle, rgba(170,110,60,0.85), rgba(170,110,60,0))", filter: "blur(6px)" }} />
      {Array.from({ length: 80 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 300 + random(`pl${i}`) * 1500, top: 320 + random(`pt${i}`) * 220, width: 10, height: 10, borderRadius: 9, background: "#6CCB7A", opacity: bloom * (random(`po${i}`) > bloom ? 0 : 0.9) }} />
      ))}
      <Tag at={6} until={at("b171")} x={960} y={990} text="The ocean needs them" tone="safe" size={38} />
      <Tag at={at("b171", 4)} x={1400} y={980} text="Krill: packed with iron" size={30} />
      <Tag at={at("b172", 10)} until={at("b174")} x={1190} y={250} text="Released near the surface" size={28} />
      <Stamp at={at("b173", 4)} text="YES. POOP." x={1200} y={500} color="#B5823F" size={50} />
      <Tag at={at("b174", 10)} x={760} y={250} text="Iron feeds plankton · plankton feed krill" tone="safe" size={28} />
      <Tag at={at("b175", 4)} x={700} y={980} text="Fertilizing its own buffet" tone="safe" size={32} />
      <Sfx at={at("b172")} name="bubbles" vol={0.45} />
      <Sfx at={at("b173", 4)} name="stamp" vol={0.55} />
      <Sfx at={at("b174")} name="pop_soft" vol={0.35} />
    </>
  );
};

const GreatWhales: React.FC = () => {
  const end = useEndOf();
  return (
    <>
      <StockClip src="blue-whale/stock/px_244188.mp4" credit="LISAOLIVIA" dur={end("b176")} />
      <Tag at={6} x={960} y={150} text="Industrial whaling took most of the great whales" size={32} />
      <div style={{ position: "absolute", right: 40, bottom: 30, fontFamily: FONT, fontWeight: 600, fontSize: 20, color: "rgba(238,243,245,0.7)" }}>(SHOWN: HUMPBACK WHALE)</div>
    </>
  );
};

const Paradox: React.FC = () => {
  const at = useAt();
  return (
    <>
      <DarkSet />
      <At x={960} y={170} center><Label text="Southern Ocean, after whaling" size={34} /></At>
      <Bars at={6} x={260} y={330} w={1400} rows={[{ label: "WHALES", v: 0.12, color: "#6E8798" }, { label: "KRILL", v: 0.4, color: "#E8857A", delay: 30 }]} />
      <Tag at={at("b177", 10)} x={960} y={560} text="Krill didn't explode. They declined." tone="threat" size={34} />
      <Tag at={at("b178", 4)} x={960} y={660} text="The krill paradox" size={32} />
      <Show at={at("b179")} enter="up" dist={30}>
        <At x={960} y={860} center><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 70, color: P.safe }}>GARDENING THE OCEAN</div></At>
      </Show>
      <Sfx at={at("b179")} name="pop_soft" vol={0.4} />
    </>
  );
};

/* ============================ CLOSE ============================ */
const Return: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  return (
    <>
      <OceanSet depth={0.14} krill={0.6} dimFrom={0.5} dimTo={0} dimAt={[0, at("b183", 20)]} />
      <At x={880 + Math.sin(f / 30) * 10} y={-30}><Sun w={300} glow={interpolate(f, [at("b183"), at("b183", 25)], [0.15, 1], clamp)} /></At>
      <At x={560 + f * 0.4} y={470}><Diver w={700} /></At>
      <Rings x={960} y={540} from={0} period={130} n={2} width={10} color={`rgba(238,243,245,${interpolate(f, [0, at("b183")], [0.25, 0], clamp)})`} max={1400} />
      <DiveHud {...hud("b180")} />
      <Tag at={at("b184", 4)} x={960} y={930} text="If you can see the sun, you're safe" tone="safe" size={34} />
      <Sfx at={0} name="bubbles" vol={0.35} />
    </>
  );
};

const NewMeaning: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const pull = interpolate(f, [at("b189"), at("b189", 40)], [1, 0.42], { ...clamp, easing: ease });
  const lunge = interpolate(f, [at("b190"), at("b190", 50)], [2200, -1600], clamp);
  return (
    <>
      <OceanSet depth={0.2} krill={0.5} />
      <div style={{ position: "absolute", inset: 0, scale: String(pull) }}>
        <Show at={at("b189")} enter="fade"><At x={-400} y={160}><Plate w={2700} style={{ opacity: 0.9 }} /></At></Show>
        {Array.from({ length: 40 }).map((_, i) => {
          const x = 300 + random(`nk${i}`) * 1300;
          const gone = f > at("b190") && Math.abs(x - (lunge + 600)) < 500;
          return <At key={i} x={x} y={300 + random(`ny${i}`) * 480}><div style={{ opacity: gone ? 0 : 1 }}><Krill w={60} flip={i % 2 === 0} /></div></At>;
        })}
        <At x={860} y={500}><Diver w={240} /></At>
        {f > at("b186") && f < at("b189") &&
          Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2;
            return <div key={i} style={{ position: "absolute", left: 980 + Math.cos(a) * 330, top: 545 + Math.sin(a) * 260, width: 70, height: 4, background: P.threat, rotate: `${(a * 180) / Math.PI}deg` }} />;
          })}
        <At x={lunge} y={180}><BlueWhale w={1500} mouth={0.9} id="nm" /></At>
      </div>
      <Tag at={at("b185", 4)} until={at("b188")} x={960} y={110} text="The rule was never about you" size={34} />
      <Tag at={at("b187", 4)} until={at("b188")} x={960} y={980} text="It was coming for everything around you" tone="threat" size={32} />
      <Tag at={at("b188", 4)} until={at("b189")} x={960} y={980} text="Not predator · not prey" size={34} />
      <Tag at={at("b189", 20)} until={at("b190")} x={960} y={980} text="A crumb on the edge of the plate" size={34} />
      <Tag at={at("b190", 20)} x={960} y={980} text="It politely ate around you" tone="safe" size={34} />
      <Sfx at={at("b190")} name="gulp" vol={0.6} />
      <Sfx at={at("b190")} name="whoosh_deep" vol={0.5} />
    </>
  );
};

const Cta: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  return (
    <>
      <OceanSet depth={0.35} krill={0.2} />
      <At x={260} y={interpolate(f, [0, 300], [760, 300], clamp)} style={{ rotate: "-25deg" }}><Diver w={320} /></At>
      <At x={960} y={250} center><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 76, letterSpacing: 10, color: P.text }}>{BRAND.channel_name.toUpperCase()} · LOG 01</div></At>
      <Show at={at("b192")} enter="up" dist={30}>
        <At x={700} y={480}>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: P.text, background: "rgba(20,32,40,0.9)", padding: "18px 28px", borderRadius: 14 }}>Which creature should {BRAND.channel_name} cover next?</div>
        </At>
      </Show>
      <Tag at={at("b193", 4)} x={1010} y={640} text="The strangest suggestion usually wins" tone="safe" size={30} />
      <Show at={at("b194")} enter="fade">
        <At x={1180} y={680}><div style={{ width: 460, height: 260, border: "3px dashed rgba(238,243,245,0.5)", borderRadius: 8, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 12, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: P.threat, letterSpacing: 3 }}>WATCH NEXT</div></At>
      </Show>
    </>
  );
};

export const Chapter_09: React.FC = () => (
  <>
    <S name="51 Menu" first="b150" last="b151"><Menu /></S>
    <S name="52 Eye" first="b152" last="b155" drift={0.01}><Eye /></S>
    <S name="53 Leave" first="b156" last="b157"><Leave /></S>
  </>
);
export const Chapter_10: React.FC = () => (
  <>
    <S name="54 Arrow" first="b158" last="b159"><Arrow /></S>
    <S name="55 Whaling" first="b160" last="b162"><Whaling /></S>
    <S name="56 Today" first="b163" last="b164"><Today /></S>
    <S name="56a NOAA pair" first="b165" last="b165" drift={0}><NoaaPair /></S>
    <S name="57 Ship clip" first="b166" last="b166" drift={0}><ShipClip /></S>
    <S name="58 Strikes" first="b167" last="b167"><Strikes /></S>
    <S name="59 Careful clip" first="b168" last="b168" drift={0}><Careful /></S>
    <S name="59a NOAA entangled" first="b169" last="b169" drift={0}><NoaaEntangled /></S>
  </>
);
export const Chapter_11: React.FC = () => (
  <>
    <S name="61 Pump" first="b170" last="b175"><Pump /></S>
    <S name="62 Great whales clip" first="b176" last="b176" drift={0}><GreatWhales /></S>
    <S name="63 Paradox" first="b177" last="b179"><Paradox /></S>
  </>
);
export const Chapter_12: React.FC = () => (
  <>
    <S name="64 Return" first="b180" last="b184"><Return /></S>
    <S name="65 New meaning" first="b185" last="b190" drift={0.015}><NewMeaning /></S>
  </>
);
export const Chapter_13: React.FC = () => (
  <>
    <S name="66 CTA" first="b191" last="b194"><Cta /></S>
  </>
);
