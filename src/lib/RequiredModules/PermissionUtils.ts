import type Types from "@Types";
import { webpack } from "replugged";

export interface PermissionUtils {
  can: (options: { permission: bigint; user: Types.User; context: Types.Channel }) => boolean;
}

const mod = await webpack
  .waitForModule(webpack.filters.bySource(".computeLurkerPermissionsAllowList()"), {
    timeout: 10000,
  })
  .catch(() => {
    throw new Error("Failed To Find PermissionUtils Module");
  });

export default {
  can: webpack.getFunctionBySource(mod, "excludeGuildPermissions:"),
  getGuildVisualOwnerId: webpack.getFunctionBySource(mod, ".ownerId"),
  getHighestHoistedRole: webpack.getFunctionBySource(mod, ".hoistRoleId?"),
  getHighestRole: webpack.getFunctionBySource(mod, ".position).first()"),
  isRoleHigher: webpack.getFunctionBySource(mod, /\w+\.indexOf\(\w+\.id\)>/),
} as PermissionUtils;
