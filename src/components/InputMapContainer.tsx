import React, { Component } from 'react'
import { Map, GoogleApiWrapper } from 'google-maps-react'
import { Button, Card, Icon, Modal } from 'antd'
import { Feature } from '../data/AOI_JSON';

interface IInputMapContainerProps {
  google?: any
  inputComplete: (geoData: any) => void
  feature: Feature
}
interface PolylineFeature {
  type: string,
  geometry: {
    type: string,
    coordinates: any[]
  },
  properties: {
    [propKey: string]: any
  }
}

export class InputMapContainer extends Component<IInputMapContainerProps> {
  polyline: any
  polygon: any
  map: any
  google: any
  state: {
    submitting: boolean
    showSuccessModal: boolean
  }
  constructor(props: IInputMapContainerProps) {
    super(props)
    this.state = {
      submitting: false,
      showSuccessModal: false

    }
    this.addLatLng = this.addLatLng.bind(this)
    this.onMapReady = this.onMapReady.bind(this)
    this.submitStructure = this.submitStructure.bind(this)
    this.dismissSuccess = this.dismissSuccess.bind(this)
  }
  onMapReady(mapProps: any, map: any) {
    // forgive me, but it works
    // setTimeout(() => map.setZoom(10), 1400)
    setTimeout(() => map.setZoom(11), 1600)
    setTimeout(() => map.setZoom(12), 2000)
    setTimeout(() => map.setZoom(13), 2200)
    setTimeout(() => map.setZoom(14), 2400)

    const { google } = mapProps
    this.google = google
    this.map = map
    this.polyline = new this.google.maps.Polyline({
      strokeColor: '#FF5E00',
      strokeOpacity: 1.0,
      strokeWeight: 3
    });
    this.polyline.setMap(this.map);

    // Add a listener for the click event
    this.map.addListener('click', this.addLatLng);
  }
  addLatLng(event: any) {
    var linePath = this.polyline.getPath();
    // Because path is an MVCArray, we can simply append a new coordinate
    // and it will automatically appear.
    linePath.push(event.latLng);

    // create polygon data
    const polygonCoords = []
    for (var i = 0; i < linePath.getLength(); i++) {
      var pt = linePath.getAt(i)
      const lat = pt.lat()
      const lng = pt.lng()
      if (lat && lng) {
        polygonCoords.push({ lat, lng })
      }
    }

    if (linePath.getLength() === 3) {
      this.polygon = new this.google.maps.Polygon({
        paths: polygonCoords,
        strokeColor: '#FF5E00',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        editable: true
      });

      // draw a polygon
      this.polygon.setMap(this.map)
      // remove polyline
      //this.polyline.setMap(null)
    } else if (linePath.getLength() >= 3) {
      this.polygon.setPath(polygonCoords);
    }


    // Add a new marker at the new plotted point on the polyline.
    var marker = new this.google.maps.Marker({
      position: event.latLng,
      // name: 'marker name',
      // title: '#' + linePath.getLength(),
      map: this.map,
      draggable: true,
      icon: {
        path: this.google.maps.SymbolPath.CIRCLE,
        fillColor: '#FF5E00',
        fillOpacity: 0.6,
        strokeColor: '#000000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        scale: 3
      }
    });
  }

  submitStructure() {
    this.setState(() => ({
      submitting: true
    }))

    var geoJson: {
      type: string,
      features: PolylineFeature[]
    } = {
      type: "FeatureCollection",
      features: []
    };
    var polylineFeature: PolylineFeature = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: []
      },
      properties: {},

    };
    for (var i = 0; i < this.polyline.getPath().getLength(); i++) {
      var pt = this.polyline.getPath().getAt(i)
      polylineFeature.geometry.coordinates.push([
        pt.lng(), pt.lat()]);
    }
    geoJson.features.push(polylineFeature);

    this.map.data.addGeoJson(geoJson);

    this.map.data.setStyle({
      fillColor: '#36db2e',
      // fillOpacity: 0.,
      strokeColor: '#3ae031',
      strokeWeight: 4
    });
    this.map.data.toGeoJson((data: any) => {
      console.log('toGeoJson, about to submit: ', data)
      this.props.inputComplete(data)

      setTimeout(() => {
        this.setState(() => ({
          submitting: false,
          showSuccessModal: true
        }))
      }, 3000)
    });
  }
  dismissSuccess() {
    this.setState(() => ({
      showSuccessModal: false
    }))
  }

  render() {
    return (
      <>
        <Card title={this.props.feature.properties.name} bordered={false} style={{ width: '100%' }}>
          <div>
            <p>Report areas with stagnant water</p>
            <p>Each submission earns $4</p>
            <p>Bounty expires on February 24th, 8:00am local time</p>
            <p>Touch the map to get started...</p>
          </div>
        </Card>
        <Map
          google={this.props.google}
          zoom={7}
          initialCenter={{
            lat: -3.7853519,
            lng: 38.5534278
          }}
          onReady={this.onMapReady}
          fullscreenControl={false}
          streetViewControl={false}
          gestureHandling={'greedy'}
        >
        </Map>
        <div style={{ position: 'absolute', bottom: 35, right: 85 }}>
          <Button type="primary" shape="circle" size="large" loading={this.state.submitting} onClick={this.submitStructure} ><Icon type="cloud-upload" /></Button>
        </div>
        <Modal
          title="Success!"
          visible={this.state.showSuccessModal}
          footer={[
            <Button key="submit" type="primary" onClick={this.dismissSuccess}>
              Done
            </Button>
          ]}
        >
          <p>Your submission was accepted.</p>
          <p>It will be reviewed, check the <a href="/users">users page</a> for updates.</p>
          <p>Thanks for contributing to Project Map.</p>
        </Modal>
      </>
    );
  }
}
const key = String(process.env.REACT_APP_GOOGLE_MAPS_KEY)
export default GoogleApiWrapper({
  apiKey: (key)
})(InputMapContainer)
