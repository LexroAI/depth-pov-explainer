import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { At, Label, Sfx, Show, Tag, clamp, useAt, useEndOf } from "../../lib/core";
import { BlueWhale, BlueWhaleFront, Croc, Diver, Orca, Shark } from "../../lib/art";
import { DarkSet, OceanSet } from "../../lib/sets";
import { BigText, Card, StockClip, TopList } from "../../lib/ui";
import { S } from "./shared";

const SharkClip: React.FC = () => {
  const end = useEndOf();
  return (
    <>
      <StockClip src="blue-whale/stock/b007_6681.mp4" credit="OADTZ" dur={end("b007")} />
      <Tag at={12} x={960} y={140} text="Sharks" size={34} />
      <Sfx at={0} name="whoosh_soft" vol={0.4} />
    </>
  );
};

const Cards: React.FC = () => {
  const at = useAt();
  return (
    <>
      <DarkSet />
      <At x={960} y={120} center><Label text="Dangerous animals?" size={38} /></At>
      <Card at={0} x={560} y={560} title="SHARK" caption="FAIR"><Shark w={300} /></Card>
      <Card at={at("b009")} x={960} y={560} title="ORCA" caption="FAIR"><Orca w={300} /></Card>
      <Card at={at("b009", 18)} x={1360} y={560} title="SALTWATER CROC" caption="FAIR"><Croc w={300} /></Card>
      <Sfx at={2} name="paper_slide" vol={0.4} />
      <Sfx at={at("b009")} name="paper_slide" vol={0.4} />
      <Sfx at={at("b009", 18)} name="paper_slide" vol={0.4} />
    </>
  );
};

/** b010-b013: the whale glides in over the tiny diver; three claims stack top-right. */
const Reveal: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  return (
    <>
      <OceanSet depth={0.3} krill={0.9} />
      {/* phase A: it charges out of the gloom straight at you, mouth wide, krill pouring in */}
      <Show at={0} until={at("b012", -6)} enter="blur">
        <At
          x={960}
          y={interpolate(f, [0, at("b012")], [560, 620], clamp)}
          center
          style={{
            scale: String(interpolate(f, [0, at("b012")], [0.28, 2.1], { ...clamp, easing: (t: number) => t * t })),
            filter: `blur(${interpolate(f, [0, 40], [8, 0], clamp)}px) brightness(${interpolate(f, [0, 50], [0.35, 1], clamp)})`,
          }}
        >
          <BlueWhaleFront w={1100} open={interpolate(f, [10, 60], [0.15, 1], clamp)} />
        </At>
        <At x={260} y={760}><Diver w={170} /></At>
      </Show>
      {/* phase B: side lunge glides past while the claims stack up */}
      <Show at={at("b012", -6)} enter="fade">
        <At x={interpolate(f, [at("b012", -6), at("b013", 120)], [1500, -900], clamp)} y={220}><BlueWhale w={2300} mouth={0.85} krillIn id="rv" /></At>
        <At x={1500} y={820}><Diver w={170} /></At>
      </Show>
      <TopList
        x={1250}
        y={90}
        rows={[
          { at: at("b011"), text: "Largest animal ever" },
          { at: at("b012"), text: "A pool of water per gulp" },
          { at: at("b013"), text: "Most powerful sustained voice", tone: "threat" },
        ]}
      />
      <Tag at={4} x={500} y={930} text="Blue whale" size={40} />
      <Sfx at={0} name="whoosh_deep" vol={0.6} />
      <Sfx at={30} name="gulp" vol={0.55} />
      <Sfx at={at("b011")} name="tick_ui" vol={0.4} />
      <Sfx at={at("b012")} name="tick_ui" vol={0.4} />
      <Sfx at={at("b013")} name="whale_moan" vol={0.45} />
    </>
  );
};

/** b014: real blue whale (NOAA Fisheries). */
const NoaaBack: React.FC = () => {
  const end = useEndOf();
  return (
    <>
      <StockClip src="blue-whale/stock/noaa_bw_back.mp4" credit="NOAA FISHERIES" source="" bright={1.0} trim={2.4} dur={end("b014")} zoom={[1.12, 1.2]} />
      <Tag at={4} x={960} y={150} text="Real blue whale · Channel Islands, California" size={30} />
      <Tag at={10} x={960} y={930} text="It isn't hunting you" tone="safe" size={34} />
    </>
  );
};

/** b015-b016: you, a dot inside the krill cloud; title. */
const Dinner: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  return (
    <>
      <OceanSet depth={0.2} krill={1} />
      <At x={880 + Math.sin(f / 30) * 8} y={500}><Diver w={240} /></At>
      <Show at={at("b015")} enter="fade">
        <At x={960} y={540} center><div style={{ width: 520, height: 520, borderRadius: 999, border: "3px dashed rgba(242,194,48,0.8)", scale: String(interpolate(f, [at("b015"), at("b015", 20)], [1.4, 1], clamp)) }} /></At>
        <Tag at={at("b015", 6)} x={960} y={860} text="You are in the dinner" tone="threat" size={36} />
      </Show>
      <Show at={at("b016")} enter="blur"><DarkSet /><BigText at={at("b016")} text="WHY YOU'D NEVER WANT TO MEET A BLUE WHALE" size={78} /></Show>
      <Sfx at={at("b015")} name="pop_soft" vol={0.4} />
      <Sfx at={at("b016")} name="riser_tension" vol={0.4} />
    </>
  );
};

export const Chapter_02: React.FC = () => (
  <>
    <S name="03 Shark clip" first="b007" last="b007" drift={0}><SharkClip /></S>
    <S name="04 Cards" first="b008" last="b009"><Cards /></S>
    <S name="05 Reveal" first="b010" last="b013" drift={0.02}><Reveal /></S>
    <S name="06a NOAA blue whale" first="b014" last="b014" drift={0}><NoaaBack /></S>
    <S name="06 Dinner" first="b015" last="b016"><Dinner /></S>
  </>
);
