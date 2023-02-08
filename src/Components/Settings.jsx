/* eslint-disable eqeqeq */
import { common, components, util } from "replugged";
import { PluginLogger, shc } from "../index.jsx";
const { Category, SwitchItem, RadioItem } = components;
const { React } = common;
import { ChannelTypes, defaultSettings } from "../lib/consts.jsx";
import * as Utils from "../lib/utils.jsx";
import { IconSwitch } from "./IconSwitch.jsx";
import { GuildStore, IconUtils } from "../lib/requiredModules.jsx";
export const registerSettings = () => {
  for (const [key, value] of Object.entries(defaultSettings)) {
    if (shc.has(key)) return;
    PluginLogger.log(`Adding new setting ${key} with value`, value);
    shc.set(key, value);
  }
};

export const Settings = () => {
  return (
    <div>
      <Category {...{ title: "General Settings", open: false }}>
        <RadioItem
          {...{
            title: "Hidden Channel Icon",
            note: "What icon to show as indicator for hidden channels.",
            options: [
              {
                name: "Lock Icon",
                value: "lock",
              },
              {
                name: "Eye Icon",
                value: "eye",
              },
              {
                name: "None",
                value: false,
              },
            ],
            ...util.useSetting(shc, "hiddenChannelIcon"),
          }}
        />

        <RadioItem
          {...{
            title: "Sorting Order",
            note: "Where to display Hidden Channels.",
            options: [
              {
                name: "Hidden Channels in the native Discord order (default)",
                value: "native",
              },
              {
                name: "Hidden Channels at the bottom of the Category",
                value: "bottom",
              },
              {
                name: "Hidden Channels in a separate Category at the bottom",
                value: "extra",
              },
            ],
            ...util.useSetting(shc, "sort"),
          }}
        />

        <SwitchItem
          note="Show what roles/users can access the hidden channel."
          {...util.useSetting(shc, "showPerms")}>
          Show Permissions
        </SwitchItem>

        <RadioItem
          {...{
            title: "Show Admin Roles",
            note: "Show roles that have ADMINISTRATOR permission in the hidden channel page (requires 'Shows Permission' enabled).",
            options: [
              {
                name: "Show only channel specific roles",
                value: "channel",
              },
              {
                name: "Include Bot Roles",
                value: "include",
              },
              {
                name: "Exclude Bot Roles",
                value: "exclude",
              },
              {
                name: "Don't Show Administrator Roles",
                value: false,
              },
            ],
            ...util.useSetting(shc, "showAdmin"),
          }}
        />

        <SwitchItem
          note="Stops the plugin from marking hidden channels as read."
          {...util.useSetting(shc, "MarkUnread")}>
          Stop marking hidden channels as read
        </SwitchItem>

        <SwitchItem
          note="Collapse hidden category by default (requires sorting order as extra category)."
          {...util.useSetting(shc, "alwaysCollapse")}>
          Collapse Hidden Category
        </SwitchItem>

        <SwitchItem
          note="Show Empty Category either because there were no channels in it or all channels are under hidden channels category."
          {...util.useSetting(shc, "shouldShowEmptyCategory")}>
          Show Empty Category
        </SwitchItem>

        <SwitchItem
          note="Enables debug mode, which will log more information to the console."
          {...util.useSetting(shc, "debugMode")}>
          Enable Debug Mode
        </SwitchItem>
      </Category>
      <Category {...{ title: "Choose what channels you want to display", open: false }}>
        {...Object.values(ChannelTypes).map((type) => {
          const typeSetting = shc.get("channels", defaultSettings.channels);
          const [switchValue, setSwitchValue] = React.useState(typeSetting[type]);
          return (
            <SwitchItem
              {...{
                value: switchValue,
                onChange: (value) => {
                  setSwitchValue(value);
                  typeSetting[type] = value;
                  shc.set("channels", typeSetting);
                },
              }}>
              {`Show ${Utils.capitalizeFirst(type.split("_")[1])}${
                type.split("_").length == 3 ? ` ${Utils.capitalizeFirst(type.split("_")[2])}` : ""
              } Channels`}
            </SwitchItem>
          );
        })}
      </Category>

      <Category {...{ title: "Guilds Blacklist", open: false }}>
        {...Object.values(GuildStore.getGuilds()).map((guild) => {
          const blacklistedGuilds = shc.get("blacklistedGuilds", defaultSettings.blacklistedGuilds);
          const [switchValue, setSwitchValue] = React.useState(
            Boolean(blacklistedGuilds[guild.id]),
          );
          return (
            <IconSwitch
              {...{
                note: guild.description,
                icon:
                  IconUtils.getGuildIconURL(guild) ??
                  IconUtils.getDefaultAvatarURL(Utils.randomNo(0, 69)),
                value: switchValue,
                onChange: (value) => {
                  setSwitchValue(value);
                  blacklistedGuilds[guild.id] = value;
                  shc.set("blacklistedGuilds", blacklistedGuilds);
                },
              }}>
              {guild.name}
            </IconSwitch>
          );
        })}
      </Category>
    </div>
  );
};
