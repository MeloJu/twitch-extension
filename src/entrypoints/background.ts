import { container } from "./container";
import { MESSAGE_TYPES } from "../shared/messages";

type AsyncResponse = (value: unknown) => void;

async function getActiveTabId(): Promise<number | null> {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return activeTab?.id ?? null;
}

function respondWithError(sendResponse: AsyncResponse, message: string): void {
  sendResponse({ ok: false, error: message });
}

chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
  const typedMessage = message as { type?: string; payload?: unknown };

  void (async () => {
    switch (typedMessage.type) {
      case MESSAGE_TYPES.openChatFromActiveTab: {
        const tabId = await getActiveTabId();
        if (tabId === null) {
          respondWithError(sendResponse, "No active tab found");
          return;
        }

        const result = await container.useCases.openChatForActiveTab.execute(tabId);
        sendResponse(result);
        return;
      }

      case MESSAGE_TYPES.getActiveTabStatus: {
        const tabId = await getActiveTabId();
        if (tabId === null) {
          respondWithError(sendResponse, "No active tab found");
          return;
        }

        const result = await container.useCases.getActiveTabStatus.execute(tabId);
        sendResponse({ ok: true, ...result });
        return;
      }

      case MESSAGE_TYPES.listMappings: {
        const mappings = await container.mappingRepository.list();
        sendResponse({ ok: true, data: mappings });
        return;
      }

      case MESSAGE_TYPES.upsertMapping: {
        const payload = typedMessage.payload as { youtubeChannelId?: string; twitchChannelName?: string };
        await container.useCases.upsertMapping.execute({
          youtubeChannelId: payload.youtubeChannelId ?? "",
          twitchChannelName: payload.twitchChannelName ?? ""
        });
        sendResponse({ ok: true });
        return;
      }

      case MESSAGE_TYPES.deleteMapping: {
        const payload = typedMessage.payload as { youtubeChannelId?: string };
        await container.useCases.deleteMapping.execute(payload.youtubeChannelId ?? "");
        sendResponse({ ok: true });
        return;
      }

      case MESSAGE_TYPES.getSessionConfig: {
        const config = await container.sessionConfigRepository.get();
        sendResponse({ ok: true, data: config });
        return;
      }

      case MESSAGE_TYPES.setOpenMode: {
        const payload = typedMessage.payload as { mode?: "tab" | "window" | "sidepanel" };
        await container.useCases.setOpenMode.execute(payload.mode ?? "window");
        sendResponse({ ok: true });
        return;
      }

      default:
        sendResponse({ ok: false, error: "Unknown message type" });
    }
  })().catch((error: unknown) => {
    container.logger.error("Background message error", {
      error: error instanceof Error ? error.message : String(error),
      messageType: typedMessage.type
    });
    respondWithError(sendResponse, "Unexpected error");
  });

  return true;
});
