import type { Logger } from "../../domain/contracts/logger";

export class ConsoleLogger implements Logger {
  info(message: string, context?: Record<string, unknown>): void {
    console.info(`[yt-twitch-bridge] ${message}`, context ?? {});
  }

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(`[yt-twitch-bridge] ${message}`, context ?? {});
  }

  error(message: string, context?: Record<string, unknown>): void {
    console.error(`[yt-twitch-bridge] ${message}`, context ?? {});
  }
}
