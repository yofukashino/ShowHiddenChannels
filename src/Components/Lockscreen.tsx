import { React, channels, guilds, modal } from "replugged/common";
import { Button, Text } from "replugged/components";
import { PluginLogger, SettingValues } from "@this";
import { DefaultSettings } from "@Consts";
import { ChannelUtils } from "@lib/RequiredModules";
import DetailsPopout from "@components/DetailsPopout";
import Utils from "@Utils";

import "./Lockscreen.css";

export default React.memo(({ guildId, channelId }: { guildId: string; channelId: string }) => {
  const debugMode = SettingValues.useValue("debugMode", DefaultSettings.debugMode);
  const hiddenChannelImg = SettingValues.useValue(
    "hiddenChannelImg",
    DefaultSettings.hiddenChannelImg,
  );
  const customHiddenChannelImg = SettingValues.useValue(
    "customHiddenChannelImg",
    DefaultSettings.customHiddenChannelImg,
  );
  const channel = channels.getChannel(channelId);
  const guild = guilds.getGuild(guildId);
  if (debugMode) PluginLogger.log("LockScreen Props", { guildId, channelId });

  const [imgSrc, setImgSrc] = React.useState<string>("");

  const setImgSrcFromSettings = (): void => {
    switch (hiddenChannelImg) {
      case "eye": {
        setImgSrc("/assets/5de724e7e966b4897f5d.svg");
        break;
      }
      case "lock": {
        setImgSrc("/assets/433e3ec4319a9d11b0cbe39342614982.svg");
        break;
      }
      case "custom": {
        setImgSrc(customHiddenChannelImg);
        break;
      }
      case "none": {
        setImgSrc("");
        break;
      }
    }
  };
  React.useEffect(() => {
    setImgSrcFromSettings();
  }, [customHiddenChannelImg, hiddenChannelImg]);

  return (
    <div className="shc-hidden-notice">
      <img
        style={{
          maxHeight: 128,
        }}
        src={imgSrc}
      />
      <Text
        color="text-strong"
        variant="heading-xxl/bold"
        style={{
          marginTop: 20,
        }}>
        This is a hidden channel.
      </Text>
      <Text
        color="text-muted"
        variant="heading-md/normal"
        style={{
          marginTop: 10,
        }}>
        You cannot see the contents of this channel.
        {channel.topic &&
          ` However, you may see its ${channel.type !== 15 ? "topic" : "guidelines"}.`}
      </Text>
      {channel.topic && guild && ChannelUtils?.renderTopic(channel, guild)}
      {channel.lastMessageId && (
        <Text color="interactive-normal" variant="heading-sm/normal">
          Last message sent: {Utils.getDateFromSnowflake(channel.lastMessageId)}
        </Text>
      )}
      <Button
        look={Button.Looks.OUTLINED}
        color={Button.Colors.TRANSPARENT}
        style={{ marginTop: "18px" }}
        onClick={() =>
          modal.openModal((modal) => <DetailsPopout channel={channel} guild={guild} {...modal} />)
        }>
        More Details
      </Button>
    </div>
  );
});
