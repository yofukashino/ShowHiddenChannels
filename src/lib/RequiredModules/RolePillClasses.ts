import { util, webpack } from "replugged";

export type RolePillClasses = Record<
  | "role"
  | "roleTag"
  | "roleDot"
  | "roleFlowerStar"
  | "roleIcon"
  | "roleName"
  | "roleNameOverflow"
  | "roleRemoveButton"
  | "roleRemoveButtonCanRemove"
  | "roleRemoveIcon"
  | "roleRemoveIconFocused"
  | "roleVerifiedIcon",
  string
>;

export default await webpack
  .waitForModule<RolePillClasses>(webpack.filters.bySource("pillButton_"), {
    timeout: 10000,
  })
  .then((c) => util.mapClassNames(c))
  .catch(() => {
    throw new Error("Failed To Find RolePillClasses Module");
  });
