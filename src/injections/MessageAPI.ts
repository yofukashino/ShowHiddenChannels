import { PluginInjector } from "../index";
import Modules from "../lib/requiredModules";
export default (): void => {
  const { ChannelStore, MessageActions } = Modules;
  PluginInjector.instead(MessageActions, "fetchMessages", (args, res, instance) => {
    if (ChannelStore.getChannel(args[0].channelId)?.isHidden?.()) return;
    return res.call(instance, ...args);
  });
};
