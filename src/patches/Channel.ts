import { PluginInjector, originalCan } from "../index";
import { Channel, DiscordConstants } from "../lib/requiredModules";
import * as Utils from "../lib/utils";
import * as Types from "../types";
export const patchChannel = (): void => {
  Channel.prototype.isHidden = Utils.NOOP;
  PluginInjector.instead(Channel.prototype, "isHidden", (_args, _res, instance) => {
    const { type } = instance as unknown as Types.Channel;
    return (
      ![1, 3].includes(type) && !originalCan(DiscordConstants.Permissions.VIEW_CHANNEL, instance)
    );
  });
};
