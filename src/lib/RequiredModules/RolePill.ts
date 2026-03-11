import { webpack } from "replugged";

import type Types from "@Types";

export type Pill = React.ComponentClass<{
  key: string;
  canRemove: boolean;
  className: string;
  disableBorderColor: boolean;
  guildId: string | number;
  onRemove: () => unknown;
  role: Types.Role;
}>;

export interface RolePill {
  Pill: Pill;
}

const mod = await webpack
  .waitForModule<RolePill>(
    webpack.filters.bySource("MemberRolesList: currentUser cannot be undefined"),
    {
      timeout: 10000,
    },
  )
  .catch(() => {
    throw new Error("Failed To Find RolePill Module");
  });

export default {
  Pill: webpack.getComponentBySource(mod, "canRemove:"),
};
