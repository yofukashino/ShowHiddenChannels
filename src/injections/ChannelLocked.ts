import { webpack } from "replugged";
import { PluginInjector } from "@this";
import { ChannelLocked } from "@lib/RequiredModules";
import Utils from "@Utils";

const isLocked = webpack.getFunctionKeyBySource(ChannelLocked, "permissionOverwrites");
PluginInjector.after(ChannelLocked, isLocked, ([channel], res) => {
  if (Utils.isHidden(channel.id, channel)) return false;
  return res;
});
