import React, { Component } from "react";

export class ErrorBoundary extends Component {
  state = {
    error: null,
    eventId: null,
  };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error });
    console.log(error, errorInfo);
  }

  render() {
    return <div>Error</div>;
  }
}
