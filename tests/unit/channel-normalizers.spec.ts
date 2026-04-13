import { describe, expect, it } from "vitest";
import {
  normalizeTwitchChannelName,
  normalizeYoutubeChannelId
} from "../../src/shared/channel-normalizers";

describe("channel normalizers", () => {
  it("normalizes youtube handle and url formats", () => {
    expect(normalizeYoutubeChannelId("@TcK10")).toBe("tck10");
    expect(normalizeYoutubeChannelId("/@TcK10")).toBe("tck10");
    expect(normalizeYoutubeChannelId("https://www.youtube.com/@TcK10")).toBe("tck10");
  });

  it("preserves canonical youtube channel id format", () => {
    expect(normalizeYoutubeChannelId("UC1234567890AbCdEfGh")).toBe("UC1234567890AbCdEfGh");
  });

  it("normalizes twitch username and url formats", () => {
    expect(normalizeTwitchChannelName("tck10")).toBe("tck10");
    expect(normalizeTwitchChannelName("@TCK10")).toBe("tck10");
    expect(normalizeTwitchChannelName("https://www.twitch.tv/tck10")).toBe("tck10");
    expect(normalizeTwitchChannelName("https://www.twitch.tv/popout/tck10/chat?popout=")).toBe("tck10");
  });
});
