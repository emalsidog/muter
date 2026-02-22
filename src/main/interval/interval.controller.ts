export abstract class IntervalController {
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(protected intervalMs: number) {}

  protected abstract onTick(): Promise<void>;

  async start(): Promise<void> {
    if (this.intervalId) return;

    await this.onTick();

    this.intervalId = setInterval(async () => {
      await this.onTick();
    }, this.intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
