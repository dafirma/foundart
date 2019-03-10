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


document.addEventListener('DOMContentLoaded', () =>{
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
