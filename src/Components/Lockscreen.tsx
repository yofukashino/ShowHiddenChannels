import { modal as ModalActions, React } from "replugged/common";
import { Button } from "replugged/components";
import { PluginLogger, SettingValues } from "../index";
import { defaultSettings } from "../lib/consts";
import DetailsPopout from "./DetailsPopout";
import Modules from "../lib/requiredModules";
import Utils from "../lib/utils";
import Types from "../types";

export default React.memo((props: Types.LockscreenProps) => {
  if (SettingValues.get("debugMode", defaultSettings.debugMode)) {
    PluginLogger.log("LockScreen Props", props);
  }
  const { ChannelUtils, TextElement } = Modules;
  const [imgSrc, setImgSrc] = React.useState<string>("");

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
        style={{ marginTop: "18px" }}
        onClick={() => ModalActions.openModal((modal) => <DetailsPopout {...props} {...modal} />)}>
        More Details
      </Button>
    </div>
  );
});
