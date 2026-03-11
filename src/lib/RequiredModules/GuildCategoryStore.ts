import { webpack } from "replugged";

import type Types from "@Types";

export interface GuildCategoryStore extends Types.Store {
  clearVars?: () => void;
}

export default await webpack.waitForStore<GuildCategoryStore>("GuildCategoryStore");
