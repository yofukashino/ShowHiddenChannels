import { React } from "replugged/common";
import { Divider, Flex, Switch, Text } from "replugged/components";
import Types from "../types";

export default React.memo((props: Types.IconSwitch) => {
  return (
    <div
      {...{
        style: {
          marginTop: "12.5px",
        },
      }}>
      <Flex>
        <Flex>
          <div
            {...{
              style: {
                display: "inline",
                position: "relative",
              },
            }}>
            {props.icon && (
              <img
                {...{
                  src: props.icon,
                  width: 52,
                  height: 52,
                  style: {
                    borderRadius: "360px",
                  },
                }}
              />
            )}
            <Text.H2
              {...{
                style: props.icon
                  ? {
                      display: "inline",
                      position: "relative",
                      bottom: "20.5px",
                      left: "3.5px",
                    }
                  : {},
              }}>
              {props.title || props.children}
            </Text.H2>
            <Text.Normal
              {...{
                style: {
                  display: "block",
                  position: "relative",
                  bottom: "15px",
                  left: "55.5px",
                },
              }}>
              {props.note}
            </Text.Normal>
          </div>
        </Flex>
        <div
          {...{
            style: {
              marginTop: "15px",
              minWidth: "16px",
              maxWidth: "16px",
            },
          }}>
          <Switch
            {...{
              checked: props.value,
              onChange: props.onChange,
              disabled: props.disabled,
            }}
          />
        </div>
      </Flex>
      <Divider
        {...{
          style: {
            marginTop: "2.5px",
          },
        }}
      />
    </div>
  );
});
