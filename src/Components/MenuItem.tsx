import { components } from "replugged";
import { SettingValues } from "../index";
import Utils from "../lib/utils";
import Types from "../types";
const {
  ContextMenu: { MenuCheckboxItem },
} = components;

export default (guild: Types.Guild): React.ReactElement => {
  const { value, onChange } = Utils.useSetting(
    SettingValues,
    `blacklistedGuilds.${guild.id}`,
    false,
  );
  return (
    <MenuCheckboxItem
      id="hidden-channel-toggle"
      label="Hide Hidden Channels"
      checked={value}
      action={() => onChange(!value)}
    />
  );
};
