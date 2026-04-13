import type { ChannelMappingRepository } from "../../domain/contracts/channel-mapping-repository";

export class DeleteMappingUseCase {
  constructor(private readonly mappingRepository: ChannelMappingRepository) {}

  async execute(youtubeChannelId: string): Promise<void> {
    const normalizedId = youtubeChannelId.trim();
    if (!normalizedId) {
      throw new Error("youtubeChannelId is required");
    }

    await this.mappingRepository.delete(normalizedId);
  }
}
