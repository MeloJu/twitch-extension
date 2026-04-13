import { describe, expect, it, vi } from "vitest";
import { OpenChatForActiveTabUseCase } from "../../src/application/use-cases/open-chat-for-active-tab";

describe("OpenChatForActiveTabUseCase", () => {
  it("returns mapping-not-found when no mapping exists", async () => {
    const useCase = new OpenChatForActiveTabUseCase({
      mappingRepository: {
        list: vi.fn(),
        getByYoutubeChannelId: vi.fn().mockResolvedValue(null),
        upsert: vi.fn(),
        delete: vi.fn()
      },
      sessionConfigRepository: {
        get: vi.fn().mockResolvedValue({ defaultOpenMode: "tab" }),
        setOpenMode: vi.fn()
      },
      liveContextProvider: {
        getLiveContext: vi.fn().mockResolvedValue({
          isLive: true,
          youtubeChannelId: "my-youtube-channel"
        })
      },
      chatWindowOpener: {
        open: vi.fn()
      },
      logger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
      }
    });

    const result = await useCase.execute(123);
    expect(result).toEqual({ ok: false, reason: "mapping-not-found" });
  });

  it("opens chat and returns success", async () => {
    const open = vi.fn().mockResolvedValue("tab");

    const useCase = new OpenChatForActiveTabUseCase({
      mappingRepository: {
        list: vi.fn(),
        getByYoutubeChannelId: vi.fn().mockResolvedValue({
          youtubeChannelId: "my-youtube-channel",
          twitchChannelName: "mytwitch",
          updatedAt: new Date().toISOString()
        }),
        upsert: vi.fn(),
        delete: vi.fn()
      },
      sessionConfigRepository: {
        get: vi.fn().mockResolvedValue({ defaultOpenMode: "tab" }),
        setOpenMode: vi.fn()
      },
      liveContextProvider: {
        getLiveContext: vi.fn().mockResolvedValue({
          isLive: true,
          youtubeChannelId: "my-youtube-channel"
        })
      },
      chatWindowOpener: { open },
      logger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
      }
    });

    const result = await useCase.execute(321);
    expect(open).toHaveBeenCalledWith({
      tabId: 321,
      twitchChannelName: "mytwitch",
      mode: "tab"
    });
    expect(result).toEqual({ ok: true, modeUsed: "tab", twitchChannelName: "mytwitch" });
  });
});
