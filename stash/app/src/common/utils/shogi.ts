import { List } from "immutable";
import { JSONKifuFormat } from "json-kifu-format";
import { Color } from "shogi.js";
import * as core from "@hiryu/shogi-core";
import { AnalysisResult } from "../store/interfaces";

export function toBasicGameRecord(kifu: JSONKifuFormat) {
  if (kifu.initial && kifu.initial.preset !== "HIRATE") {
    throw new Error("not supported yet");
  }
  const events: core.Event[] = [
    new core.StartEvent(),
  ];
  for (const mvf of kifu.moves) {
    if (mvf.special === "TORYO") {
      // TODO: color
      events.push(new core.ResignEvent());
      break;
    }
    const mv = mvf.move;
    if (mv === undefined) {
      continue;
    }
    const piece = core.Piece.fromCSAString(mv.piece);
    if (!piece || (mv.promote && !piece.canPromote())) {
      throw new Error("invalid kufu data");
    }
    events.push(new core.CSAMoveEvent({
      color: mv.color === Color.Black ? core.Color.BLACK : core.Color.WHITE,
      from: mv.from && core.Position.from(mv.from),
      to: core.Position.from(mv.to!),
      piece: mv.promote ? piece.flip()! : piece,
    }));
  }
  return new core.Record({
    initialState: core.State.preset(core.Handicap.NONE),
    events: List(events),
  });
}

export interface AnalysisResultForView {
  priority: number;
  score: string;
  moves: string[];
}

export function getAnalysisResultForView(result: AnalysisResult): AnalysisResultForView {
  return {
    priority: 1,
    score: result.score ? `${result.score.value}` : "-",
    moves: result.moves,
  };
}
