import { webpack } from "replugged";
import { React, channels, constants, guilds, i18n, users } from "replugged/common";
import {
  ErrorBoundary,
  Field,
  Flex,
  Loader,
  Modal,
  Stack,
  TabBar,
  Text,
} from "replugged/components";
import { SettingValues } from "@this";
import { DefaultSettings } from "@Consts";
import {
  ChannelItem,
  ForumTags,
  GuildMemberStore,
  PermissionUtils,
  ProfileActions,
  RolePill,
  RolePillClasses,
} from "@lib/RequiredModules";
import Utils from "@Utils";
import NothingButWaumpus from "@components/NothingButWaumpus";
import User from "@components/User";

import type Types from "@Types";
import type { ChannelItemIcon } from "@lib/RequiredModules/ChannelItem";

import "./DetailsPopout.css";

const { ChannelTypes, Permissions } = constants;

const TabTypes = {
  GENERAL: "general",
  USERS: "users",
  CHANNEL: "channel",
  ADMIN: "admin",
  FORUM: "forum",
};

export const GeneralTab = ({ channel }: { channel: Types.Channel }): React.ReactElement => {
  return (
    <Stack gap={24}>
      <Field
        layout="horizontal"
        description="The time (in seconds) users must wait before sending another message in this text channel"
        label="Slowmode">
        <Text.Normal>{Utils.convertToHMS(channel.rateLimitPerUser ?? 0)}</Text.Normal>
      </Field>
      <Field
        layout="horizontal"
        description="The audio quality of this voice channel, measured in kilobits per second (Kbps)"
        label="Bitrate">
        <Text.Normal>{`${channel.bitrate / 1000}`} Kbps</Text.Normal>
      </Field>
      <Field
        layout="horizontal"
        description="The maximum number of members that can opacity: 0.5;join this voice channel at once, A value of 0 means there's no limit"
        label="User Limit">
        <Text.Normal>{`${channel.userLimit}`} Users</Text.Normal>
      </Field>
      {channel.lastPinTimestamp && (
        <Field
          layout="horizontal"
          description="The date and time when the last pinned message was added to this channel"
          label="Last Message Pinned">
          <Text.Normal>
            {new Date(channel.lastPinTimestamp).toLocaleString(i18n.intl.currentLocale as string)}
          </Text.Normal>
        </Field>
      )}
      <Field
        layout="horizontal"
        description="The category this channel belongs to (like “Voice Channels” or “Text Channels”)"
        label="Parent Category">
        <Text.Normal>{channels.getChannel(channel?.parent_id)?.name ?? "None"}</Text.Normal>
      </Field>
      <Field
        layout="horizontal"
        description="NSFW channels are hidden behind a warning and require users to confirm they're 18+"
        label="Age Restriction">
        <Text.Normal>{channel.nsfw ? "18+" : "13+"}</Text.Normal>
      </Field>
    </Stack>
  );
};

const UserOverwriteTab = ({
  channel,
  guild,
}: {
  channel: Types.Channel;
  guild: Types.Guild;
}): React.ReactElement => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [overwriteUsers, setOverwriteUsers] = React.useState<Types.User[]>([]);
  const mapUsers = async (): Promise<void> => {
    const userOverwrites = [];
    for (const overwrite of Object.values(channel.permissionOverwrites)) {
      if (overwrite?.type !== 1) continue;
      if (!users.getUser(overwrite.id))
        await ProfileActions.fetchProfile(overwrite.id, {
          guildId: guild.id,
          withMutualGuilds: false,
        });

      const user = users.getUser(overwrite.id);
      if (
        PermissionUtils.can({
          permission: Permissions.VIEW_CHANNEL,
          user,
          context: channel,
        }) &&
        GuildMemberStore.isMember(guild.id, overwrite.id)
      )
        userOverwrites.push(users.getUser(overwrite.id));
    }

    if (userOverwrites.length) setOverwriteUsers(userOverwrites);

    setLoading(false);
  };

  React.useEffect(() => {
    void mapUsers();
  }, [channel.id, guild.id]);

  if (loading)
    return (
      <Flex className="shc-detailFlex">
        <Loader />
      </Flex>
    );
  if (!overwriteUsers.length) return <NothingButWaumpus />;
  return (
    <Field helperText="Users that have specific overwrites for this channel">
      <Flex className="shc-detailFlex">
        {overwriteUsers.map((user) => (
          <User key={user.id} user={user} guildId={guild.id} channelId={channel.id} />
        ))}
      </Flex>
    </Field>
  );
};

const ChannelOverwriteRolesTab = ({
  channel,
  guild,
}: {
  channel: Types.Channel;
  guild: Types.Guild;
}): React.ReactElement => {
  const [channelSpecificRole, setChannelSpecificRole] = React.useState<Types.Role[]>([]);

  React.useEffect(() => {
    const channelRoles = Object.values(channel.permissionOverwrites).reduce((acc, overwrite) => {
      if (overwrite?.type !== 0) return acc;
      const ViewChannelString = Permissions.VIEW_CHANNEL.toString();
      const role = guilds.getRole(guild.id, overwrite.id);
      const canViewChannel =
        overwrite.allow.toString().includes(ViewChannelString) ||
        (role.permissions.toString().includes(ViewChannelString) &&
          !overwrite.deny.toString().includes(ViewChannelString));

      if (canViewChannel) acc.push(role);

      return acc;
    }, []);

    setChannelSpecificRole(channelRoles);
  }, [channel.id, guild.id]);

  if (!channelSpecificRole.length) return <NothingButWaumpus />;

  return (
    <Field helperText="Roles that have specific overwrites for this channel">
      <Flex className="shc-detailFlex">
        {channelSpecificRole.map((role) => (
          <RolePill.Pill
            key={role.id}
            canRemove={false}
            className={`${RolePillClasses.role} shc-rolePill`}
            disableBorderColor={true}
            guildId={guild.id}
            onRemove={() => null}
            role={role}
          />
        ))}
      </Flex>
    </Field>
  );
};

