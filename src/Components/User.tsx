import { React, components } from "replugged/common";
import { Clickable, Tooltip } from "replugged/components";
import { UserProfile } from "../lib/requiredModules";
import Types from "../types";

export default React.memo(
  ({
    user,
    channelId,
    guildId,
  }: {
    user: Types.User;
    channelId: string;
    guildId: string;
  }): React.ReactElement => {
    const { Popout } = components as typeof components & { Popout: Types.Popout };

    return (
      <Popout
        renderPopout={(props) =>
          user ? (
            <UserProfile {...props} user={user} channelId={channelId} guildId={guildId} />
          ) : (
            <></>
          )
        }
        position="right"
        animation={Popout.Animation.FADE}>
        {({ onClick }: { onClick: Types.DefaultTypes.AnyFunction }) => {
          return (
            <Tooltip text={user?.globalName ?? user?.username}>
              <Clickable onClick={onClick}>
                <img
                  className="shc-user"
                  src={user ? user?.getAvatarURL() : "/assets/5d6a5e9d7d77ac29116e.png"}
                />
              </Clickable>
            </Tooltip>
          );
        }}
      </Popout>
    );
  },
);
