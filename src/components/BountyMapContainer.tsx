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
    map.data.loadGeoJson('AOI_EPSG4326.json')
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
          zoom={10}
          initialCenter={{
            lat: -4.03,
            lng: 39.6
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
