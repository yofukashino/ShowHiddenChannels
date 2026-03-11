import { PluginInjector, SettingValues } from "@this";
import { CategoryCollapseStore } from "@lib/RequiredModules";
import { DefaultSettings } from "@Consts";

PluginInjector.after(CategoryCollapseStore, "isCollapsed", ([channelId], res) => {
  const alwaysCollapse = SettingValues.get("alwaysCollapse", DefaultSettings.alwaysCollapse);
  if (!channelId?.endsWith("hidden") || !alwaysCollapse) return res;
  return alwaysCollapse && res;
});
