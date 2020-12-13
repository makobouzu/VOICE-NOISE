mapboxgl.accessToken = 'pk.eyJ1IjoibWFrb2JvdXp1IiwiYSI6ImNrYWF5and0MzFhYnMyc214ZGo3OWd3cHQifQ.pPCfwEss5pJhm4Yu7kvj1w';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/light-v10',
center: [136.6401445,35.3682434],
zoom: 13
});

var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    language: 'ja',
    placeholder: 'Recorded at.',
    marker: {
        color: '#727475'
    },
    mapboxgl: mapboxgl
});
var geocoder_lng, geocoder_lat;
map.addControl(geocoder);
geocoder.on('result', function(e) {
    geocoder_lng = e.result.center[0];
    geocoder_lat = e.result.center[1];
});

var geolocate_lng, geolocate_lat;
var geoLocate = new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true}, trackUserLocation: true});
map.addControl(geoLocate);
map.addControl(new mapboxgl.NavigationControl());
geoLocate.on('geoLocate', function(e) {
    geolocate_lng = e.coords.longitude;
    geolocate_lat = e.coords.latitude;
   map.flyTo({
    center:[e.coords.longitude, e.coords.latitude], 
    zoom:16
  });
});

map.on('load', () => { 
    axios.get('/sound')
    .then(response => {
        const sounds = response.data;
        sounds.map(s => {
            var marker = new mapboxgl.Marker({ "color": "#222529" })
                .setLngLat([s.location.x, s.location.y])
                .setPopup(new mapboxgl.Popup({ offset: 25 })
                .setHTML('<p>'+ s.name + '</p><audio src ="' + s.path + '"controls>'))
                .addTo(map);
        });
    })
    .catch(err => {
        console.log(err);
    });
});