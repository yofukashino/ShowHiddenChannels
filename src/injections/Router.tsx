import { webpack } from "replugged";
import { ErrorBoundary } from "replugged/components";
import { PluginInjector } from "@this";
import { RTCConnectionStore, Router } from "@lib/RequiredModules";
import Lockscreen from "@components/Lockscreen";
import Utils from "@Utils";

const loader = webpack.getFunctionKeyBySource(Router, "ImpressionTypes.PAGE");
PluginInjector.before(Router, loader, (args) => {
  const { channelId, guildId } = args[0].computedMatch.params;
  if (guildId && Utils.isHidden(channelId) && channelId !== RTCConnectionStore.getChannelId())
    args[0].render = () => (
      <ErrorBoundary>
        <Lockscreen channelId={channelId} guildId={guildId} />
      </ErrorBoundary>
    );
  return args;
});
