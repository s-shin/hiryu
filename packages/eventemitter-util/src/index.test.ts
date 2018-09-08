import { listenEvent, EventListenerPool } from "./index";
import * as events from "events";

describe("EventListenerPool", () => {
  test("basic", () => {
    const ee1 = new events.EventEmitter();
    const ee2 = new events.EventEmitter();

    let t = "";

    const pool = new EventListenerPool();
    pool.listen(ee1, "foo", () => { t = "foo"; });
    pool.listen(ee2, "bar", () => { t = "bar"; });

    ee1.emit("foo");
    expect(t).toBe("foo");
    ee2.emit("bar");
    expect(t).toBe("bar");
    pool.dispose();
    ee1.emit("foo");
    expect(t).toBe("bar");
  });
});
