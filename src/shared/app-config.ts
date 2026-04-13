export const APP_CONFIG = {
  twitch: {
    popoutBaseUrl: "https://www.twitch.tv/popout"
  },
  youtube: {
    allowedHosts: ["www.youtube.com", "youtube.com", "m.youtube.com"] as const
  }
} as const;

export const STORAGE_KEYS = {
  channelMappings: "channelMappings",
  sessionConfig: "sessionConfig"
} as const;
