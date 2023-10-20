import { components, util } from "replugged";
import { SettingValues } from "../index";
import { defaultSettings } from "../lib/consts";
import Types from "../types";
const {
  ContextMenu: { MenuCheckboxItem },
} = components;

export default (guild: Types.Guild, menuID: string): React.ReactElement => {
  const blacklistedGuilds = SettingValues.get(
    "blacklistedGuilds",
    defaultSettings.blacklistedGuilds,
  );
  const state = {
    value: blacklistedGuilds[guild.id],
    forceUpdate: () => util.forceUpdateElement(`[id="${menuID}"]`),
  };
  const onChange = (value: boolean): void => {
    state.value = value;
    blacklistedGuilds[guild.id] = value;
    SettingValues.set("blacklistedGuilds", blacklistedGuilds);
    state.forceUpdate();
  };
  return (
    <MenuCheckboxItem
      {...{
        id: "hidden-channel-toggle",
        label: "Hide Hidden Channels",
        checked: state.value,
        action: () => onChange(!state.value),
      }}
    />
  );
};
