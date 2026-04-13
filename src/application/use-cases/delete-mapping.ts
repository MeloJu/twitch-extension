import type { ChannelMappingRepository } from "../../domain/contracts/channel-mapping-repository";
import { normalizeYoutubeChannelId } from "../../shared/channel-normalizers";

export class DeleteMappingUseCase {
  constructor(private readonly mappingRepository: ChannelMappingRepository) {}

  async execute(youtubeChannelId: string): Promise<void> {
    const normalizedId = normalizeYoutubeChannelId(youtubeChannelId);
    if (!normalizedId) {
      throw new Error("youtubeChannelId is required");
    }

    await this.mappingRepository.delete(normalizedId);
  }
}
