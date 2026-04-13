import type { ChatWindowOpener } from "../../domain/contracts/chat-window-opener";
import type { OpenMode } from "../../domain/entities/session-config";
import { buildTwitchPopoutUrl } from "../../shared/twitch-chat-url";

const ACTIVE_CHANNEL_SESSION_KEY = "activeTwitchChannel";

async function setActiveChannel(twitchChannelName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.session.set({ [ACTIVE_CHANNEL_SESSION_KEY]: twitchChannelName }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve();
    });
  });
}

async function openInTab(url: string): Promise<void> {
  await chrome.tabs.create({ url });
}

export class ChromeChatWindowOpener implements ChatWindowOpener {
  async open(params: {
    tabId: number;
    twitchChannelName: string;
    mode: OpenMode;
  }): Promise<"tab" | "sidepanel"> {
    const twitchChatUrl = buildTwitchPopoutUrl(params.twitchChannelName);

    if (params.mode === "sidepanel") {
      try {
        await setActiveChannel(params.twitchChannelName);
        await chrome.sidePanel.setOptions({
          tabId: params.tabId,
          path: "sidepanel.html",
          enabled: true
        });
        await chrome.sidePanel.open({ tabId: params.tabId });
        return "sidepanel";
      } catch {
        await openInTab(twitchChatUrl);
        return "tab";
      }
    }

    await openInTab(twitchChatUrl);
    return "tab";
  }
}

export async function getActiveTwitchChannel(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    chrome.storage.session.get([ACTIVE_CHANNEL_SESSION_KEY], (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve((result[ACTIVE_CHANNEL_SESSION_KEY] as string | undefined) ?? null);
    });
  });
}
