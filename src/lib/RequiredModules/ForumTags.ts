import { webpack } from "replugged";

export type Tags = React.ComponentType<{
  key?: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  selected?: boolean;
  tag?: { name?: string; id?: string };
}>;

export interface ForumTags {
  Tag: Tags;
  Tags: (...args: unknown[]) => unknown;
}

const mod = await webpack
  .waitForModule<ForumTags>(webpack.filters.bySource("forum-tag"), {
    timeout: 10000,
  })
  .catch(() => {
    throw new Error("Failed To Find ForumTags Module");
  });

export default {
  Tag: webpack.getComponentBySource(mod, "onContextMenu:"),
  Tags: webpack.getComponentBySource(mod, "tags:"),
};
