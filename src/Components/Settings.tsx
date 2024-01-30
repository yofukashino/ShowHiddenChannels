import {
  ButtonItem,
  Category,
  FormItem,
  RadioItem,
  SwitchItem,
  TextInput,
} from "replugged/components";
import { PluginLogger, SettingValues } from "../index";
import { defaultSettings } from "../lib/consts";

import SearchableGuilds from "./SearchableGuilds";
import Utils from "../lib/utils";
import Types from "../types";
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
      <Category title="General Settings" open={false}>
        <RadioItem
          note="What image to show in hidden channel's content."
          options={[
            { name: "Lock Icon", value: "lock" },
            { name: "Eye Icon", value: "eye" },
            { name: "Custom Icon", value: "custom" },
            { name: "None", value: "false" },
          ]}
          {...Utils.useSetting(
            SettingValues,
            "hiddenChannelImg",
            defaultSettings.hiddenChannelImg,
          )}>
          Hidden Channel Image
        </RadioItem>
        <FormItem
          title="Custom Image Link"
          note={"MUST BE IMAGE LINK! (Recommended Hosts are github, discord and imgur)."}
          style={{ marginBottom: 20 }}
          divider={true}>
          <TextInput
            disabled={
              SettingValues.get("hiddenChannelImg", defaultSettings.hiddenChannelImg) !== "custom"
            }
            placeholder="Enter Link of your custom image"
            {...Utils.useSetting(
              SettingValues,
              "customHiddenChannelImg",
              defaultSettings.customHiddenChannelImg,
            )}
          />
        </FormItem>
        <RadioItem
          note="What icon to show as an indicator for hidden channels."
          options={[
            { name: "Lock Icon", value: "lock" },
            { name: "Eye Icon", value: "eye" },
            { name: "Custom Icon", value: "custom" },
            { name: "None", value: "false" },
          ]}
          {...Utils.useSetting(
            SettingValues,
            "hiddenChannelIcon",
            defaultSettings.hiddenChannelIcon,
          )}>
          Hidden Channel Icon
        </RadioItem>
        <FormItem
          title="Custom Icon Link"
          note={"MUST BE SVG LINK! (Recommended Hosts are github, discord and imgur)."}
          style={{ marginBottom: 20 }}
          divider={true}>
          <TextInput
            disabled={
              SettingValues.get("hiddenChannelIcon", defaultSettings.hiddenChannelIcon) !== "custom"
            }
            placeholder="Enter Link of your custom icon"
            {...Utils.useSetting(
              SettingValues,
              "customHiddenChannelIcon",
              defaultSettings.customHiddenChannelIcon,
            )}
          />
        </FormItem>
        <SwitchItem
          note="Fade away hidden channels like if they are muted."
          {...Utils.useSetting(SettingValues, "faded")}>
          Faded Channel
        </SwitchItem>
        <RadioItem
          note="Where to display Hidden Channels."
          options={[
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
          ]}
          {...Utils.useSetting(SettingValues, "sort", defaultSettings.sort)}>
          Sorting Order
        </RadioItem>
        <SwitchItem
          note="Show what roles/users can access the hidden channel."
          {...Utils.useSetting(SettingValues, "showPerms")}>
          Show Permissions
        </SwitchItem>
        <RadioItem
          note="Show roles that have ADMINISTRATOR permission in the hidden channel page (requires 'Shows Permission' enabled)."
          options={[
            { name: "Show only channel-specific roles", value: "channel" },
            { name: "Include Bot Roles", value: "include" },
            { name: "Exclude Bot Roles", value: "exclude" },
            { name: "Don't Show Administrator Roles", value: "false" },
          ]}
          {...Utils.useSetting(SettingValues, "showAdmin", defaultSettings.showAdmin)}>
          Show Admin Roles
        </RadioItem>
        <SwitchItem
          note="Stops the plugin from marking hidden channels as read."
          {...Utils.useSetting(
            SettingValues,
            "stopMarkingUnread",
            defaultSettings.stopMarkingUnread,
          )}>
          Stop marking hidden channels as read
        </SwitchItem>
        <SwitchItem
          note="Collapse hidden category by default (requires sorting order as an extra category)."
          {...Utils.useSetting(SettingValues, "alwaysCollapse", defaultSettings.alwaysCollapse)}>
          Collapse Hidden Category
        </SwitchItem>
        <SwitchItem
          note="Show Empty Category either because there were no channels in it or all channels are under the hidden channels category."
          {...Utils.useSetting(
            SettingValues,
            "shouldShowEmptyCategory",
            defaultSettings.shouldShowEmptyCategory,
          )}>
          Show Empty Category
        </SwitchItem>
        <SwitchItem
          note="Enables debug mode, which will log more information to the console."
          {...Utils.useSetting(SettingValues, "debugMode", defaultSettings.debugMode)}>
          Enable Debug Mode
        </SwitchItem>
      </Category>
      <Category title="Choose what channels you want to display" open={false}>
        {Object.keys(SettingValues.get("channels", defaultSettings.channels)).map(
          (type: keyof typeof defaultSettings.channels) => (
            <SwitchItem
              key={type}
              {...Utils.useSetting(
                SettingValues,
                `channels.${type}`,
                defaultSettings.channels[type],
              )}>
              {`Show ${Utils.capitalizeFirst(type.split("_")[1])}${
                type.split("_").length === 3 ? ` ${Utils.capitalizeFirst(type.split("_")[2])}` : ""
              } Channels`}
            </SwitchItem>
          ),
        )}
      </Category>
      <Category title="Guilds Blacklist" open={false}>
        <SearchableGuilds SettingManager={SettingValues} path="blacklistedGuilds" />
      </Category>
      <ButtonItem
        button="Reload discord"
        onClick={() => {
          window.location.reload();
        }}>
        Some Settings Might require a reload to take effect.
      </ButtonItem>
    </div>
  );
};

export default { registerSettings, Settings };
