import type { OpenMode } from "../domain/entities/session-config";
import type { ChannelMapping } from "../domain/entities/channel-mapping";

export const MESSAGE_TYPES = {
  requestYouTubeLiveContext: "REQUEST_YOUTUBE_LIVE_CONTEXT",
  responseYouTubeLiveContext: "RESPONSE_YOUTUBE_LIVE_CONTEXT",
  openChatFromActiveTab: "OPEN_CHAT_FROM_ACTIVE_TAB",
  getActiveTabStatus: "GET_ACTIVE_TAB_STATUS",
  listMappings: "LIST_MAPPINGS",
  upsertMapping: "UPSERT_MAPPING",
  deleteMapping: "DELETE_MAPPING",
  getSessionConfig: "GET_SESSION_CONFIG",
  setOpenMode: "SET_OPEN_MODE"
} as const;

export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];

export type YouTubeLiveContextPayload = {
  isLive: boolean;
  youtubeChannelId: string | null;
};

export type RuntimeMessage =
  | { type: typeof MESSAGE_TYPES.requestYouTubeLiveContext }
  | { type: typeof MESSAGE_TYPES.responseYouTubeLiveContext; payload: YouTubeLiveContextPayload }
  | { type: typeof MESSAGE_TYPES.openChatFromActiveTab }
  | { type: typeof MESSAGE_TYPES.getActiveTabStatus }
  | { type: typeof MESSAGE_TYPES.listMappings }
  | { type: typeof MESSAGE_TYPES.upsertMapping; payload: Pick<ChannelMapping, "youtubeChannelId" | "twitchChannelName"> }
  | { type: typeof MESSAGE_TYPES.deleteMapping; payload: { youtubeChannelId: string } }
  | { type: typeof MESSAGE_TYPES.getSessionConfig }
  | { type: typeof MESSAGE_TYPES.setOpenMode; payload: { mode: OpenMode } };
