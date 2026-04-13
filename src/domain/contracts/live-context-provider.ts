import type { LiveContext } from "../entities/live-context";

export interface LiveContextProvider {
  getLiveContext(tabId: number): Promise<LiveContext>;
}
