const YOUTUBE_HOST_PATTERN = /(^|\.)youtube\.com$/i;
const TWITCH_HOST_PATTERN = /(^|\.)twitch\.tv$/i;

function tryParseUrl(input: string): URL | null {
  try {
    return new URL(input);
  } catch {
    return null;
  }
}

export function normalizeYoutubeChannelId(input: string): string {
  let value = input.trim();
  if (!value) {
    return "";
  }

  const url = tryParseUrl(value);
  if (url && YOUTUBE_HOST_PATTERN.test(url.hostname)) {
    const path = url.pathname;
    if (path.startsWith("/@")) {
      value = path.slice(2);
    } else if (path.startsWith("/channel/")) {
      value = path.slice("/channel/".length).split("/")[0] ?? "";
    }
  }

  if (value.startsWith("/@")) {
    value = value.slice(2);
  } else if (value.startsWith("/channel/")) {
    value = value.slice("/channel/".length);
  } else if (value.startsWith("channel/")) {
    value = value.slice("channel/".length);
  }

  value = value.replace(/^@/, "").replace(/[#?].*$/, "").replace(/\/+$/, "").trim();

  if (!value) {
    return "";
  }

  if (/^UC[A-Za-z0-9_-]{10,}$/.test(value)) {
    return value;
  }

  return value.toLowerCase();
}

export function normalizeTwitchChannelName(input: string): string {
  let value = input.trim();
  if (!value) {
    return "";
  }

  const url = tryParseUrl(value);
  if (url && TWITCH_HOST_PATTERN.test(url.hostname)) {
    const segments = url.pathname.split("/").filter(Boolean);
    if (segments[0] === "popout") {
      value = segments[1] ?? "";
    } else {
      value = segments[0] ?? "";
    }
  }

  value = value.replace(/^@/, "").replace(/[#?].*$/, "").replace(/\/+$/, "").trim();
  return value.toLowerCase();
}