import React, { Component } from "react";
import QrReader from "react-qr-scanner";

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: 100,
      result: "No result",
    };

    this.handleScan = this.handleScan.bind(this);
  }

  handleScan(data) {
    if (data && data.text) {
      this.setState({
        result: data.text,
      });
    }
  }

  handleError(err) {
    console.error(err);
  }

  render() {
    const previewStyle = {
      height: 240,
      width: 320,
    };

    return (
      <div>
        <QrReader
          delay={this.state.delay}
          style={previewStyle}
          onError={this.handleError}
          onScan={this.handleScan}
          facingMode="user" // Set the facingMode prop to "user" to use the front-facing camera
        />
        <p>{this.state.result}</p>
      </div>
    );
  }
}

export default Test;
