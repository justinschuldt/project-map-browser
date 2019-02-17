import React, { Component } from 'react'
import InputMapContainer from './InputMapContainer'

interface IInputPageProps {
  match: any
  web3: any
  submitBounty?: (bountyId: number, data: any) => void
}

export class InputPage extends Component<IInputPageProps> {
  constructor(props: IInputPageProps) {
    super(props)
    this.submitBounty = this.submitBounty.bind(this)
  }
  submitBounty(geoData: any) {
    console.log('InputPage.submitBounty() geoData: ', geoData)
    // this.props.submitBounty(this.props.match.params.id, geoData)
  }
  render() {
    console.log(`inputPage rendered for bountyId: ${this.props.match.params.id}`)
    return (
      <InputMapContainer inputComplete={this.submitBounty} />
    );
  }
}

export default InputPage
