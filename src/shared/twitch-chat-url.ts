import { APP_CONFIG } from "./app-config";

export function buildTwitchPopoutUrl(twitchChannelName: string): string {
  const channel = twitchChannelName.trim().replace(/^@/, "").toLowerCase();
  return `${APP_CONFIG.twitch.popoutBaseUrl}/${channel}/chat?popout=`;
}
