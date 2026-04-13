import { describe, expect, it, vi } from "vitest";
import { UpsertMappingUseCase } from "../../src/application/use-cases/upsert-mapping";

describe("UpsertMappingUseCase", () => {
  it("normalizes youtube and twitch inputs before persisting", async () => {
    const upsert = vi.fn().mockResolvedValue(undefined);

    const useCase = new UpsertMappingUseCase({
      list: vi.fn(),
      getByYoutubeChannelId: vi.fn(),
      upsert,
      delete: vi.fn()
    });

    await useCase.execute({
      youtubeChannelId: "https://www.youtube.com/@TcK10",
      twitchChannelName: "https://www.twitch.tv/tck10"
    });

    expect(upsert).toHaveBeenCalledWith({
      youtubeChannelId: "tck10",
      twitchChannelName: "tck10"
    });
  });
});
