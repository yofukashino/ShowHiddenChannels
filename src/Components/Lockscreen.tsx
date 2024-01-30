import { modal as ModalActions, React, users as UltimateUserStore } from "replugged/common";
import { Button } from "replugged/components";
import { PluginLogger, SettingValues } from "../index";
import { defaultSettings } from "../lib/consts";
import Types from "../types";

import {
  BigIntUtils,
  ChannelUtils,
  DiscordConstants,
  GuildMemberStore,
  PermissionUtils,
  PresenceStore,
  ProfileActions,
  RolePill,
  RolePillClasses,
  TextElement,
  UserMentions,
} from "../lib/requiredModules";
import Utils from "../lib/utils";
import DetailsPopout from "./DetailsPopout";

export default React.memo((props: Types.LockscreenProps) => {
  if (SettingValues.get("debugMode", defaultSettings.debugMode)) {
    PluginLogger.log("LockScreen Props", props);
  }

  const [channelSpecificRoles, setChannelSpecificRoles] = React.useState<
    React.ReactElement[] | string[]
  >([]);
  const [adminRoles, setAdminRoles] = React.useState<React.ReactElement[] | string[]>([]);
  const [userMentionComponents, setUserMentionComponents] = React.useState<
    React.ReactElement[] | string[]
  >([]);
  const [imgSrc, setImgSrc] = React.useState<string>("");
  const NoneElement: React.ReactElement = (
    <TextElement
      color={TextElement.Colors.HEADER_PRIMARY}
      size={TextElement.Sizes.SIZE_16}
      style={{
        marginTop: 10,
        textAlign: "center",
        fontWeight: "bold",
        justifyContent: "center",
      }}>
      None
    </TextElement>
  );
  const mapChannelRoles = (): void => {
    const channelRoleOverwrites = Object.values(props.channel.permissionOverwrites).filter(
      (role: Types.permissionOverwrite) =>
        role &&
        role?.type === 0 &&
        ((SettingValues.get("showAdmin", defaultSettings.showAdmin) !== "false" &&
          BigIntUtils.has(
            props.guild.roles[role.id].permissions,
            DiscordConstants.Permissions.ADMINISTRATOR,
          )) ||
          BigIntUtils.has(role.allow, DiscordConstants.Permissions.VIEW_CHANNEL) ||
          (BigIntUtils.has(
            props.guild.roles[role.id].permissions,
            DiscordConstants.Permissions.VIEW_CHANNEL,
          ) &&
            !BigIntUtils.has(role.deny, DiscordConstants.Permissions.VIEW_CHANNEL))),
    );

    if (!channelRoleOverwrites?.length) return setChannelSpecificRoles([NoneElement]);

    const roleComponentArray = channelRoleOverwrites.map((m) => (
      <RolePill.MemberRole
        key={m.id}
        canRemove={false}
        className={`${RolePillClasses.rolePill} shc-rolePill`}
        disableBorderColor={true}
        guildId={props.guild.id}
        onRemove={() => null}
        role={props.guild.roles[m.id]}
      />
    ));

    return setChannelSpecificRoles(roleComponentArray);
  };

  const mapAdminRoles = (): void => {
    if (SettingValues.get("showAdmin", defaultSettings.showAdmin) === "false") {
      return setAdminRoles([NoneElement]);
    }

    const adminRoles = Object.values(props.guild.roles).filter(
      (role) =>
        BigIntUtils.has(role.permissions, DiscordConstants.Permissions.ADMINISTRATOR) &&
        (SettingValues.get("showAdmin", defaultSettings.showAdmin) === "include" ||
          (SettingValues.get("showAdmin", defaultSettings.showAdmin) === "exclude" &&
            !role.tags?.bot_id)),
    );

    if (!adminRoles?.length) return setAdminRoles([NoneElement]);

    const roleComponentArray = adminRoles.map((m) => (
      <RolePill.MemberRole
        key={m.id}
        canRemove={false}
        className={`${RolePillClasses.rolePill} shc-rolePill`}
        disableBorderColor={true}
        guildId={props.guild.id}
        onRemove={() => null}
        role={m}
      />
    ));

    return setAdminRoles(roleComponentArray);
  };

  const fetchMemberAndMap = async (): Promise<void> => {
    const MemberRow = window[
      Symbol.for("dev.tharki.ShowHiddenChannels")
    ] as React.ComponentClass<Types.MemberRow>;

    const allUserOverwrites = Object.values(props.channel.permissionOverwrites).filter(
      (user: Types.permissionOverwrite): boolean => Boolean(user && user?.type === 1),
    );

    for (const user of allUserOverwrites) {
      await ProfileActions.fetchProfile(user.id, {
        guildId: props.guild.id,
        withMutualGuilds: false,
      });
    }

    const filteredUserOverwrites = Object.values(props.channel.permissionOverwrites).filter(
      (user: Types.permissionOverwrite): boolean =>
        Boolean(
          PermissionUtils.can({
            permission: DiscordConstants.Permissions.VIEW_CHANNEL,
            user: UltimateUserStore.getUser(user.id),
            context: props.channel,
          }) && GuildMemberStore.isMember(props.guild.id, user.id),
        ),
    );

    if (!filteredUserOverwrites?.length) return setUserMentionComponents([NoneElement]);

    const mentionArray = filteredUserOverwrites.map((m: Types.permissionOverwrite) => {
      const GuildMember = GuildMemberStore.getMember(props.guild.id, m.id) as {
        colorString: string;
        colorRoleId: string;
        premiumSince: string;
        nick: string;
      };

      return MemberRow ? (
        <MemberRow
          key={m.id}
          user={UltimateUserStore.getUser(m.id)}
          colorString={GuildMember.colorString}
          colorRoleId={GuildMember.colorRoleId}
          nick={GuildMember.nick}
          premiumSince={GuildMember.premiumSince}
          status={PresenceStore.getStatus(m.id)}
          isMobileOnline={PresenceStore.isMobileOnline(m.id)}
          activities={PresenceStore.getActivities(m.id)}
          isOwner={false}
          applicationStream={null}
          channel={props.channel}
          guildId={props.guild.id}
        />
      ) : (
        UserMentions.react(
          {
            userId: m.id,
            channelId: props.channel.id,
          },
          () => null,
          {
            noStyleAndInteraction: false,
          },
        )
      );
    });

    return setUserMentionComponents(mentionArray);
  };

  const setImgSrcFromSettings = (): void => {
    switch (SettingValues.get("hiddenChannelImg", defaultSettings.hiddenChannelImg)) {
      case "eye": {
        setImgSrc("/assets/5de724e7e966b4897f5d.svg");
        break;
      }
      case "lock": {
        setImgSrc("/assets/433e3ec4319a9d11b0cbe39342614982.svg");
        break;
      }
      case "custom": {
        setImgSrc(
          SettingValues.get("customHiddenChannelImg", defaultSettings.customHiddenChannelImg),
        );
        break;
      }
      case "none": {
        setImgSrc("");
        break;
      }
    }
  };
  React.useEffect(() => {
    mapChannelRoles();
    mapAdminRoles();
    fetchMemberAndMap();
    setImgSrcFromSettings();
  }, [
    props.channel.id,
    props.guild.id,
    SettingValues.get("customHiddenChannelImg"),
    SettingValues.get("hiddenChannelImg"),
  ]);

  return (
    <div className="shc-hidden-notice">
      <img
        style={{
          maxHeight: 128,
        }}
        src={imgSrc}
      />
      <TextElement
        color={TextElement.Colors.HEADER_PRIMARY}
        size={TextElement.Sizes.SIZE_32}
        style={{
          marginTop: 20,
          fontWeight: "bold",
        }}>
        This is a hidden channel.
      </TextElement>
      <TextElement
        color={TextElement.Colors.HEADER_SECONDARY}
        size={TextElement.Sizes.SIZE_16}
        style={{
          marginTop: 10,
        }}>
        You cannot see the contents of this channel.
        {props.channel.topic &&
          ` However, you may see its ${props.channel.type !== 15 ? "topic" : "guidelines"}.`}
      </TextElement>
      {props.channel.topic && props.guild && ChannelUtils?.renderTopic(props.channel, props.guild)}
      {props.channel.lastMessageId && (
        <TextElement color={TextElement.Colors.INTERACTIVE_NORMAL} size={TextElement.Sizes.SIZE_14}>
          Last message sent: {Utils.getDateFromSnowflake(props.channel.lastMessageId)}
        </TextElement>
      )}
      <Button
        look={Button.Looks.OUTLINED}
        color={Button.Colors.TRANSPARENT}
        hover={Button.Hovers.LINK}
        style={{ marginTop: "18px" }}
        onClick={() =>
          ModalActions.openModal((modal) => (
            <DetailsPopout
              {...props}
              {...modal}
              NoneElement={NoneElement}
              channelSpecificRoles={channelSpecificRoles}
              adminRoles={adminRoles}
              userMentionComponents={userMentionComponents}
            />
          ))
        }>
        More Details
      </Button>
    </div>
  );
});
