import { MemberMemos } from "./lib/requiredModules";
import Types from "./types";

export const _assignMemberRow = (
  fn: Types.DefaultTypes.AnyFunction,
): Types.DefaultTypes.AnyFunction => {
  Object.defineProperty(MemberMemos, "MemberRow", {
    get: () => fn,
    set: (value) => (fn = value),
    configurable: true,
  });
  return fn;
};
