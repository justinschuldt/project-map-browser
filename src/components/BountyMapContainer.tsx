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
        // styles={[
        //   { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
        //   { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
        //   { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        //   {
        //     featureType: 'administrative.locality',
        //     elementType: 'labels.text.fill',
        //     stylers: [{ color: '#d59563' }]
        //   },
        //   {
        //     featureType: 'poi',
        //     elementType: 'labels.text.fill',
        //     stylers: [{ color: '#d59563' }]
        //   },
        //   {
        //     featureType: 'poi.park',
        //     elementType: 'geometry',
        //     stylers: [{ color: '#263c3f' }]
        //   },
        //   {
        //     featureType: 'poi.park',
        //     elementType: 'labels.text.fill',
        //     stylers: [{ color: '#6b9a76' }]
        //   },
        //   {
        //     featureType: 'road',
        //     elementType: 'geometry',
        //     stylers: [{ color: '#38414e' }]
        //   },
        //   {
        //     featureType: 'road',
        //     elementType: 'geometry.stroke',
        //     stylers: [{ color: '#212a37' }]
        //   },
        //   {
        //     featureType: 'road',
        //     elementType: 'labels.text.fill',
        //     stylers: [{ color: '#9ca5b3' }]
        //   },
        //   {
        //     featureType: 'road.highway',
        //     elementType: 'geometry',
        //     stylers: [{ color: '#746855' }]
        //   },
        //   {
        //     featureType: 'road.highway',
        //     elementType: 'geometry.stroke',
        //     stylers: [{ color: '#1f2835' }]
        //   },
        //   {
        //     featureType: 'road.highway',
        //     elementType: 'labels.text.fill',
        //     stylers: [{ color: '#f3d19c' }]
        //   },
        //   {
        //     featureType: 'transit',
        //     elementType: 'geometry',
        //     stylers: [{ color: '#2f3948' }]
        //   },
        //   {
        //     featureType: 'transit.station',
        //     elementType: 'labels.text.fill',
        //     stylers: [{ color: '#d59563' }]
        //   },
        //   {
        //     featureType: 'water',
        //     elementType: 'geometry',
        //     stylers: [{ color: '#17263c' }]
        //   },
        //   {
        //     featureType: 'water',
        //     elementType: 'labels.text.fill',
        //     stylers: [{ color: '#515c6d' }]
        //   },
        //   {
        //     featureType: 'water',
        //     elementType: 'labels.text.stroke',
        //     stylers: [{ color: '#17263c' }]
        //   }
        // ]}
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
