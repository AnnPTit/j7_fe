import Head from "next/head";
import { Box, Button, Container, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import React, { Component } from "react";
import QrReader from "react-qr-scanner";

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: 100,
      result: "No result",
      cameraEnabled: true, // Initial camera state (enabled)
    };

    this.handleScan = this.handleScan.bind(this);
    this.handleError = this.handleError.bind(this);
    this.toggleCamera = this.toggleCamera.bind(this);
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

  toggleCamera() {
    this.setState((prevState) => ({
      cameraEnabled: !prevState.cameraEnabled,
    }));
  }

  render() {
    const { delay, result, cameraEnabled } = this.state;
    const previewStyle = {
      height: 240,
      width: 320,
      transform: cameraEnabled ? "scaleX(-1)" : "none",
    };

    return (
      <div>
        {cameraEnabled ? (
          <QrReader
            delay={delay}
            style={previewStyle}
            onError={this.handleError}
            onScan={this.handleScan}
          />
        ) : (
          <div>Camera is disabled.</div>
        )}
        <p>{result}</p>
        <Button onClick={this.toggleCamera}>
          {cameraEnabled ? "Disable Camera" : "Enable Camera"}
        </Button>
      </div>
    );
  }
}

const Page = () => (
  <div>
    <Head>{/* Add your head content here */}</Head>
    <Test />
  </div>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
