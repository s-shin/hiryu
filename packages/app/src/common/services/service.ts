export interface APIBase {
  isInitialized: boolean;
  initialize(): Promise<void>;
  destroy(): Promise<void>;
}

export class ServiceProvider<API extends APIBase> {
  private service?: API;

  setService(service: API) {
    this.service = service;
  }

  canUse() {
    return !!this.service;
  }

  use() {
    if (!this.service) {
      throw new Error("service is not available");
    }
    return this.service;
  }
}
