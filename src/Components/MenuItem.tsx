import { ContextMenu } from "replugged/components";
import { SettingValues } from "../index";
import Utils from "../lib/utils";
import Types from "../types";

export default (
  { guild }: Record<string, unknown> & { guild: Types.Guild },
  menu: Types.MenuProps,
): void => {
  const [value, onChange] = Utils.useSettingArray(
    SettingValues,
    `blacklistedGuilds.${guild.id}`,
    false,
  );
  const ItemGroup = (menu.children as React.ReactElement[]).find((element) =>
    element?.props?.children?.some?.((item) => item?.props?.id === "hide-muted-channels"),
  );
  const HideMutedIndex =
    Array.isArray(ItemGroup?.props?.children) &&
    ItemGroup?.props?.children?.findIndex((item) => item?.props?.id === "hide-muted-channels");
  if (!HideMutedIndex) return;
  ItemGroup.props.children = ItemGroup?.props?.children.filter(
    (c) => c?.props?.id !== "hidden-channel-toggle",
  );
  ItemGroup?.props?.children.splice(
    HideMutedIndex + 1,
    0,
    <ContextMenu.MenuCheckboxItem
      id="hidden-channel-toggle"
      label="Hide Hidden Channels"
      checked={value}
      action={() => onChange(!value)}
    />,
  );
};
