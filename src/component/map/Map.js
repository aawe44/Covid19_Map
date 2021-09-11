import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { MapService } from '../../service/MapService';
import { MapUtils } from '../../utils/MapUtils';
import renderMark from '../markers/Circles';


class Map extends Component {
    static defaultProps = {
        center: {
            lat: 40.2,
            lng: -77.3,
        },
        zoom: 11
    };

    state = {
        zoom: 11,
        boundary: {},
        points: {},
        s_map: {},
        s_maps: {},
        state_circles: [],
        county_circles: [],
    }

    render() {
        return (
            // Important! Always set the container height explicitly
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{
                        key: "",
                        language: "en",
                        region: "en"
                    }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                    yesIWantToUseGoogleMapApiInternals

                    onGoogleApiLoaded={({ map, maps }) => {
                        MapService.getUSCovidData()
                            .then((response) => {
                                const covidDataPoints = MapUtils.getCovidPoints(response.data)
                                const [state_circles, county_circles] = MapUtils.getAllCircle(map, maps, covidDataPoints, this.state.boundary)
                                console.log(covidDataPoints)
                                this.setState({
                                    points: covidDataPoints,
                                    s_map: map,
                                    s_maps: maps,
                                    state_circles: state_circles,
                                    county_circles: county_circles,
                                });
                            })
                            .catch(error => console.error(error))
                    }}
                    onChange={(changeObject) => {
                        this.setState({
                            zoom: changeObject.zoom,
                            boundary: changeObject.bounds,
                        })
                    }}
                >
                    {renderMark(this.state.zoom, this.state.state_circles, this.state.county_circles, this.state.s_map)}

                </GoogleMapReact>
            </div>
        );
    };
}


export default Map;