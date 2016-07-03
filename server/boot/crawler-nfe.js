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
                companyData = data.source;
                companyData.cnae = values[0];
                companyData.address.coordinates = values[1];

                Inventory(app)
                  .normalizeNfe(result)
                  .then(function (normalizedNfe) {
                    var Company = app.models.company;
                    Company.findOrCreate(
                      {where: {cnpj: companyData.cnpj}},
                      companyData,
                      function(err, instance) {
                        if (err) {
                          console.log(err);
                        }
                        else {
                          instance.nfes.create(normalizedNfe);
                        }
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
