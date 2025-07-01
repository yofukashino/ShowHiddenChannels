import { types } from "replugged";
import GeneralDiscordTypes from "discord-types/general";
import type { Store as StoreType } from "replugged/dist/renderer/modules/common/flux";
import { ContextMenuType } from "replugged/dist/renderer/modules/components/ContextMenu";
import { components } from "replugged/common";
import util from "replugged/util";

export namespace Types {
  export import DefaultTypes = types;
  export type MenuProps = React.ComponentProps<ContextMenuType["ContextMenu"]>;
  export type Tree = util.Tree;
  export type Store = StoreType;
  export type OriginalChannel = GeneralDiscordTypes.Channel;
  export type Guild = GeneralDiscordTypes.Guild;
  export type Role = GeneralDiscordTypes.Role;
  export type User = GeneralDiscordTypes.User & { globalName?: string };
  export type GenericModule = Record<string, DefaultTypes.AnyFunction> & {
    default: DefaultTypes.AnyFunction;
  };
  export interface GenericExport {
    exports?: GenericModule;
    id: string;
    loaded: boolean;
  }
  export type UserProfile = React.MemoExoticComponent<
    React.ComponentType<{ user: User; currentUser: User; channelId?: string; guildId?: string }>
  >;
  export interface TabBarProps extends React.HTMLAttributes<HTMLDivElement> {
    type: string;
    look?: string;
    selectedItem: string;
    onItemSelect: (newItem: string) => void;
  }

  export interface TabBarItemProps extends React.HTMLAttributes<HTMLDivElement> {
    id: string;
    key: string;
  }

  export interface TabBar {
    (props: TabBarProps): JSX.Element;
    Item: (props: TabBarItemProps) => JSX.Element;
  }

