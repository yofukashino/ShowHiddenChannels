import { util, webpack } from "replugged";

export type IconClasses = Record<
  | "actionIcon"
  | "alwaysShown"
  | "channelInfo"
  | "containerDefault"
  | "containerDragAfter"
  | "containerDragBefore"
  | "containerUserOver"
  | "disableClick"
  | "disabled"
  | "iconBase"
  | "iconItem"
  | "iconLive"
  | "iconVisibility"
  | "openChatIconItem"
  | "selected"
  | "subtitleHasThreads"
  | "summary",
  string
>;

export default await webpack
  .waitForModule<IconClasses>(webpack.filters.bySource("iconItem_"), {
    timeout: 10000,
  })
  .then((c) => util.mapClassNames(c))
  .catch(() => {
    throw new Error("Failed To Find IconClasses Module");
  });
