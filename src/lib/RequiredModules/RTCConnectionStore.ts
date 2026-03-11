import { webpack } from "replugged";

import type Types from "@Types";

export interface RTCConnectionStore extends Types.Store {
  getChannelId: () => string;
}

export default await webpack.waitForStore<RTCConnectionStore>("RTCConnectionStore");
