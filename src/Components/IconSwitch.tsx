import { React } from "replugged/common";
import { Divider, Flex, Switch, Text } from "replugged/components";
import Types from "../types";

export default React.memo((props: Types.IconSwitch) => {
  return (
    <div style={{ marginTop: "12.5px" }}>
      <Flex>
        <div style={{ display: "flex", maxWidth: "100%", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
            {props.icon && props.icon.includes("https://") ? (
              <img
                src={props.icon}
                width={52}
                height={52}
                style={{ borderRadius: "50%", marginRight: "10px" }}
                alt="Icon"
              />
            ) : (
              <div
                className="shc-noIcon"
                style={{ borderRadius: "50%", marginRight: "10px", width: "52px", height: "52px" }}>
                {props.icon}
              </div>
            )}
            <Text.H2
              style={{
                marginBottom: "5px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "80%",
              }}>
              {props.title || props.children}
            </Text.H2>
            <div
              style={{
                marginLeft: "auto",
                marginRight: "10px",
                flexShrink: 0,
                alignItems: "center",
              }}>
              <Switch checked={props.value} onChange={props.onChange} disabled={props.disabled} />
            </div>
          </div>
          <Text.Normal style={{ marginTop: "7.5px", textAlign: "center" }}>
            {props.note}
          </Text.Normal>
        </div>
      </Flex>
      <Divider style={{ marginTop: "12.5px" }} />
    </div>
  );
});
