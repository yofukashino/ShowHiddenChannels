import { util, webpack } from "replugged";
import { React, users } from "replugged/common";
import { Flex, Switch } from "replugged/components";
import { SettingValues } from "@this";
import { IconUtils } from "@lib/RequiredModules";
import Utils from "@lib/utils";
import type Types from "@Types";

import "./Selector.css";

export default ({
  guild,
  user,
  channel,
  path,
  id,
}: {
  id: string;
  path: "blacklistedGuilds";
  guild?: Types.Guild;
  user?: Types.User;
  channel?: Types.Channel;
}): React.ReactElement => {
  const getLabel = React.useCallback(() => {
    if (guild) return guild.name;
    if (user) return user?.globalName || user?.username;
    if (channel)
      return (
        channel?.name ||
        channel?.recipients?.reduce((name, uid) => {
          const user = users.getUser(uid) as Types.User;
          const username = user?.globalName ?? user?.username;
          if (name) return `${name},${username}`;
          return username;
        }, "")
      );
  }, []);

  const getDescription = React.useCallback(() => {
    if (guild) return guild.description || guild.vanityURLCode || guild.id;
    if (user) return user.bio || user.tag || user.id;
    if (channel)
      return (
        channel.topic ||
        (channel.ownerId && `Owned By: ${users.getUser(channel.ownerId).username}`) ||
        channel.id
      );
  }, []);

  const getIcon = React.useCallback(() => {
    if (guild) return guild.icon ? IconUtils.getGuildIconURL(guild) : Utils.getAcronym(guild.name);
    if (user)
      return user.avatar
        ? IconUtils.getUserAvatarURL(user)
        : Utils.getAcronym(user?.globalName ?? user?.username);
    if (channel)
      return channel.icon ? IconUtils.getChannelIconURL(channel) : Utils.getAcronym(channel.name);
  }, []);

  const icon = getIcon();

  return (
    <Flex align={Flex.Align.CENTER} className="shc-selectorSwitchContainer">
      {icon?.includes("https://") || webpack.parseRegex(/\/assets\/\i\.\i/).test(icon) ? (
        <img
          src={icon}
          width={48}
          height={48}
          style={{ borderRadius: "50%", marginRight: "10px" }}
          alt="Icon"
        />
      ) : (
        <div className="shc-noIcon">{icon}</div>
      )}
      <Switch
        label={getLabel()}
        description={getDescription()}
        {...util.useSetting(SettingValues, `${path}.${id}`, false)}
      />
    </Flex>
  );
};
