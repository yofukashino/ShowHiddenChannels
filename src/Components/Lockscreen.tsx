import { common } from "replugged";
import { PluginLogger, SettingValues } from "../index";
import { defaultSettings } from "../lib/consts";
import * as Types from "../types";

import {
  BigIntUtils,
  ChannelUtils,
  ChatClasses,
  DiscordComponents,
  DiscordConstants,
  ForumTags,
  GuildMemberStore,
  PermissionUtils,
  RolePill,
  RolePillClasses,
  ScrollerClasses,
  TextElement,
  UserMentions,
} from "../lib/requiredModules";
import * as Utils from "../lib/utils";
const { React, users: UltimateUserStore } = common;
const { AdvancedScrollerAuto } = DiscordComponents;
export const Lockscreen = React.memo((props: Types.LockscreenProps) => {
  if (SettingValues.get("debugMode", defaultSettings.debugMode))
    PluginLogger.log("LockScreen Props", props);
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
                    {...(() => {
                      const allUsers = Object.values(props.channel.permissionOverwrites).filter(
                        (user: Types.permissionOverwrite): boolean =>
                          Boolean(
                            user &&
                              user?.type === 1 &&
                              PermissionUtils.can({
                                permission: DiscordConstants.Permissions.VIEW_CHANNEL,
                                user: UltimateUserStore.getUser(user.id),
                                context: props.channel,
                              }) &&
                              GuildMemberStore.isMember(props.guild.id, user.id),
                          ),
                      );
                      if (!allUsers?.length) return ["None"];
                      return allUsers.map((m: Types.permissionOverwrite) =>
                        UserMentions.react(
                          {
                            userId: m.id,
                            channelId: props.channel.id,
                          },
                          Utils.NOOP,
                          {
                            noStyleAndInteraction: false,
                          },
                        ),
                      );
                    })() as Types.ReactElement[]}
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
                    {...(() => {
                      const channelRoles = Object.values(props.channel.permissionOverwrites).filter(
                        (role: Types.permissionOverwrite) =>
                          role &&
                          role?.type === 0 &&
                          ((SettingValues.get("showAdmin", defaultSettings.showAdmin) !== "false" &&
                            BigIntUtils.has(
                              props.guild.roles[role.id].permissions,
                              DiscordConstants.Permissions.ADMINISTRATOR,
                            )) ||
                            BigIntUtils.has(
                              role.allow,
                              DiscordConstants.Permissions.VIEW_CHANNEL,
                            ) ||
                            (BigIntUtils.has(
                              props.guild.roles[role.id].permissions,
                              DiscordConstants.Permissions.VIEW_CHANNEL,
                            ) &&
                              !BigIntUtils.has(
                                role.deny,
                                DiscordConstants.Permissions.VIEW_CHANNEL,
                              ))),
                      );

                      if (!channelRoles?.length) return ["None"];
                      return channelRoles.map((m) => (
                        <RolePill
                          {...{
                            canRemove: false,
                            className: `${RolePillClasses.rolePill} shc-rolePill`, //${rolePillBorder}
                            disableBorderColor: true,
                            guildId: props.guild.id,
                            onRemove: Utils.NOOP,
                            role: props.guild.roles[m.id],
                          }}
                        />
                      ));
                    })() as Types.ReactElement[]}
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
                          {...(() => {
                            if (
                              SettingValues.get("showAdmin", defaultSettings.showAdmin) === "false"
                            )
                              return ["None"];
                            const guildRoles = Object.values(props.guild.roles).filter(
                              (role) =>
                                BigIntUtils.has(
                                  role.permissions,
                                  DiscordConstants.Permissions.ADMINISTRATOR,
                                ) &&
                                (SettingValues.get("showAdmin", defaultSettings.showAdmin) ===
                                  "include" ||
                                  (SettingValues.get("showAdmin", defaultSettings.showAdmin) ===
                                    "exclude" &&
                                    !role.tags?.bot_id)),
                            );

                            if (!guildRoles?.length) return ["None"];
                            return guildRoles.map((m) => (
                              <RolePill
                                {...{
                                  canRemove: false,
                                  className: `${RolePillClasses.rolePill} shc-rolePill`, //${rolePillBorder}
                                  disableBorderColor: true,
                                  guildId: props.guild.id,
                                  onRemove: Utils.NOOP,
                                  role: m,
                                }}
                              />
                            ));
                          })() as Types.ReactElement[]}
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
