import { common, components } from "replugged";
const { React } = common;
const { SwitchItem } = components;

export class IconSwitch extends React.Component {
  render() {
    return (
      <div>
        <SwitchItem {...this.props}>
          <div>
            {" "}
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
              {this.props.children}
            </div>
          </div>
        </SwitchItem>
      </div>
    );
  }
}
