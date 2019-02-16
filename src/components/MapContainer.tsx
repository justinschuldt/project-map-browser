import React, { Component } from 'react'
import { Map, InfoWindow, GoogleApiWrapper, Polygon } from 'google-maps-react';
import { mockData, FormattedPoint } from '../data/AOI_JSON'

interface IMapContainerProps {
  google?: any
}

export class MapContainer extends Component<IMapContainerProps> {
  latitude: any
  longitude: any
  constructor(props: IMapContainerProps) {
    super(props)
    this.bountyClicked = this.bountyClicked.bind(this)
  }
  bountyClicked(bountyId: number) {
    return (...items: any[]) => {
      console.log('items: ', items)
      console.log('bountyId: ', bountyId)
    }
  }
  render() {
    const { features } = mockData
    const featuresWithFormattedPoints = features.map(feature => {
      const points = feature.geometry.coordinates[0]

      const formattedPoints = points.reduce((accum: FormattedPoint[], p: number[]) => {
        if (p[0] && p[1]) {
          accum.push({
            lat: p[0],
            lng: p[1]
          })
        }
        return accum
      }, [])
      feature.formattedPoints = formattedPoints
      return feature
    })

    // hack to make each poly a differnt color 
    const colorHack = [{
      strokeColor: '#4286f4',
      fillColor: '#4286f4'
    }, {
      strokeColor: '#42f450',
      fillColor: '#42f450'
    }, {
      strokeColor: '#f48941',
      fillColor: '#f48941'
    }, {
      strokeColor: '#b541f4',
      fillColor: '#b541f4'
    }, {
      strokeColor: '#87731b',
      fillColor: '#87731b'
    }]

    return (
      <Map
        google={this.props.google}
        zoom={11}
        initialCenter={{
          lat: 39.526916205904911,
          lng: -4.008829069511703
        }}
      >
        {featuresWithFormattedPoints.map((feature, i) => {
          return (
            <Polygon
              key={feature.properties.name}
              paths={feature.formattedPoints}
              strokeColor={colorHack[i].strokeColor || "#0000FF"}
              strokeOpacity={0.8}
              strokeWeight={2}
              fillColor={colorHack[i].fillColor || "#0000FF"}
              fillOpacity={0.35}
              onClick={this.bountyClicked(feature.properties.fid)}
            />
          )
        })}

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
