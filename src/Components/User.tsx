import { webpack } from "replugged";
import { React, components, users } from "replugged/common";
import { Clickable, Tooltip } from "replugged/components";
import { UserProfile } from "@lib/RequiredModules";
import Types from "@Types";

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
    const Popout = webpack.getFunctionBySource<Types.Popout>(
      components,
      "Unsupported animation config:",
    );
    const userRef = React.useRef();
    return (
      <Popout
        targetElementRef={userRef}
        renderPopout={(props) =>
          user && UserProfile ? (
            <UserProfile.Popout
              {...props}
              user={user}
              currentUser={users.getCurrentUser()}
              channelId={channelId}
              guildId={guildId}
            />
          ) : (
            <></>
          )
        }
        position="right"
        animation={Popout.Animation.FADE}>
        {({ onClick }: { onClick: Types.DefaultTypes.AnyFunction }) => {
          return (
            <span ref={userRef}>
              <Tooltip text={user?.globalName ?? user?.username}>
                <Clickable onClick={onClick}>
                  <img
                    className="shc-user"
                    src={user ? user?.getAvatarURL() : "/assets/5d6a5e9d7d77ac29116e.png"}
                  />
                </Clickable>
              </Tooltip>
            </span>
          );
        }}
      </Popout>
    );
  },
);
