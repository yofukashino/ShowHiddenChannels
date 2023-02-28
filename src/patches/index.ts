import { patchMessageAPI } from "./MessageAPI";
import { patchChannel } from "./Channel";
import { patchChannelCategories } from "./ChannelsCategories";
import { patchPermissions } from "./Permissions";
import { patchUnreadStore } from "./UnreadStore";
import { patchVisuals } from "./Visuals";
export { addSHCEntry } from "./GuildContextMenu";
export const applyInjections = (): void => {
  patchChannel();
  patchChannelCategories();
  patchMessageAPI();
  patchPermissions();
  patchUnreadStore();
  patchVisuals();
};