const AdminRolesTab = ({ guild }: { guild: Types.Guild }): React.ReactElement => {
  const [adminRole, setAdminRole] = React.useState<Types.Role[]>([]);

  React.useEffect(() => {
    const showAdmin = SettingValues.get("showAdmin", DefaultSettings.showAdmin);
    if (showAdmin === "false") return;

    const adminRoles = Object.values(guilds.getRolesSnapshot(guild.id)).filter((role) => {
      const isAdmin = role.permissions.toString().includes(Permissions.ADMINISTRATOR.toString());
      const showInclude = showAdmin === "include";
      const showExclude = showAdmin === "exclude" && !role.tags?.bot_id;

      return isAdmin && (showInclude || showExclude);
    });

    setAdminRole(adminRoles);
  }, [guild.id]);

  if (!adminRole.length) return <NothingButWaumpus />;
  return (
    <Field helperText="Administrative Roles with server wide access">
      <Flex className="shc-detailFlex">
        {adminRole.map((role) => (
          <RolePill.Pill
            key={role.id}
            canRemove={false}
            className={`${RolePillClasses.role} shc-rolePill`}
            disableBorderColor={true}
            guildId={guild.id}
            onRemove={() => null}
            role={role}
          />
        ))}
      </Flex>
    </Field>
  );
};

const ForumTagTab = ({ channel }: { channel: Types.Channel }): React.ReactElement => {
  if (!channel?.availableTags.length) return <NothingButWaumpus />;
  return (
    <Field helperText="Tags Available in this forum channel">
      <Flex className="shc-detailFlex">
        {channel?.availableTags?.map?.((tag) => (
          <ForumTags.Tag key={tag.id} selected={false} tag={tag} />
        ))}
      </Flex>
    </Field>
  );
};

export const TabBarItems = ({
  channel,
  ...props
}: {
  channel: Types.Channel;
}): React.ReactElement[] => {
  const showPerms = SettingValues.get("showPerms", DefaultSettings.showPerms);
  const showAdmin = SettingValues.get("showAdmin", DefaultSettings.showAdmin);
  const items = [];
  items.push(
    <TabBar.Item id={TabTypes.GENERAL} key={TabTypes.GENERAL} {...props}>
      General Information
    </TabBar.Item>,
  );
  if (showPerms && channel.permissionOverwrites) {
    items.push(
      <TabBar.Item id={TabTypes.USERS} key={TabTypes.USERS} {...props}>
        Users
      </TabBar.Item>,
    );
    items.push(
      <TabBar.Item id={TabTypes.CHANNEL} key={TabTypes.CHANNEL} {...props}>
        Channel Overwrite
      </TabBar.Item>,
    );
    if (showAdmin !== "false" && showAdmin !== "channel")
      items.push(
        <TabBar.Item id={TabTypes.ADMIN} key={TabTypes.ADMIN} {...props}>
          Admins
        </TabBar.Item>,
      );
  }

  if (channel?.type === ChannelTypes.GUILD_FORUM)
    items.push(
      <TabBar.Item id={TabTypes.FORUM} key={TabTypes.FORUM} {...props}>
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
  switch (tab) {
    case TabTypes.GENERAL:
      return <GeneralTab channel={channel} />;
    case TabTypes.USERS: {
      return <UserOverwriteTab channel={channel} guild={guild} />;
    }
    case TabTypes.CHANNEL:
      return <ChannelOverwriteRolesTab channel={channel} guild={guild} />;
    case TabTypes.ADMIN:
      return <AdminRolesTab guild={guild} />;
    case TabTypes.FORUM:
      return <ForumTagTab channel={channel} />;
    default:
      return <NothingButWaumpus />;
  }
};

export default React.memo(
  ({
    channel,
    guild,
    onClose,

    ...props
  }: {
    channel: Types.Channel;
    guild: Types.Guild;
    onClose?: (...args: unknown[]) => unknown;
    transitionState: number;
  }) => {
    const ChannelItemIcon = webpack.getComponentBySource<ChannelItemIcon>(
      ChannelItem,
      "containerClassName:",
    );

    const [open, setOpen] = React.useState<string>("general");

    return (
      <Modal.ModalRoot className="shc-details-modal" size="large" {...props}>
        <ErrorBoundary>
          <span className="shc-details-header">
            <Text color="text-strong" variant="heading-xl/bold">
              <Flex style={{ gap: "5px", alignItems: "center" }}>
                <ChannelItemIcon
                  channel={channel}
                  guild={guild}
                  original={true}
                  hasActiveThreads={false}
                  locked={false}
                  className="shc-details-channelIcon"
                />
                {channel.name}
              </Flex>
            </Text>
            <Modal.ModalCloseButton onClick={onClose} />
          </span>
          <TabBar
            type="top"
            look="brand"
            className="shc-details-tabbar"
            selectedItem={open}
            onItemSelect={setOpen}>
            <TabBarItems channel={channel} />
          </TabBar>
          <Modal.ModalContent>
            <div key={open} className="shc-details-content" {...{ tab: open }}>
              <Tab tab={open} channel={channel} guild={guild} />
            </div>
          </Modal.ModalContent>
        </ErrorBoundary>
      </Modal.ModalRoot>
    );
  },
);
