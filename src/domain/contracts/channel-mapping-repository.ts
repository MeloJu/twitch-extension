import type { ChannelMapping } from "../entities/channel-mapping";

export interface ChannelMappingRepository {
  list(): Promise<ChannelMapping[]>;
  getByYoutubeChannelId(youtubeChannelId: string): Promise<ChannelMapping | null>;
  upsert(mapping: Pick<ChannelMapping, "youtubeChannelId" | "twitchChannelName">): Promise<void>;
  delete(youtubeChannelId: string): Promise<void>;
}
