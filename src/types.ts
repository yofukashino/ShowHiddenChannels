import { types } from "replugged";
import type util from "replugged/util";
import type * as flux from "replugged/dist/renderer/modules/common/flux";
import type GeneralDiscordTypes from "discord-types/general";

import type { DefaultSettings } from "@Consts";

import type { CategoryCollapseStore } from "@lib/RequiredModules/CategoryCollapseStore";
import type { ChannelButtonClasses } from "@lib/RequiredModules/ChannelButtonClasses";
import type { ChannelItem } from "@lib/RequiredModules/ChannelItem";
import type { ChannelListClasses } from "@lib/RequiredModules/ChannelListClasses";
import type { ChannelListStore } from "@lib/RequiredModules/ChannelListStore";
import type { ChannelLocked } from "@lib/RequiredModules/ChannelLocked";
import type { Channels } from "@lib/RequiredModules/Channels";
import type { ChannelUtils } from "@lib/RequiredModules/ChannelUtils";
import type { ChatContentLayer } from "@lib/RequiredModules/ChatContentLayer";
import type { ForumTags } from "@lib/RequiredModules/ForumTags";
import type { GuildCategoryStore } from "@lib/RequiredModules/GuildCategoryStore";
import type { GuildChannelStore } from "@lib/RequiredModules/GuildChannelStore";
import type { GuildMemberStore } from "@lib/RequiredModules/GuildMemberStore";
import type { IconClasses } from "@lib/RequiredModules/IconClasses";
import type { IconUtils } from "@lib/RequiredModules/IconUtils";
import type { PermissionStore } from "@lib/RequiredModules/PermissionStore";
import type { PermissionUtils } from "@lib/RequiredModules/PermissionUtils";
import type { ProfileActions } from "@lib/RequiredModules/ProfileActions";
import type { ReadStateStore } from "@lib/RequiredModules/ReadStateStore";
import type { RolePill } from "@lib/RequiredModules/RolePill";
import type { RolePillClasses } from "@lib/RequiredModules/RolePillClasses";
import type { Router } from "@lib/RequiredModules/Router";
import type { RoutingUtils } from "@lib/RequiredModules/RoutingUtils";
import type { RTCConnectionStore } from "@lib/RequiredModules/RTCConnectionStore";
import type { UserGuildSettingsStore } from "@lib/RequiredModules/UserGuildSettingsStore";
import type { UserProfile } from "@lib/RequiredModules/UserProfile";

export namespace Types {
  export import DefaultTypes = types;
  export type Tree = util.Tree;
  export type ReactTree = util.ReactTree;
  export type Store = flux.Store;
  export type Channel = GeneralDiscordTypes.Channel &
    Partial<{
      availableTags: Array<{
        name: string;
        id: string;
      }>;
      isGuildVocal: () => boolean;
    }>;
  export type Guild = GeneralDiscordTypes.Guild;
  export type Role = GeneralDiscordTypes.Role;
  export type User = GeneralDiscordTypes.User & { globalName?: string };

  export interface Popout extends React.ComponentClass<{
    targetElementRef: React.Ref<unknown>;
    align?: string;
    renderPopout: DefaultTypes.AnyFunction;
    children: DefaultTypes.AnyFunction;
    animation?: string;
    autoInvert?: boolean;
    nudgeAlignIntoViewport?: boolean;
    position?: string;
    positionKey?: string;
    spacing?: number;
  }> {
    Animation: {
      FADE: string;
      NONE: string;
      SCALE: string;
      TRANSLATE: string;
    };

    defaultProps: {
      animation: string;
      autoInvert: boolean;
      nudgeAlignIntoViewport: boolean;
      position: string;
      positionKey?: string;
      spacing: number;
    };
  }

  export interface PermissionOverwrite {
    id: string;
    type: number;
    deny: bigint;
    allow: bigint;
  }

  export type Settings = typeof DefaultSettings & {
    blacklistedGuilds: Record<string, boolean>;
    collapsed: Record<string, boolean>;
  };

  export interface Modules {
    Proxy: Exclude<Modules, "Proxy" | "loadModules">;
    loadModules: () => Promise<void>;
    CategoryCollapseStore: CategoryCollapseStore;
    ChannelButtonClasses: ChannelButtonClasses;
    ChannelItem: ChannelItem;
    ChannelListClasses: ChannelListClasses;
    ChannelListStore: ChannelListStore;
    ChannelLocked: ChannelLocked;
    Channels: Channels;
    ChannelUtils: ChannelUtils;
    ChatContentLayer: ChatContentLayer;
    ForumTags: ForumTags;
    GuildCategoryStore: GuildCategoryStore;
    GuildChannelStore: GuildChannelStore;
    GuildMemberStore: GuildMemberStore;
    IconClasses: IconClasses;
    IconUtils: IconUtils;
    PermissionStore: PermissionStore;
    PermissionUtils: PermissionUtils;
    ProfileActions: ProfileActions;
    ReadStateStore: ReadStateStore;
    RolePill: RolePill;
    RolePillClasses: RolePillClasses;
    Router: Router;
    RoutingUtils: RoutingUtils;
    RTCConnectionStore: RTCConnectionStore;
    UserGuildSettingsStore: UserGuildSettingsStore;
    UserProfile: UserProfile;
  }
}
export default Types;
