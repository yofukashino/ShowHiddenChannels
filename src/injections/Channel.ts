import { webpack } from "replugged";
import { PluginInjector } from "../index";
import Modules from "../lib/requiredModules";
import Types from "../types";
export default (): void => {
  const { Channels, DiscordConstants, PermissionStore } = Modules;
  const ChannelRecordBase = webpack.getFunctionBySource<Types.DefaultTypes.AnyFunction>(
    Channels,
    "get permissionOverwrites",
  );
  ChannelRecordBase.prototype.isHidden ??= () => null;
  PluginInjector.instead(
    ChannelRecordBase.prototype,
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
