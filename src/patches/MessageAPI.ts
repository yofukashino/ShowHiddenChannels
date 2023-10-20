import { PluginInjector } from "../index";
import { ChannelStore, MessageActions } from "../lib/requiredModules";
export default (): void => {
  PluginInjector.instead(MessageActions, "fetchMessages", (args, res, instance) => {
    if (ChannelStore.getChannel(args[0].channelId)?.isHidden?.()) return;
    return res.call(instance, ...args);
  });
};
