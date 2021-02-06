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

var buffer_marker;
var marker_play = false;
map.on('load', () => { 
    axios.get('/sound')
    .then(response => {
        const sounds = response.data;
        var num = 0;
        var plus_num = 0;
        sounds.map(s => {
            var marker = new mapboxgl.Marker({ "color": "#222529" })
                .setLngLat([s.location.x, s.location.y])
                .setPopup(new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<p class="fw-bold" id="marker_text">${s.name}</p>`))
                .addTo(map); 
            marker._element.id = "marker_" + num;

            num += 1;
            marker.getElement().addEventListener('click', () => {
                console.log(sources);
                if(sources.length){
                    const marker_num = marker.getElement().id.split('_')[1];
                    if(marker_play){
                        sources[buffer_marker].stop();
                        updateList(bufferLoader.bufferList, sources, buffer_marker);
                        document.getElementById("plus_marker").remove();                    
                    }
                    sources[marker_num].start();
                    audio_context.resume();
                    marker_play = true;
                    var plus = new mapboxgl.Marker({ "color": "#ff1622" })
                        .setLngLat([s.location.x, s.location.y])
                        .addTo(map);
                    plus._element.id = "plus_marker";
                    plus.getElement().addEventListener('click', () => {
                        sources[marker_num].stop();
                        audio_context.suspend();
                        updateList(bufferLoader.bufferList, sources, marker_num);
                        plus.remove();
                        marker_play = false;
                    });
                    buffer_marker = marker_num;
                }else{
                    alert("読み込みに時間がかかっています。少々お待ちください。\nPlease wait a moment.");
                    document.getElementsByClassName("mapboxgl-popup-close-button").click();
                }
            });
        });
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