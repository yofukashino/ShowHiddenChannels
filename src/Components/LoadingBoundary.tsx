import { common, components } from "replugged";
import { PluginLogger } from "../index";
import * as Types from "../types";
const { React } = common;
const { Loader } = components;
export class LoadingBoundary extends React.PureComponent<
  Types.LoadingBoundaryProps,
  Types.LoadingBoundaryState
> {
  constructor(props: Types.LoadingBoundaryProps) {
    super(props);
    this.state = {
      loaded: false,
    };
  }
  componentDidCatch() {
    PluginLogger.warn(
      "An error has occurred. Do Not Contact the developer for help, its Normal, if the page still loads!",
    );
    this.setState({
      loaded: false,
    });
  }
  render() {
    const { loaded } = this.state;
    setTimeout(() => {
      this.setState({
        loaded: true,
      });
    }, 1000);
    if (!loaded)
      return (
        <div
          {...{
            className: "shc-loading-container",
            style: {
              textAlign: "center",
              margin: "auto",
            },
          }}>
          <Loader
            {...{
              animated: true,
              className: "shc-loading",
              itemClassName: "shc-loading-components",
              type: Loader.Type.LOW_MOTION,
            }}
          />
        </div>
      );
    return this.props.children;
  }
}
