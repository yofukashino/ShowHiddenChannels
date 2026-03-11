import { util } from "replugged";
import { ContextMenu } from "replugged/components";
import { SettingValues } from "@this";

import type Types from "@Types";
import type { DefaultSettings } from "@Consts";

export const Item = ({ guild }: { guild: Types.Guild }): React.ReactElement => {
  if (!guild) return;
  const [value, onChange] = util.useSettingArray(
    SettingValues,
    `blacklistedGuilds.${guild.id}` as keyof typeof DefaultSettings,
    false,
  );
  return (
    <ContextMenu.MenuCheckboxItem
      id="hidden-channel-toggle"
      label="Hide Hidden Channels"
      checked={Boolean(value)}
      action={() => onChange(!value)}
    />
  );
};

export const GroupIndex = (menu): number => {
  return menu.children.findIndex((element) =>
    element?.props?.children?.some?.((item) => item?.props?.id === "hide-muted-channels"),
  );
};

export const ItemIndex = (menu): number => {
  const ItemGroup = menu.children[GroupIndex(menu)];

  const HideMutedIndex =
    Array.isArray(ItemGroup?.props?.children) &&
    (ItemGroup?.props?.children?.findIndex(
      (item) => item?.props?.id === "hide-muted-channels",
    ) as number);

  if (!HideMutedIndex) return;

  ItemGroup.props.children = ItemGroup?.props?.children.filter(
    (c) => c?.props?.id !== "hidden-channel-toggle",
  );

  return HideMutedIndex + 1;
};

export default { Item, GroupIndex, ItemIndex };
