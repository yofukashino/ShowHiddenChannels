/* eslint-disable eqeqeq */
/* eslint-disable no-undefined */
/* eslint-disable new-cap */
import { PluginLogger, shc } from "../index.jsx";
import { defaultSettings } from "../lib/consts.jsx";
import { common } from "replugged";
const { React } = common;
import {
  ChannelUtils,
  GuildMemberStore,
  RolePill,
  RolePillClasses,
  TextElement,
  UserMentions,
  chat,
} from "../lib/requiredModules.jsx";
import * as Utils from "../lib/utils.jsx";
export const Lockscreen = React.memo((props) => {
  if (shc.get("debugMode", defaultSettings.debugMode)) PluginLogger.log(props);
  return (
    <div
      {...{
        className: ["shc-hidden-chat-content", chat].filter(Boolean).join(" "),
      }}>
      <div
        {...{
          className: "shc-hidden-notice",
        }}>
        <img
          {...{
            style: {
              WebkitUserDrag: "none",
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
          {props.channel.topic && props.channel.type !== 15 && "However, you may see its topic."}
        </TextElement>
        {props.channel.topic &&
          props.channel.type !== 15 &&
          props.guild &&
          ChannelUtils?.ChannelTopic(props.channel, props.guild)}
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
        {shc.get("showPerms", defaultSettings.showPerms) && props.channel.permissionOverwrites && (
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
                  (user) =>
                    user !== undefined &&
                    user?.type == 1 &&
                    user.allow &&
                    BigInt(user.allow) &&
                    GuildMemberStore.isMember(props.guild.id, user.id),
                );
                if (!allUsers?.length) return ["None"];
                return allUsers.map((m) =>
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
              })()}
            </div>

            <TextElement
              {...{
                style: {
                  color: "var(--interactive-normal)",
                  borderTop: "1px solid var(--background-tertiary)",
                  padding: 5,
                },
              }}>
              Channel-specific roles: ,
              <div
                {...{
                  style: {
                    color: "var(--interactive-normal)",
                    paddingTop: 5,
                  },
                }}>
                {...(() => {
                  const channelRoles = Object.values(props.channel.permissionOverwrites).filter(
                    (role) =>
                      role !== undefined &&
                      role?.type == 0 &&
                      ((shc.get("showAdmin", defaultSettings.showAdmin) &&
                        (props.guild.roles[role.id].permissions & BigInt(8)) == BigInt(8)) ||
                        (role.allow & BigInt(1024)) == BigInt(1024) ||
                        (props.guild.roles[role.id].permissions & BigInt(1024) &&
                          (role.deny & BigInt(1024)) == 0)),
                  );

                  if (!channelRoles?.length) return ["None"];
                  return channelRoles.map((m) =>
                    RolePill.render(
                      {
                        canRemove: false,
                        className: `${RolePillClasses.rolePill} shc-rolePill`, //${rolePillBorder}
                        disableBorderColor: true,
                        guildId: props.guild.id,
                        onRemove: Utils.NOOP,
                        role: props.guild.roles[m.id],
                      },
                      Utils.NOOP,
                    ),
                  );
                })()}
              </div>
            </TextElement>
          </div>
        )}
        {props.channel.type == 15 && (props.channel.availableTags || props.channel.topic) && (
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
              Forum
            </TextElement>
            {props.channel.availableTags && props.channel.availableTags.length > 0 && (
              <TextElement
                {...{
                  color: TextElement.Colors.INTERACTIVE_NORMAL,
                  size: TextElement.Sizes.SIZE_14,
                  style: {
                    marginTop: 10,
                  },
                }}>
                Tags: ,{props.channel.availableTags.map((tag) => tag.name).join(", ")}
              </TextElement>
            )}
            {props.channel.topic && (
              <TextElement
                {...{
                  color: TextElement.Colors.INTERACTIVE_NORMAL,
                  size: TextElement.Sizes.SIZE_14,
                  style: {
                    marginTop: 10,
                  },
                }}>
                {" "}
                Guidelines: ,{props.channel.topic}
              </TextElement>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
