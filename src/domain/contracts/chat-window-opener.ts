import type { OpenMode } from "../entities/session-config";

export interface ChatWindowOpener {
  open(params: { tabId: number; twitchChannelName: string; mode: OpenMode }): Promise<"tab" | "window" | "sidepanel">;
}
