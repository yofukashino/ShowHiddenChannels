import { webpack } from "replugged";

import type Types from "@Types";

export interface CategoryCollapseStore extends Types.Store {
  isCollapsed: (channelId: string) => boolean;
}

export default await webpack.waitForStore<CategoryCollapseStore>("CategoryCollapseStore");
