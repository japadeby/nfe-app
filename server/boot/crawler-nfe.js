module.exports = function (app) {
  var crawlerSefaz = require('../util/crawlerSefaz');
  var validateNfe = require('../util/validateNfe');
  var inventory = require('../util/inventory');
  var geolocation = require('../util/geolocation');
  var getcnae = require('../util/getcnae');
  var Promise = require('bluebird');
  var Inventory = require('../util/inventory');

  app.get('/crawler/:key', function (req, res) {
    var key = req.params.key;
    var validation = 'OK';
    //var validation = validateNfe(key);
    if (validation !== 'OK') {
      console.error(validation);
      res.json({ msg: validation });
    } else {
      app.models.nfe.find({ where: { key: key } }, function (err, nfe) {
        if (nfe.length === 0) {
          crawlerSefaz(key, function (err, data) {
            if (data) {
              Promise.all([
                getcnae(data.source.ie, app),
                geolocation(data.source.address, app),
              ]).then(function (values) {
                var result = {
                  key: data.chaveNFe,
                  data: data,
                };
                cnaeData = data.source;
                cnaeData.address.coordinates = values[1];

                Inventory(app)
                  .saveNfe(result)
                  .then(function (response) {
                    var Cnae = app.models.cnae;
                    Cnae.findOrCreate(
                      {where: {cnpj: cnaeData.cnpj}},
                      cnaeData,
                      function(err, instance) {
                        console.log(response.key);
                        instance.nfes.create(response, function (err, n) {
                          console.log(n);
                        });
                      }
                    );
                  });

                console.log('Crawling nfe ' + result.key);
                res.json(result);
              }).catch(function (err) {
                console.log(err.message);
                res.json({ msg: 'Problemas para obter a nota' });
              });
            } else {
              console.error(err);
              res.json({ msg: err });
            }
          });
        } else {
          console.log('Getting nfe ' + nfe[0].key);
          res.json(nfe[0]);
        }
      });
    }
  });
};
