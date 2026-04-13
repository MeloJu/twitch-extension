import type { OpenMode } from "../../domain/entities/session-config";
import type { SessionConfigRepository } from "../../domain/contracts/session-config-repository";

export class SetOpenModeUseCase {
  constructor(private readonly sessionConfigRepository: SessionConfigRepository) {}

  async execute(mode: OpenMode): Promise<void> {
    if (mode !== "tab" && mode !== "window" && mode !== "sidepanel") {
      throw new Error("Invalid open mode");
    }

    await this.sessionConfigRepository.setOpenMode(mode);
  }
}
