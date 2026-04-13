import type { ChannelMappingRepository } from "../../domain/contracts/channel-mapping-repository";
import { normalizeTwitchChannelName, normalizeYoutubeChannelId } from "../../shared/channel-normalizers";

interface Input {
  youtubeChannelId: string;
  twitchChannelName: string;
}

export class UpsertMappingUseCase {
  constructor(private readonly mappingRepository: ChannelMappingRepository) {}

  async execute(input: Input): Promise<void> {
    const youtubeChannelId = normalizeYoutubeChannelId(input.youtubeChannelId);
    const twitchChannelName = normalizeTwitchChannelName(input.twitchChannelName);

    if (!youtubeChannelId || !twitchChannelName) {
      throw new Error("Invalid mapping data");
    }

    await this.mappingRepository.upsert({ youtubeChannelId, twitchChannelName });
  }
}
