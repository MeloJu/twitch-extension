import type { ChannelMappingRepository } from "../../domain/contracts/channel-mapping-repository";

interface Input {
  youtubeChannelId: string;
  twitchChannelName: string;
}

export class UpsertMappingUseCase {
  constructor(private readonly mappingRepository: ChannelMappingRepository) {}

  async execute(input: Input): Promise<void> {
    const youtubeChannelId = input.youtubeChannelId.trim();
    const twitchChannelName = input.twitchChannelName.trim().replace(/^@/, "");

    if (!youtubeChannelId || !twitchChannelName) {
      throw new Error("Invalid mapping data");
    }

    await this.mappingRepository.upsert({ youtubeChannelId, twitchChannelName });
  }
}
