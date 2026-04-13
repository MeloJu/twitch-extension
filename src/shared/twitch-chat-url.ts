import { APP_CONFIG } from "./app-config";
import { normalizeTwitchChannelName } from "./channel-normalizers";

export function buildTwitchPopoutUrl(twitchChannelName: string): string {
  const channel = normalizeTwitchChannelName(twitchChannelName);
  return `${APP_CONFIG.twitch.popoutBaseUrl}/${channel}/chat?popout=`;
}
