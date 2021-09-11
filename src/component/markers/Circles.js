

export default function renderMark(zoom, state_circles, county_circles, map) {
    function setMapOnAll(markers, map) {
        markers.map(circle => circle.setMap(map));
    }

    function hideMarkers(markers) {
        setMapOnAll(markers, null);
    }

    function showMarkers(markers, map) {
        setMapOnAll(markers, map);
    }

    if (zoom <= 6) {
        showMarkers(state_circles, map);
        hideMarkers(county_circles);
    } else {
        showMarkers(county_circles, map);
        hideMarkers(state_circles);
    }


};