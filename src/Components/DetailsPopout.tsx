import { React, channels as UltimateChannelStore } from "replugged/common";
import { ErrorBoundary, Flex, FormItem, Modal, Text } from "replugged/components";
import { SettingValues } from "../index";
import { defaultSettings } from "../lib/consts";
import Modules from "../lib/requiredModules";
import Utils from "../lib/utils";
import Types from "../types";

export const getTabBarItems = ({ channel }: { channel: Types.Channel }): React.ReactElement[] => {
  const {
    DiscordConstants,
    DiscordComponents: { TabBar },
  } = Modules;
  const items = [];
  items.push(
    <TabBar.Item id="general" className={`shc-details-tabbar-item`} key="general">
      General Information
    </TabBar.Item>,
  );
  if (SettingValues.get("showPerms", defaultSettings.showPerms) && channel.permissionOverwrites) {
    items.push(
      <TabBar.Item id="users" className={`shc-details-tabbar-item`} key="users">
        Users
      </TabBar.Item>,
    );
    items.push(
      <TabBar.Item id="channel" className={`shc-details-tabbar-item`} key="channel">
        Channel Specific
      </TabBar.Item>,
    );
    if (
      SettingValues.get("showAdmin", defaultSettings.showAdmin) !== "false" &&
      SettingValues.get("showAdmin", defaultSettings.showAdmin) !== "channel"
    )
      items.push(
        <TabBar.Item id="admin" className={`shc-details-tabbar-item`} key="admin">
          Admins
        </TabBar.Item>,
      );
  }

  if (channel?.type === DiscordConstants.ChannelTypes.GUILD_FORUM)
    items.push(
      <TabBar.Item id="forum" className={`shc-details-tabbar-item`} key="forum">
        Forum Tags
      </TabBar.Item>,
    );
  return items;
};
export default React.memo((props: Types.DetailsPopoutProps) => {
  const {
    ForumTags,
    LocaleManager,
    DiscordComponents: { TabBar },
  } = Modules;
  const [open, setOpen] = React.useState<string>("general");
  const { AdminRoles, ChannelSpecificRoles, None, Users } = props;
  return (
    <Modal.ModalRoot className="shc-details-modal" size="large" {...props}>
      <Modal.ModalHeader className="shc-details-header">
        <Text.H2
          style={{
            marginTop: 10,
          }}>
          {props.channel.name}'s Details
        </Text.H2>
        <Modal.ModalCloseButton onClick={props.onClose} />
      </Modal.ModalHeader>
      <TabBar
        type="top"
        look="brand"
        className={`shc-details-tabbar`}
        selectedItem={open}
        onItemSelect={setOpen}>
        {getTabBarItems({ channel: props.channel })}
      </TabBar>
      <Modal.ModalContent>
        <ErrorBoundary>
          <div key={open}>
            {open === "general" && (
              <FormItem
                title="General Info About the channel"
                className="shc-details-content-header">
                <Flex
                  className="shc-detailFlex shc-generalDetails"
                  justify={Flex.Justify.AROUND}
                  wrap={Flex.Wrap.WRAP}>
                  <FormItem title="Slowmode">
                    <Text.Normal>
                      {Utils.convertToHMS(props.channel.rateLimitPerUser ?? 0)}
                    </Text.Normal>
                  </FormItem>
                  <FormItem title="Bitrate">
                    <Text.Normal>{`${Number(props.channel.bitrate) / 1000}`} Kbps</Text.Normal>
                  </FormItem>
                  <FormItem title="User Limit">
                    <Text.Normal>{`${Number(props.channel.userLimit)}`} Users</Text.Normal>
                  </FormItem>
                  {props.channel.lastPinTimestamp && (
                    <FormItem title="Last Message Pinned">
                      <Text.Normal>
                        {new Date(props.channel.lastPinTimestamp).toLocaleString(
                          LocaleManager._chosenLocale,
                        )}
                      </Text.Normal>
                    </FormItem>
                  )}
                  <FormItem title="Parent Category">
                    <Text.Normal>
                      {UltimateChannelStore.getChannel(props.channel?.parent_id)?.name ?? "None"}
                    </Text.Normal>
                  </FormItem>
                  <FormItem title="Age Restriction">
                    <Text.Normal>{props.channel.nsfw ? "18+" : "13+"}</Text.Normal>
                  </FormItem>
                </Flex>
              </FormItem>
            )}
            {open === "users" && (
              <FormItem
                title="Users that have specific overwrites for this channel"
                className="shc-details-content-header">
                <Flex className="shc-detailFlex">
                  <Users />
                </Flex>
              </FormItem>
            )}
            {open === "channel" && (
              <FormItem
                title="Roles that have specific overwrites for this channel"
                className="shc-details-content-header">
                <Flex className="shc-detailFlex">
                  <ChannelSpecificRoles />
                </Flex>
              </FormItem>
            )}
            {open === "admin" && (
              <FormItem
                title="Administrative Roles with server wide access"
                className="shc-details-content-header">
                <Flex className="shc-detailFlex">
                  <AdminRoles />
                </Flex>
              </FormItem>
            )}
            {open === "forum" && (
              <FormItem
                title="Tags Available in this forum channel"
                className="shc-details-content-header">
                <Flex className="shc-detailFlex">
                  {props?.channel?.availableTags.length ? (
                    props?.channel?.availableTags?.map?.((tag) => (
                      <ForumTags.IncreasedActivityForumTagPill
                        key={tag.id}
                        selected={false}
                        tag={tag}
                      />
                    ))
                  ) : (
                    <None />
                  )}
                </Flex>
              </FormItem>
            )}
          </div>
        </ErrorBoundary>
      </Modal.ModalContent>
    </Modal.ModalRoot>
  );
});
