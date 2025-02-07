import { webpack } from "replugged";
import {
  React,
  channels as UltimateChannelStore,
  users as UltimateUserStore,
  components,
} from "replugged/common";
import { ErrorBoundary, Flex, FormItem, Modal, Text } from "replugged/components";
import { SettingValues } from "../index";
import { defaultSettings } from "../lib/consts";
import NothingButWaumpus from "./NothingButWaumpus";
import User from "./User";
import Modules from "../lib/requiredModules";
import Utils from "../lib/utils";
import Types from "../types";

export const TabBarItems = ({
  channel,
  ...props
}: {
  channel: Types.Channel;
}): React.ReactElement[] => {
  const { DiscordConstants } = Modules;
  const TabBar = webpack.getFunctionBySource<Types.TabBar>(components, "this.tabBarRef");
  const items = [];
  items.push(
    <TabBar.Item id="general" className={`shc-details-tabbar-item`} key="general" {...props}>
      General Information
    </TabBar.Item>,
  );
  if (SettingValues.get("showPerms", defaultSettings.showPerms) && channel.permissionOverwrites) {
    items.push(
      <TabBar.Item id="users" className={`shc-details-tabbar-item`} key="users" {...props}>
        Users
      </TabBar.Item>,
    );
    items.push(
      <TabBar.Item id="channel" className={`shc-details-tabbar-item`} key="channel" {...props}>
        Channel Specific
      </TabBar.Item>,
    );
    if (
      SettingValues.get("showAdmin", defaultSettings.showAdmin) !== "false" &&
      SettingValues.get("showAdmin", defaultSettings.showAdmin) !== "channel"
    )
      items.push(
        <TabBar.Item id="admin" className={`shc-details-tabbar-item`} key="admin" {...props}>
          Admins
        </TabBar.Item>,
      );
  }

  if (channel?.type === DiscordConstants.ChannelTypes.GUILD_FORUM)
    items.push(
      <TabBar.Item id="forum" className={`shc-details-tabbar-item`} key="forum" {...props}>
        Forum Tags
      </TabBar.Item>,
    );
  return items;
};
export const Tab = ({
  tab,
  channel,
  guild,
}: {
  tab: string;
  channel: Types.Channel;
  guild: Types.Guild;
}): React.ReactElement => {
  const {
    DiscordConstants,
    GuildMemberStore,
    GuildStore,
    PermissionUtils,
    ProfileActions,
    RolePill,
    RolePillClasses,
    LocaleManager,
    ForumTagsModule,
  } = Modules;
  const ForumTags = webpack.getFunctionBySource<Types.ForumTags>(
    ForumTagsModule,
    "FORUM_TAG_A11Y_FILTER_BY_TAG",
  );
  const [channelSpecificRole, setChannelSpecificRole] = React.useState<Types.Role[]>([]);
  const [adminRole, setAdminRole] = React.useState<Types.Role[]>([]);
  const [user, setUser] = React.useState<Types.User[]>([]);
  const mapOverwrites = async () => {
    const showAdmin = SettingValues.get("showAdmin", defaultSettings.showAdmin);

    const { roleOverwrites, userOverwrites } = Object.values(channel.permissionOverwrites).reduce(
      (acc, overwrite) => {
        if (overwrite?.type === 0) {
          acc.roleOverwrites.push(overwrite);
        } else if (overwrite?.type === 1) {
          acc.userOverwrites.push(overwrite);
        }
        return acc;
      },
      { roleOverwrites: [], userOverwrites: [] },
    );

    const channelRoles = roleOverwrites.reduce((acc, role) => {
      const roleObj = GuildStore.getRole(guild.id, role.id);
      const hasAdmin = roleObj.permissions
        .toString()
        .includes(DiscordConstants.Permissions.ADMINISTRATOR.toString());
      const canViewChannel =
        role.allow.toString().includes(DiscordConstants.Permissions.VIEW_CHANNEL.toString()) ||
        (roleObj.permissions
          .toString()
          .includes(DiscordConstants.Permissions.VIEW_CHANNEL.toString()) &&
          !role.deny.toString().includes(DiscordConstants.Permissions.VIEW_CHANNEL.toString()));

      if ((showAdmin !== "false" && hasAdmin) || canViewChannel) {
        acc.push(roleObj);
      }

      return acc;
    }, []);

    setChannelSpecificRole(channelRoles);

    if (showAdmin !== "false") {
      const adminRoles = Object.values(GuildStore.getRoles(guild.id)).filter((role) => {
        const isAdmin = role.permissions
          .toString()
          .includes(DiscordConstants.Permissions.ADMINISTRATOR.toString());
        const showInclude = showAdmin === "include";
        const showExclude = showAdmin === "exclude" && !role.tags?.bot_id;

        return isAdmin && (showInclude || showExclude);
      });

      setAdminRole(adminRoles);
    }

    for (const user of userOverwrites) {
      if (!UltimateUserStore.getUser(user.id))
        await ProfileActions.fetchProfile(user.id, {
          guildId: guild.id,
          withMutualGuilds: false,
        });
    }

    const filteredUserOverwrites = userOverwrites.filter((user) => {
      const ultimateUser = UltimateUserStore.getUser(user.id);
      return (
        PermissionUtils.can({
          permission: DiscordConstants.Permissions.VIEW_CHANNEL,
          user: ultimateUser,
          context: channel,
        }) && GuildMemberStore.isMember(guild.id, user.id)
      );
    });

    if (filteredUserOverwrites.length) {
      setUser(filteredUserOverwrites.map((user) => UltimateUserStore.getUser(user.id)));
    }
  };

  React.useEffect(() => {
    mapOverwrites();
  }, [channel.id, guild.id]);

  switch (tab) {
    case "general": {
      return (
        <FormItem title="General Info About the channel" className="shc-details-content-header">
          <Flex
            className="shc-detailFlex shc-generalDetails"
            justify={Flex.Justify.AROUND}
            wrap={Flex.Wrap.WRAP}>
            <FormItem title="Slowmode">
              <Text.Normal>{Utils.convertToHMS(channel.rateLimitPerUser ?? 0)}</Text.Normal>
            </FormItem>
            <FormItem title="Bitrate">
              <Text.Normal>{`${Number(channel.bitrate) / 1000}`} Kbps</Text.Normal>
            </FormItem>
            <FormItem title="User Limit">
              <Text.Normal>{`${Number(channel.userLimit)}`} Users</Text.Normal>
            </FormItem>
            {channel.lastPinTimestamp && (
              <FormItem title="Last Message Pinned">
                <Text.Normal>
                  {new Date(channel.lastPinTimestamp).toLocaleString(LocaleManager._chosenLocale)}
                </Text.Normal>
              </FormItem>
            )}
            <FormItem title="Parent Category">
              <Text.Normal>
                {UltimateChannelStore.getChannel(channel?.parent_id)?.name ?? "None"}
              </Text.Normal>
            </FormItem>
            <FormItem title="Age Restriction">
              <Text.Normal>{channel.nsfw ? "18+" : "13+"}</Text.Normal>
            </FormItem>
          </Flex>
        </FormItem>
      );
    }
    case "users": {
      return (
        <FormItem
          title="Users that have specific overwrites for this channel"
          className="shc-details-content-header">
          <Flex className="shc-detailFlex">
            {user.length ? (
              user.map((user) => <User user={user} guildId={guild.id} channelId={channel.id} />)
            ) : (
              <NothingButWaumpus />
            )}
          </Flex>
        </FormItem>
      );
    }
    case "channel": {
      return (
        <FormItem
          title="Roles that have specific overwrites for this channel"
          className="shc-details-content-header">
          <Flex className="shc-detailFlex">
            {channelSpecificRole.length ? (
              channelSpecificRole.map((role) => (
                <RolePill
                  key={role.id}
                  canRemove={false}
                  className={`${RolePillClasses.role} shc-rolePill`}
                  disableBorderColor={true}
                  guildId={guild.id}
                  onRemove={() => null}
                  role={role}
                />
              ))
            ) : (
              <NothingButWaumpus />
            )}
          </Flex>
        </FormItem>
      );
    }
    case "admin": {
      return (
        <FormItem
          title="Administrative Roles with server wide access"
          className="shc-details-content-header">
          <Flex className="shc-detailFlex">
            {adminRole.length ? (
              adminRole.map((role) => (
                <RolePill
                  key={role.id}
                  canRemove={false}
                  className={`${RolePillClasses.role} shc-rolePill`}
                  disableBorderColor={true}
                  guildId={guild.id}
                  onRemove={() => null}
                  role={role}
                />
              ))
            ) : (
              <NothingButWaumpus />
            )}
          </Flex>
        </FormItem>
      );
    }
    case "forum": {
      return (
        <FormItem
          title="Tags Available in this forum channel"
          className="shc-details-content-header">
          <Flex className="shc-detailFlex">
            {channel?.availableTags.length ? (
              channel?.availableTags?.map?.((tag) => (
                <ForumTags key={tag.id} selected={false} tag={tag} />
              ))
            ) : (
              <NothingButWaumpus />
            )}
          </Flex>
        </FormItem>
      );
    }
    default: {
      return <NothingButWaumpus />;
    }
  }
};
export default React.memo((props: Types.DetailsPopoutProps) => {
  const { ChannelItem } = Modules;
  const TabBar = webpack.getFunctionBySource<Types.TabBar>(components, "this.tabBarRef");
  const ChannelItemIcon = webpack.getFunctionBySource<Types.ChannelItem["ChannelItemIcon"]>(
    ChannelItem,
    ".iconContainerWithGuildIcon,",
  );
  const [open, setOpen] = React.useState<string>("general");
  return (
    <Modal.ModalRoot className="shc-details-modal" size="large" {...props}>
      <Modal.ModalHeader className="shc-details-header">
        <Text.H2
          style={{
            marginTop: 10,
          }}>
          <Flex style={{ alignItems: "center" }}>
            <ChannelItemIcon
              channel={props.channel}
              guild={props.guild}
              original={true}
              hasActiveThreads={false}
              locked={false}
              className="shc-details-channelIcon"
            />
            {props.channel.name}'s Details
          </Flex>
        </Text.H2>
        <Modal.ModalCloseButton onClick={props.onClose} />
      </Modal.ModalHeader>
      <TabBar
        type="top"
        look="brand"
        className={`shc-details-tabbar`}
        selectedItem={open}
        onItemSelect={setOpen}>
        <TabBarItems channel={props.channel} />
      </TabBar>
      <Modal.ModalContent>
        <ErrorBoundary>
          <div key={open}>
            <Tab tab={open} channel={props.channel} guild={props.guild} />
          </div>
        </ErrorBoundary>
      </Modal.ModalContent>
    </Modal.ModalRoot>
  );
});
