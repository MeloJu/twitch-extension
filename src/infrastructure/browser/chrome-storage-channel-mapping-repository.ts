import type { ChannelMappingRepository } from "../../domain/contracts/channel-mapping-repository";
import type { ChannelMapping } from "../../domain/entities/channel-mapping";
import { STORAGE_KEYS } from "../../shared/app-config";

type MappingStore = Record<string, ChannelMapping>;

async function getMappingStore(): Promise<MappingStore> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([STORAGE_KEYS.channelMappings], (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve((result[STORAGE_KEYS.channelMappings] as MappingStore | undefined) ?? {});
    });
  });
}

async function setMappingStore(store: MappingStore): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [STORAGE_KEYS.channelMappings]: store }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve();
    });
  });
}

export class ChromeStorageChannelMappingRepository implements ChannelMappingRepository {
  async list(): Promise<ChannelMapping[]> {
    const store = await getMappingStore();
    return Object.values(store).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async getByYoutubeChannelId(youtubeChannelId: string): Promise<ChannelMapping | null> {
    const store = await getMappingStore();
    return store[youtubeChannelId] ?? null;
  }

  async upsert(mapping: Pick<ChannelMapping, "youtubeChannelId" | "twitchChannelName">): Promise<void> {
    const store = await getMappingStore();
    store[mapping.youtubeChannelId] = {
      youtubeChannelId: mapping.youtubeChannelId,
      twitchChannelName: mapping.twitchChannelName,
      updatedAt: new Date().toISOString()
    };
    await setMappingStore(store);
  }

  async delete(youtubeChannelId: string): Promise<void> {
    const store = await getMappingStore();
    delete store[youtubeChannelId];
    await setMappingStore(store);
  }
}
