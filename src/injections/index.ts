import { PluginInjector, PluginLogger } from "@this";
import Modules from "@lib/RequiredModules";
import Utils from "@Utils";

const InjectionNames = [
  "CategoryCollapseStore.ts",
  "ChannelItem.tsx",
  "ChannelListStore.ts",
  "ChannelLocked.ts",
  "ChannelStore.ts",
  "ChatContentLayer.tsx",
  "GuildChannelStore.ts",
  "GuildContextMenu.tsx",
  "Messages.ts",
  "PermissionStore.ts",
  "ReadStateStore.ts",
  "Router.tsx",
  "UserGuildSettingsStore.ts",
] as const;

export const applyInjections = async (): Promise<void> => {
  try {
    await Modules.loadModules();
    Utils.debug("Injecting Modules");
    await Promise.all(
      InjectionNames.map((name) => {
        Utils.debug("Loading", name);
        return import(`./${name}`);
      }),
    );
    Utils.debug("Injected Modules");
    Utils.rerenderChannels();
  } catch (err: unknown) {
    PluginLogger.error(err);
  }
};

export const removeInjections = (): void => {
  Utils.debug("Uninjecting Modules");
  PluginInjector.uninjectAll();
  Utils.debug("Uninjected Modules");
  Utils.rerenderChannels();
};

export default { applyInjections, removeInjections };
