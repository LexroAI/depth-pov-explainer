import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { At, Cam, Count, FONT, P, Sfx, Show, Tag, clamp, ease, useAt, useEndOf } from "../../lib/core";
import { BlueWhale, BlueWhaleFront, Building, Diver, Krill, Paper, Sun } from "../../lib/art";
import { DarkSet, MapSet, OceanSet, XraySet } from "../../lib/sets";
import { BigText, DepthRuler, Ecg, Meter, Rings, StockClip, TopList } from "../../lib/ui";
import { S, hud } from "./shared";
import { DiveHud } from "../../lib/ui";

const Pool: React.FC<{ w: number }> = ({ w }) => (
  <svg width={w} height={w * 0.5} viewBox="0 0 200 100">
    <rect x="2" y="2" width="196" height="96" rx="6" fill="rgba(79,179,217,0.25)" stroke="#BDE6F3" strokeWidth={3} strokeDasharray="8 6" />
    {[25, 50, 75].map((y) => (
      <line key={y} x1="8" y1={y} x2="192" y2={y} stroke="#BDE6F3" strokeWidth={1.5} strokeDasharray="3 5" />
    ))}
  </svg>
);

/** b064-b071: PAYOFF. The shadow that ate the sun was a mouth. */
const Payoff: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const m = interpolate(f, [at("b067"), at("b069", 10)], [0, 1], { ...clamp, easing: ease });
  const wx = interpolate(f, [0, at("b067"), at("b069", 20)], [1500, 700, -100], { ...clamp, easing: ease });
  return (
    <>
      <OceanSet depth={0.18} krill={1} dimFrom={0.15} dimTo={0.55} dimAt={[at("b069"), at("b071", 20)]} />
      <At x={880} y={-30}><Sun w={300} glow={interpolate(f, [at("b071"), at("b071", 15)], [1, 0.1], clamp)} /></At>
      <Cam keys={[[0, 1, 0, 0], [at("b068"), 1.0, 0, 0], [at("b068", 25), 1.7, 300, -40], [at("b069", 30), 1.7, 300, -40], [at("b070"), 1.15, 80, 0]]} origin="35% 50%">
        <At x={wx} y={170} style={{ rotate: "-8deg", opacity: f >= at("b065") && f < at("b067") ? 0 : 1 }}><BlueWhale w={1700} mouth={m} krillIn id="pay" /></At>
        <Show at={at("b065")} until={at("b067")} enter="blur">
          <At
            x={960}
            y={470}
            center
            style={{ scale: String(interpolate(f, [at("b065"), at("b067")], [0.5, 2.3], { ...clamp, easing: (t: number) => t * t })) }}
          >
            <BlueWhaleFront w={1100} open={interpolate(f, [at("b065"), at("b065", 25)], [0.2, 1], clamp)} />
          </At>
        </Show>
        <Show at={at("b070")} enter="pop"><At x={wx + 120} y={420}><Pool w={560} /></At></Show>
      </Cam>
      <At x={1460} y={820}><Diver w={200} /></At>
      <DiveHud {...hud("b064")} />
      <Tag at={at("b064", 4)} until={at("b065")} x={960} y={960} text="Remember the sun going out?" size={32} />
      <Tag at={at("b065", 4)} until={at("b068")} x={960} y={960} text="That wasn't a cloud. That was a mouth." tone="threat" size={34} />
      <Tag at={at("b068", 20)} until={at("b070")} x={960} y={960} text="Throat grooves · fold like an accordion" size={30} />
      <Tag at={at("b070", 6)} x={960} y={960} text="≈ a large swimming pool, in seconds" tone="threat" size={32} />
      <Sfx at={at("b065")} name="riser_tension" vol={0.4} />
      <Sfx at={at("b065", 10)} name="gulp" vol={0.55} />
      <Sfx at={at("b067")} name="whoosh_deep" vol={0.6} />
      <Sfx at={at("b069")} name="gulp" vol={0.7} />
      <Sfx at={at("b071")} name="low_hum" vol={0.4} />
    </>
  );
};

