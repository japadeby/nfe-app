var request = require('request'),
    cheerio = require('cheerio'),
    iconv  = require('iconv-lite'),
    Promise = require('bluebird');

function getcnae(id, app){
  return new Promise(function(resolve, reject) {
    ie = id;
    // console.log('ie '+ie);
    data = {
      url: 'https://saplic.receita.pb.gov.br/sintegra/SINf_ConsultaSintegra',
      qs: {'tpDocumento':'1','nrDocumento':ie,'B2':'Consulta+por+IE'},
      method: 'POST'
    };
    request(data, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var dataUtf8 = iconv.decode(new Buffer(body), "ISO-8859-1");
        var $ = cheerio.load(dataUtf8);
        cnae_field = $('table:nth-child(3) p:nth-child(7) table:nth-child(2) td:nth-child(2) font').text().replace('(ICMS)','').trim().split(/ - /)[1];
        cnae_code = $('table:nth-child(3) p:nth-child(7) table:nth-child(2) td:nth-child(2) font').text().replace('(ICMS)','').trim().split(/ - /)[0];
        app.models.cnae.findOne({'where': {"data.code":cnae_code}})
        .then(function(response){
          if(response != null){
            return resolve(response.data);
          }else{
            cnae = {
              data: {
                code: cnae_code,
                name: cnae_field,
                category: ''
              }
            };
            app.models.cnae.create(cnae);
            return resolve(cnae.data);
          }
        });
      }
    });
  });
}
module.exports = getcnae;
