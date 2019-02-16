import React, { Component } from 'react'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

interface IMapContainerProps {
  google?: any
}

export class MapContainer extends Component<IMapContainerProps> {
  latitude: any
  longitude: any
  constructor(props: IMapContainerProps) {
    super(props)
    console.log('process.env.REACT_APP_GOOGLE_MAPS_KEY: ', process.env.REACT_APP_GOOGLE_MAPS_KEY)
  }

  render() {
    return (
      <Map
        google={this.props.google}
        zoom={14}
        initialCenter={{
          lat: 39.7325764,
          lng: -105.0002149
        }}
      >
        <Marker />

        <InfoWindow
          google={this.props.google}
        >
          <div>
            <h1>{`info window text`}</h1>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

const key = String(process.env.REACT_APP_GOOGLE_MAPS_KEY)
export default GoogleApiWrapper({
  apiKey: (key)
})(MapContainer)
