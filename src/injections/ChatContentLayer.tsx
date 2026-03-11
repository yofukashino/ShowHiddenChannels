import { ErrorBoundary } from "replugged/components";
import { PluginInjector } from "@this";
import { ChatContentLayer, RTCConnectionStore } from "@lib/RequiredModules";
import Lockscreen from "@components/Lockscreen";
import Utils from "@Utils";

PluginInjector.after(ChatContentLayer, "type", ([{ channel, chatInputType, guild }], res) => {
  if (
    !Utils.isHidden(channel.id, channel) ||
    channel?.id === RTCConnectionStore.getChannelId() ||
    chatInputType.analyticsName !== "sidebar"
  )
    return res;

  return (
    <ErrorBoundary>
      <Lockscreen channelId={channel.id} guildId={guild.id} />
    </ErrorBoundary>
  );
});
