import { types as DefaultTypes } from "replugged";
export { types as DefaultTypes } from "replugged";
export { ReactElement, ComponentClass } from "react";
import { ComponentClass, ReactElement } from "react";
export interface UnreadStore {
  ackMessageId: DefaultTypes.AnyFunction;
  getAllReadStates: DefaultTypes.AnyFunction;
  getForDebugging: DefaultTypes.AnyFunction;
  getGuildChannelUnreadState: DefaultTypes.AnyFunction;
  getMentionCount: DefaultTypes.AnyFunction;
  getOldestUnreadMessageId: DefaultTypes.AnyFunction;
  getOldestUnreadTimestamp: DefaultTypes.AnyFunction;
  getReadStatesByChannel: DefaultTypes.AnyFunction;
  getTrackedAckMessageId: DefaultTypes.AnyFunction;
  getUnreadCount: DefaultTypes.AnyFunction;
  hasNotableUnread: DefaultTypes.AnyFunction;
  hasOpenedThread: DefaultTypes.AnyFunction;
  hasRecentlyVisitedAndRead: DefaultTypes.AnyFunction;
  hasRelevantUnread: DefaultTypes.AnyFunction;
  hasTrackedUnread: DefaultTypes.AnyFunction;
  hasUnread: DefaultTypes.AnyFunction;
  hasUnreadPins: DefaultTypes.AnyFunction;
  initialize: DefaultTypes.AnyFunction;
  isEstimated: DefaultTypes.AnyFunction;
  isForumPostUnread: DefaultTypes.AnyFunction;
  isNewForumThread: DefaultTypes.AnyFunction;
  lastMessageId: DefaultTypes.AnyFunction;
  lastPinTimestamp: DefaultTypes.AnyFunction;
}
export interface Channel {
  defaultAutoArchiveDuration: undefined | number;
  defaultThreadRateLimitPerUser: undefined | number;
  flags_: number;
  id: string;
  lastMessageId: string;
  lastPinTimestamp: string;
  memberListId: undefined | string;
  name: string;
  nsfw_: boolean;
  permissionOverwrites_: {
    [key: string | number]: {
      allow: bigint;
      deny: bigint;
      id: string;
      type: number;
    };
  };
  guild_id: string;
  position_: number;
  rateLimitPerUser_: number;
  topic_: string;
  type: number;
  version: undefined | number;
  accessPermissions: bigint;
  bitrate: number;
  flags: number;
  nsfw: boolean;
  permissionOverwrites: {
    [key: string | number]: {
      allow: bigint;
      deny: bigint;
      id: string;
      type: number;
    };
  };
  position: number;
  rateLimitPerUser: number;
  topic: undefined | string;
  userLimit: number;
  availableTags: Array<{
    name: string;
  }>;
  isHidden: () => boolean;
  isGuildVocal: () => boolean;
}
export interface PermissionUtils {
  ALL: number;
  ALLOW: string;
  DEFAULT: string;
  DENY: string;
  NONE: number;
  PASSTHROUGH: string;
  VIEW_GUILD_SETTINGS: number;
  applyThreadPermissions: DefaultTypes.AnyFunction;
  areChannelsLocked: DefaultTypes.AnyFunction;
  can: DefaultTypes.AnyFunction;
  canEveryone: DefaultTypes.AnyFunction;
  canEveryoneRole: DefaultTypes.AnyFunction;
  canManageACategory: DefaultTypes.AnyFunction;
  computePermissions: DefaultTypes.AnyFunction;
  computePermissionsForRoles: DefaultTypes.AnyFunction;
  getGuildVisualOwnerId: DefaultTypes.AnyFunction;
  getHighestHoistedRole: DefaultTypes.AnyFunction;
  getHighestRole: DefaultTypes.AnyFunction;
  isRoleHigher: DefaultTypes.AnyFunction;
  makeEveryoneOverwrite: DefaultTypes.AnyFunction;
}
export interface ChannelStore {
  getAllThreadsForParent: DefaultTypes.AnyFunction;
  getBasicChannel: DefaultTypes.AnyFunction;
  getCachedChannelJsonForGuild: DefaultTypes.AnyFunction;
  getChannel: (e: string) => Channel;
  getDMFromUserId: DefaultTypes.AnyFunction;
  getDMUserIds: DefaultTypes.AnyFunction;
  getGuildChannelsVersion: DefaultTypes.AnyFunction;
  getInitialOverlayState: DefaultTypes.AnyFunction;
  getMutableBasicGuildChannelsForGuild: DefaultTypes.AnyFunction;
  getMutableGuildChannelsForGuild: DefaultTypes.AnyFunction;
  getMutablePrivateChannels: DefaultTypes.AnyFunction;
  getPrivateChannelsVersion: DefaultTypes.AnyFunction;
  getSortedPrivateChannels: DefaultTypes.AnyFunction;
  hasChannel: DefaultTypes.AnyFunction;
  hasRestoredGuild: DefaultTypes.AnyFunction;
  initialize: DefaultTypes.AnyFunction;
  loadAllGuildAndPrivateChannelsFromDisk: DefaultTypes.AnyFunction;
}
export interface PermissionStore {
  can: DefaultTypes.AnyFunction;
  canAccessGuildSettings: DefaultTypes.AnyFunction;
  canBasicChannel: DefaultTypes.AnyFunction;
  canImpersonateRole: DefaultTypes.AnyFunction;
  canManageUser: DefaultTypes.AnyFunction;
  canWithPartialContext: DefaultTypes.AnyFunction;
  computePermissions: DefaultTypes.AnyFunction;
  getChannelPermissions: DefaultTypes.AnyFunction;
  getChannelsVersion: DefaultTypes.AnyFunction;
  getGuildPermissionProps: DefaultTypes.AnyFunction;
  getPermissionUtils: DefaultTypes.AnyFunction;
  getGuildVersion: DefaultTypes.AnyFunction;
  getHighestRole: DefaultTypes.AnyFunction;
  initialize: DefaultTypes.AnyFunction;
  isRoleHigher: DefaultTypes.AnyFunction;
  clearVars: DefaultTypes.AnyFunction;
}
export interface MessageActions {
  clearChannel: DefaultTypes.AnyFunction;
  crosspostMessage: DefaultTypes.AnyFunction;
  deleteMessage: DefaultTypes.AnyFunction;
  dismissAutomatedMessage: DefaultTypes.AnyFunction;
  editMessage: DefaultTypes.AnyFunction;
  endEditMessage: DefaultTypes.AnyFunction;
  fetchMessages: DefaultTypes.AnyFunction;
  focusMessage: DefaultTypes.AnyFunction;
  getSendMessageOptionsForReply: DefaultTypes.AnyFunction;
  jumpToMessage: DefaultTypes.AnyFunction;
  jumpToPresent: DefaultTypes.AnyFunction;
  patchMessageAttachments: DefaultTypes.AnyFunction;
  receiveMessage: DefaultTypes.AnyFunction;
  revealMessage: DefaultTypes.AnyFunction;
  sendBotMessage: DefaultTypes.AnyFunction;
  sendClydeError: DefaultTypes.AnyFunction;
  sendGreetMessage: DefaultTypes.AnyFunction;
  sendInvite: DefaultTypes.AnyFunction;
  sendMessage: DefaultTypes.AnyFunction;
  sendStickers: DefaultTypes.AnyFunction;
  startEditMessage: DefaultTypes.AnyFunction;
  suppressEmbeds: DefaultTypes.AnyFunction;
  trackInvite: DefaultTypes.AnyFunction;
  trackJump: DefaultTypes.AnyFunction;
  truncateMessages: DefaultTypes.AnyFunction;
  updateEditMessage: DefaultTypes.AnyFunction;
  _sendMessage: DefaultTypes.AnyFunction;
  _tryFetchMessagesCached: DefaultTypes.AnyFunction;
}
export interface RouteExports {
  exports: {
    [key: string]: DefaultTypes.AnyFunction;
  };
}
export interface GuildStore {
  getGuild: (guildId: string) => Guild;
  getGuildCount: DefaultTypes.AnyFunction;
  getGuilds: DefaultTypes.AnyFunction;
  isLoaded: DefaultTypes.AnyFunction;
}
export interface ChannelUtils {
  channelTopic: (channel: Channel, guild: Guild) => ReactElement;
}
export interface GuildMemberStore {
  getCommunicationDisabledUserMap: DefaultTypes.AnyFunction;
  getCommunicationDisabledVersion: DefaultTypes.AnyFunction;
  getMember: DefaultTypes.AnyFunction;
  getMemberIds: DefaultTypes.AnyFunction;
  getMemberRoleWithPendingUpdates: DefaultTypes.AnyFunction;
  getMembers: DefaultTypes.AnyFunction;
  getMutableAllGuildsAndMembers: DefaultTypes.AnyFunction;
  getNick: DefaultTypes.AnyFunction;
  getNicknameGuildsMapping: DefaultTypes.AnyFunction;
  getNicknames: DefaultTypes.AnyFunction;
  getPendingRoleUpdates: DefaultTypes.AnyFunction;
  getSelfMember: DefaultTypes.AnyFunction;
  getTrueMember: DefaultTypes.AnyFunction;
  initialize: DefaultTypes.AnyFunction;
  isMember: DefaultTypes.AnyFunction;
  memberOf: DefaultTypes.AnyFunction;
}
export interface UserMentions {
  handleUserContextMenu: DefaultTypes.AnyFunction;
  react: (
    info: {
      userId: string;
      channelId: string;
    },
    AnyFunction: DefaultTypes.AnyFunction,
    styles: {
      noStyleAndInteraction: boolean;
    },
  ) => ReactElement;
}
export interface User {
  avatar: string;
  avatarDecoration: undefined | string;
  bot: boolean;
  desktop: boolean;
  discriminator: string;
  email: null | string;
  flags: number;
  guildMemberAvatars: {
    [key: number]: string;
  };
  hasBouncedEmail: boolean;
  hasFlag: DefaultTypes.AnyFunction;
  id: string;
  isStaff: DefaultTypes.AnyFunction;
  isStaffPersonal: DefaultTypes.AnyFunction;
  mfaEnabled: boolean;
  mobile: boolean;
  nsfwAllowed: undefined | boolean;
  personalConnectionId: null | string;
  phone: null | string;
  premiumType: undefined | number;
  premiumUsageFlags: number;
  publicFlags: number;
  purchasedFlags: number;
  system: boolean;
  username: string;
  verified: boolean;
  createdAt: Date;
  tag: string;
}
export interface permissionOverwrite {
  allow: bigint;
  deny: bigint;
  id: string;
  type: number;
}
export interface Voice {
  getAveragePing: DefaultTypes.AnyFunction;
  getChannelId: DefaultTypes.AnyFunction;
  getDuration: DefaultTypes.AnyFunction;
  getGuildId: DefaultTypes.AnyFunction;
  getHostname: DefaultTypes.AnyFunction;
  getLastPing: DefaultTypes.AnyFunction;
  getMediaSessionId: DefaultTypes.AnyFunction;
  getOutboundLossRate: DefaultTypes.AnyFunction;
  getPacketStats: DefaultTypes.AnyFunction;
  getPings: DefaultTypes.AnyFunction;
  getQuality: DefaultTypes.AnyFunction;
  getRTCConnection: DefaultTypes.AnyFunction;
  getRTCConnectionId: DefaultTypes.AnyFunction;
  getRemoteDisconnectVoiceChannelId: DefaultTypes.AnyFunction;
  getState: DefaultTypes.AnyFunction;
  getVoiceStateStats: DefaultTypes.AnyFunction;
  getWasEverMultiParticipant: DefaultTypes.AnyFunction;
  getWasEverRtcConnected: DefaultTypes.AnyFunction;
  initialize: DefaultTypes.AnyFunction;
  isConnected: DefaultTypes.AnyFunction;
  isDisconnected: DefaultTypes.AnyFunction;
}
export interface ChannelIconArgs2 {
  hasActiveThreads: undefined | boolean;
  locked: undefined | boolean;
}
export interface ChannelListCategory {
  categoriesById: {
    [key: string]: Channel;
  };
  channels: {
    [key: string]: ChannelRecord;
  };
  guild?: ChannelList;
  id?: string;
  hiddenChannelIds: null | string[];
  isCollapsed: boolean;
  isMuted: boolean;
  position: number;
  shownChannelIds: string[];
  shouldShowEmptyCategory: DefaultTypes.AnyFunction;
}
export interface ChannelRecord {
  category: ChannelListCategory;
  id: string;
  position: number;
  record: Channel;
  renderLevel: number;
  subtitle: null | string;
  threadCount: number;
  threadIds: string[];
  isCollapsed: boolean;
  isFirstVoiceChannel: boolean;
  isMuted: boolean;
}
export interface ChannelList {
  guildChannels: {
    allChannelsById: null | string[];
    categories: { [key: string]: ChannelListCategory };
    collapsedCategoryIds: { [key: string]: boolean };
    communitySection: {
      directoryChannels: string[];
      communityRows: string[];
    };
    favoriteChannelIds: Set<string>;
    favoritesCategory: ChannelListCategory;
    favoritesSectionNumber: number;
    firstVoiceChannel: undefined | Channel;
    hideMutedChannels: boolean;
    hideResourceChannels: boolean;
    id: string;
    mutedChannelIds: Set<string>;
    noParentCategory: ChannelListCategory;
    optInEnabled: boolean;
    optedInChannels: Set<string>;
    recentsCategory: ChannelListCategory;
    recentsSectionNumber: number;
    rows: string[];
    sections: number[];
    sortedNamedCategories: ChannelListCategory[];
    suggestedFavoriteChannelId: null | string;
    version: number;
    voiceChannelsCategory: ChannelListCategory;
    voiceChannelsSectionNumber: number;
    initializationData: {
      activeJoinedRelevantThreads: object;
      activeJoinedUnreadThreads: object;
      selectedChannel: Channel;
      selectedVoiceChannelId: null | string;
    };
  };
  guildChannelsVersion: number;
}
export interface CategoryStore {
  getCollapsedCategories: DefaultTypes.AnyFunction;
  getState: DefaultTypes.AnyFunction;
  initialize: DefaultTypes.AnyFunction;
  isCollapsed: DefaultTypes.AnyFunction;
}
export interface ChannelTypes {
  ANNOUNCEMENT_THREAD: number;
  DM: number;
  GROUP_DM: number;
  GUILD_ANNOUNCEMENT: number;
  GUILD_CATEGORY: number;
  GUILD_DIRECTORY: number;
  GUILD_FORUM: number;
  GUILD_STAGE_VOICE: number;
  GUILD_STORE: number;
  GUILD_TEXT: number;
  GUILD_VOICE: number;
  PRIVATE_THREAD: number;
  PUBLIC_THREAD: number;
  UNKNOWN: number;
}
export interface GuildChannelsStore {
  getAllGuilds: DefaultTypes.AnyFunction;
  getChannels: (guildId: string) => GuildChannels;
  getDefaultChannel: DefaultTypes.AnyFunction;
  getSelectableChannelIds: DefaultTypes.AnyFunction;
  getSelectableChannels: DefaultTypes.AnyFunction;
  getTextChannelNameDisambiguations: DefaultTypes.AnyFunction;
  getVocalChannelIds: DefaultTypes.AnyFunction;
  hasCategories: DefaultTypes.AnyFunction;
  hasChannels: DefaultTypes.AnyFunction;
  hasElevatedPermissions: DefaultTypes.AnyFunction;
  hasSelectableChannel: DefaultTypes.AnyFunction;
  initialize: DefaultTypes.AnyFunction;
}
export interface ChannelListStore {
  getGuild: DefaultTypes.AnyFunction;
  getGuildWithoutChangingCommunityRows: DefaultTypes.AnyFunction;
  initialize: DefaultTypes.AnyFunction;
  recentsChannelCount: DefaultTypes.AnyFunction;
  clearVars: DefaultTypes.AnyFunction;
}
export interface ChanneListCache {
  lastSelectedChannelId: string;
  lastSelectedVoiceChannelId: string;
  state: {
    guilds: {
      [key: string]: {
        allChannelsById: null | string[];
        categories: { [key: string]: ChannelListCategory };
        collapsedCategoryIds: { [key: string]: boolean };
        communitySection: {
          directoryChannels: string[];
          communityRows: string[];
        };
        favoriteChannelIds: Set<string>;
        favoritesCategory: ChannelListCategory;
        favoritesSectionNumber: number;
        firstVoiceChannel: undefined | Channel;
        hideMutedChannels: boolean;
        hideResourceChannels: boolean;
        id: string;
        mutedChannelIds: Set<string>;
        noParentCategory: ChannelListCategory;
        optInEnabled: boolean;
        optedInChannels: Set<string>;
        recentsCategory: ChannelListCategory;
        recentsSectionNumber: number;
        rows: string[];
        sections: number[];
        sortedNamedCategories: ChannelListCategory[];
        suggestedFavoriteChannelId: null | string;
        version: number;
        voiceChannelsCategory: ChannelListCategory;
        voiceChannelsSectionNumber: number;
        initializationData: {
          activeJoinedRelevantThreads: object;
          activeJoinedUnreadThreads: object;
          selectedChannel: Channel;
          selectedVoiceChannelId: null | string;
        };
      };
    };
  };
}
export interface HiddenChannels {
  channels: Channel[];
  amount: number;
}
export interface HiddenChannelRecord extends HiddenChannels {
  records: {
    [key: string]: ChannelRecord;
  };
}
export interface PermsssionCache {
  channelCache: {
    [key: string]: number;
  };
  channelsVersion: number;
  guildCache: {
    [key: string]: number;
  };
  guildVersions: {
    [key: string]: number;
  };
}
export interface ChannelConstructorProps {
  guild_id?: string;
  id: string;
  name: string;
  type: number;
}
export type ChannelConstructor = new (ChannelConstructorProps: ChannelConstructorProps) => Channel;
export interface GuildChannel {
  channel: Channel;
  comparator: number;
}
export interface GuildChannels {
  4: GuildChannel[];
  SELECTABLE: GuildChannel[];
  VOCAL: GuildChannel[];
  count: number;
  id: string;
}
export interface ChannelListClasses {
  betaTag: string;
  container: string;
  dropdownButton: string;
  dropdownWrapperHighlighted: string;
  hubContainer: string;
  lowerPriceBoostingImg: string;
  lowerPriceBoostingTooltip: string;
  lowerPriceBoostingTooltipHeader: string;
  stageDescription: string;
  stageUpsellInline: string;
  tooltip: string;
  tooltipAsset: string;
  tooltipContainer: string;
  tooltipHeaderContainer: string;
  tooltipIntegrationsPermissionsAsset: string;
  tooltipOverrideColor: string;
  tooltipVideo: string;
  varUpsell: string;
  varUpsellBody: string;
  varUpsellTitle: string;
  varUpsellTooltip: string;
  viewAllChannelsButton: string;
  visibilityHidden: string;
}
export interface genericObjectExport {
  [key: string | number]: DefaultTypes.AnyFunction;
}
export interface collapsedCategoryIds {
  [key: string]: boolean;
}
export interface LocaleManager {
  Messages: DefaultTypes.ObjectExports;
  loadPromise: DefaultTypes.ObjectExports;
  _chosenLocale: string;
  _events: DefaultTypes.ObjectExports;
  _eventsCount: number;
  _getMessages: DefaultTypes.AnyFunction;
  _getParsedMessages: DefaultTypes.AnyFunction;
  _handleNewListener: DefaultTypes.AnyFunction;
  _languages: Array<{
    code: string;
    enabled: boolean;
    englishName: string;
    name: string;
    postgresLang: string;
  }>;
  _maxListeners: undefined | string;
  _provider: DefaultTypes.ObjectExports;
  _requestedLocale: string;
}
export interface LoadingBoundaryProps {
  children: React.ReactNode;
}

