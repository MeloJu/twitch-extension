import type { ChannelMapping } from "../domain/entities/channel-mapping";
import type { OpenMode, SessionConfig } from "../domain/entities/session-config";
import { MESSAGE_TYPES } from "../shared/messages";

const mappingForm = document.querySelector<HTMLFormElement>("#mappingForm");
const youtubeInput = document.querySelector<HTMLInputElement>("#youtubeChannelId");
const twitchInput = document.querySelector<HTMLInputElement>("#twitchChannelName");
const mappingList = document.querySelector<HTMLUListElement>("#mappingList");
const feedback = document.querySelector<HTMLParagraphElement>("#feedback");
const openModeSelect = document.querySelector<HTMLSelectElement>("#openModeSelect");

function hasSidePanelSupport(): boolean {
  return typeof chrome.sidePanel !== "undefined";
}

function enforceBrowserCapabilities(): void {
  if (!openModeSelect) {
    return;
  }

  const sidePanelOption = openModeSelect.querySelector<HTMLOptionElement>("option[value='sidepanel']");
  if (!sidePanelOption) {
    return;
  }

  if (!hasSidePanelSupport()) {
    sidePanelOption.disabled = true;
    sidePanelOption.textContent = "Side Panel (not supported in this browser)";
  }
}

function setFeedback(message: string, isError = false): void {
  if (!feedback) {
    return;
  }

  feedback.textContent = message;
  feedback.style.color = isError ? "#b42318" : "#067647";
}

async function listMappings(): Promise<ChannelMapping[]> {
  const response = (await chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.listMappings
  })) as { ok: boolean; data?: ChannelMapping[]; error?: string };

  if (!response.ok || !response.data) {
    throw new Error(response.error ?? "Failed to list mappings");
  }

  return response.data;
}

function renderMappings(mappings: ChannelMapping[]): void {
  if (!mappingList) {
    return;
  }

  mappingList.innerHTML = "";

  if (mappings.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No mappings saved yet.";
    mappingList.appendChild(empty);
    return;
  }

  for (const mapping of mappings) {
    const item = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = `${mapping.youtubeChannelId} -> ${mapping.twitchChannelName}`;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      void handleDelete(mapping.youtubeChannelId);
    });

    item.append(text, deleteButton);
    mappingList.appendChild(item);
  }
}

async function refreshMappings(): Promise<void> {
  const mappings = await listMappings();
  renderMappings(mappings);
}

async function handleDelete(youtubeChannelId: string): Promise<void> {
  try {
    await chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.deleteMapping,
      payload: { youtubeChannelId }
    });
    setFeedback("Mapping deleted.");
    await refreshMappings();
  } catch (error) {
    setFeedback(error instanceof Error ? error.message : "Failed to delete mapping", true);
  }
}

async function loadSessionConfig(): Promise<void> {
  const response = (await chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.getSessionConfig
  })) as { ok: boolean; data?: SessionConfig; error?: string };

  if (!response.ok || !response.data) {
    setFeedback(response.error ?? "Failed to load session config", true);
    return;
  }

  if (openModeSelect) {
    const supportsSidePanel = hasSidePanelSupport();
    const desiredMode = response.data.defaultOpenMode;
    const mode = !supportsSidePanel && desiredMode === "sidepanel" ? "window" : desiredMode;

    openModeSelect.value = mode;

    if (mode !== desiredMode) {
      await handleOpenModeChange(mode);
      setFeedback("Side panel is not supported in this browser. Switched to Window mode.");
    }
  }
}

async function handleOpenModeChange(mode: OpenMode): Promise<void> {
  try {
    await chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.setOpenMode,
      payload: { mode }
    });
    setFeedback("Default open mode saved.");
  } catch (error) {
    setFeedback(error instanceof Error ? error.message : "Failed to save open mode", true);
  }
}

mappingForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  void (async () => {
    try {
      const youtubeChannelId = youtubeInput?.value ?? "";
      const twitchChannelName = twitchInput?.value ?? "";

      await chrome.runtime.sendMessage({
        type: MESSAGE_TYPES.upsertMapping,
        payload: { youtubeChannelId, twitchChannelName }
      });

      if (youtubeInput) {
        youtubeInput.value = "";
      }
      if (twitchInput) {
        twitchInput.value = "";
      }

      setFeedback("Mapping saved.");
      await refreshMappings();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Failed to save mapping", true);
    }
  })();
});

openModeSelect?.addEventListener("change", () => {
  const mode = openModeSelect.value as OpenMode;
  void handleOpenModeChange(mode);
});

enforceBrowserCapabilities();
void refreshMappings();
void loadSessionConfig();
