import { common, components } from "replugged";
const { React } = common;
const { Text, Clickable } = components;

class Open extends React.Component {
  render() {
    return (
      <img
        {...{
          src: "https://tharki-god.github.io/files-random-host/arrow%20icon.svg",
          width: 16,
          height: 16,
        }}
      />
    );
  }
}

class Closed extends React.Component {
  render() {
    return (
      <img
        {...{
          src: "https://tharki-god.github.io/files-random-host/arrow%20icon.svg",
          width: 16,
          height: 16,
          style: {
            transition: "transform .3s ease",
            transform: "rotate(-90deg)",
          },
        }}
      />
    );
  }
}

export class SettingsGroup extends React.Component {
  constructor(props) {
    super(props);
    // eslint-disable-next-line no-implicit-coercion
    this.state = { open: !!props.shown };
  }
  toggle() {
    this.setState({
      open: !this.state.open,
    });
  }

  render() {
    return (
      <div
        {...{
          style: {
            padding: this.state.open ? "0px 0px 0px 0px" : "0px 0px 10px 0px",
          },
        }}>
        <Clickable
          {...{
            onClick: () => this.toggle(),
            style: {
              display: "flex",
            },
          }}>
          {this.state.open ? <Open /> : <Closed />}
          <Text.Eyebrow>{this.props.name}</Text.Eyebrow>
        </Clickable>
        <div
          {...{
            style: {
              display: this.state.open ? "block" : "none",
              padding: "10px 0px 0px 0px",
            },
          }}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
