import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { ChannelBug } from "../../lib/ui";
import { DURATION } from "./timing";
import { Chapter_01 } from "./Chapter_01_cold_open";
import { Chapter_02 } from "./Chapter_02_reframe";
import { Chapter_03 } from "./Chapter_03_size";
import { Chapter_04 } from "./Chapter_04_food";
import { Chapter_05 } from "./Chapter_05_hunts";
import { Chapter_06 } from "./Chapter_06_brain";
import { Chapter_07 } from "./Chapter_07_people";
import { Chapter_08 } from "./Chapter_08_options";
import { Chapter_09, Chapter_10, Chapter_11, Chapter_12, Chapter_13 } from "./Chapter_09_13";

export const MainV2: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#050C12" }}>
      <Chapter_01 />
      <Chapter_02 />
      <Chapter_03 />
      <Chapter_04 />
      <Chapter_05 />
      <Chapter_06 />
      <Chapter_07 />
      <Chapter_08 />
      <Chapter_09 />
      <Chapter_10 />
      <Chapter_11 />
      <Chapter_12 />
      <Chapter_13 />
      <Sequence name="ChannelBug" from={DURATION - 10 * fps}>
        <ChannelBug />
      </Sequence>
      <Audio name="Voice" src={staticFile("blue-whale/voice.mp3")} />
      <Audio name="Ambient" src={staticFile("ambient_deep_drone.mp3")} volume={0.9} loop />
    </AbsoluteFill>
  );
};
