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

async function openInWindow(url: string): Promise<boolean> {
  try {
    await chrome.windows.create({
      url,
      type: "popup",
      width: 430,
      height: 760
    });
    return true;
  } catch {
    return false;
  }
}

function hasSidePanelSupport(): boolean {
  return typeof chrome.sidePanel !== "undefined";
}

export class ChromeChatWindowOpener implements ChatWindowOpener {
  async open(params: {
    tabId: number;
    twitchChannelName: string;
    mode: OpenMode;
  }): Promise<"tab" | "window" | "sidepanel"> {
    const twitchChatUrl = buildTwitchPopoutUrl(params.twitchChannelName);

    if (params.mode === "sidepanel") {
      try {
        if (!hasSidePanelSupport()) {
          throw new Error("Side panel API not supported");
        }

        await setActiveChannel(params.twitchChannelName);
        await chrome.sidePanel.setOptions({
          tabId: params.tabId,
          path: "sidepanel.html",
          enabled: true
        });
        await chrome.sidePanel.open({ tabId: params.tabId });
        return "sidepanel";
      } catch {
        const openedInWindow = await openInWindow(twitchChatUrl);
        if (openedInWindow) {
          return "window";
        }

        await openInTab(twitchChatUrl);
        return "tab";
      }
    }

    if (params.mode === "window") {
      const openedInWindow = await openInWindow(twitchChatUrl);
      if (openedInWindow) {
        return "window";
      }

      await openInTab(twitchChatUrl);
      return "tab";
    }

    if (!hasSidePanelSupport()) {
      const openedInWindow = await openInWindow(twitchChatUrl);
      if (openedInWindow) {
        return "window";
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