  export interface Popout
    extends React.ComponentClass<{
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
  export interface ReadStateStore extends Store {
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
  export interface Channel extends OriginalChannel {
    availableTags: Array<{
      name: string;
      id: string;
    }>;
    isHidden: () => boolean;
    isGuildVocal: () => boolean;
  }

  export interface MemberRow {
    key: string;
    user: User;
    colorString: string;
    colorRoleId: string;
    nick: string;
    premiumSince: string;
    status: unknown;
    isMobileOnline: unknown;
    activities: unknown;
    isOwner: boolean;
    applicationStream: null;
    channel: Channel;
    guildId: string;
  }
  export interface PermissionUtils {
    applyThreadPermissions?: DefaultTypes.AnyFunction;
    areChannelsLocked?: DefaultTypes.AnyFunction;
    can: DefaultTypes.AnyFunction;
    canEveryone?: DefaultTypes.AnyFunction;
    canEveryoneRole?: DefaultTypes.AnyFunction;
    canManageACategory?: DefaultTypes.AnyFunction;
    computePermissions?: DefaultTypes.AnyFunction;
    computePermissionsForRoles?: DefaultTypes.AnyFunction;
    getGuildVisualOwnerId?: DefaultTypes.AnyFunction;
    getHighestHoistedRole?: DefaultTypes.AnyFunction;
    getHighestRole?: DefaultTypes.AnyFunction;
    isRoleHigher?: DefaultTypes.AnyFunction;
    makeEveryoneOverwrite?: DefaultTypes.AnyFunction;
  }
  export interface ChannelStore extends Store {
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
  export interface PermissionStore extends Store {
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
    exports: Record<string, DefaultTypes.AnyFunction>;
  }
  export interface ChatContentArgs {
    channel: Channel;
    chatInputType: {
      analyticsName: string;
      attachments: boolean;
      autocomplete: { addReactionShortcut: boolean; forceChatLayer: boolean; reactions: boolean };
      commands: { enabled: boolean };
      drafts: { type: 0; autoSave: boolean };
      emojis: { button: boolean };
      gifs: { button: boolean; allowSending: boolean };
      gifts: { button: boolean };
      permissions: { requireSendMessages: boolean };
      sedReplace: boolean;
      showCharacterCount: boolean;
      showThreadPromptOnReply: boolean;
      stickers: { button: boolean; allowSending: boolean; autoSuggest: boolean };
      submit: {
        button: boolean;
        ignorePreference: boolean;
        disableEnterToSubmit: boolean;
        clearOnSubmit: boolean;
        useDisabledStylesOnSubmit: boolean;
      };
      uploadLongMessages: boolean;
      upsellLongMessages: { iconOnly: boolean };
    };
    guild: Guild;
  }
  export interface ChatContent {
    $$typeof: symbol;
    compare: null;
    type: (ChatContentArgs: ChatContentArgs) => React.ReactElement;
  }
  export interface RouteArgs {
    computedMatch: {
      isExact: boolean;
      params: {
        channelId: undefined | string;
        guildId: undefined | string;
        messageId: undefined | string;
      };

      path: string;
      url: string;
    };
    disableTrack: boolean;
    impressionName: string;
    location: {
      pathname: string;
      search: string;
      hash: string;
      state: undefined | string;
      key: string;
    };
    path: string;
    render: DefaultTypes.AnyFunction;
  }
  export interface UserGuildSettingsStore extends Store {
    allowAllMessages: DefaultTypes.AnyFunction;
    allowNoMessages: DefaultTypes.AnyFunction;
    getAllSettings: DefaultTypes.AnyFunction;
    getChannelFlags: DefaultTypes.AnyFunction;
    getChannelMessageNotifications: DefaultTypes.AnyFunction;
    getChannelMuteConfig: DefaultTypes.AnyFunction;
    getChannelOverrides: DefaultTypes.AnyFunction;
    getChannelUnreadSetting: DefaultTypes.AnyFunction;
    getGuildChannelFlags: DefaultTypes.AnyFunction;
    getGuildFavorites: DefaultTypes.AnyFunction;
    getGuildFlags: DefaultTypes.AnyFunction;
    getMessageNotifications: DefaultTypes.AnyFunction;
    getMuteConfig: DefaultTypes.AnyFunction;
    getMutedChannels: DefaultTypes.AnyFunction;
    getNewForumThreadsCreated: DefaultTypes.AnyFunction;
    getNotifyHighlights: DefaultTypes.AnyFunction;
    getOptedInChannels: DefaultTypes.AnyFunction;
    getOptedInChannelsWithPendingUpdates: DefaultTypes.AnyFunction;
    getPendingChannelUpdates: DefaultTypes.AnyFunction;
    getState: DefaultTypes.AnyFunction;
    initialize: DefaultTypes.AnyFunction;
    isCategoryMuted: DefaultTypes.AnyFunction;
    isChannelMuted: DefaultTypes.AnyFunction;
    isChannelOptedIn: DefaultTypes.AnyFunction;
    isChannelOrParentOptedIn: DefaultTypes.AnyFunction;
    isChannelRecordOrParentOptedIn: DefaultTypes.AnyFunction;
    isChannelRelevant: DefaultTypes.AnyFunction;
    isFavorite: DefaultTypes.AnyFunction;
    isGuildCollapsed: DefaultTypes.AnyFunction;
    isGuildOrCategoryOrChannelMuted: DefaultTypes.AnyFunction;
    isGuildUnreadSettingEnabled: DefaultTypes.AnyFunction;
    isMobilePushEnabled: DefaultTypes.AnyFunction;
    isMuteScheduledEventsEnabled: DefaultTypes.AnyFunction;
    isMuted: DefaultTypes.AnyFunction;
    isOptInEnabled: DefaultTypes.AnyFunction;
    isSuppressEveryoneEnabled: DefaultTypes.AnyFunction;
    isSuppressRolesEnabled: DefaultTypes.AnyFunction;
    resolvedMessageNotifications: DefaultTypes.AnyFunction;
  }
  export interface GuildStore extends Store {
    getGuild: (guildId: string) => Guild;
    getGuildCount: DefaultTypes.AnyFunction;
    getGuilds: DefaultTypes.AnyFunction;
    isLoaded: DefaultTypes.AnyFunction;
  }
  export interface GuildRoleStore extends Store {
    getAllGuildsRoles: DefaultTypes.AnyFunction;
    getRole: (guildId: string, roleId: string) => Role;
    getRoles: (guildId: string) => Role[];
    isLoaded: DefaultTypes.AnyFunction;
  }
  export interface ChannelUtils {
    renderTopic: (channel: Channel, guild: Guild) => React.ReactElement;
    HeaderGuildBreadcrumb: DefaultTypes.AnyFunction;
    renderTitle: DefaultTypes.AnyFunction;
  }
  export type RolePill = React.ComponentClass<{
    key: string;
    canRemove: boolean;
    className: string;
    disableBorderColor: boolean;
    guildId: string | number;
    onRemove: DefaultTypes.AnyFunction;
    role: Role;
  }>;

  export type ForumTags = React.ComponentType<{
    key?: string;
    className?: string;
    onClick?: DefaultTypes.AnyFunction;
    selected?: boolean;
    tag?: { name?: string; id?: string };
  }>;

  export interface ProfileActions {
    acceptAgreements: DefaultTypes.AnyFunction;
    fetchCurrentUser: DefaultTypes.AnyFunction;
    fetchProfile: DefaultTypes.AnyFunction;
    getUser: DefaultTypes.AnyFunction;
    setFlag: DefaultTypes.AnyFunction;
  }
  export interface GuildMemberStore extends Store {
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
  export interface permissionOverwrite {
    allow: bigint;
    deny: bigint;
    id: string;
    type: number;
  }
  export interface RTCConnectionStore extends Store {
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
      rows: string[][];
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
  export interface CategoryStore extends Store {
    getCollapsedCategories: DefaultTypes.AnyFunction;
    getState: DefaultTypes.AnyFunction;
    initialize: DefaultTypes.AnyFunction;
    isCollapsed: DefaultTypes.AnyFunction;
  }
  export interface DiscordConstants {
    Permissions: {
      ADD_REACTIONS: bigint;
      ADMINISTRATOR: bigint;
      ATTACH_FILES: bigint;
      BAN_MEMBERS: bigint;
      CHANGE_NICKNAME: bigint;
      CONNECT: bigint;
      CREATE_EVENTS: bigint;
      CREATE_GUILD_EXPRESSIONS: bigint;
      CREATE_INSTANT_INVITE: bigint;
      CREATE_PRIVATE_THREADS: bigint;
      CREATE_PUBLIC_THREADS: bigint;
      DEAFEN_MEMBERS: bigint;
      EMBED_LINKS: bigint;
      KICK_MEMBERS: bigint;
      MANAGE_CHANNELS: bigint;
      MANAGE_EVENTS: bigint;
      MANAGE_GUILD: bigint;
      MANAGE_GUILD_EXPRESSIONS: bigint;
      MANAGE_MESSAGES: bigint;
      MANAGE_NICKNAMES: bigint;
      MANAGE_ROLES: bigint;
      MANAGE_THREADS: bigint;
      MANAGE_WEBHOOKS: bigint;
      MENTION_EVERYONE: bigint;
      MODERATE_MEMBERS: bigint;
      MOVE_MEMBERS: bigint;
      MUTE_MEMBERS: bigint;
      PRIORITY_SPEAKER: bigint;
      READ_MESSAGE_HISTORY: bigint;
      REQUEST_TO_SPEAK: bigint;
      SEND_MESSAGES: bigint;
      SEND_MESSAGES_IN_THREADS: bigint;
      SEND_TTS_MESSAGES: bigint;
      SEND_VOICE_MESSAGES: bigint;
      SPEAK: bigint;
      STREAM: bigint;
      USE_APPLICATION_COMMANDS: bigint;
      USE_EMBEDDED_ACTIVITIES: bigint;
      USE_EXTERNAL_EMOJIS: bigint;
      USE_EXTERNAL_SOUNDS: bigint;
      USE_EXTERNAL_STICKERS: bigint;
      USE_SOUNDBOARD: bigint;
      USE_VAD: bigint;
      VIEW_AUDIT_LOG: bigint;
      VIEW_CHANNEL: bigint;
      VIEW_CREATOR_MONETIZATION_ANALYTICS: bigint;
      VIEW_GUILD_ANALYTICS: bigint;
    };
    ChannelTypes: {
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
    };
  }
  export interface ChannelItem {
    ChannelItemIcon:
      | React.ComponentType<{
          channel: Channel;
          guild: Guild;
          original: boolean;
          hasActiveThreads: boolean;
          locked: boolean;
        }> &
          DefaultTypes.AnyFunction;
    default: DefaultTypes.AnyFunction;
  }
  export interface ChannelItemUtil {
    getChannelIconComponent: DefaultTypes.AnyFunction;
    getChannelIconTooltipText: DefaultTypes.AnyFunction;
    getSimpleChannelIconComponent: DefaultTypes.AnyFunction;
  }
  export interface RoutingUtils {
    back: DefaultTypes.AnyFunction;
    forward: DefaultTypes.AnyFunction;
    getFingerprintLocation?: DefaultTypes.AnyFunction;
    getHistory?: DefaultTypes.AnyFunction;
    getLastRouteChangeSource?: DefaultTypes.AnyFunction;
    getLastRouteChangeSourceLocationStack?: DefaultTypes.AnyFunction;
    hasNavigated?: DefaultTypes.AnyFunction;
    isValidFingerprintRoute?: DefaultTypes.AnyFunction;
    replaceWith: DefaultTypes.AnyFunction;
    transitionTo: DefaultTypes.AnyFunction;
    transitionToGuild: DefaultTypes.AnyFunction;
  }
  export interface GuildChannelStore extends Store {
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
  export interface ChannelListStore extends Store {
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
          rows: string[][];
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
  export type ChannelConstructor = new (
    ChannelConstructorProps: ChannelConstructorProps,
  ) => Channel;
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
  export interface ChatClasses {
    avatar: string;
    channelEmoji: string;
    channelEmojiLeftOfIcon: string;
    channelEmojiRightOfIcon: string;
    channelName: string;
    channelTextArea: string;
    chat: string;
    chatContent: string;
    content: string;
    cursorPointer: string;
    editPartyIcon: string;
    followButton: string;
    form: string;
    forumPostTitle: string;
    guildBreadcrumbContainer: string;
    guildBreadcrumbIcon: string;
    loader: string;
    noChat: string;
    parentChannelName: string;
    status: string;
    threadSidebarFloating: string;
    threadSidebarOpen: string;
    title: string;
    titleWrapper: string;
    twemoji: string;
    typing: string;
    uploadArea: string;
  }
  export interface RolePillClasses {
    role: string;
    roleCircle: string;
    roleDot: string;
    roleFlowerStar: string;
    roleIcon: string;
    roleName: string;
    roleNameOverflow: string;
    roleRemoveButton: string;
    roleRemoveButtonCanRemove: string;
    roleRemoveIcon: string;
    roleRemoveIconFocused: string;
    roleVerifiedIcon: string;
  }
  export interface ChannelItemClasses {
    channelEmoji: string;
    channelEmojiLeftOfIcon: string;
    channelEmojiRightOfIcon: string;
    channelName: string;
    children: string;
    content: string;
    emojiColorFill: string;
    favoriteSuggestion: string;
    icon: string;
    iconContainer: string;
    mainContent: string;
    mainContentWithChannelEmoji: string;
    modeConnected: string;
    modeLocked: string;
    modeMuted: string;
    modeSelected: string;
    modeUnread: string;
    name: string;
    newBadge: string;
    notInteractive: string;
    numberBadge: string;
    responsiveWidthMobile: string;
    ripple: string;
    subtitle: string;
    topicDiv: string;
    topicText: string;
    twemoji: string;
    typeThread: string;
    unread: string;
    unreadRelevant: string;
    wrapper: string;
  }
  export interface ChannelButtonClasses {
    channelEmoji: string;
    channelEmojiLeftOfIcon: string;
    channelEmojiRightOfIcon: string;
    children: string;
    emojiColorFill: string;
    favoritesSuggestion: string;
    icon: string;
    iconContainer: string;
    link: string;
    linkBottom: string;
    linkTop: string;
    linkWithChannelEmoji: string;
    modeConnected: string;
    modeLocked: string;
    modeMuted: string;
    modeSelected: string;
    modeUnread: string;
    name: string;
    newBadge: string;
    notInteractive: string;
    numberBadge: string;
    responsiveWidthMobile: string;
    ripple: string;
    subtitle: string;
    topContent: string;
    twemoji: string;
    typeThread: string;
    unread: string;
    unreadRelevant: string;
    wrapper: string;
  }
  export interface IconClasses {
    actionIcon: string;
    alwaysShown: string;
    channelInfo: string;
    containerDefault: string;
    containerDragAfter: string;
    containerDragBefore: string;
    containerUserOver: string;
    disableClick: string;
    disabled: string;
    iconBase: string;
    iconItem: string;
    iconLive: string;
    iconVisibility: string;
    openChatIconItem: string;
    selected: string;
    subtitleHasThreads: string;
    summary: string;
  }
  export interface genericObjectExport extends Record<string | number, DefaultTypes.AnyFunction> {}
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
  export interface TextElement
    extends React.ComponentClass<{
      color?: string;
      size?: string;
      children: string | string[];
      style?: Record<string, string | number>;
    }> {
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
  export interface LockscreenProps {
    channel: Channel;
    guild: Guild;
  }
  export interface DetailsPopoutProps extends LockscreenProps {
    onClose?: DefaultTypes.AnyFunction;
  }
  export interface IconSwitch {
    title: string;
    icon?: string;
    value: boolean;
    onChange: (e: boolean) => void;
    note?: string;
    tooltipNote?: string;
    disabled?: boolean;
    hideBorder?: boolean;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactElement;
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

  export interface ScrollerClasses {
    listHeight: string;
    listItems: string;
    listWrapper: string;
    scroller: string;
  }
  export interface PopoutList extends React.ComponentClass {
    Divider: React.ComponentClass;
    Empty: React.ComponentClass;
    Item: React.ComponentClass;
    SearchBar: React.ComponentClass<{
      autoFocus?: boolean;
      placeholder?: string;
      query?: string;
      onChange?: (query: string) => void;
      onClear?: () => void;
    }>;
  }
  export type DiscordComponents = {
    Popout: Types.Popout;
    TabBar: TabBar;
    AdvancedScroller: React.ComponentClass;
    AdvancedScrollerAuto: React.ComponentClass;
    AdvancedScrollerNone: React.ComponentClass;
    AdvancedScrollerThin: React.ComponentClass;
    PopoutList: PopoutList;
    Scroller: React.ComponentClass;
    ScrollerAuto: React.ComponentClass;
    ScrollerNone: React.ComponentClass;
    ScrollerThin: React.ComponentClass;
  } & typeof components;

  export interface Modules {
    loadModules?: () => Promise<void>;
    DiscordConstantsModule?: GenericModule;
    DiscordConstants?: DiscordConstants;
    ChatClasses?: ChatClasses;
    Route?: GenericModule;
    ChannelIconLocked?: GenericModule;
    ChatContent?: ChatContent;
    ChannelItem?: GenericModule;
    ChannelItemUtil?: GenericModule;
    RolePillClasses?: RolePillClasses;
    ChannelButtonClasses?: ChannelButtonClasses;
    PermissionStore?: PermissionStore;
    PermissionUtilsModule?: GenericModule;
    PermissionUtils?: PermissionUtils;
    ChannelListClasses?: ChannelListClasses;
    LocaleManager?: LocaleManager;
    Channels?: GenericModule;
    ChannelListStore?: ChannelListStore;
    UserGuildSettingsStore?: UserGuildSettingsStore;
    IconUtils?: IconUtils;
    IconClasses?: IconClasses;
    ReadStateStore?: ReadStateStore;
    RTCConnectionStore?: RTCConnectionStore;
    GuildRoleStore?: GuildRoleStore;
    GuildStore?: GuildStore;
    RolePill?: RolePill;
    MessageActions?: MessageActions;
    GuildChannelStore?: GuildChannelStore;
    TextElement?: TextElement;
    CategoryStore?: CategoryStore;
    GuildMemberStore?: GuildMemberStore;
    ChannelStore?: ChannelStore;
    RoutingUtilsModule?: GenericModule;
    RoutingUtils?: RoutingUtils;
    ChannelUtilsModule?: GenericModule;
    ChannelUtils?: ChannelUtils;
    ForumTagsModule?: GenericModule;
    ProfileActionsModule?: GenericModule;
    ProfileActions?: ProfileActions;
    UserProfile?: UserProfile;
  }
  export type Jsonifiable =
    | null
    | undefined
    | boolean
    | number
    | string
    | Jsonifiable[]
    | { [key: string]: Jsonifiable };
  export type ValType<T> =
    | T
    | React.ChangeEvent<HTMLInputElement>
    | (Record<string, unknown> & { value?: T; checked?: T });

  export type NestedType<T, P> = P extends
    | `${infer Left}.${infer Right}`
    | `${infer Left}/${infer Right}`
    | `${infer Left}-${infer Right}`
    ? Left extends keyof T
      ? NestedType<T[Left], Right>
      : Left extends `${infer FieldKey}[${infer IndexKey}]`
      ? FieldKey extends keyof T
        ? NestedType<Exclude<T[FieldKey], undefined> extends infer U ? U : never, IndexKey>
        : undefined
      : undefined
    : P extends keyof T
    ? T[P]
    : P extends `${infer FieldKey}[${infer _IndexKey}]`
    ? FieldKey extends keyof T
      ? Exclude<T[FieldKey], undefined> extends infer U
        ? U
        : never
      : undefined
    : undefined;

  export interface Settings {
    hiddenChannelIcon: string;
    customHiddenChannelIcon: string;
    faded: boolean;
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
    blacklistedGuilds: Record<string, boolean>;
    collapsed: Record<string, boolean>;
  }
}
export default Types;
