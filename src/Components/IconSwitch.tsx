import { common, components } from "replugged";
import * as Types from "../types";
const { React } = common;
const SwitchItem = components.SwitchItem as unknown as Types.SwitchItem;

export class IconSwitch extends React.Component<Types.IconSwitch> {
  render() {
    return (
      <div>
        <SwitchItem {...this.props}>
          <div>
            {this.props.icon && (
              <img
                {...{
                  src: this.props.icon,
                  width: 32,
                  height: 32,
                  style: {
                    borderRadius: "360px",
                  },
                }}
              />
            )}
            <div
              {...{
                style: this.props.icon
                  ? {
                      display: "inline",
                      fontSize: "22px",
                      position: "relative",
                      bottom: "7.5px",
                      left: "2.5px",
                    }
                  : {},
              }}>
              {this.props.title || this.props.children}
            </div>
          </div>
        </SwitchItem>
      </div>
    );
  }
}
