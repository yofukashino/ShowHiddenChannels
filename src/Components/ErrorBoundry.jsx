import { common } from "replugged";

const { React } = common;

import { TextElement } from "../lib/requiredModules.jsx";

import { PluginLogger } from "../index.jsx";

const encounteredErrors = [];

export const ErrorBoundary = class ErrorBoundary extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }
  componentDidCatch(error) {
    this.setState({
      hasError: true,
      error,
    });
  }
  render() {
    const { hasError, error } = this.state;
    if (hasError) {
      if (!encounteredErrors.includes(error)) {
        PluginLogger.error("An error has occurred. Do Not Contact the developer for help!");
        encounteredErrors.push(error);
      }
      this.setState({
        hasError: false,
        error: null,
      });
      return (
        <div>
          <TextElement
            {...{
              color: TextElement.Colors.HEADER_PRIMARY,
              size: TextElement.Sizes.SIZE_32,
              style: {
                marginTop: 20,
                fontWeight: "bold",
              },
            }}>
            Error Loading Hidden Channel Info ;-;
          </TextElement>
        </div>
      );
    }
    return this.props.children;
  }
};
