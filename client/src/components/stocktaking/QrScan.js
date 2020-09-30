import React, { Fragment, Component } from "react";
import QrReader from "react-qr-scanner";
import Bottle from "./Bottle";

// react-qr-scaner component. takes care of camera access and scanning for QR codes.
class QrCodeReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasResult: false,
      hasScanned: false,
      delay: 100,
      result: null,
    };

    this.handleScan = this.handleScan.bind(this);
  }
  handleScan(data) {
    this.setState({
      result: data,
    });
  }
  handleError(err) {
    console.error(err);
  }

  render() {
    const previewStyle = {
      height: 240,
      width: 320,
    };

    const { result, hasResult, hasScanned } = this.state;
    const setPairBool = (key, value) => {
      this.setState({ [key]: value });
    };

    return (
      <Fragment>
        <div className="d-flex justify-content-center">
          <QrReader
            delay={this.state.delay}
            style={previewStyle}
            onError={this.handleError}
            onScan={this.handleScan}
          />
        </div>
        <div className="d-flex justify-content-center">
          <Bottle
          
            result={result}
            hasResult={hasResult}
            hasScanned={hasScanned}
            setPairBool={setPairBool}
            setQuantityChange={this.props.setQuantityChange}
            setQuantity={this.props.setQuantity}
          />
        </div>
      </Fragment>
    );
  }
}

export default QrCodeReader;
