import { components, webpack } from "replugged";
import { PluginInjector, SettingValues } from "../index";
import {
  ChannelClasses,
  ChannelItem,
  ChannelItemUtil,
  ChannelStore,
  ChatContent,
  DiscordConstants,
  GuildStore,
  IconClasses,
  Route,
  TransitionUtil,
  UserGuildSettingsStore,
  Voice,
} from "../lib/requiredModules";
import HiddenChannelIcon from "../Components/HiddenChannelIcon";
import { Lockscreen } from "../Components/Lockscreen";
import { LoadingBoundary } from "../Components/LoadingBoundary";
import { defaultSettings } from "../lib/consts";
import * as Utils from "../lib/utils";
import * as Types from "../types";
const { Tooltip } = components;
export const makeChannelBrowerLockIcon = ({ channel, originalIcon }) => {
  if (
    !channel?.isHidden() ||
    SettingValues.get("hiddenChannelIcon", defaultSettings.hiddenChannelIcon) === "false"
  )
    return originalIcon;
  return (
    <Tooltip
      {...{
        text: "Hidden Channel",
        className: `${IconClasses.iconItem}`,
        style: {
          display: "block",
        },
      }}>
      <HiddenChannelIcon {...{ className: `shc-size-increase ${IconClasses.actionIcon}` }} />
    </Tooltip>
  );
};
export const patchChannelItem = (): void => {
  const FunctionKey = webpack.getFunctionKeyBySource(
    ChannelItem,
    /\.unread,.*\.canHaveDot.*\.mentionCount.*\.relevant/,
  ) as string;
  PluginInjector.after(
    ChannelItem,
    FunctionKey,
    ([props]: [{ channel: Types.Channel; connected: boolean }], res: Types.ReactElement) => {
      if (!props.channel?.isHidden?.()) return res;
      const item = res.props?.children?.props;
      if (item?.className)
        item.className += ` shc-hidden-channel shc-hidden-channel-type-${props.channel.type}`;
      const children = Utils.findInReactTree(res, (m: Types.ReactElement) =>
        m?.props?.onClick?.toString().includes("stopPropagation"),
      ) as Types.ReactElement;
      if (children?.props?.children)
        children.props.children = [
          <Tooltip
            {...{
              text: "Hidden Channel",
              className: `${IconClasses.iconItem}`,
              style: {
                display: "block",
              },
            }}>
            <HiddenChannelIcon
              {...{
                className: IconClasses.actionIcon,
                style: SettingValues.get("faded", defaultSettings.faded)
                  ? {
                      color: "var(--interactive-muted)",
                    }
                  : {},
              }}
            />
          </Tooltip>,
        ];
      if (props.channel.type === DiscordConstants.ChanneTypes.GUILD_VOICE && !props.connected) {
        const wrapper = Utils.findInReactTree(res, (n: Types.ReactElement) =>
          n?.props?.className?.includes(ChannelClasses.wrapper),
        ) as Types.ReactElement;
        if (wrapper) {
          wrapper.props.onMouseDown = () => {};
          wrapper.props.onMouseUp = () => {};
        }
        const mainContent = Utils.findInReactTree(res, (n: Types.ReactElement) =>
          n?.props?.className?.includes(ChannelClasses.mainContent),
        ) as Types.ReactElement;

        if (mainContent) {
          mainContent.props.onClick = () =>
            props.channel.isGuildVocal() &&
            TransitionUtil.transitionToChannel(
              `/channels/${props.channel.guild_id}/${props.channel.id}`,
            );
          mainContent.props.href = null;
        }
      }
      return res;
    },
  );
};

export const patchChannelItemUtil = (): void => {
  //* Remove lock icon from hidden voice channels
  const FunctionKey = webpack.getFunctionKeyBySource(
    ChannelItemUtil,
    /\.locked,.*\.video.*\.hasActiveThreads.*\.textFocused/,
  ) as string;
  PluginInjector.before(
    ChannelItemUtil,
    FunctionKey,
    (args: [Types.Channel, undefined, Types.ChannelIconArgs2]) => {
      if (!args[2]) return;
      if (args[0]?.isHidden?.() && args[2].locked) {
        args[2].locked = false;
      }
    },
  );
};

export const patchUserGuildSettingsStore = (): void => {
  PluginInjector.after(
    UserGuildSettingsStore,
    "getMutedChannels",
    (args: [string], res: Set<string>) => {
      if (!SettingValues.get("faded", defaultSettings.faded)) return res;
      const HiddenChannelIDs = Utils.getHiddenChannels(args[0]).channels.map((c) => c.id);
      return new Set([...res, ...HiddenChannelIDs]);
    },
  );
  PluginInjector.after(
    UserGuildSettingsStore,
    "isChannelMuted",
    (args: [string, string], res: boolean) => {
      const Channel = ChannelStore.getChannel(args[1]);
      if (!SettingValues.get("faded", defaultSettings.faded) || !Channel?.isHidden()) return res;
      return true;
    },
  );
};

export const patchRoute = (): void => {
  const FunctionKey = webpack.getFunctionKeyBySource(
    Route,
    /\.impressionName.*\.impressionProperties.*\.disableTrack.*\.PAGE/,
  ) as string;
  PluginInjector.before(Route, FunctionKey, (args) => {
    const channelId = args[0]?.computedMatch?.params?.channelId;
    const guildId = args[0]?.computedMatch?.params?.guildId;
    const channel = ChannelStore?.getChannel(channelId);
    if (guildId && channel?.isHidden?.() && channel?.id !== Voice.getChannelId())
      args[0].render = () => (
        <LoadingBoundary>
          <Lockscreen
            {...{
              channel,
              guild: GuildStore.getGuild(guildId),
            }}
          />
        </LoadingBoundary>
      );
    return args;
  });
};
export const patchSidebarChatContent = (): void => {
  PluginInjector.after(ChatContent, "type", ([{ channel, chatInputType, guild }], res) => {
    if (
      !channel?.isHidden() ||
      channel?.id === Voice.getChannelId() ||
      chatInputType.analyticsName !== "sidebar"
    )
      return res;
    return (
      <LoadingBoundary>
        <Lockscreen
          {...{
            channel,
            guild: GuildStore.getGuild(guild.id),
          }}
        />
      </LoadingBoundary>
    );
  });
};
export const patchVisuals = (): void => {
  patchChannelItem();
  patchChannelItemUtil();
  patchUserGuildSettingsStore();
  patchRoute();
  patchSidebarChatContent();
};