/** b072-b075: water out through the baleen, krill stays, and so might you. */
const Filter: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const m = interpolate(f, [0, 30], [0.8, 0.15], { ...clamp, easing: ease });
  return (
    <>
      <OceanSet depth={0.3} krill={0.6} />
      <Cam keys={[[0, 1.55, 520, 40], [at("b075"), 1.55, 520, 40], [at("b075", 25), 1.2, 300, 20]]} origin="20% 50%">
        <At x={60} y={250}><BlueWhale w={1600} mouth={m} id="flt" baleen={f > at("b073")} /></At>
        {/* water jets */}
        <Show at={at("b072")} enter="fade">
          {Array.from({ length: 10 }).map((_, i) => {
            const t = ((f + i * 7) % 40) / 40;
            return <div key={i} style={{ position: "absolute", left: 140 + i * 58, top: 600 + t * 180, width: 6, height: 40, borderRadius: 4, background: "rgba(200,235,245,0.7)", opacity: 1 - t }} />;
          })}
        </Show>
        {Array.from({ length: 30 }).map((_, i) => (
          <At key={i} x={150 + random(`fk${i}`) * 600} y={330 + random(`fy${i}`) * 70}><Krill w={24} /></At>
        ))}
      </Cam>
      <Tag at={at("b073", 4)} x={1380} y={140} text="Baleen = a giant comb" size={32} />
      <Tag at={at("b074")} x={1380} y={210} text="Water out · krill stays" tone="safe" size={32} />
      <Show at={at("b075")} enter="fade">
        <At x={1120} y={600}><Diver w={130} /></At>
        <At x={1185} y={625} center><div style={{ width: 230, height: 230, borderRadius: 999, border: `3px solid ${P.threat}` }} /></At>
        <Tag at={at("b075", 6)} x={1185} y={790} text="You · more stuff in the water" tone="threat" size={28} />
      </Show>
      <Sfx at={at("b072")} name="bubbles" vol={0.45} />
      <Sfx at={at("b075")} name="pop_soft" vol={0.4} />
    </>
  );
};

/** b076-b079: tags, lunges, and the feeding zone - right where you are. */
const Zone: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const px = (m: number) => 140 + m * 8;
  return (
    <>
      <OceanSet depth={0.3} krill={0.4} />
      {[0, 1, 2].map((i) => (
        <At key={i} x={interpolate(f, [0, 400], [1300 + i * 160, 300 + i * 160], clamp)} y={180 + i * 210}><BlueWhale w={620 - i * 60} tag id={`z${i}`} swim={0.6} /></At>
      ))}
      <TopList x={120} y={80} rows={[{ at: 4, text: "265 whales tagged" }, { at: at("b077"), text: "650+ lunges recorded" }]} />
      <Show at={at("b078")} enter="fade">
        <div style={{ position: "absolute", left: 1500, top: px(0), width: 300, height: px(100) - px(0), background: "rgba(61,220,132,0.14)", borderTop: `2px solid ${P.safe}`, borderBottom: `2px solid ${P.safe}` }} />
        {[0, 25, 50, 75, 100, 115].map((m) => (
          <div key={m} style={{ position: "absolute", left: 1820, top: px(m) - 14, fontFamily: FONT, fontWeight: 600, fontSize: 24, color: P.dim }}>{m} m</div>
        ))}
        <Tag at={at("b078", 6)} x={1650} y={px(50)} text="Most feeding" tone="safe" size={28} />
      </Show>
      <Show at={at("b079")} enter="pop">
        <At x={1540} y={px(22) - 30}><Diver w={150} beam={false} /></At>
        <Tag at={at("b079", 4)} x={1650} y={px(22) - 60} text="You · 22 m" tone="threat" size={26} />
      </Show>
      <Sfx at={at("b077")} name="tick_ui" vol={0.35} />
      <Sfx at={at("b079")} name="warning_beep" vol={0.35} />
    </>
  );
};

/** b080-b082: follow the dive down a scrolling depth ruler. */
const Dive: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const d = interpolate(f, [0, at("b081", 30)], [0, 506], { ...clamp, easing: ease });
  return (
    <>
      <OceanSet depth={interpolate(d, [0, 506], [0.3, 0.95])} rays={false} />
      <At x={560} y={240 + Math.sin(f / 20) * 10} style={{ rotate: "62deg" }}><BlueWhale w={900} swim={1.2} id="dv" /></At>
      <DepthRuler depth={d} x={1640} color={d > 480 ? P.threat : P.text} />
      <Tag at={at("b081", 30)} x={1300} y={640} text="Deepest confirmed" tone="threat" size={28} />
      <Show at={at("b082")} enter="up" dist={60}>
        <At x={1260} y={540 - (443 * 1.4) / 2 - 40}><Building w={140} /></At>
        <Tag at={at("b082", 6)} x={1330} y={1020} text="Empire State Building · 443 m" size={26} />
      </Show>
      <Sfx at={0} name="whoosh_deep" vol={0.5} />
      <Sfx at={at("b081")} name="sonar_ping" vol={0.35} />
    </>
  );
};

/** b080: real blue whale lifting its fluke to dive (NOAA Fisheries). */
const NoaaFluke: React.FC = () => {
  const end = useEndOf();
  return (
    <>
      <StockClip src="blue-whale/stock/noaa_bw_fluke.mp4" credit="NOAA FISHERIES" source="" bright={1.0} trim={0.9} dur={end("b080")} zoom={[1.15, 1.22]} />
      <Tag at={6} x={960} y={150} text="Typical dive: 8-15 minutes" size={32} />
      <Sfx at={20} name="whoosh_deep" vol={0.35} />
    </>
  );
};

