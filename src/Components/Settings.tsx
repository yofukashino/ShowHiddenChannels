/* eslint-disable eqeqeq */
import { components, util } from "replugged";
import { PluginLogger, SettingValues } from "../index";
import { ChannelTypes, defaultSettings } from "../lib/consts";
import { IconSwitch } from "./IconSwitch";
import { GuildStore, IconUtils } from "../lib/requiredModules";
import * as Utils from "../lib/utils";
import * as Types from "../types";
const { Category, SwitchItem, RadioItem } = components;
export const registerSettings = (): void => {
  for (const key in defaultSettings) {
    if (SettingValues.has(key as keyof Types.Settings)) return;
    PluginLogger.log(`Adding new setting ${key} with value ${defaultSettings[key]}.`);
    SettingValues.set(key as keyof Types.Settings, defaultSettings[key]);
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
                value: "false",
              },
            ],
            ...Utils.useSetting(
              SettingValues,
              "hiddenChannelIcon",
              defaultSettings.hiddenChannelIcon,
            ),
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
            ...Utils.useSetting(SettingValues, "sort", defaultSettings.sort),
          }}
        />

        <SwitchItem
          note="Show what roles/users can access the hidden channel."
          {...util.useSetting(SettingValues, "showPerms")}>
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
                value: "false",
              },
            ],
            ...Utils.useSetting(SettingValues, "showAdmin", defaultSettings.showAdmin),
          }}
        />

        <SwitchItem
          note="Stops the plugin from marking hidden channels as read."
          {...util.useSetting(
            SettingValues,
            "stopMarkingUnread",
            defaultSettings.stopMarkingUnread,
          )}>
          Stop marking hidden channels as read
        </SwitchItem>

        <SwitchItem
          note="Collapse hidden category by default (requires sorting order as extra category)."
          {...util.useSetting(SettingValues, "alwaysCollapse", defaultSettings.alwaysCollapse)}>
          Collapse Hidden Category
        </SwitchItem>

        <SwitchItem
          note="Show Empty Category either because there were no channels in it or all channels are under hidden channels category."
          {...util.useSetting(
            SettingValues,
            "shouldShowEmptyCategory",
            defaultSettings.shouldShowEmptyCategory,
          )}>
          Show Empty Category
        </SwitchItem>

        <SwitchItem
          note="Enables debug mode, which will log more information to the console."
          {...util.useSetting(SettingValues, "debugMode", defaultSettings.debugMode)}>
          Enable Debug Mode
        </SwitchItem>
      </Category>
      <Category {...{ title: "Choose what channels you want to display", open: false }}>
        {...Object.values(ChannelTypes).map((type) => {
          return (
            <SwitchItem
              {...{
                ...(Utils.useSetting(
                  SettingValues,
                  `channels.${type}`,
                  defaultSettings.channels[type],
                ) as unknown as {
                  value: boolean;
                  onChange: (newValue: boolean) => void;
                }),
              }}>
              {`Show ${Utils.capitalizeFirst(type.split("_")[1])}${
                type.split("_").length == 3 ? ` ${Utils.capitalizeFirst(type.split("_")[2])}` : ""
              } Channels`}
            </SwitchItem>
          );
        })}
      </Category>

      <Category {...{ title: "Guilds Blacklist", open: false }}>
        {...Object.values(GuildStore.getGuilds()).map((guild) => (
          <IconSwitch
            {...{
              title: guild.name,
              note: guild.description,
              icon:
                IconUtils.getGuildIconURL(guild) ??
                IconUtils.getDefaultAvatarURL(Utils.randomNo(0, 69)),
              ...(Utils.useSetting(
                SettingValues,
                `blacklistedGuilds.${guild.id}`,
                false as unknown as string,
              ) as unknown as {
                value: boolean;
                onChange: (newValue: boolean) => void;
              }),
            }}
          />
        ))}
      </Category>
    </div>
  );
};
