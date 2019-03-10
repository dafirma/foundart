module.exports = {
  getPosition: (req, res, next) => {
    if (req.navigator.geolocation) {
      req.navigator.geolocation.watchPosition((pos) => {
        const lat = pos.coords.latitude;
        const long = pos.coords.longitude;
        console.log(`lat= ${lat} long= ${long}`);
        // return (lat, long);
      });
    } else {
      console.log('geo middleware');
    }
  },
};