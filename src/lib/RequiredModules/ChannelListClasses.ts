import { util, webpack } from "replugged";

export type ChannelListClasses = Record<
  | "betaTag"
  | "container"
  | "dropdownButton"
  | "dropdownWrapperHighlighted"
  | "hubContainer"
  | "lowerPriceBoostingImg"
  | "lowerPriceBoostingTooltip"
  | "lowerPriceBoostingTooltipHeader"
  | "stageDescription"
  | "stageUpsellInline"
  | "tooltip"
  | "tooltipAsset"
  | "tooltipContainer"
  | "tooltipHeaderContainer"
  | "tooltipIntegrationsPermissionsAsset"
  | "tooltipOverrideColor"
  | "tooltipVideo"
  | "varUpsell"
  | "varUpsellBody"
  | "varUpsellTitle"
  | "varUpsellTooltip"
  | "viewAllChannelsButton"
  | "visibilityHidden",
  string
>;

export default await webpack
  .waitForModule<ChannelListClasses>(webpack.filters.bySource("hubContainer_"), {
    timeout: 10000,
  })
  .then((c) => util.mapClassNames(c))
  .catch(() => {
    throw new Error("Failed To Find ChatListClasses Module");
  });
