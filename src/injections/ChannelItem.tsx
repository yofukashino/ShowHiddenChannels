import { webpack } from "replugged";
import { classNames, constants } from "replugged/common";
import { Tooltip } from "replugged/components";
import { PluginInjector, SettingValues } from "@this";
import { DefaultSettings } from "@Consts";
import { ChannelButtonClasses, ChannelItem, IconClasses, RoutingUtils } from "@lib/RequiredModules";
import HiddenChannelIcon from "@components/HiddenChannelIcon";
import Utils from "@Utils";

import type { ChannelItemIcon, ChannelItemTab } from "@lib/RequiredModules/ChannelItem";
import type Types from "@Types";

const { ChannelTypes } = constants;

const ChannelItemIcon = webpack.getComponentBySource<ChannelItemIcon>(
  ChannelItem,
  "containerClassName:",
);

PluginInjector.before(ChannelItemIcon, "type", (args) => {
  const { channel, locked } = args[0];
  if (!channel) return args;
  if (Utils.isHidden(channel.id, channel) && locked) {
    args[0].locked = false;
  }
});

PluginInjector.after(
  ChannelItemIcon,
  "type",
  ([{ original, channel, className, ...args }], res) => {
    const hiddenChannelIcon = SettingValues.get(
      "hiddenChannelIcon",
      DefaultSettings.hiddenChannelIcon,
    );

    original ??= "withGuildIcon" in args;

    if (original || !Utils.isHidden(channel.id, channel) || hiddenChannelIcon === "false")
      return res;

    return (
      <Tooltip text="Hidden Channel">
        <span
          className={IconClasses.iconItem}
          style={{
            display: "block",
          }}>
          <HiddenChannelIcon
            className={classNames(
              "shc-size-increase",
              className ?? ChannelButtonClasses.icon ?? IconClasses.actionIcon,
            )}
            style={
              className
                ? { marginRight: "6px" }
                : {
                    height: "20px",
                    width: "20px",
                    marginRight: "6px",
                  }
            }
          />
        </span>
      </Tooltip>
    );
  },
);

const ChannelTab = webpack.getComponentBySource<ChannelItemTab>(ChannelItem, "locked:");

PluginInjector.after(ChannelTab, "render", ([{ channel, connected }], res: Types.ReactTree) => {
  if (!Utils.isHidden(channel.id, channel)) return res;
  const faded = SettingValues.get("faded", DefaultSettings.faded);
  const item = res.props?.children?.props;
  if (item?.className)
    item.className = classNames(
      item.className as string,
      {
        "shc-muted": faded && !item.className.includes("shc-muted"),
      },
      "shc-hidden-channel",
      `shc-hidden-channel-type-${channel.type}`,
    );

  const children = Utils.findInReactTree(
    res,
    (m: React.ReactElement & Types.Tree) =>
      m?.props?.onClick?.toString().includes("stopPropagation") && m.type === "div",
  ) as React.ReactElement & Types.Tree;

  if (children?.props?.children)
    children.props.children = [
      <Tooltip key="Hidden Channel" text="Hidden Channel">
        <span
          className={IconClasses.iconItem}
          style={{
            display: "block",
          }}>
          <HiddenChannelIcon
            className={classNames(IconClasses.actionIcon, ChannelButtonClasses.icon, {
              "shc-muted": faded,
            })}
          />
        </span>
      </Tooltip>,
    ];

  if (channel.type === ChannelTypes.GUILD_VOICE && !connected) {
    const button = Utils.findInReactTree(res, (n) =>
      n?.props?.className?.includes(ChannelButtonClasses?.link),
    );

    if (!button?.props) return res;
    const href = `/channels/${channel.guild_id}/${channel.id}`;
    button.props.href = href;
    button.props.onClick = () => channel.isGuildVocal() && RoutingUtils.transitionTo(href);
  }

  return res;
});
