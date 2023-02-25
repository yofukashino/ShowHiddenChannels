//import { patchMessageAPI } from "./API";
import { patchChannel } from "./Channel";
import { patchChannelCategories } from "./ChannelsCategories";
import { patchPermissions } from "./Permissions";
import { patchUnreadStore } from "./UnreadStore";
import { patchVisuals } from "./Visuals";
export { addSHCEntry } from "./GuildContextMenu";
export const applyInjections = (): void => {
  //patchMessageAPI();
  patchChannel();
  patchChannelCategories();
  patchPermissions();
  patchUnreadStore();
  patchVisuals();
};
