import { Handicap, State } from "./definitions";
import { getSFEN } from "./formats/usi";

export function getState(h: Handicap): State {
  return getSFEN(h).state;
}
