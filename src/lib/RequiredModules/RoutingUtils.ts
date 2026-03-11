import { webpack } from "replugged";

export interface RoutingUtils {
  back: () => void;
  forward: () => void;
  transitionTo: (href: string) => void;
}

const mod = await webpack
  .waitForModule(webpack.filters.bySource("transitionTo - Transitioning to"), {
    timeout: 10000,
    raw: true,
  })
  .catch(() => {
    throw new Error("Failed To Find RoutingUtils Module");
  });

export default {
  back: webpack.getFunctionBySource(mod, "goBack()"),
  forward: webpack.getFunctionBySource(mod, "goForward()"),
  getFingerprintLocation: webpack.getFunctionBySource(mod, ".REJECT_IP"),
  isValidFingerprintRoute: webpack.getFunctionBySource(mod, ".HANDOFF"),
  replaceWith: webpack.getFunctionBySource(mod, "Replacing route with"),
  transitionTo: webpack.getFunctionBySource(mod, "transitionTo - Transitioning to"),
  transitionToGuild: webpack.getFunctionBySource(mod, "transitionToGuild - Transitioning to"),
} as RoutingUtils;
