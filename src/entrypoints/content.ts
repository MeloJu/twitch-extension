import { MESSAGE_TYPES } from "../shared/messages";
import type { LiveContext } from "../domain/entities/live-context";
import { APP_CONFIG } from "../shared/app-config";

function isYouTubeHost(hostname: string): boolean {
  return APP_CONFIG.youtube.allowedHosts.includes(hostname as (typeof APP_CONFIG.youtube.allowedHosts)[number]);
}

function detectLiveState(): boolean {
  const isWatchPage = location.pathname === "/watch";
  if (!isWatchPage) {
    return false;
  }

  const liveIndicators: string[] = [
    ".ytp-live-badge",
    "ytd-live-chat-frame",
    "meta[itemprop='isLiveBroadcast'][content='True']",
    "meta[itemprop='isLiveBroadcast'][content='true']"
  ];

  return liveIndicators.some((selector) => document.querySelector(selector) !== null);
}

function extractYoutubeChannelId(): string | null {
  const candidateSelectors = [
    "ytd-channel-name a[href^='/@']",
    "ytd-channel-name a[href^='/channel/']",
    "#owner a[href^='/@']",
    "#owner a[href^='/channel/']"
  ];

  for (const selector of candidateSelectors) {
    const anchor = document.querySelector<HTMLAnchorElement>(selector);
    if (!anchor) {
      continue;
    }

    const href = anchor.getAttribute("href");
    if (!href) {
      continue;
    }

    if (href.startsWith("/@")) {
      return href.slice(2);
    }

    if (href.startsWith("/channel/")) {
      return href.slice("/channel/".length);
    }
  }

  return null;
}

function getLiveContext(): LiveContext {
  if (!isYouTubeHost(location.hostname)) {
    return { isLive: false, youtubeChannelId: null };
  }

  return {
    isLive: detectLiveState(),
    youtubeChannelId: extractYoutubeChannelId()
  };
}

chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
  const typedMessage = message as { type?: string };
  if (typedMessage.type !== MESSAGE_TYPES.requestYouTubeLiveContext) {
    return;
  }

  sendResponse(getLiveContext());
});
