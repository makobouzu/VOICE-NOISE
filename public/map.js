mapboxgl.accessToken = 'pk.eyJ1IjoibWFrb2JvdXp1IiwiYSI6ImNrYWF5and0MzFhYnMyc214ZGo3OWd3cHQifQ.pPCfwEss5pJhm4Yu7kvj1w';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/light-v10',
center: [139.7023894,35.6598003],
zoom: 9
});

var lang = navigator.language;
if(lang === 'ja'){
    var geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        language: 'ja',
        placeholder: 'Recorded at.',
        marker: {
            color: '#727475'
        },
        mapboxgl: mapboxgl
    });
}else{
    var geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        language: 'en',
        placeholder: 'Recorded at.',
        marker: {
            color: '#727475'
        },
        mapboxgl: mapboxgl
    });
}

var geocoder_lng, geocoder_lat;
map.addControl(geocoder);
geocoder.on('result', function(e) {
    geocoder_lng = e.result.center[0];
    geocoder_lat = e.result.center[1];
});


//検索結果 or GPSのデータを使用する場合
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

var marker;
map.on('load', () => { 
    axios.get('/sound')
    .then(response => {
        const sounds = response.data;
        var num = 0;
        sounds.map(s => {
            var el = document.createElement('div');
            el.className = 'marker';
            el.id = "marker_" + num;
            marker = new mapboxgl.Marker(el, { "color": "#222529" })
                .setLngLat([s.location.x, s.location.y])
                .setPopup(new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<p class="fw-bold">${s.name}</p><audio id="marker_audio" src ="${s.path}" gtag('event', 'marker_click', {'event_category': 'marker_${s.name}', 'event_label': 'marker_${s.name}', 'non_interaction': true});" controls>`))
                .addTo(map);
        });
        num += 1;
        console.log(marker);
    })
    .catch(err => {
        console.log(err);
    });

    document.querySelector('.mapboxgl-ctrl-geocoder').addEventListener('click', () =>{
        gtag('event', 'geocoder_click', {
            'event_label': 'geocoder_on',
            'event_category': 'geocoder_on',
            'non_interaction': true
        });
    });

    document.querySelector('.mapboxgl-ctrl-geolocate').addEventListener('click', () =>{
        gtag('event', 'geolocate_click', {
            'event_label': 'geolocate_on',
            'event_category': 'geolocate_on',
            'non_interaction': true
        });
    });
});