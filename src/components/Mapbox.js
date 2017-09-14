import React from 'react'
import mapboxgl from 'mapbox-gl'


class Mapbox extends React.Component {

  componentDidMount() {
    mapboxgl.accessToken = config.MAPBOX_TOKEN;
    var map = new mapboxgl.Map({
    container: 'mapbox-jl',
    style: 'mapbox://styles/mapbox/streets-v10',
    center: [-74.016259, 40.7052529], // starting position
    zoom: 15 // starting zoom
    });
    console.log('map created')

    // Add zoom and rotation controls to the map.
    var nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'bottom-right');
    console.log('control added')
    var marker = new mapboxgl.Marker()
    .setLngLat([-74.016259, 40.7052529]);
    marker.addTo(map)
    console.log('marker added')



  }

  render() {

    console.log('rendering')


    return (
      <div id="mapbox" />
    )
  }

}

export default Mapbox
