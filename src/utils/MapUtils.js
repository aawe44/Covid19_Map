

export const MapUtils = {


    getCovidPoints: function (countyPoints) {

        if (!countyPoints) {
            return {};
        }

        const states = {
            type: 'states',
        }

        for (const point of countyPoints) {
            if (Number.isNaN(point.stats.confirmed)) {
                console.log("got dirty data", point)
                continue
            }

            const country = point.country;
            const province = point.province;
            const coordinates = point.coordinates;
            const confirmed = point.stats.confirmed;
            
            states[country] = states[country] || {}
            states[country][province] = states[country][province] || {
                confirmed: 0,
            }

            states[country][province].confirmed += confirmed;
            
            states[country][province].coordinates = states[country][province].coordinates || coordinates;

        }


        const result = {};
        let i = 1; //zoom level

        for (; i <= 20; i++) {

            if (i <= 9) {

                result[i] = states;

            } else if (i <= 20) {

                result[i] = countyPoints;
            }
        }

        return result;


    },

    isInBoundary: function (bounds, coordinates) {
        return coordinates && bounds && bounds.nw && bounds.se
            && ((bounds.se.lng >= coordinates.longitude && coordinates.longitude >= bounds.nw.lng)
                || (bounds.nw.lng >= coordinates.longitude && coordinates.longitude >= bounds.se.lng)
            )
            && ((coordinates.latitude >= bounds.se.lat && coordinates.latitude <= bounds.nw.lat)
                || (coordinates.latitude <= bounds.se.lat && coordinates.latitude >= bounds.nw.lat)
            );
    },

    get_state_circles(map, maps, state_points) {
        const state_circles = [];
        const points = state_points[9];
        for (const nation in points) {
            for (const state in points[nation]) {

                const confirmed = points[nation][state].confirmed;
                const coordinates = points[nation][state].coordinates;

                let pos = []
                for (const t in coordinates) {
                    pos.push(parseFloat(coordinates[t]))
                }

                const r = confirmed / 10;
                const cityCircle = new maps.Circle({
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#FF0000",
                    fillOpacity: 0.35,
                    map,
                    center: {
                        lat: pos[0],
                        lng: pos[1]
                    },
                    radius: r,
                })

                cityCircle.setMap(null)
                state_circles.push(cityCircle)

            }
        }
        return state_circles
    },

    get_county_circles(map, maps, state_points, boundary) {
        if (!state_points || Object.keys(state_points).length === 0) {
            return []
        }
        const points = state_points[11]
        const county_circle = [];
        for (const county of points) {

            const r = county.stats.confirmed / 10;
            const cityCircle = new maps.Circle({
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
                map,
                center: {
                    lat: parseFloat(county.coordinates.latitude),
                    lng: parseFloat(county.coordinates.longitude)
                },
                radius: r,
            })

            county_circle.push(cityCircle)
            cityCircle.setMap(null)
        }
        return county_circle
    },


    getAllCircle: function (map, maps, state_points, boundary) {
        if (!state_points || state_points === null) {
            return {}
        }

        let state_circles = [];
        let county_circle = [];

        state_circles = this.get_state_circles(map, maps, state_points);
        county_circle = this.get_county_circles(map, maps, state_points, boundary);

        return [state_circles, county_circle]

    }


}