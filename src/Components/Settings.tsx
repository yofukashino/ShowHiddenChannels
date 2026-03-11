import { util } from "replugged";
import { React } from "replugged/common";
import {
  ButtonItem,
  Category,
  Notice,
  RadioGroup,
  Stack,
  Switch,
  TextInput,
} from "replugged/components";
import { PluginLogger, SettingValues } from "@this";
import { DefaultSettings } from "@Consts";
import SearchableGuilds from "@components/SearchableGuilds";

export const registerSettings = (): void => {
  type DefaultSettings = typeof DefaultSettings;
  type key = keyof DefaultSettings;
  type value = DefaultSettings[key];

  for (const key in DefaultSettings) {
    if (SettingValues.has(key as key)) return;
    PluginLogger.log(`Adding new setting ${key} with value ${DefaultSettings[key]}.`);
    SettingValues.set(key as key, DefaultSettings[key] as value);
  }
};

export const Settings = (): React.ReactElement => {
  const hiddenChannelImg = SettingValues.useValue(
    "hiddenChannelImg",
    DefaultSettings.hiddenChannelImg,
  );
  const hiddenChannelIcon = SettingValues.useValue(
    "hiddenChannelIcon",
    DefaultSettings.hiddenChannelIcon,
  );
  const showPerms = SettingValues.useValue("showPerms", DefaultSettings.showPerms);

  const disabled = React.useMemo(() => {
    return {
      customHiddenChannelImg: hiddenChannelImg !== "custom",
      customHiddenChannelIcon: hiddenChannelIcon !== "custom",
      showAdmin: !showPerms,
    };
  }, [hiddenChannelImg, hiddenChannelIcon]);

  return (
    <Stack gap={24}>
      <Category label="General Settings" open={false}>
        <Stack gap={24}>
          <RadioGroup
            label="Hidden Channel Image"
            description="What image to show in hidden channel's content."
            options={[
              { name: "Lock Icon", value: "lock" },
              { name: "Eye Icon", value: "eye" },
              { name: "Custom Icon", value: "custom" },
              { name: "None", value: "false" },
            ]}
            {...util.useSetting(
              SettingValues,
              "hiddenChannelImg",
              DefaultSettings.hiddenChannelImg,
            )}
          />

          <TextInput
            label="Custom Image Link"
            description="MUST BE IMAGE LINK! (Recommended Hosts are github, discord and imgur)."
            disabled={disabled.customHiddenChannelImg}
            placeholder="Enter Link of your custom image"
            {...util.useSetting(
              SettingValues,
              "customHiddenChannelImg",
              DefaultSettings.customHiddenChannelImg,
            )}
          />

          <RadioGroup
            label="Hidden Channel Icon"
            description="What icon to show as an indicator for hidden channels."
            options={[
              { name: "Lock Icon", value: "lock" },
              { name: "Eye Icon", value: "eye" },
              { name: "Custom Icon", value: "custom" },
              { name: "None", value: "false" },
            ]}
            {...util.useSetting(
              SettingValues,
              "hiddenChannelIcon",
              DefaultSettings.hiddenChannelIcon,
            )}
          />

          <TextInput
            label="Custom Icon Link"
            description={"MUST BE SVG LINK! (Recommended Hosts are github, discord and imgur)."}
            disabled={disabled.customHiddenChannelImg}
            placeholder="Enter Link of your custom icon"
            {...util.useSetting(
              SettingValues,
              "customHiddenChannelIcon",
              DefaultSettings.customHiddenChannelIcon,
            )}
          />

          <Switch
            label="Faded Channel"
            description="Fade away hidden channels like if they are muted."
            {...util.useSetting(SettingValues, "faded")}
          />

          <RadioGroup
            label="Sorting Order"
            description="Where to display Hidden Channels."
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
            {...util.useSetting(SettingValues, "sort", DefaultSettings.sort)}
          />

          <Switch
            label="Show Permissions"
            description="Show what roles/users can access the hidden channel."
            {...util.useSetting(SettingValues, "showPerms")}
          />

          <RadioGroup
            label="Show Admin Roles"
            description="Show roles that have ADMINISTRATOR permission in the hidden channel page (requires 'Shows Permission' enabled)."
            disabled={disabled.showAdmin}
            options={[
              { name: "Show only channel-specific roles", value: "channel" },
              { name: "Include Bot Roles", value: "include" },
              { name: "Exclude Bot Roles", value: "exclude" },
              { name: "Don't Show Administrator Roles", value: "false" },
            ]}
            {...util.useSetting(SettingValues, "showAdmin", DefaultSettings.showAdmin)}
          />

          <Switch
            label="Stop marking hidden channels as read"
            description="Stops the plugin from marking hidden channels as read."
            {...util.useSetting(
              SettingValues,
              "stopMarkingUnread",
              DefaultSettings.stopMarkingUnread,
            )}
          />
          <Switch
            label="Collapse Hidden Category"
            description="Collapse hidden category by default (requires sorting order as an extra category)."
            {...util.useSetting(SettingValues, "alwaysCollapse", DefaultSettings.alwaysCollapse)}
          />

          <Switch
            label="Show Empty Category"
            description="Show Empty Category either because there were no channels in it or all channels are under the hidden channels category."
            {...util.useSetting(
              SettingValues,
              "shouldShowEmptyCategory",
              DefaultSettings.shouldShowEmptyCategory,
            )}
          />
          <Switch
            label="Enable Debug Mode"
            description="Enables debug mode, which will log more information to the console."
            {...util.useSetting(SettingValues, "debugMode", DefaultSettings.debugMode)}
          />
        </Stack>
      </Category>
      <Category label="Choose what channels you want to display" open={false}>
        <Stack gap={24}>
          {Object.keys(SettingValues.get("channels", DefaultSettings.channels)).map(
            (type: keyof typeof DefaultSettings.channels) => (
              <Switch
                key={type}
                label={`Show ${type
                  .replace("GUILD_", "")
                  .split("_")
                  .map((w) => `${w[0].toUpperCase()}${w.slice(1).toLowerCase()}`)
                  .join(" ")} Channels`}
                {...util.useSetting(
                  SettingValues,
                  `channels.${type}`,
                  DefaultSettings.channels[type],
                )}
              />
            ),
          )}
        </Stack>
      </Category>
      <Category label="Guilds Blacklist" open={false}>
        <SearchableGuilds />
      </Category>
      {/*   <Switch
        label="Experimental Bypass"
        description="Experimental Bypass for Discord's Experiment 'Private Channel Hiding'."
        {...util.useSetting(SettingValues, "experimental", DefaultSettings.experimental)}/> */}
      <Notice messageType={Notice.HelpMessageTypes.INFO} className="shc-reloadNotice">
        <ButtonItem
          label="Some ettings might require a reload to take effect."
          button="Reload discord"
          onClick={() => {
            window.location.reload();
          }}
        />
      </Notice>
    </Stack>
  );
};

export default { registerSettings, Settings };
