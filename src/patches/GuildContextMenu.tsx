import { PluginInjectorUtils } from "../index";
import shcContextMenuEntry from "../Components/MenuItem";
import Types from "../types";
export default (): void => {
  const addContextMenuItem = (data: Record<string, unknown>, menu: Types.MenuProps): void => {
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
      shcContextMenuEntry(data.guild as Types.Guild),
    );
  };
  PluginInjectorUtils.addMenuItem(
    Types.DefaultTypes.ContextMenuTypes.GuildContext,
    addContextMenuItem,
  );
  PluginInjectorUtils.addMenuItem(
    Types.DefaultTypes.ContextMenuTypes.GuildHeaderPopout,
    addContextMenuItem,
  );
};
