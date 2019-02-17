import React, { Component } from 'react'
import { Map, GoogleApiWrapper } from 'google-maps-react'

interface IInputMapContainerProps {
  google?: any
  inputComplete: (geoData: any) => void
}

export class InputMapContainer extends Component<IInputMapContainerProps> {
  constructor(props: IInputMapContainerProps) {
    super(props)
    this.handleReturnedMarkers = this.handleReturnedMarkers.bind(this)
  }
  onMapClick(mapProps: any, map: any, clickEvent: any) {
    console.log('onMapClick mapProps, clickEvent ', mapProps, clickEvent)
    map.data.toGeoJson((geojson: any) => {
      // access the geojson
      console.log('geoJson from map!: ', geojson)
    });
  }
  handleReturnedMarkers(...a: any[]) {
    console.log('handleReturnedMarkers: ', a)
  }

  render() {
    return (

      <Map
        google={this.props.google}
        zoom={14}
        initialCenter={{
          lat: -3.7853519,
          lng: 38.5534278
        }}
        fullscreenControl={false}
        onClick={this.onMapClick}
      >
      </Map>
    );
  }
}
const key = String(process.env.REACT_APP_GOOGLE_MAPS_KEY)
export default GoogleApiWrapper({
  apiKey: (key)
})(InputMapContainer)