export interface LoadingBoundaryState {
  loaded: boolean;
}
export interface TextElement extends ComponentClass {
  Colors: {
    ALWAYS_WHITE: string;
    BRAND: string;
    CUSTOM: null | string;
    ERROR: string;
    HEADER_PRIMARY: string;
    HEADER_SECONDARY: string;
    INTERACTIVE_ACTIVE: string;
    INTERACTIVE_NORMAL: string;
    LINK: string;
    MUTED: string;
    STANDARD: string;
    STATUS_GREEN: string;
    STATUS_RED: string;
    STATUS_YELLOW: string;
  };
  Sizes: {
    SIZE_10: string;
    SIZE_12: string;
    SIZE_14: string;
    SIZE_16: string;
    SIZE_20: string;
    SIZE_24: string;
    SIZE_32: string;
  };
}
export interface Role {
  color: number;
  colorString: null | string;
  flags: number;
  hoist: boolean;
  icon: null | string;
  id: string;
  managed: boolean;
  mentionable: boolean;
  name: string;
  originalPosition: number;
  permissions: bigint;
  position: number;
  tags: {
    bot_id?: string;
  };
  unicodeEmoji: null | string;
}
export interface Guild {
  afkChannelId: null | string;
  afkTimeout: number;
  applicationCommandCounts: {
    [key: number]: number;
  };
  application_id: null | string;
  banner: string;
  defaultMessageNotifications: number;
  description: string;
  discoverySplash: null | boolean;
  explicitContentFilter: number;
  features: Set<string>;
  homeHeader: null | string;
  hubType: null | number;
  icon: string;
  id: string;
  joinedAt: Date;
  latestOnboardingQuestionId: null | string;
  maxMembers: number;
  maxStageVideoChannelUsers: number;
  maxVideoChannelUsers: number;
  mfaLevel: number;
  name: string;
  nsfwLevel: number;
  ownerId: string;
  preferredLocale: string;
  premiumProgressBarEnabled: boolean;
  premiumSubscriberCount: number;
  premiumTier: number;
  publicUpdatesChannelId: string;
  roles: {
    [key: string]: Role;
  };
  rulesChannelId: string;
  safetyAlertsChannelId: null | string;
  splash: null | string;
  systemChannelFlags: number;
  systemChannelId: string;
  vanityURLCode: string;
  verificationLevel: number;
  acronym: string;
  getApplicationId: DefaultTypes.AnyFunction;
  getIconSource: DefaultTypes.AnyFunction;
  getIconURL: DefaultTypes.AnyFunction;
  getMaxEmojiSlots: DefaultTypes.AnyFunction;
  getMaxRoleSubscriptionEmojiSlots: DefaultTypes.AnyFunction;
  getRole: DefaultTypes.AnyFunction;
  hasCommunityInfoSubheader: DefaultTypes.AnyFunction;
  hasFeature: DefaultTypes.AnyFunction;
  hasVerificationGate: DefaultTypes.AnyFunction;
  isLurker: DefaultTypes.AnyFunction;
  isNew: DefaultTypes.AnyFunction;
  isOwner: DefaultTypes.AnyFunction;
  isOwnerWithRequiredMfaLevel: DefaultTypes.AnyFunction;
  toString: DefaultTypes.AnyFunction;
}
export interface LockscreenProps {
  channel: Channel;
  guild: Guild;
}
export interface SwitchItem extends ComponentClass {
  value: boolean;
  onChange: (e: boolean) => void;
  note?: string;
  tooltipNote?: string;
  disabled?: boolean;
  hideBorder?: boolean;
  style?: React.CSSProperties;
  className?: string;
  children?: ReactElement;
}
export interface IconSwitch extends SwitchItem {
  title: string;
  icon?: string;
}
export interface IconUtils {
  getAnimatableSourceWithFallback: DefaultTypes.AnyFunction;
  getApplicationIconSource: DefaultTypes.AnyFunction;
  getApplicationIconURL: DefaultTypes.AnyFunction;
  getAvatarDecorationURL: DefaultTypes.AnyFunction;
  getChannelIconSource: DefaultTypes.AnyFunction;
  getChannelIconURL: DefaultTypes.AnyFunction;
  getDefaultAvatarURL: (number: number) => string;
  getEmojiURL: DefaultTypes.AnyFunction;
  getGameAssetSource: DefaultTypes.AnyFunction;
  getGameAssetURL: DefaultTypes.AnyFunction;
  getGuildBannerSource: DefaultTypes.AnyFunction;
  getGuildBannerURL: DefaultTypes.AnyFunction;
  getGuildDiscoverySplashSource: DefaultTypes.AnyFunction;
  getGuildDiscoverySplashURL: DefaultTypes.AnyFunction;
  getGuildHomeHeaderSource: DefaultTypes.AnyFunction;
  getGuildHomeHeaderURL: DefaultTypes.AnyFunction;
  getGuildIconSource: DefaultTypes.AnyFunction;
  getGuildIconURL: (Guild: Guild) => string;
  getGuildMemberAvatarSource: DefaultTypes.AnyFunction;
  getGuildMemberAvatarURL: DefaultTypes.AnyFunction;
  getGuildMemberAvatarURLSimple: DefaultTypes.AnyFunction;
  getGuildMemberBannerURL: DefaultTypes.AnyFunction;
  getGuildSplashSource: DefaultTypes.AnyFunction;
  getGuildSplashURL: DefaultTypes.AnyFunction;
  getGuildTemplateIconSource: DefaultTypes.AnyFunction;
  getGuildTemplateIconURL: DefaultTypes.AnyFunction;
  getUserAvatarColor: DefaultTypes.AnyFunction;
  getUserAvatarSource: DefaultTypes.AnyFunction;
  getUserAvatarURL: DefaultTypes.AnyFunction;
  getUserBannerURL: DefaultTypes.AnyFunction;
  getVideoFilterAssetURL: DefaultTypes.AnyFunction;
  hasAnimatedGuildIcon: DefaultTypes.AnyFunction;
  isAnimatedIconHash: DefaultTypes.AnyFunction;
  makeSource: DefaultTypes.AnyFunction;
}
export interface BigIntUtils {
  add: DefaultTypes.AnyFunction;
  combine: DefaultTypes.AnyFunction;
  deserialize: DefaultTypes.AnyFunction;
  equals: DefaultTypes.AnyFunction;
  filter: DefaultTypes.AnyFunction;
  getFlag: DefaultTypes.AnyFunction;
  has: DefaultTypes.AnyFunction;
  hasAny: DefaultTypes.AnyFunction;
  invert: DefaultTypes.AnyFunction;
  remove: DefaultTypes.AnyFunction;
}
export interface Settings {
  hiddenChannelIcon: string;
  sort: string;
  showPerms: boolean;
  showAdmin: string;
  stopMarkingUnread: boolean;
  shouldShowEmptyCategory: boolean;
  alwaysCollapse: boolean;
  debugMode: boolean;
  channels: {
    GUILD_TEXT: boolean;
    GUILD_VOICE: boolean;
    GUILD_ANNOUNCEMENT: boolean;
    GUILD_STORE: boolean;
    GUILD_STAGE_VOICE: boolean;
    GUILD_FORUM: boolean;
  };
  blacklistedGuilds: {
    [key: string]: boolean;
  };
  collapsed: {
    [key: string]: boolean;
  };
}
