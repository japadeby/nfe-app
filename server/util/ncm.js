var request = require('request'),
    cheerio = require('cheerio'),
    iconv  = require('iconv-lite'),
    Promise = require('bluebird');


var Ncm = (function () {
  var url = 'http://www.qualncm.com.br/consultancmporproduto.asp';
  function search(ncm) {
    var options = {
      url: 'http://www.qualncm.com.br/consultancmporproduto.asp',
      method: 'POST',
      encoding: null,
      form: { pesquisa: ncm }
    };
    return new Promise(function (resolve, reject) {
      request(options, function(err, response, body) {
        var decodedBody = iconv.decode(body, 'iso-8859-1'),
            $ = cheerio.load(decodedBody),
            descriptionSelector = "a[href*='ncm/" + ncm + "']",
            description = $(descriptionSelector).eq(1).text();
        
        return resolve(description);
      });
    });
  }

  return {
    search: search
  };
})();

module.exports = Ncm;
