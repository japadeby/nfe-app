module.exports = function (app) {
  var crawlerSefaz = require('../util/crawlerSefaz');
  var validateNfe = require('../util/validateNfe');
  var inventory = require('../util/inventory');
  var geolocation = require('../util/geolocation');
  var getcnae = require('../util/getcnae');
  var Promise = require('bluebird');

  app.get('/crawler/:key', function (req, res) {
    var key = req.params.key;
    var validation = validateNfe(key);
    if (validation !== 'OK') {
      console.error(validation);
      res.json({msg: validation});
    } else {
      app.models.nfe.find({where: {key: key}}, function (err, nfe) {
        if (nfe.length === 0) {
          crawlerSefaz(key, function (err, data) {
            if (data) {
              Promise.all([
                getcnae(data.source.ie, app),
                geolocation(data.source.address, app)
                // inventory(data_nfe, app)
              ]).then(function (values) {
                // console.log(values);
                result = {
                  msg: 'ok',
                  key: data.chaveNFe,
                  source: [data.source.name, data.source.fantasy].join(', '),
                  data: data,
                };
                result.data.source.cnae = values[0];
                result.data.source.address.location = values[1];
                app.models.nfe.create(result);
                console.log('Crawling nfe ' + result.key);
                res.json(result);
              }).catch(function (err) {
                console.log(err.message);
                res.json({msg: 'Problemas para obter a nota'});
              });
            } else {
              console.error(err);
              res.json({msg: err});
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
