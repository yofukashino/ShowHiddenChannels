import { webpack } from "replugged";

import type Types from "@Types";

export interface IconUtils {
  getDefaultAvatarURL: (number: number) => string;
  getGuildIconURL: (Guild: Types.Guild) => string;
  getChannelIconURL: (channel: Types.Channel) => string;
  getUserAvatarURL: (user: Types.User) => string;
}

export default await webpack
  .waitForProps<IconUtils>(["getUserAvatarURL"], { timeout: 10000 })
  .catch(() => {
    throw new Error("Failed To Find IconUtils Module");
  });
