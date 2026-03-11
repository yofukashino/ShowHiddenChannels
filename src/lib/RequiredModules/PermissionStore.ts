import { webpack } from "replugged";

import type Types from "@Types";

export interface PermissionStore extends Types.Store {
  clearVars?: () => void;
  can: (permission: bigint, channel: Partial<Types.Channel>, original?: boolean) => boolean;
}

export default await webpack.waitForStore<PermissionStore>("PermissionStore");
