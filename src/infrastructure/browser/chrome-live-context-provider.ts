import type { LiveContextProvider } from "../../domain/contracts/live-context-provider";
import type { LiveContext } from "../../domain/entities/live-context";
import { MESSAGE_TYPES } from "../../shared/messages";

export class ChromeLiveContextProvider implements LiveContextProvider {
  async getLiveContext(tabId: number): Promise<LiveContext> {
    try {
      const response = await chrome.tabs.sendMessage(tabId, {
        type: MESSAGE_TYPES.requestYouTubeLiveContext
      });

      const payload = response as LiveContext | undefined;
      return {
        isLive: payload?.isLive ?? false,
        youtubeChannelId: payload?.youtubeChannelId ?? null
      };
    } catch {
      return {
        isLive: false,
        youtubeChannelId: null
      };
    }
  }
}
