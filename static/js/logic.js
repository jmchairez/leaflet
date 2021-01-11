const earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

const earthquakes = new L.LayerGroup();

const darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Â© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> Â© <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 524,
    maxZoom: 19,
    zoomOffset: -1,
    id: "dark-v10",
    accessToken: API_KEY
});

const lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Â© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> Â© <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 524,
    maxZoom: 19,
    zoomOffset: -1,
    id: "light-v10",
    accessToken: API_KEY
});

const outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Â© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> Â© <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 524,
    maxZoom: 19,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
});

const satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Â© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> Â© <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 524,
    maxZoom: 19,
    zoomOffset: -1,
    id: "mapbox/satellite-streets-v11",
    accessToken: API_KEY
});

const streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Â© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> Â© <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 524,
    maxZoom: 19,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});


const baseMaps = {
    "Dark Mode": darkMap,
    "Light Mode": lightMap,
    "Outdoor Mode": outdoorMap,
    "Satellite Mode": satelliteMap,
    "Street Mode": streetMap
};


const overlayMaps = {
    "Earthquakes": earthquakes,
};


const myMap = L.map("map", {
    center: [35.30, -92.00],
    zoom: 5,
    layers: [lightMap, earthquakes]
});


L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

d3.json(earthquakesURL, function(earthquakeData) {

    function markerSize(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 2.9;
    }

    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: markerSize(feature.properties.mag),
            stroke: true,
            weight: 0.4
        };
    }

    
    function getColor(magnitude) {
        switch (true) {
        case magnitude > 5:
            return "#bd0026";
        case magnitude > 4:
            return "#f03b20";
        case magnitude > 3:
            return "#fd8d3c";
        case magnitude > 2:
            return "#feb24c";
        case magnitude > 1:
            return "#fed976";
        default:
            return "#ffffb2";
        }
    }

    L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h4> Earthquake Location: " + feature.properties.place + "</h4> <hr> <p> Earthquake Date & Time: " 
            + new Date(feature.properties.time) + "</p> <hr> <p> Earthquake Magnitude: " + feature.properties.mag + "</p>");
        }

    }).addTo(earthquakes);

    earthquakes.addTo(myMap);



    const legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        const div = L.DomUtil.create("div", "info legend"), 
        magnitudeLevels = [0, 1, 2, 3, 4, 5];

        div.innerHTML += "<h3> Earthquake Magnitude </h3> <hr>"

        for (var i = 0; i < magnitudeLevels.length; i++) {
            div.innerHTML +=
                '<i style="background: ' + getColor(magnitudeLevels[i] + 1) + '"></i> ' +
                magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(myMap);
});