const latitudeInput = document.getElementById('lat');
const longitudeInput = document.getElementById('long');


const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setLocation);
  }
};

const setLocation = (position) => {
  latitudeInput.value = position.coords.latitude;
  longitudeInput.value = position.coords.longitude;
  console.log(latitudeInput);
};


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('search-form');

  const delayedSubmit = () => {
    getLocation();
    form.onsubmit = () => {
      if (latitudeInput === null || longitudeInput === null) {
        setTimeout(delayedSubmit, 2000);
      } else {
        form.submit();
      }
    };
  };

  if (form) {
    delayedSubmit();
  }
});

// Set map location

mapboxgl.accessToken = mapboxKey;
const map = new mapboxgl.Map({

  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
  center: [-3.70379, 40.41677], // starting position [lng, lat]
  zoom: 4, // starting zoom
});
const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
});

map.addControl(geocoder);

map.addControl(new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true,
  },
  trackUserLocation: true,
}));

geocoder.on('result', (ev) => {
  $('input[name="lat"]').val(ev.result.geometry.coordinates[1]);
  $('input[name="long"]').val(ev.result.geometry.coordinates[0]);
});

map.on('load', () => {
  map.addSource('single-point', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  });

  map.addLayer({
    id: 'point',
    source: 'single-point',
    type: 'circle',
    paint: {
      'circle-radius': 10,
      'circle-color': '#007cbf',
    },
  });

  // Listen for the `result` event from the MapboxGeocoder that is triggered when a user
  // makes a selection and add a symbol that matches the result.
  geocoder.on('result', (ev) => {
    map.getSource('single-point').setData(ev.result.geometry);
  });
});

