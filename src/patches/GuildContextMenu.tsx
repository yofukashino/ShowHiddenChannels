import { components } from "replugged";
import * as Utils from "../lib/utils";
import * as Types from "../types";
const {
  ContextMenu: { MenuCheckboxItem },
} = components;
import { SettingValues } from "../index";
export const addSHCEntry = (guild: Types.Guild): Types.ReactElement => {
  const { value, onChange } = Utils.useSetting(
    SettingValues,
    `blacklistedGuilds.${guild.id}`,
    false as unknown as string,
  );
  return (
    <MenuCheckboxItem
      {...{
        id: "hidden-channel-toggle",
        label: "Hide Hidden Channels",
        checked: value,
        action: () => onChange(!value as unknown as string),
      }}
    />
  );
};
