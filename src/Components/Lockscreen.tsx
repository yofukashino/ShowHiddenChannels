import { React, users as UltimateUserStore } from "replugged/common";
import { PluginLogger, SettingValues } from "../index";
import { defaultSettings } from "../lib/consts";
import Types from "../types";

import {
  BigIntUtils,
  ChannelUtils,
  ChatClasses,
  DiscordComponents,
  DiscordConstants,
  ForumTags,
  GuildMemberStore,
  MemberMemos,
  PermissionUtils,
  PresenceStore,
  ProfileActions,
  RolePill,
  RolePillClasses,
  ScrollerClasses,
  TextElement,
  UserMentions,
} from "../lib/requiredModules";
import Utils from "../lib/utils";

export const Lockscreen = React.memo((props: Types.LockscreenProps) => {
  const { AdvancedScrollerAuto } = DiscordComponents;
  const { MemberRow } = MemberMemos;
  if (SettingValues.get("debugMode", defaultSettings.debugMode))
    PluginLogger.log("LockScreen Props", props);
  const [channelSpecificRoles, setChannelSpecificRoles] = React.useState<
    React.ReactElement[] | string[]
  >([]);
  const [adminRoles, setAdminRoles] = React.useState<React.ReactElement[] | string[]>([]);
  const [userMentionComponents, setUserMentionComponents] = React.useState<
    React.ReactElement[] | string[]
  >([]);

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

    if (!channelRoleOverwrites?.length) return setChannelSpecificRoles(["None"]);
    const roleComponentArray = channelRoleOverwrites.map((m) => (
      <RolePill
        {...{
          canRemove: false,
          className: `${RolePillClasses.rolePill} shc-rolePill`,
          disableBorderColor: true,
          guildId: props.guild.id,
          onRemove: () => null,
          role: props.guild.roles[m.id],
        }}
      />
    ));
    return setChannelSpecificRoles(roleComponentArray);
  };

  const mapAdminRoles = (): void => {
    if (SettingValues.get("showAdmin", defaultSettings.showAdmin) === "false")
      return setAdminRoles(["None"]);
    const adminRoles = Object.values(props.guild.roles).filter(
      (role) =>
        BigIntUtils.has(role.permissions, DiscordConstants.Permissions.ADMINISTRATOR) &&
        (SettingValues.get("showAdmin", defaultSettings.showAdmin) === "include" ||
          (SettingValues.get("showAdmin", defaultSettings.showAdmin) === "exclude" &&
            !role.tags?.bot_id)),
    );

    if (!adminRoles?.length) return setAdminRoles(["None"]);

    const roleComponentArray = adminRoles.map((m) => (
      <RolePill
        {...{
          canRemove: false,
          className: `${RolePillClasses.rolePill} shc-rolePill`, //${rolePillBorder}
          disableBorderColor: true,
          guildId: props.guild.id,
          onRemove: () => null,
          role: m,
        }}
      />
    ));
    return setAdminRoles(roleComponentArray);
  };

  const fetchMemberAndMap = async (): Promise<void> => {
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

    if (!filteredUserOverwrites?.length) return setUserMentionComponents(["None"]);
    const mentionArray = filteredUserOverwrites.map((m: Types.permissionOverwrite) => {
      const GuildMember = GuildMemberStore.getMember(props.guild.id, m.id) as {
        colorString: string;
        colorRoleId: string;
        premiumSince: string;
        nick: string;
      };
      return MemberRow ? (
        <MemberRow
          {...{
            user: UltimateUserStore.getUser(m.id),
            colorString: GuildMember.colorString,
            colorRoleId: GuildMember.colorRoleId,
            nick: GuildMember.nick,
            premiumSince: GuildMember.premiumSince,
            status: PresenceStore.getStatus(m.id),
            isMobileOnline: PresenceStore.isMobileOnline(m.id),
            activities: PresenceStore.getActivities(m.id),
            isOwner: false,
            applicationStream: null,
            channel: props.channel,
            guildId: props.guild.id,
          }}
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

  React.useEffect(() => {
    mapChannelRoles();
    mapAdminRoles();
    fetchMemberAndMap();
  }, [props.channel.id, props.guild.id]);

  return (
    <div
      {...{
        className: ["shc-hidden-wrapper", ChatClasses.chat].filter(Boolean).join(" "),
      }}>
      <AdvancedScrollerAuto
        {...{
          className: `shc-hidden-chat-scroller ${ScrollerClasses.scroller}`,
        }}>
        <div
          {...{
            className: "shc-hidden-chat-content",
          }}>
          <div
            {...{
              className: "shc-hidden-notice",
            }}>
            <img
              {...{
                style: {
                  maxHeight: 128,
                },
                src: "https://tharki-god.github.io/files-random-host/unknown%20copy.png",
              }}
            />
            <TextElement
              {...{
                color: TextElement.Colors.HEADER_PRIMARY,
                size: TextElement.Sizes.SIZE_32,
                style: {
                  marginTop: 20,
                  fontWeight: "bold",
                },
              }}>
              This is a hidden channel.
            </TextElement>
            <TextElement
              {...{
                color: TextElement.Colors.HEADER_SECONDARY,
                size: TextElement.Sizes.SIZE_16,
                style: {
                  marginTop: 10,
                },
              }}>
              You cannot see the contents of this channel.
              {props.channel.topic &&
                ` However, you may see its ${props.channel.type !== 15 ? "topic" : "guidelines"}.`}
            </TextElement>
            {props.channel.topic &&
              props.guild &&
              ChannelUtils?.channelTopic(props.channel, props.guild)}
            {props.channel.lastMessageId && (
              <TextElement
                {...{
                  color: TextElement.Colors.INTERACTIVE_NORMAL,
                  size: TextElement.Sizes.SIZE_14,
                }}>
                Last message sent: {Utils.getDateFromSnowflake(props.channel.lastMessageId)}
              </TextElement>
            )}
            {props.channel.rateLimitPerUser > 0 && (
              <TextElement
                {...{
                  color: TextElement.Colors.INTERACTIVE_NORMAL,
                  size: TextElement.Sizes.SIZE_14,
                  style: {
                    marginTop: 10,
                  },
                }}>
                Slowmode:
                {Utils.convertToHMS(props.channel.rateLimitPerUser)}
              </TextElement>
            )}
            {props.channel.nsfw && (
              <TextElement
                {...{
                  color: TextElement.Colors.INTERACTIVE_NORMAL,
                  size: TextElement.Sizes.SIZE_14,
                  style: {
                    marginTop: 10,
                  },
                }}>
                Age-Restricted Channel (NSFW) 🔞
              </TextElement>
            )}
            {SettingValues.get("showPerms", defaultSettings.showPerms) &&
              props.channel.permissionOverwrites && (
                <div
                  {...{
                    style: {
                      marginTop: 20,
                      backgroundColor: "var(--background-secondary-alt)",
                      padding: 10,
                      borderRadius: 5,
                      color: "var(--text-normal)",
                    },
                  }}>
                  <TextElement
                    {...{
                      color: TextElement.Colors.INTERACTIVE_NORMAL,
                      size: TextElement.Sizes.SIZE_14,
                    }}>
                    Users that can see this channel:
                  </TextElement>
                  <div
                    {...{
                      style: {
                        color: "var(--interactive-normal)",
                        marginTop: 5,
                        marginBottom: 5,
                      },
                    }}>
                    {userMentionComponents}
                  </div>

                  <TextElement
                    {...{
                      style: {
                        color: "var(--interactive-normal)",
                        borderTop: "1px solid var(--background-tertiary)",
                        padding: 5,
                      },
                    }}>
                    Channel-specific roles:
                  </TextElement>
                  <div
                    {...{
                      style: {
                        color: "var(--interactive-normal)",
                        paddingTop: 5,
                      },
                    }}>
                    {channelSpecificRoles}
                  </div>
                  {SettingValues.get("showAdmin", defaultSettings.showAdmin) !== "false" &&
                    SettingValues.get("showAdmin", defaultSettings.showAdmin) !== "channel" && (
                      <div>
                        <TextElement
                          {...{
                            style: {
                              color: "var(--interactive-normal)",
                              borderTop: "1px solid var(--background-tertiary)",
                              padding: 5,
                            },
                          }}>
                          Admin roles:
                        </TextElement>
                        <div
                          {...{
                            style: {
                              color: "var(--interactive-normal)",
                              paddingTop: 5,
                            },
                          }}>
                          {adminRoles}
                        </div>
                      </div>
                    )}
                </div>
              )}
            {props.channel.type === 15 && props.channel.availableTags && (
              <div
                {...{
                  style: {
                    marginTop: 20,
                    backgroundColor: "var(--background-secondary)",
                    padding: 10,
                    borderRadius: 5,
                    color: "var(--text-normal)",
                  },
                }}>
                <TextElement
                  {...{
                    color: TextElement.Colors.HEADER_SECONDARY,
                    size: TextElement.Sizes.SIZE_16,
                    style: {
                      fontWeight: "bold",
                      marginBottom: 10,
                    },
                  }}>
                  Forum Tags
                </TextElement>
                {props.channel.availableTags &&
                  props.channel.availableTags.length > 0 &&
                  props.channel.availableTags.map((tag) => (
                    <ForumTags
                      {...{
                        key: tag.id,
                        className: "tag-3T_qsl",
                        onClick: () => null,
                        selected: false,
                        tag,
                      }}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </AdvancedScrollerAuto>
    </div>
  );
});
