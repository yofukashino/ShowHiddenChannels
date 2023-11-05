import { ErrorBoundary, Tooltip } from "replugged/components";
import { PluginInjector, SettingValues } from "../index";
import { defaultSettings } from "../lib/consts";
import {
  ChannelButtonClasses,
  ChannelItem,
  ChannelItemClasses,
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
import Lockscreen from "../Components/Lockscreen";
import Utils from "../lib/utils";
import Types from "../types";
export const patchChannelItem = (): void => {
  PluginInjector.after(
    ChannelItem,
    "default",
    (
      [props]: [{ channel: Types.Channel; connected: boolean }],
      res: React.ReactElement & Types.Tree,
    ) => {
      if (!props.channel?.isHidden?.()) return res;
      const item = res.props?.children?.props;
      if (item?.className)
        item.className += ` ${
          SettingValues.get("faded", defaultSettings.faded) &&
          !item.className.includes(ChannelItemClasses.modeMuted)
            ? `${ChannelItemClasses.modeMuted} `
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

      if (props.channel.type === DiscordConstants.ChannelTypes.GUILD_VOICE && !props.connected) {
        const wrapper = Utils.findInReactTree(res, (n: React.ReactElement & Types.Tree) =>
          n?.props?.className?.includes(ChannelItemClasses.wrapper),
        ) as React.ReactElement & Types.Tree;

        if (wrapper?.props) {
          wrapper.props.onMouseDown = () => {};
          wrapper.props.onMouseUp = () => {};
        }

        const button = Utils.findInReactTree(res, (n: React.ReactElement & Types.Tree) =>
          n?.props?.className?.includes(ChannelButtonClasses.link),
        ) as React.ReactElement & Types.Tree;

        if (button?.props) {
          button.props.href = `/channels/${props.channel.guild_id}/${props.channel.id}`;
          button.props.onClick = () =>
            props.channel.isGuildVocal() && TransitionUtil.transitionTo(button.props.href);
        }
      }

      return res;
    },
  );
};

export const patchChannelItemUtil = (): void => {
  //* Remove lock icon from hidden voice channels
  PluginInjector.before(
    ChannelItemUtil,
    "getChannelIconComponent",
    (args: [Types.Channel, undefined, Types.ChannelIconArgs2]) => {
      if (!args[2]) return;
      if (args[0]?.isHidden?.() && args[2].locked) {
        args[2].locked = false;
      }
    },
  );
};
export const patchChannelBrowerLockIcon = () => {
  PluginInjector.after(
    ChannelItem,
    "ChannelItemIcon",
    (
      [props]: [{ channel: Types.Channel; guild: Types.Guild; className?: string }],
      res: React.ReactElement,
    ) => {
      if (
        !props.channel?.isHidden() ||
        SettingValues.get("hiddenChannelIcon", defaultSettings.hiddenChannelIcon) === "false"
      )
        return res;
      return (
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
              className: `shc-size-increase ${props.className ?? IconClasses.actionIcon}`,
              style: props.className
                ? { marginRight: "6px" }
                : {
                    height: "20px",
                    width: "20px",
                    marginRight: "6px",
                  },
            }}
          />
        </Tooltip>
      );
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
  PluginInjector.before(Route, "default", (args: [Types.RouteArgs]) => {
    const channelId = args[0]?.computedMatch?.params?.channelId;
    const guildId = args[0]?.computedMatch?.params?.guildId;
    const channel = ChannelStore?.getChannel(channelId);
    if (guildId && channel?.isHidden?.() && channel?.id !== Voice.getChannelId())
      args[0].render = () => (
        <ErrorBoundary>
          <Lockscreen
            {...{
              channel,
              guild: GuildStore.getGuild(guildId),
            }}
          />
        </ErrorBoundary>
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
      <ErrorBoundary>
        <Lockscreen
          {...{
            channel,
            guild: GuildStore.getGuild(guild.id),
          }}
        />
      </ErrorBoundary>
    );
  });
};
export default (): void => {
  patchChannelItem();
  patchChannelItemUtil();
  patchChannelBrowerLockIcon();
  patchUserGuildSettingsStore();
  patchRoute();
  patchSidebarChatContent();
};
