import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { At, Cam, P, Sfx, Show, Tag, clamp, useAt } from "../../lib/core";
import { BlueWhale, Diver, Shark, Sun } from "../../lib/art";
import { OceanSet } from "../../lib/sets";
import { DiveHud, Rings } from "../../lib/ui";
import { S, hud } from "./shared";

/** b001-b003: diver drifting in pink krill water, sun overhead; the rule appears. */
const Calm: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  return (
    <>
      <OceanSet depth={0.12} krill={0.55} />
      <At x={860 + Math.sin(f / 30) * 10} y={-20}><Sun w={300} /></At>
      {/* menace in the haze: a vast shape gliding far below, a shark crossing in the distance */}
      <At x={interpolate(f, [0, 420], [1500, -900], clamp)} y={600} style={{ opacity: 0.7, filter: "blur(6px)" }}>
        <BlueWhale w={2600} silhouette swim={0.3} id="far1" />
      </At>
      <At x={interpolate(f, [40, 260], [-500, 2100], clamp)} y={300} style={{ opacity: 0.55, filter: "blur(3px) brightness(0.15)" }}>
        <Shark w={360} />
      </At>
      <Sfx at={50} name="whoosh_deep" vol={0.25} />
      <Cam keys={[[0, 1.25, 120, 40], [at("b002"), 1.0, 0, 0]]}>
        <At x={560 + f * 0.6} y={480 + Math.sin(f / 40) * 12}><Diver w={760} /></At>
      </Cam>
      <DiveHud {...hud("b001")} />
      <Tag at={at("b002", 6)} x={960} y={930} text="If you can see the sun, you're safe" tone="safe" size={34} />
      <Sfx at={0} name="bubbles" vol={0.35} />
      <Sfx at={at("b002", 6)} name="pop_soft" vol={0.3} />
    </>
  );
};

/** b004-b006: macro on the mask, a low hum, then a vast shadow eats the sun. */
const Hum: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const dark = interpolate(f, [at("b006"), at("b006", 40)], [0, 0.8], clamp);
  return (
    <>
      <OceanSet depth={0.15} krill={0.55} dimFrom={0} dimTo={0.7} dimAt={[at("b006"), at("b006", 40)]} />
      <At x={860} y={-20} style={{ opacity: 1 - dark }}><Sun w={300} /></At>
      <At x={interpolate(f, [at("b006"), at("b006", 70)], [-2600, -300], clamp)} y={-160}><BlueWhale w={2600} silhouette swim={0.4} /></At>
      <Cam keys={[[0, 2.6, -700, -80], [at("b005"), 3.2, -900, -120]]} origin="50% 50%">
        <At x={700} y={470}><Diver w={600} beam={false} /></At>
      </Cam>
      <Rings x={960} y={540} from={0} period={120} n={3} color="rgba(238,243,245,0.28)" width={14} max={1400} />
      <DiveHud {...hud("b004")} />
      <Tag at={at("b005", 4)} x={960} y={930} text="Felt in your teeth" size={30} />
      <Show at={at("b006")} enter="none"><At x={0} y={0} w={1920} h={1080} style={{ background: P.deep2, opacity: dark * 0.4 }}>{null}</At></Show>
      <Sfx at={0} name="low_hum" vol={0.55} />
      <Sfx at={at("b006")} name="whoosh_deep" vol={0.6} />
      <Sfx at={at("b006", 10)} name="riser_tension" vol={0.35} />
    </>
  );
};

export const Chapter_01: React.FC = () => (
  <>
    <S name="01 Calm" first="b001" last="b003"><Calm /></S>
    <S name="02 Hum" first="b004" last="b006" drift={0.02}><Hum /></S>
  </>
);
