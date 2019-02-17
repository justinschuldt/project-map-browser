import React, { Component } from 'react'
import InputMapContainer from './InputMapContainer'

interface IInputPageProps {
  match: any
  web3: any
}

export class InputPage extends Component<IInputPageProps> {
  constructor(props: IInputPageProps) {
    super(props)
    this.submitBounty = this.submitBounty.bind(this)
  }
  submitBounty(geoData: any) {
    console.log('submitBounty geoData: ', geoData)
    // TODO: send the geoData up
    // this.props.web3
  }
  render() {
    console.log(`inputPage rendered for bountyId: ${this.props.match.params.id}`)
    return (
      <InputMapContainer inputComplete={this.submitBounty} />
    );
  }
}

export default InputPage
