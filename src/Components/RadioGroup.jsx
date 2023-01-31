import { common, components } from "replugged";
const { React } = common;
const { Text, Divider } = components;
import { RadioGroupComponent } from "../lib/requiredModules.jsx";

export class RadioGroup extends React.Component {
  render() {
    return (
      <div>
        <div
          {...{
            style: {
              padding: "0px 0px 10px 0px",
            },
          }}>
          <Text.H3>{this.props.name}</Text.H3>
        </div>

        <div
          {...{
            style: {
              padding: "0px 0px 10px 0px",
            },
          }}>
          <Text.Normal>{this.props.note}</Text.Normal>
        </div>
        <RadioGroupComponent
          {...{
            options: this.props.options,
            onChange: ({ value }) => this.props.onChange(value),
            value: this.props.value,
          }}
        />
        <Divider
          {...{
            style: {
              padding: "0px 0px 20px 0px",
            },
          }}
        />
      </div>
    );
  }
}
