import { messages } from "replugged/common";
import { PluginInjector } from "@this";
import Utils from "@Utils";

PluginInjector.instead(messages, "fetchMessages", (args, orig, instance) => {
  const [{ channelId }] = args;
  if (Utils.isHidden(channelId)) return;

  return orig.call(instance, ...args);
});
