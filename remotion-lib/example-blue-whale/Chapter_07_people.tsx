import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { At, Count, P, Sfx, Show, Tag, clamp, ease, useAt } from "../../lib/core";
import { BlueWhale, Diver, Krill, Plate, Rib, Sun } from "../../lib/art";
import { DarkSet, OceanSet, SurfaceSet } from "../../lib/sets";
import { BigText, DiveHud, Impact, Rings, Shake } from "../../lib/ui";
import { S, hud } from "./shared";

const Zero: React.FC = () => {
  const at = useAt();
  return (
    <>
      <DarkSet />
      <At x={960} y={420} center><Count at={4} to={0} from={0} size={170} sub="known attacks on people" /></At>
      <Tag at={at("b114", 50)} x={960} y={700} text="One close call" tone="threat" size={44} />
      <Sfx at={at("b114", 50)} name="riser_tension" vol={0.35} />
    </>
  );
};

/** b115-b122: San Diego 2014 - surface split, lunge from below, boat flips. */
const Capsize: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const hit = at("b119");
  const rise = interpolate(f, [at("b117"), hit], [900, 360], { ...clamp, easing: ease });
  const rot = interpolate(f, [hit, hit + 16], [0, 165], { ...clamp, easing: Easing2 });
  const boatY = interpolate(f, [hit, hit + 10, hit + 22], [250, 120, 300], clamp);
  return (
    <Shake at={hit} amp={16}>
      <SurfaceSet line={360} />
      <At x={1180} y={boatY} style={{ rotate: `${rot}deg`, transformOrigin: "50% 60%" }}><Rib w={380} people={f < hit + 6} /></At>
      <Show at={hit + 10} enter="fade">
        <At x={1240} y={330}><div style={{ width: 22, height: 22, borderRadius: 99, background: "#E36F3C" }} /></At>
        <At x={1420} y={340}><div style={{ width: 22, height: 22, borderRadius: 99, background: "#E36F3C" }} /></At>
      </Show>
      <At x={760} y={rise} style={{ rotate: "-14deg" }}><BlueWhale w={1100} mouth={interpolate(f, [at("b117"), hit], [0.2, 0.9], clamp)} id="cap1" /></At>
      <At x={1000} y={rise + 160} style={{ rotate: "-10deg" }}><BlueWhale w={900} mouth={0.6} id="cap2" /></At>
      {Array.from({ length: 30 }).map((_, i) => (
        <At key={i} x={900 + ((i * 53) % 600)} y={440 + ((i * 37) % 200)}><Krill w={22} /></At>
      ))}
      <Impact at={hit} x={1360} y={360} />
      <Tag at={4} x={420} y={90} text="San Diego · July 2, 2014" size={32} />
      <Tag at={at("b116", 4)} x={420} y={150} text="12 miles out · small inflatable" size={28} />
      <Tag at={at("b117", 4)} until={hit} x={500} y={980} text="Lunge feeding on krill" size={30} />
      <Tag at={hit + 4} until={at("b120")} x={500} y={980} text="Flipped" tone="threat" size={38} />
      <Tag at={at("b120", 4)} until={at("b121")} x={500} y={980} text="Both rescued · unhurt" tone="safe" size={32} />
      <Tag at={at("b121", 4)} until={at("b122")} x={500} y={980} text="Not angry. Eating." size={32} />
      <Show at={at("b122")} enter="fade">
        <At x={1050} y={330}><Plate w={620} style={{ opacity: 0.85 }} /></At>
        <Tag at={at("b122", 6)} x={500} y={980} text="Parked on the buffet" tone="threat" size={34} />
      </Show>
      <Sfx at={0} name="boat_motor" vol={0.3} />
      <Sfx at={at("b117")} name="whoosh_deep" vol={0.5} />
      <Sfx at={hit} name="splash_big" vol={0.8} />
      <Sfx at={hit} name="impact_heavy" vol={0.5} />
      <Sfx at={at("b120")} name="pop_soft" vol={0.3} />
    </Shake>
  );
};
const Easing2 = (t: number) => 1 - Math.pow(1 - t, 3);

/** b123-b126: the mouth could hold a crowd, the throat could not. */
const Throat: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const bounce = f > at("b125", 20) ? Math.abs(Math.sin((f - at("b125", 20)) / 5)) * 30 * Math.max(0, 1 - (f - at("b125", 20)) / 40) : 0;
  return (
    <>
      <DarkSet />
      <At x={140} y={180}><BlueWhale w={1000} mouth={1} id="thr" /></At>
      <Show at={at("b124")} enter="fade">
        <At x={1340} y={420} center><div style={{ width: 300, height: 300, borderRadius: 999, border: `6px solid ${P.threat}`, background: "rgba(10,20,27,0.85)" }} /></At>
        <Tag at={at("b124", 4)} x={1340} y={620} text="Throat" tone="threat" size={30} />
      </Show>
      <Show at={at("b125")} enter="up" dist={30}>
        <At x={1190} y={720}><Plate w={300} /></At>
        <Tag at={at("b125", 6)} x={1340} y={880} text="≈ dinner-plate wide" size={30} />
        <At x={1520} y={260 - bounce}><Diver w={300} beam={false} /></At>
      </Show>
      <Tag at={at("b126", 4)} x={700} y={980} text="World's worst piece of krill" tone="threat" size={32} />
      <Sfx at={at("b125", 20)} name="pop_soft" vol={0.5} />
    </>
  );
};

/** b127-b130: back in the water - the hum, the sun goes out again. */
const Again: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  return (
    <>
      <OceanSet depth={0.18} krill={0.9} dimFrom={0} dimTo={0.65} dimAt={[at("b129"), at("b129", 30)]} />
      <At x={880} y={-30}><Sun w={300} glow={interpolate(f, [at("b129"), at("b129", 20)], [1, 0.1], clamp)} /></At>
      <At x={interpolate(f, [at("b129"), at("b129", 50)], [-2600, -200], clamp)} y={-140}><BlueWhale w={2600} silhouette id="ag" /></At>
      <At x={760} y={520}><Diver w={420} /></At>
      <Rings x={960} y={540} from={at("b128")} period={110} n={3} width={14} color="rgba(238,243,245,0.25)" max={1500} />
      <DiveHud {...hud("b127")} />
      <Show at={at("b130")} enter="blur"><DarkSet /><BigText at={at("b130")} text="WHAT WOULD YOU ACTUALLY DO?" size={80} /></Show>
      <Sfx at={at("b128")} name="low_hum" vol={0.55} />
      <Sfx at={at("b129")} name="whoosh_deep" vol={0.6} />
    </>
  );
};

export const Chapter_07: React.FC = () => (
  <>
    <S name="37 Zero" first="b114" last="b114"><Zero /></S>
    <S name="38 Capsize" first="b115" last="b122" drift={0.025}><Capsize /></S>
    <S name="39 Throat" first="b123" last="b126"><Throat /></S>
    <S name="40 Again" first="b127" last="b130"><Again /></S>
  </>
);
