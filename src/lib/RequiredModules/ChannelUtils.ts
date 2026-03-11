import type Types from "@Types";
import { webpack } from "replugged";

export interface ChannelUtils {
  renderTopic: (channel: Types.Channel, guild: Types.Guild) => React.ReactElement;
}

const mod = await webpack
  .waitForModule(webpack.filters.bySource(".GROUP_DM:return null"), {
    timeout: 10000,
  })
  .catch(() => {
    throw new Error("Failed To Find ChannelUtils Module");
  });

export default {
  renderTopic: webpack.getFunctionBySource(mod, ".GROUP_DM:return null"),
  HeaderGuildBreadcrumb: webpack.getFunctionBySource(mod, ".guildBreadcrumbIcon,"),
  renderTitle: webpack.getFunctionBySource(mod, ".__invalid_icon,"),
};
