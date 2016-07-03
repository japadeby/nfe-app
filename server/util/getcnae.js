var request = require('request');
var cheerio = require('cheerio');
var iconv  = require('iconv-lite');
var Promise = require('bluebird');

function getcnae(id, app) {
  return new Promise(function (resolve, reject) {
    var ie = id;

    // console.log('ie '+ie);
    var data = {
      url: 'https://saplic.receita.pb.gov.br/sintegra/SINf_ConsultaSintegra',
      qs: {
        tpDocumento: '1',
        nrDocumento:ie,
        B2:'Consulta+por+IE',
      },
      method: 'POST',
    };

    request(data, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var dataUtf8 = iconv.decode(new Buffer(body), 'ISO-8859-1');
        var $ = cheerio.load(dataUtf8);
        var cnaeField = $('table:nth-child(3) p:nth-child(7) ' +
                      'table:nth-child(2) td:nth-child(2) font').text()
                      .replace('(ICMS)', '').trim().split(/ - /)[1];
        var cnaeCode = $('table:nth-child(3) p:nth-child(7) ' +
                      'table:nth-child(2) td:nth-child(2) font').text()
                      .replace('(ICMS)', '').trim().split(/ - /)[0];
        app.models.Company.findOne({where: {"cnae": {"code": cnaeCode}}}, function (err, response) {
          if (response) {
            return resolve(response.cnae);
          } else {
            var cnae = {
              code: cnaeCode,
              name: cnaeField,
            };
            return resolve(cnae);
          }
        });
      }
    });
  });
}

module.exports = getcnae;
