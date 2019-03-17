module.exports = {
  mapboxKey: (req, res, next) => {
    const mapboxKey = process.env.MAPBOX_KEY;
    return mapboxKey;
  },
};