import React, { Component } from 'react'
import QrReader from 'react-qr-scanner'
import Bottle from "./Bottle";
 
class QrCodeReader extends Component {
  constructor(props){
    super(props)
    this.state = {
      hasResult: false,
      hasScanned: false,
      delay: 100,
      result: null,
    }
 
    this.handleScan = this.handleScan.bind(this)
  }
  handleScan(data){
    this.setState({
      result: data,
    })
  }
  handleError(err){
    console.error(err)
  }

  render(){
    const previewStyle = {
      height: 240,
      width: 320,
    }


    const {  result, hasResult, hasScanned } = this.state;
    const setPairBool = (key, value) => {
      this.setState({[key]: value})
    }
 
    return(
      <div>
        <QrReader
          delay={this.state.delay}
          style={previewStyle}
          onError={this.handleError}
          onScan={this.handleScan}
          />
          
        <Bottle result={result} hasResult={hasResult} hasScanned={hasScanned} setPairBool={setPairBool} setProductsChange={this.props.setProductsChange} setQuantity={this.props.setQuantity}/>

      </div>
    )
  }
}

export default QrCodeReader;