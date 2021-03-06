import React, { Component } from 'react'
import { Map, GoogleApiWrapper } from 'google-maps-react'
import { Button, Card, Icon, Modal, Spin } from 'antd'
import { Feature } from '../data/AOI_JSON';
import { Link } from 'react-router-dom';
interface IInputMapContainerProps {
  google?: any
  inputComplete: (geoData: any) => Promise<any>
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
    setTimeout(() => map.setZoom(9), 1600)
    setTimeout(() => map.setZoom(11), 2000)
    setTimeout(() => map.setZoom(12), 2200)
    setTimeout(() => map.setZoom(13), 2400)
    setTimeout(() => map.setZoom(14), 2600)
    setTimeout(() => map.setZoom(15), 2800)
    setTimeout(() => map.setZoom(16), 3000)
    setTimeout(() => map.setZoom(17), 3200)
    setTimeout(() => map.setZoom(18), 3400)

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
    this.map.data.toGeoJson(async (data: any) => {
      console.log('toGeoJson, about to submit: ', data)
      try {
        await this.props.inputComplete(data)
        console.log('input complete returned')
        this.setState(() => ({
          submitting: false,
          showSuccessModal: true
        }))

      } catch (e) {
        console.log('submit failed. e: ', e)
      }

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
        <Spin spinning={this.state.submitting} tip="Storing your submission..." >
          <Card title={this.props.feature.properties.name} bordered={false} style={{ width: '100%' }}>
            <div>
              <p><span style={{ fontWeight: 500, fontSize: 16 }}>Objective: </span>Report areas with stagnant water</p>
              <p><span style={{ fontWeight: 500, fontSize: 16 }}>Reward: </span> Each submission earns $4</p>
              <p><span style={{ fontWeight: 500, fontSize: 16 }}>Timeframe: </span> Bounty expires on February 24th, 8:00am local time</p>
            </div>
          </Card>
        </Spin>
        <Map
          google={this.props.google}
          zoom={7}
          initialCenter={{
            lat: -4.002427,
            lng: 39.5580713
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
          <p>It will be reviewed, check the <Link to="/user">users page</Link> for updates.</p>
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
