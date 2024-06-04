import { React } from "replugged/common";
import { PluginLogger, SettingValues } from "../index";
import { defaultSettings } from "../lib/consts";
import Utils from "../lib/utils";
export default React.memo((props: object) => {
  const [svgToMap, setSvgToMap] = React.useState<{
    viewBox?: string;
    children?: Array<
      [
        (
          | (string &
              React.FC<{
                fill?: string;
              }>)
          | string
        ),
        Record<string, string>,
      ]
    >;
  }>({});
  const abortion = new AbortController();
  React.useEffect(() => {
    const fetchSvgToObject = async () => {
      try {
        const svgURL = SettingValues.get(
          "customHiddenChannelIcon",
          defaultSettings.customHiddenChannelIcon,
        );
        const svgTexts = await fetch(svgURL, { signal: abortion.signal }).then((res) => res.text());
        if (!Utils.isTextSvgHtml(svgTexts)) {
          setSvgToMap({});
          return;
        }
        const parser = new DOMParser();
        const container = parser.parseFromString(svgTexts, "image/svg+xml");
        const svgElement = container.querySelector("svg");

        if (!svgElement) {
          setSvgToMap({});
          return;
        }
        const viewBox = svgElement.getAttribute("viewBox");
        const children = Array.from(svgElement.children).map((child) => {
          const elementType = child.tagName.toLowerCase();
          const elementAttributes = Object.fromEntries(
            Array.from(child.attributes).map((attribute) => [attribute.name, attribute.value]),
          );

          return [
            elementType,
            elementType === "style"
              ? { dangerouslySetInnerHTML: { __html: child.textContent }, ...elementAttributes }
              : { fill: "currentColor", ...elementAttributes },
          ];
        }) as Array<[string, Record<string, string>]>;

        setSvgToMap({
          viewBox: viewBox || "",
          children: children || [],
        });
      } catch (error) {
        PluginLogger.error(`Error Mapping SVG: ${error}`);
      }
    };
    void fetchSvgToObject();
    return () => abortion.abort();
  }, [
    SettingValues.get("customHiddenChannelIcon", defaultSettings.customHiddenChannelIcon),
    props,
  ]);
  return (
    <svg {...props} viewBox={svgToMap.viewBox}>
      {svgToMap.children?.map(([TagName, attributeValue]) => (
        <TagName {...attributeValue} />
      ))}
    </svg>
  );
});
