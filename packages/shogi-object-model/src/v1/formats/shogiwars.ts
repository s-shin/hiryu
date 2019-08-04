import { Event, EventType, Record, Color, isSquare, isPiece, Handicap } from "../definitions";

export function parseRecord(data: string): Error | Record {
  const strs = data.split(/[ \r\n\t]+/);
  if (strs.length === 0) {
    return new Error("");
  }
  const result = strs.pop()!;
  const events: Event[] = [];
  for (const s of strs) {
    const color = s[0] === "+" ? Color.BLACK : Color.WHITE;
    const srcSquare = [Number(s[1]), Number(s[2])];
    const dstSquare = [Number(s[3]), Number(s[4])];
    if (!isSquare(dstSquare)) {
      return new Error("");
    }
    const dstPiece = s.substr(5, 2);
    if (!isPiece(dstPiece)) {
      return new Error("");
    }
    events.push({
      type: EventType.MOVE,
      color,
      srcSquare: isSquare(srcSquare) ? srcSquare : null,
      dstSquare,
      dstPiece,
    });
  }
  const loose = result.match(/SENTE.*/) ? Color.WHITE : Color.BLACK;
  events.push({
    type: EventType.RESIGN,
    color: loose,
  });
  return {
    competition: "",
    location: "",
    startingSetup: { handicap: Handicap.NONE },
    events,
  };
}
