import { components, webpack } from "replugged";
import { PluginInjector, PluginLogger, SettingValues } from "../index";
import {
  ChannelClasses,
  ChannelItem,
  ChannelItemUtil,
  ChannelStore,
  DiscordConstants,
  GuildStore,
  IconClasses,
  Route,
  TransitionUtil,
  UserMentions,
  Voice,
} from "../lib/requiredModules";
import * as Icons from "../Components/Icons";
import { Lockscreen } from "../Components/Lockscreen";
import { LoadingBoundary } from "../Components/LoadingBoundary";
import { defaultSettings } from "../lib/consts";
import * as Utils from "../lib/utils";
import * as Types from "../types";
const { Tooltip } = components;
export const patchVisuals = (): void => {
  if (SettingValues.get("debugMode", defaultSettings.debugMode)) {
    PluginLogger.log("ChannelItem", ChannelItem);
    PluginLogger.log("UserMention", UserMentions);
  }

  const routePatchFunctionKey = webpack.getFunctionKeyBySource(
    Route,
    /\.impressionName.*\.impressionProperties.*\.disableTrack.*\.PAGE/,
  ) as string;
  PluginInjector.after(Route, routePatchFunctionKey, (_args, res: Types.ReactElement) => {
    const channelId = res.props?.computedMatch?.params?.channelId;
    const guildId = res.props?.computedMatch?.params?.guildId;
    const channel = ChannelStore?.getChannel(channelId);
    if (guildId && channel?.isHidden?.() && channel?.id !== Voice.getChannelId())
      res.props.render = () => (
        <LoadingBoundary>
          <Lockscreen
            {...{
              channel,
              guild: GuildStore.getGuild(guildId),
            }}
          />
        </LoadingBoundary>
      );
    return res;
  });

  const channelItemPatchFunctionKey = webpack.getFunctionKeyBySource(
    ChannelItem,
    /\.unread,.*\.canHaveDot.*\.mentionCount.*\.relevant/,
  ) as string;
  PluginInjector.after(
    ChannelItem,
    channelItemPatchFunctionKey,
    (args, res: Types.ReactElement) => {
      if (SettingValues.get("hiddenChannelIcon", defaultSettings.hiddenChannelIcon) === "false")
        return res;
      const [instance] = args as [{ channel: Types.Channel; connected: boolean }];
      if (!instance.channel?.isHidden?.()) return res;
      const item = res.props?.children?.props;
      if (item?.className)
        item.className += ` shc-hidden-channel shc-hidden-channel-type-${instance.channel.type}`;

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
            {
              Utils.getParameterCaseInsensitive(
                Icons,
                SettingValues.get("hiddenChannelIcon", defaultSettings.hiddenChannelIcon),
              ) as Types.ReactElement
            }
          </Tooltip>,
        ];

      if (
        instance.channel.type === DiscordConstants.ChanneTypes.GUILD_VOICE &&
        !instance.connected
      ) {
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
            instance.channel.isGuildVocal() &&
            TransitionUtil.transitionToChannel(
              `/channels/${instance.channel.guild_id}/${instance.channel.id}`,
            );
          mainContent.props.href = null;
        }
      }
      return res;
    },
  );

  //* Remove lock icon from hidden voice channels
  const channelItemUtilPatchFunctionKey = webpack.getFunctionKeyBySource(
    ChannelItemUtil,
    /\.locked,.*\.video.*\.hasActiveThreads.*\.textFocused/,
  ) as string;
  PluginInjector.before(
    ChannelItemUtil,
    channelItemUtilPatchFunctionKey,
    (args: [Types.Channel, undefined, Types.ChannelIconArgs2]) => {
      if (!args[2]) return;
      if (args[0]?.isHidden?.() && args[2].locked) {
        args[2].locked = false;
      }
    },
  );
};
