export enum TaskState {
  INIT,
  RUNNING,
  DONE,
}

export class Task<Result = undefined> {
  state = TaskState.INIT;
  error?: Error;
  result?: Result;

  reset() {
    this.state = TaskState.INIT;
    this.error = undefined;
    this.result = undefined;
    return this;
  }

  begin() {
    if (this.state !== TaskState.INIT) {
      throw new Error("invalid state");
    }
    this.state = TaskState.RUNNING;
    return this;
  }

  end(err?: Error, result?: Result) {
    if (this.state !== TaskState.RUNNING) {
      throw new Error("invalid state");
    }
    this.state = TaskState.DONE;
    this.error = err;
    this.result = result;
    return this;
  }

  isRunning() {
    return this.state === TaskState.RUNNING;
  }

  isSucceeded() {
    return this.state === TaskState.DONE && !this.error;
  }

  isFailed() {
    return this.state === TaskState.DONE && !!this.error;
  }
}
