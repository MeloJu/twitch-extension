import type { SessionConfigRepository } from "../../domain/contracts/session-config-repository";
import {
  DEFAULT_SESSION_CONFIG,
  type OpenMode,
  type SessionConfig
} from "../../domain/entities/session-config";
import { STORAGE_KEYS } from "../../shared/app-config";

async function getSessionConfigRaw(): Promise<SessionConfig | null> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([STORAGE_KEYS.sessionConfig], (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      resolve((result[STORAGE_KEYS.sessionConfig] as SessionConfig | undefined) ?? null);
    });
  });
}

async function setSessionConfigRaw(config: SessionConfig): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [STORAGE_KEYS.sessionConfig]: config }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve();
    });
  });
}

export class ChromeStorageSessionConfigRepository implements SessionConfigRepository {
  async get(): Promise<SessionConfig> {
    const stored = await getSessionConfigRaw();
    if (
      !stored ||
      (stored.defaultOpenMode !== "tab" &&
        stored.defaultOpenMode !== "window" &&
        stored.defaultOpenMode !== "sidepanel")
    ) {
      return DEFAULT_SESSION_CONFIG;
    }

    return stored;
  }

  async setOpenMode(mode: OpenMode): Promise<void> {
    await setSessionConfigRaw({ defaultOpenMode: mode });
  }
}
