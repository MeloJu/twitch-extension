export type OpenMode = "tab" | "sidepanel";

export interface SessionConfig {
  defaultOpenMode: OpenMode;
}

export const DEFAULT_SESSION_CONFIG: SessionConfig = {
  defaultOpenMode: "tab"
};
