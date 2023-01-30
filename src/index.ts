import { Injector, Logger, webpack } from "replugged";

const inject = new Injector();
const logger = Logger.plugin("PluginTemplate");

export async function start(): Promise<void> {
  const typingMod = await webpack.waitForModule<{
    startTyping: (channelId: string) => void;
  }>(webpack.filters.byProps("startTyping"));
  const getChannelMod = await webpack.waitForModule<{
    getChannel: (id: string) => {
      name: string;
    };
  }>(webpack.filters.byProps("getChannel"));

  if (typingMod && getChannelMod) {
    inject.instead(typingMod, "startTyping", ([channel]) => {
      const channelObj = getChannelMod.getChannel(channel);
      logger.log(`Typing prevented! Channel: #${channelObj?.name ?? "unknown"} (${channel}).`);
    });
  }
}

export function stop(): void {
  inject.uninjectAll();
}
