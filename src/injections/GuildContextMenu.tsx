import { PluginInjectorUtils } from "@this";
import ContextMenuEntry from "@components/MenuItem";
import Types from "@Types";

PluginInjectorUtils.addMenuItem(
  Types.DefaultTypes.ContextMenuTypes.GuildContext,
  ContextMenuEntry.Item,
  ContextMenuEntry.GroupIndex,
  ContextMenuEntry.ItemIndex,
);

PluginInjectorUtils.addMenuItem(
  Types.DefaultTypes.ContextMenuTypes.GuildHeaderPopout,
  ContextMenuEntry.Item,
  ContextMenuEntry.GroupIndex,
  ContextMenuEntry.ItemIndex,
);
