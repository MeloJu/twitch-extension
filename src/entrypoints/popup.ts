import { MESSAGE_TYPES } from "../shared/messages";

type PopupStatusResponse = {
  ok: boolean;
  isLive?: boolean;
  youtubeChannelId?: string | null;
  hasMapping?: boolean;
  error?: string;
};

type OpenChatResponse =
  | { ok: true; modeUsed: "tab" | "window" | "sidepanel"; twitchChannelName: string }
  | { ok: false; reason?: string; error?: string };

const statusElement = document.querySelector<HTMLParagraphElement>("#status");
const openChatButton = document.querySelector<HTMLButtonElement>("#openChatButton");
const openOptionsButton = document.querySelector<HTMLButtonElement>("#openOptionsButton");

function setStatus(message: string): void {
  if (statusElement) {
    statusElement.textContent = message;
  }
}

function setOpenButtonEnabled(enabled: boolean): void {
  if (openChatButton) {
    openChatButton.disabled = !enabled;
  }
}

async function loadStatus(): Promise<void> {
  const response = (await chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.getActiveTabStatus
  })) as PopupStatusResponse;

  if (!response.ok) {
    setStatus(response.error ?? "Failed to inspect active tab");
    setOpenButtonEnabled(false);
    return;
  }

  if (!response.isLive) {
    setStatus("Open a YouTube live page to enable Twitch chat.");
    setOpenButtonEnabled(false);
    return;
  }

  if (!response.hasMapping) {
    setStatus(`Live detected, but no mapping for ${response.youtubeChannelId ?? "channel"}.`);
    setOpenButtonEnabled(false);
    return;
  }

  setStatus(`Ready: mapping found for ${response.youtubeChannelId ?? "channel"}.`);
  setOpenButtonEnabled(true);
}

function reasonToLabel(reason?: string): string {
  switch (reason) {
    case "not-live":
      return "Current tab is not a YouTube live.";
    case "channel-not-identified":
      return "Could not identify YouTube channel in this page.";
    case "mapping-not-found":
      return "No Twitch mapping found for this YouTube channel.";
    default:
      return "Unable to open Twitch chat.";
  }
}

async function handleOpenChat(): Promise<void> {
  const response = (await chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.openChatFromActiveTab
  })) as OpenChatResponse;

  if (!response.ok) {
    setStatus(reasonToLabel(response.reason ?? response.error));
    return;
  }

  setStatus(`Chat opened for ${response.twitchChannelName} (${response.modeUsed}).`);
}

openChatButton?.addEventListener("click", () => {
  void handleOpenChat();
});

openOptionsButton?.addEventListener("click", () => {
  void chrome.runtime.openOptionsPage();
});

void loadStatus();
