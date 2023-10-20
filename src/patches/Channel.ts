import { PluginInjector, originalCan } from "../index";
import { Channel, DiscordConstants } from "../lib/requiredModules";
import Types from "../types";
export default (): void => {
  Channel.prototype.isHidden ??= () => null;
  PluginInjector.instead(
    Channel.prototype,
    "isHidden",
    (_args, _res, instance: Types.Channel & Types.DefaultTypes.ObjectExports) => {
      const { type } = instance;
      return (
        ![1, 3].includes(type) && !originalCan(DiscordConstants.Permissions.VIEW_CHANNEL, instance)
      );
    },
  );
};
