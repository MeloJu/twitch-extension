import { DeleteMappingUseCase } from "../application/use-cases/delete-mapping";
import { GetActiveTabStatusUseCase } from "../application/use-cases/get-active-tab-status";
import { OpenChatForActiveTabUseCase } from "../application/use-cases/open-chat-for-active-tab";
import { SetOpenModeUseCase } from "../application/use-cases/set-open-mode";
import { UpsertMappingUseCase } from "../application/use-cases/upsert-mapping";
import { ChromeChatWindowOpener } from "../infrastructure/browser/chrome-chat-window-opener";
import { ChromeLiveContextProvider } from "../infrastructure/browser/chrome-live-context-provider";
import { ChromeStorageChannelMappingRepository } from "../infrastructure/browser/chrome-storage-channel-mapping-repository";
import { ChromeStorageSessionConfigRepository } from "../infrastructure/browser/chrome-storage-session-config-repository";
import { ConsoleLogger } from "../infrastructure/browser/console-logger";

const mappingRepository = new ChromeStorageChannelMappingRepository();
const sessionConfigRepository = new ChromeStorageSessionConfigRepository();
const liveContextProvider = new ChromeLiveContextProvider();
const chatWindowOpener = new ChromeChatWindowOpener();
const logger = new ConsoleLogger();

export const container = {
  mappingRepository,
  sessionConfigRepository,
  liveContextProvider,
  chatWindowOpener,
  logger,
  useCases: {
    openChatForActiveTab: new OpenChatForActiveTabUseCase({
      mappingRepository,
      sessionConfigRepository,
      liveContextProvider,
      chatWindowOpener,
      logger
    }),
    getActiveTabStatus: new GetActiveTabStatusUseCase({
      mappingRepository,
      liveContextProvider
    }),
    upsertMapping: new UpsertMappingUseCase(mappingRepository),
    deleteMapping: new DeleteMappingUseCase(mappingRepository),
    setOpenMode: new SetOpenModeUseCase(sessionConfigRepository)
  }
};
