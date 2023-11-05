import { PluginInjector } from "../index";
import { Channels, DiscordConstants, PermissionStore } from "../lib/requiredModules";
import Types from "../types";
export default (): void => {
  Channels.ChannelRecordBase.prototype.isHidden ??= () => null;
  PluginInjector.instead(
    Channels.ChannelRecordBase.prototype,
    "isHidden",
    (_args, _res, instance: Types.Channel & Types.DefaultTypes.ObjectExports) => {
      const { type } = instance;
      return (
        ![1, 3].includes(type) &&
        !Object.getPrototypeOf(PermissionStore).can(
          DiscordConstants.Permissions.VIEW_CHANNEL,
          instance,
        )
      );
    },
  );
};
