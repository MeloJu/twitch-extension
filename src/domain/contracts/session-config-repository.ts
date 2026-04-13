import type { OpenMode, SessionConfig } from "../entities/session-config";

export interface SessionConfigRepository {
  get(): Promise<SessionConfig>;
  setOpenMode(mode: OpenMode): Promise<void>;
}
