import { common, components } from "replugged";
import { defaultSettings } from "./consts.jsx";
const { React } = common;
const {
  ContextMenu: { MenuCheckboxItem },
} = components;
import { shc } from "../index.jsx";
export const addSHCEntry = (guild) => {
  const blacklistedGuilds = shc.get("blacklistedGuilds", defaultSettings.blacklistedGuilds);
  const [toggleValue, setToggleValue] = React.useState(Boolean(blacklistedGuilds[guild.id]));
  return (
    <MenuCheckboxItem
      {...{
        id: "hidden-channel-toggle",
        label: "Hide Hidden Channels",
        checked: toggleValue,
        action: () => {
          blacklistedGuilds[guild.id] = !toggleValue;
          shc.set("blacklistedGuilds", blacklistedGuilds);
          setToggleValue(!toggleValue);
        },
      }}
    />
  );
};
