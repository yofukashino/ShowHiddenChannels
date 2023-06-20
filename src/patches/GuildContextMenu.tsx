import { PluginInjectorUtils } from "../index";
import shcContextMenuEntry from "../Components/MenuItem";
import * as Types from "../types";
export const patchGuildContextMenu = (): void => {
  PluginInjectorUtils.addMenuItem(
    Types.DefaultTypes.ContextMenuTypes.GuildContext,
    (data, menu) => {
      const ItemGroup = (menu.children as Types.ReactElement[]).find((element) =>
        element?.props?.children?.some?.((item) => item?.props?.id === "hide-muted-channels"),
      );
      const HideMutedIndex =
        Array.isArray(ItemGroup?.props?.children) &&
        ItemGroup?.props?.children?.findIndex((item) => item?.props?.id === "hide-muted-channels");
      if (!HideMutedIndex) return;
      ItemGroup?.props?.children.splice(
        HideMutedIndex + 1,
        0,
        shcContextMenuEntry(data.guild as Types.Guild, menu.navId),
      );
    },
  );
  PluginInjectorUtils.addMenuItem(
    Types.DefaultTypes.ContextMenuTypes.GuildHeaderPopout,
    (data, menu) => {
      const ItemGroup = (menu.children as Types.ReactElement[]).find((element) =>
        element?.props?.children?.some?.((item) => item?.props?.id === "hide-muted-channels"),
      );
      const HideMutedIndex =
        Array.isArray(ItemGroup?.props?.children) &&
        ItemGroup?.props?.children?.findIndex((item) => item?.props?.id === "hide-muted-channels");
      if (!HideMutedIndex) return;
      ItemGroup?.props?.children.splice(
        HideMutedIndex + 1,
        0,
        shcContextMenuEntry(data.guild as Types.Guild, menu.navId),
      );
    },
  );
};
