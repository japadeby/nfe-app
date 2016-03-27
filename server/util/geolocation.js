var geocoder = require('node-geocoder')('google', 'https', {
  apiKey: 'AIzaSyCTkYUF2DfyvN1nQtQDgIFKcy8sco1kZgc',
  formatter: null,
});
var Promise = require('bluebird');

function geolocation(address, app) {
  address = [
    address.street,
    address.neighbourhood,
    address.nameCity,
    address.uf,
    'brasil',
  ].join(', ').toLowerCase();
  return new Promise(function (resolve, reject) {
    app.models.address.findOne({where: {"name":address}})
    .then(function (response) {
      if (response !== null) {
        return resolve(response.location);
      } else {
        geocoder.geocode(address)
        .then(function (res) {
          if (res[0] !== undefined) {
            var location = {
              type:'Point',
              coordinates:[
                res[0].latitude,
                res[0].longitude,
              ],
            };
            app.models.address.create({
              name: address,
              location: location,
            });
            return resolve(location);
          }
        });
      }
    });
  });
}

module.exports = geolocation;
