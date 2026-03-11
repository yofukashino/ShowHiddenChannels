import { webpack } from "replugged";

export interface ProfileActions {
  fetchProfile: (
    userId: string,
    options: {
      guildId: string;
      withMutualGuilds: boolean;
    },
  ) => Promise<void>;
}

const mod = await webpack
  .waitForModule(webpack.filters.bySource("setFlag: user cannot be undefined"), {
    timeout: 10000,
  })
  .catch(() => {
    throw new Error("Failed To Find ProfileActions Module");
  });

export default {
  acceptAgreements: webpack.getFunctionBySource(mod, ".USER_ACCEPT_AGREEMENTS"),
  fetchCurrentUser: webpack.getFunctionBySource(mod, "CURRENT_USER_UPDATE"),
  fetchProfile: webpack.getFunctionBySource(mod, "USER_PROFILE_FETCH_START"),
  getUser: webpack.getFunctionBySource(mod, "USER_UPDATE"),
  setFlag: webpack.getFunctionBySource(mod, "setFlag: user cannot be undefined"),
} as ProfileActions;
