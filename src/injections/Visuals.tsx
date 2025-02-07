import { webpack } from "replugged";
import { ErrorBoundary, Tooltip } from "replugged/components";
import { PluginInjector, SettingValues } from "../index";
import { defaultSettings } from "../lib/consts";
import Modules from "../lib/requiredModules";
import HiddenChannelIcon from "../Components/HiddenChannelIcon";
import Lockscreen from "../Components/Lockscreen";
import Utils from "../lib/utils";
import Types from "../types";

export const injectChannelItem = (): void => {
  const { ChannelButtonClasses, ChannelItem, DiscordConstants, IconClasses, RoutingUtils } =
    Modules;
  const loader = webpack.getFunctionKeyBySource(ChannelItem, ".ALL_MESSAGES");
  PluginInjector.after(
    ChannelItem,
    loader,
    (
      [props]: [{ channel: Types.Channel; connected: boolean }],
      res: React.ReactElement & Types.Tree,
    ) => {
      if (!props.channel?.isHidden?.()) return res;
      const item = res.props?.children?.props;
      if (item?.className)
        item.className += ` ${
          SettingValues.get("faded", defaultSettings.faded) && !item.className.includes("shc-muted")
            ? "shc-muted "
            : ""
        }shc-hidden-channel shc-hidden-channel-type-${props.channel.type}`;
      const children = Utils.findInReactTree(
        res,
        (m: React.ReactElement & Types.Tree) =>
          m?.props?.onClick?.toString().includes("stopPropagation") && m.type === "div",
      ) as React.ReactElement & Types.Tree;
      if (children?.props?.children)
        children.props.children = [
          <Tooltip
            text="Hidden Channel"
            className={`${IconClasses.iconItem}`}
            style={{
              display: "block",
            }}>
            <HiddenChannelIcon
              className={`${IconClasses.actionIcon}${
                SettingValues.get("faded", defaultSettings.faded) ? " shc-muted" : ""
              }`}
            />
          </Tooltip>,
        ];

      if (props.channel.type === DiscordConstants.ChannelTypes.GUILD_VOICE && !props.connected) {
        const button = Utils.findInReactTree(res, (n: React.ReactElement & Types.Tree) =>
          n?.props?.className?.includes(ChannelButtonClasses?.link),
        ) as React.ReactElement & Types.Tree;

        if (button?.props) {
          button.props.href = `/channels/${props.channel.guild_id}/${props.channel.id}`;
          button.props.onClick = () =>
            props.channel.isGuildVocal() && RoutingUtils.transitionTo(button.props.href);
        }
      }

      return res;
    },
  );
};

export const injectChannelIconLocked = (): void => {
  const { ChannelIconLocked } = Modules;
  const loader = webpack.getFunctionKeyBySource(ChannelIconLocked, "permissionOverwrites");
  PluginInjector.after(ChannelIconLocked, loader, ([channel]: [Types.Channel], res) => {
    return !(channel.isHidden() || !res);
  });
};
export const injectChannelItemUtil = (): void => {
  const { ChannelItemUtil } = Modules;
  const loader = webpack.getFunctionKeyBySource(ChannelItemUtil, ".ToS;");
  PluginInjector.before(
    ChannelItemUtil,
    loader,
    ([channel, , props]: [Types.Channel, undefined, Types.ChannelIconArgs2]) => {
      if (!props) return;
      if (channel?.isHidden?.() && props.locked) {
        props.locked = false;
      }
    },
  );
};
export const injectChannelBrowerLockedIcon = () => {
  const { ChannelItem, IconClasses } = Modules;
  const loader = webpack.getFunctionKeyBySource(ChannelItem, ".iconContainerWithGuildIcon,");
  PluginInjector.after(
    ChannelItem,
    loader,
    (
      [props]: [
        { channel: Types.Channel; guild: Types.Guild; className?: string; original: boolean },
      ],
      res: React.ReactElement,
    ) => {
      if (
        props.original ||
        !props.channel?.isHidden() ||
        SettingValues.get("hiddenChannelIcon", defaultSettings.hiddenChannelIcon) === "false"
      )
        return res;
      return (
        <Tooltip
          text="Hidden Channel"
          className={`${IconClasses.iconItem}`}
          style={{
            display: "block",
          }}>
          <HiddenChannelIcon
            className={`shc-size-increase ${props.className ?? IconClasses.actionIcon}`}
            style={
              props.className
                ? { marginRight: "6px" }
                : {
                    height: "20px",
                    width: "20px",
                    marginRight: "6px",
                  }
            }
          />
        </Tooltip>
      );
    },
  );
};
export const injectUserGuildSettingsStore = (): void => {
  const { ChannelStore, UserGuildSettingsStore } = Modules;
  PluginInjector.after(
    UserGuildSettingsStore,
    "getMutedChannels",
    (args: [string], res: Set<string>) => {
      if (!SettingValues.get("faded", defaultSettings.faded)) return res;
      const HiddenChannelIDs = Utils.getHiddenChannels(args[0]).channels.map((c) => c.id);
      const Category =
        SettingValues.get("sort", defaultSettings.sort) === "extra" ? [`${args[0]}_hidden`] : [];
      return new Set([...res, ...Category, ...HiddenChannelIDs]);
    },
  );
  PluginInjector.after(
    UserGuildSettingsStore,
    "isChannelMuted",
    (args: [string, string], res: boolean) => {
      const Channel = ChannelStore.getChannel(args[1]);
      if (
        !SettingValues.get("faded", defaultSettings.faded) ||
        (!Channel?.isHidden() &&
          (SettingValues.get("sort", defaultSettings.sort) !== "extra" ||
            !args[1].endsWith("hidden")))
      )
        return res;
      return true;
    },
  );
};

export const injectRoute = (): void => {
  const { ChannelStore, GuildStore, Route, RTCConnectionStore } = Modules;
  const loader = webpack.getFunctionKeyBySource(Route, "ImpressionTypes.PAGE");
  PluginInjector.before(Route, loader, (args: [Types.RouteArgs]) => {
    const channelId = args[0]?.computedMatch?.params?.channelId;
    const guildId = args[0]?.computedMatch?.params?.guildId;
    const channel = ChannelStore?.getChannel(channelId);
    if (guildId && channel?.isHidden?.() && channel?.id !== RTCConnectionStore.getChannelId())
      args[0].render = () => (
        <ErrorBoundary>
          <Lockscreen channel={channel} guild={GuildStore.getGuild(guildId)} />
        </ErrorBoundary>
      );
    return args;
  });
};
export const injectSidebarChatContent = (): void => {
  const { ChatContent, GuildStore, RTCConnectionStore } = Modules;
  PluginInjector.after(ChatContent, "type", ([{ channel, chatInputType, guild }], res) => {
    if (
      !channel?.isHidden() ||
      channel?.id === RTCConnectionStore.getChannelId() ||
      chatInputType.analyticsName !== "sidebar"
    )
      return res;
    return (
      <ErrorBoundary>
        <Lockscreen channel={channel} guild={GuildStore.getGuild(guild.id)} />
      </ErrorBoundary>
    );
  });
};
export default (): void => {
  injectChannelItem();
  injectChannelIconLocked();
  injectChannelItemUtil();
  injectChannelBrowerLockedIcon();
  injectUserGuildSettingsStore();
  injectRoute();
  injectSidebarChatContent();
};
