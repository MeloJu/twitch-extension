import type { ChannelMappingRepository } from "../../domain/contracts/channel-mapping-repository";
import type { ChatWindowOpener } from "../../domain/contracts/chat-window-opener";
import type { LiveContextProvider } from "../../domain/contracts/live-context-provider";
import type { Logger } from "../../domain/contracts/logger";
import type { SessionConfigRepository } from "../../domain/contracts/session-config-repository";
import { normalizeYoutubeChannelId } from "../../shared/channel-normalizers";

export type OpenChatResult =
  | { ok: true; modeUsed: "tab" | "window" | "sidepanel"; twitchChannelName: string }
  | { ok: false; reason: "context-unavailable" | "not-live" | "channel-not-identified" | "mapping-not-found" };

interface Dependencies {
  mappingRepository: ChannelMappingRepository;
  sessionConfigRepository: SessionConfigRepository;
  liveContextProvider: LiveContextProvider;
  chatWindowOpener: ChatWindowOpener;
  logger: Logger;
}

export class OpenChatForActiveTabUseCase {
  constructor(private readonly deps: Dependencies) {}

  async execute(tabId: number): Promise<OpenChatResult> {
    const context = await this.deps.liveContextProvider.getLiveContext(tabId);

    if (!context) {
      this.deps.logger.warn("Live context unavailable", { tabId });
      return { ok: false, reason: "context-unavailable" };
    }

    if (!context.isLive) {
      this.deps.logger.info("YouTube tab is not live", { tabId });
      return { ok: false, reason: "not-live" };
    }

    if (!context.youtubeChannelId) {
      this.deps.logger.warn("YouTube channel could not be identified", { tabId });
      return { ok: false, reason: "channel-not-identified" };
    }

    const normalizedYoutubeChannelId = normalizeYoutubeChannelId(context.youtubeChannelId);
    const mapping = await this.deps.mappingRepository.getByYoutubeChannelId(normalizedYoutubeChannelId);
    if (!mapping) {
      this.deps.logger.info("Mapping not found for channel", { youtubeChannelId: normalizedYoutubeChannelId });
      return { ok: false, reason: "mapping-not-found" };
    }

    const sessionConfig = await this.deps.sessionConfigRepository.get();
    const modeUsed = await this.deps.chatWindowOpener.open({
      tabId,
      twitchChannelName: mapping.twitchChannelName,
      mode: sessionConfig.defaultOpenMode
    });

    this.deps.logger.info("Twitch chat opened", {
      tabId,
      youtubeChannelId: normalizedYoutubeChannelId,
      twitchChannelName: mapping.twitchChannelName,
      modeUsed
    });

    return { ok: true, modeUsed, twitchChannelName: mapping.twitchChannelName };
  }
}
