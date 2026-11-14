import React from "react";
import { Scene } from "../../lib/core";
import { BF } from "./timing";

/** Scene bound to this video's beat table. */
export const S: React.FC<{ name: string; first: string; last: string; drift?: number; pan?: [number, number]; children: React.ReactNode }> = (p) => <Scene bf={BF} {...p} />;

/** Brand HUD values at the start of a beat (air drains 2000 -> 1400 PSI by b181). */
export const hud = (id: string) => {
  const t = BF[id][0];
  const end = BF.b181[0];
  return { depth: 22, air: Math.round(2000 - 600 * Math.min(t / end, 1)), time: t / 30 };
};
