import { React, channels as UltimateChannelStore } from "replugged/common";
import { Category, Flex, Modal } from "replugged/components";
import { SettingValues } from "../index";
import { defaultSettings } from "../lib/consts";
import { DiscordConstants, ForumTags, LocaleManager, TextElement } from "../lib/requiredModules";
import Utils from "../lib/utils";
import Types from "../types";
export default React.memo((props: Types.DetailsPopoutProps) => {
  const [open, setOpen] = React.useState<string>("");
  return (
    <Modal.ModalRoot className="shc-details-modal" size="large" {...props}>
      <Modal.ModalHeader className="shc-details-header">
        <TextElement
          color={TextElement.Colors.HEADER_PRIMARY}
          size={TextElement.Sizes.SIZE_32}
          style={{
            marginTop: 10,
          }}>
          {props.channel.name}'s Details
        </TextElement>
        <Modal.ModalCloseButton onClick={props.onClose} />
      </Modal.ModalHeader>
      <Modal.ModalContent>
        <div key={open}>
          <Category
            title="General Information"
            open={open === "general"}
            onChange={() => setOpen(open === "general" ? "none" : "general")}>
            <Flex className="shc-detailFlex shc-generalDetails">
              <TextElement
                color={TextElement.Colors.INTERACTIVE_NORMAL}
                size={TextElement.Sizes.SIZE_14}
                style={{
                  marginTop: 10,
                }}>
                Slowmode: {Utils.convertToHMS(props.channel.rateLimitPerUser ?? 0)}
              </TextElement>
              <TextElement
                color={TextElement.Colors.INTERACTIVE_NORMAL}
                size={TextElement.Sizes.SIZE_14}
                style={{
                  marginTop: 10,
                }}>
                Bitrate: {`${Number(props.channel.bitrate) / 1000}`} Kbps
              </TextElement>
              <TextElement
                color={TextElement.Colors.INTERACTIVE_NORMAL}
                size={TextElement.Sizes.SIZE_14}
                style={{
                  marginTop: 10,
                }}>
                User Limit: {`${Number(props.channel.userLimit)}`} Users
              </TextElement>
              <TextElement
                color={TextElement.Colors.INTERACTIVE_NORMAL}
                size={TextElement.Sizes.SIZE_14}
                style={{
                  marginTop: 10,
                }}>
                {props.channel.nsfw
                  ? "Age-Restricted Channel (NSFW) 🔞"
                  : "Not Age-Restricted Channel (SFW) 👶"}
              </TextElement>
              {props.channel.lastPinTimestamp && (
                <TextElement
                  color={TextElement.Colors.INTERACTIVE_NORMAL}
                  size={TextElement.Sizes.SIZE_14}
                  style={{
                    marginTop: 10,
                  }}>
                  {"Last Message Pinned: "}
                  {new Date(props.channel.lastPinTimestamp).toLocaleString(
                    LocaleManager._chosenLocale,
                  )}
                </TextElement>
              )}
              <TextElement
                color={TextElement.Colors.INTERACTIVE_NORMAL}
                size={TextElement.Sizes.SIZE_14}
                style={{
                  marginTop: 10,
                }}>
                {"Parent Category: "}
                {UltimateChannelStore.getChannel(props.channel?.parent_id)?.name ?? "None"}
              </TextElement>
            </Flex>
          </Category>
          {SettingValues.get("showPerms", defaultSettings.showPerms) &&
            props.channel.permissionOverwrites && (
              <>
                <Category
                  title="Users that can see this channel"
                  open={open === "users"}
                  onChange={() => setOpen(open === "users" ? "none" : "users")}>
                  <Flex className="shc-detailFlex">{props.userMentionComponents}</Flex>
                </Category>
                <Category
                  title="Channel-specific roles"
                  open={open === "channel"}
                  onChange={() => setOpen(open === "channel" ? "none" : "channel")}>
                  <Flex className="shc-detailFlex">{props.channelSpecificRoles}</Flex>
                </Category>
                {SettingValues.get("showAdmin", defaultSettings.showAdmin) !== "false" &&
                  SettingValues.get("showAdmin", defaultSettings.showAdmin) !== "channel" && (
                    <Category
                      title="Admin roles"
                      open={open === "admin"}
                      onChange={() => setOpen(open === "admin" ? "none" : "admin")}>
                      <Flex className="shc-detailFlex">{props.adminRoles}</Flex>
                    </Category>
                  )}
              </>
            )}
          {props?.channel?.type === DiscordConstants.ChannelTypes.GUILD_FORUM && (
            <Category
              title="Forum Tags"
              open={open === "forum"}
              onChange={() => setOpen(open === "forum" ? "none" : "forum")}>
              <Flex className="shc-detailFlex">
                {props?.channel?.availableTags.length
                  ? props?.channel?.availableTags?.map?.((tag) => (
                      <ForumTags.IncreasedActivityForumTagPill
                        key={tag.id}
                        selected={false}
                        tag={tag}
                      />
                    ))
                  : props.NoneElement}
              </Flex>
            </Category>
          )}
        </div>
      </Modal.ModalContent>
    </Modal.ModalRoot>
  );
});