/** b083-b085: the heart nearly stops. */
const HeartRate: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const bpm = interpolate(f, [0, at("b084", 20)], [12, 2], clamp);
  return (
    <>
      <DarkSet />
      <At x={160} y={120}><BlueWhale w={900} silhouette id="hrs" /></At>
      <At x={560} y={260} center><div style={{ width: 70, height: 70, borderRadius: 99, background: "rgba(220,80,90,0.85)", boxShadow: "0 0 60px rgba(220,80,90,0.9)", scale: String((f % Math.round(1800 / bpm)) < 6 ? 1.3 : 1) }} /></At>
      <Ecg x={180} y={520} w={1560} bpm={bpm} color={P.threat} title="BLUE WHALE · DIVING" />
      <At x={1520} y={430} center><Count at={at("b084")} to={2} from={12} suffix=" BPM" size={70} color={P.threat} sub="tagged whale, PNAS 2019" /></At>
      <Show at={at("b085")} enter="up" dist={30}>
        <Ecg x={180} y={770} w={1560} bpm={60} color={P.safe} title="YOU · RESTING" />
        <Tag at={at("b085", 8)} x={960} y={1010} text="1 beat for it · 30 for you" size={30} />
      </Show>
      <Sfx at={4} name="heartbeat_slow" vol={0.55} />
      <Sfx at={at("b084")} name="heartbeat_slow" vol={0.5} />
    </>
  );
};

/** b086-b088: the hum = calls ~188 dB, the 1971 paper. */
const Voice: React.FC = () => {
  const at = useAt();
  return (
    <>
      <OceanSet depth={0.6} rays={false} />
      <At x={-200} y={420}><BlueWhale w={1100} id="vc" swim={0.5} /></At>
      <Rings x={180} y={560} from={0} period={110} n={4} width={10} color="rgba(242,194,48,0.35)" max={1700} />
      <Show at={at("b087")} enter="fade"><Meter at={at("b087")} to={0.8} x={860} y={180} w={900} title="BLUE WHALE CALL · UNDERWATER" value="~188 dB" /></Show>
      <Show at={at("b088")} enter="up" dist={80}>
        <At x={1080} y={500}><Paper w={560} title="1971 STUDY" lines={[["CALLS:", "blue whale moans"], ["VERDICT:", "most powerful sustained sounds known from any living source"]]} rot={3} /></At>
      </Show>
      <Sfx at={0} name="whale_moan" vol={0.55} />
      <Sfx at={at("b087")} name="counter_roll" vol={0.3} />
      <Sfx at={at("b088")} name="paper_slide" vol={0.5} />
    </>
  );
};

const Felt: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <XraySet />
      <At x={460} y={330} style={{ translate: `${Math.sin(f * 1.7) * 4}px 0px` }}><Diver w={1000} xray beam={false} bubbles={false} /></At>
      <Rings x={-100} y={540} period={60} n={3} color="rgba(45,210,122,0.5)" width={6} max={2200} />
      <Tag at={6} x={960} y={140} text="Felt, not heard" tone="safe" size={40} />
      <Sfx at={0} name="scan_beep" vol={0.4} />
      <Sfx at={10} name="low_hum" vol={0.5} />
    </>
  );
};

const Range: React.FC = () => {
  const at = useAt();
  return (
    <>
      <MapSet land={["M1500 0 C1460 200 1560 380 1520 560 C1480 760 1600 900 1580 1080 L1920 1080 L1920 0 Z", "M0 820 C200 780 340 860 420 1080 L0 1080 Z"]} />
      <Rings x={760} y={520} from={0} period={100} n={4} width={4} color="rgba(242,194,48,0.6)" max={900} />
      <At x={760} y={520} center><div style={{ width: 22, height: 22, borderRadius: 99, background: P.threat }} /></At>
      <Tag at={8} x={760} y={140} text="Calls carry hundreds of miles" size={34} />
      <Show at={at("b091")} enter="fade">
        <TopList x={1180} y={640} rows={[{ at: at("b091"), text: "Huge" }, { at: at("b091", 8), text: "Loud" }, { at: at("b091", 16), text: "Eats a pool in seconds", tone: "threat" }]} />
      </Show>
      <Sfx at={0} name="sonar_ping" vol={0.4} />
    </>
  );
};

const AskWhere: React.FC = () => (
  <>
    <DarkSet />
    <BigText at={2} text="BUT DOES IT KNOW" size={64} sub="WHERE IT'S GOING?" subAt={18} />
  </>
);

export const Chapter_05: React.FC = () => (
  <>
    <S name="20 Payoff" first="b064" last="b071" drift={0.02}><Payoff /></S>
    <S name="21 Filter" first="b072" last="b075" drift={0.015}><Filter /></S>
    <S name="22 Zone" first="b076" last="b079"><Zone /></S>
    <S name="23a NOAA fluke" first="b080" last="b080" drift={0}><NoaaFluke /></S>
    <S name="23 Dive" first="b081" last="b082" drift={0.015}><Dive /></S>
    <S name="24 Heart rate" first="b083" last="b085"><HeartRate /></S>
    <S name="25 Voice" first="b086" last="b088"><Voice /></S>
    <S name="26 Felt" first="b089" last="b089"><Felt /></S>
    <S name="27 Range" first="b090" last="b091"><Range /></S>
    <S name="28 Ask where" first="b092" last="b092"><AskWhere /></S>
  </>
);

