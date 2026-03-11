import { webpack } from "replugged";

import type Types from "@Types";

export interface ChatContentLayer {
  $$typeof: symbol;
  compare: null;
  type: (args: {
    channel: Types.Channel;
    chatInputType: {
      analyticsName: string;
      attachments: boolean;
      autocomplete: { addReactionShortcut: boolean; forceChatLayer: boolean; reactions: boolean };
      commands: { enabled: boolean };
      drafts: { type: 0; autoSave: boolean };
      emojis: { button: boolean };
      gifs: { button: boolean; allowSending: boolean };
      gifts: { button: boolean };
      permissions: { requireSendMessages: boolean };
      sedReplace: boolean;
      showCharacterCount: boolean;
      showThreadPromptOnReply: boolean;
      stickers: { button: boolean; allowSending: boolean; autoSuggest: boolean };
      submit: {
        button: boolean;
        ignorePreference: boolean;
        disableEnterToSubmit: boolean;
        clearOnSubmit: boolean;
        useDisabledStylesOnSubmit: boolean;
      };
      uploadLongMessages: boolean;
      upsellLongMessages: { iconOnly: boolean };
    };
    guild: Types.Guild;
  }) => React.ReactElement;
}

export default await webpack
  .waitForModule<ChatContentLayer>(webpack.filters.bySource("showAutomodUserProfileChatBlocker"), {
    timeout: 10000,
  })
  .catch(() => {
    throw new Error("Failed To Find ChatContentLayer Module");
  });
