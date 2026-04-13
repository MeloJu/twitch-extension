import type { ChannelMappingRepository } from "../../domain/contracts/channel-mapping-repository";
import type { LiveContextProvider } from "../../domain/contracts/live-context-provider";

interface Dependencies {
  mappingRepository: ChannelMappingRepository;
  liveContextProvider: LiveContextProvider;
}

export interface ActiveTabStatus {
  isLive: boolean;
  youtubeChannelId: string | null;
  hasMapping: boolean;
}

export class GetActiveTabStatusUseCase {
  constructor(private readonly deps: Dependencies) {}

  async execute(tabId: number): Promise<ActiveTabStatus> {
    const context = await this.deps.liveContextProvider.getLiveContext(tabId);

    if (!context.youtubeChannelId) {
      return {
        isLive: context.isLive,
        youtubeChannelId: null,
        hasMapping: false
      };
    }

    const mapping = await this.deps.mappingRepository.getByYoutubeChannelId(context.youtubeChannelId);
    return {
      isLive: context.isLive,
      youtubeChannelId: context.youtubeChannelId,
      hasMapping: Boolean(mapping)
    };
  }
}
