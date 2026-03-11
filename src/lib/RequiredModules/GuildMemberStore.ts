import { webpack } from "replugged";

import type Types from "@Types";

export interface GuildMemberStore extends Types.Store {
  isMember: (guildId: string, userId: string) => boolean;
}

export default await webpack.waitForStore<GuildMemberStore>("GuildMemberStore");
