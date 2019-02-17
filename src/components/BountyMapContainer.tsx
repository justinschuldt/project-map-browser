import React, { Component } from 'react'
import { Map, GoogleApiWrapper } from 'google-maps-react';
import { Card, List } from 'antd'
import { Link } from 'react-router-dom'
import { mockData } from '../data/AOI_JSON'

interface IMapContainerProps {
  google?: any
}

export class BountyMapContainer extends Component<IMapContainerProps> {
  loadGeojson(mapProps: any, map: any) {
    const { google } = mapProps
    map.data.setStyle(() => {
      return {
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#FF5E00',
          strokeColor: '#5e3509',
          strokeWeight: 2,
        },

        fillColor: '#FF5E00',
        fillOpacity: 0.6,
        strokeColor: '#5e3509',
        strokeWeight: 2,
        scale: 3
      };
    });
    // 🤷‍♀️👨‍🔧
    setTimeout(() => map.setZoom(7), 1600)
    setTimeout(() => map.setZoom(8), 2000)
    setTimeout(() => map.setZoom(9), 2200)
    setTimeout(() => map.setZoom(10), 2400)
    setTimeout(() => {
      // load the bounty regions while zooming in
      map.data.loadGeoJson('AOI_EPSG4326.json')
      map.setZoom(11)
    }, 2600)
    setTimeout(() => {
      map.setZoom(13)
    }, 3100)
    setTimeout(() => {
      // add markers when zooming is complete
      map.data.loadGeoJson('PointsClip_EPSG4326_Thin.json')
    }, 3300)


  }
  render() {
    return (
      <>
        <Card title="Bounty Areas" bordered={false} style={{ width: '100%' }}>
          <List
            size="small"
            bordered={false}
            dataSource={mockData.features}
            renderItem={(item: any) => (<List.Item><Link to={`/bounty/${item.properties.fid}`} >{item.properties.name}</Link></List.Item>)}
          />
        </Card>
        <Map
          google={this.props.google}
          zoom={4}
          initialCenter={{
            lat: -4.0385066,
            lng: 39.649095
          }}
          fullscreenControl={false}
          streetViewControl={false}
          onReady={this.loadGeojson}
        >
        </Map>
      </>
    );
  }
}

const key = String(process.env.REACT_APP_GOOGLE_MAPS_KEY)
export default GoogleApiWrapper({
  apiKey: (key)
})(BountyMapContainer)
