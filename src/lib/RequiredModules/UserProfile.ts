import { webpack } from "replugged";

import type Types from "@Types";

export type UserProfilePopout = React.MemoExoticComponent<
  React.FC<{
    user: Types.User;
    currentUser: Types.User;
    channelId?: string;
    guildId?: string;
  }>
>;

export interface UserProfile {
  Popout: UserProfilePopout;
}

export default {
  Popout: await webpack
    .waitForModule<UserProfilePopout>(webpack.filters.bySource("USER_PROFILE_POPOUT])"), {
      timeout: 10000,
    })
    .catch(() => {
      throw new Error("Failed To Find UserProfile Module");
    }),
};
