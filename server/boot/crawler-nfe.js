module.exports = function(app) {
  var crawlerSefaz = require('../util/crawlerSefaz');
  var validateNfe = require('../util/validateNfe');

  app.get('/crawler/:key', function(req, res) {
    var key = req.params.key;
    var validation = validateNfe(key);
    if(validation != "OK"){
      console.error(validation);
      res.json({"msg":validation});
    }else{
      app.models.nfe.find({where: {"key": key}}, function(err, nfe){
        if(nfe.length == 0){
          crawlerSefaz(key, function(err, data){
            if(data){
              data_nfe = {
                "msg": "ok",
                "key": data.chaveNFe,
                "source": [data.source.name, data.source.fantasy].join(', '),
                "data": data
              };
              app.models.nfe.create(data_nfe, function(err, response){
                console.log("Crawling nfe "+data_nfe.key);
                res.json(response);
              });
            }else{
              console.error(err);
              res.json({"msg": err});
            }
          });
        }else{
          console.log("Getting nfe "+nfe[0].key);
          res.json(nfe[0]);
        }
      });
    }
  });
};
