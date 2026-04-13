import { getActiveTwitchChannel } from "../infrastructure/browser/chrome-chat-window-opener";
import { buildTwitchPopoutUrl } from "../shared/twitch-chat-url";

const chatFrame = document.querySelector<HTMLIFrameElement>("#chatFrame");
const channelLabel = document.querySelector<HTMLParagraphElement>("#channelLabel");
const emptyState = document.querySelector<HTMLParagraphElement>("#emptyState");

async function renderActiveChannel(): Promise<void> {
  const channel = await getActiveTwitchChannel();

  if (!channel) {
    if (emptyState) {
      emptyState.classList.remove("hidden");
    }

    if (chatFrame) {
      chatFrame.classList.add("hidden");
    }

    if (channelLabel) {
      channelLabel.textContent = "No channel selected";
    }
    return;
  }

  if (channelLabel) {
    channelLabel.textContent = `Channel: ${channel}`;
  }

  if (chatFrame) {
    chatFrame.src = buildTwitchPopoutUrl(channel);
    chatFrame.classList.remove("hidden");
  }

  if (emptyState) {
    emptyState.classList.add("hidden");
  }
}

void renderActiveChannel();
