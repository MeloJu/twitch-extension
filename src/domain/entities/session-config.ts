export type OpenMode = "tab" | "window" | "sidepanel";

export interface SessionConfig {
  defaultOpenMode: OpenMode;
}

export const DEFAULT_SESSION_CONFIG: SessionConfig = {
  defaultOpenMode: "window"
};
