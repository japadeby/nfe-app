var request = require('request');
var cheerio = require('cheerio');
var iconv  = require('iconv-lite');

var toFloat = function (number) {
  number = number.replace(',', '.');
  if (typeof Number(number) === 'number' &&
      Number(number) !== 0 && !isNaN(number)) {
    return parseFloat(number);
  } else {
    return 0;
  }
};

function crawlerSefaz(id, callback) {
  // TODO retry 5x and try connection error pool thread & CAPTCHA
  var key = id;
  var requestOptions  = {
    encoding: null,
    method: 'POST',
    uri: 'https://www.sefaz.rs.gov.br/ASP/AAE_ROOT/NFE/SAT-WEB-NFE-COM_2.asp?' +
          'HML=false&chaveNFe=' + key,
  };

  request(requestOptions, function (error, response, html) {

    if (error) {return callback(error);}

    if (!error && response.statusCode === 200) {
      var dataUtf8 = iconv.decode(new Buffer(html), 'ISO-8859-1');
      var $ = cheerio.load(dataUtf8);

      if (/Favor informar novamente os caracteres de segurança/
            .test(dataUtf8)) {
        callback('Bloqueio do CAPTCHA no SEFAZ.', null);
        return null;
      }

      if ($('.GeralXslt .box td span').eq(0).text().replace(/\s/g, '') === '') {
        require('fs').writeFileSync(id + '.html', dataUtf8);
        callback('Nota ' + id + ' não encontrada na base do SEFAZ.', null);
        return null;
      }

      // GET PRODUCTS
      var products = [];
      $('#Prod').find('.toggle.box').each(function (index) {
        var toggleBox = $('#Prod').find('.toggle.box');
        var toggableBox = $('#Prod').find('.toggable.box');

        //  TODO get custom TAX
        var icms = {
          origin: toggableBox.eq(index).find('span').eq(22).text(),
          kind: toggableBox.eq(index).find('span').eq(23).text(),
        };

        var pis = {};
        var cofins = {};
        products.push({
          item: index + 1,
          product: {
            code: toggableBox.eq(index).find('span').eq(0).text(),
            ncm: toggableBox.eq(index).find('span').eq(1).text(),
            cfop: toggableBox.eq(index).find('span').eq(4).text(),
            discount: toggableBox.eq(index).find('span').eq(6).text(),
            ean: toggableBox.eq(index).find('span').eq(10).text(),
            name: toggleBox.eq(index)
                  .find('.fixo-prod-serv-descricao span').text(),
            unity: toggleBox.eq(index).find('.fixo-prod-serv-uc span').text(),
            quantity: toFloat(toggleBox.eq(index)
                  .find('.fixo-prod-serv-qtd span').text()),
            price: toFloat(toggleBox.eq(index)
                  .find('.fixo-prod-serv-vb span').text()),
            tax:{
              icms: icms,
              pis: pis,
              cofins: cofins,
            },
          },
        });
      });

      var data = {
        chaveNFe: key,
        info: {
          model: $('#NFe').find('span').eq(0).text(),
          serie: $('#NFe').find('span').eq(1).text(),
          number: $('#NFe').find('span').eq(2).text(),
          emissionDate: new Date($('#NFe').find('span')
                        .eq(3).text().replace(/(\d{2})\/(\d{2})/, '$2/$1')),
          total: toFloat($('#NFe').find('span').eq(5).text()),
        },
        source:{
          name: $('#Emitente').find('span').eq(0).text().trim(),
          fantasy: $('#Emitente').find('span').eq(1).text(),
          cnpj: $('#Emitente').find('span').eq(2).text(),
          ie: $('#Emitente').find('span').eq(10).text(),
          crt: $('#Emitente').find('span').eq(15).text(),
          address: {
            street: $('#Emitente').find('span').eq(3)
                    .text().replace(/\s+/g, ' ').trim(),
            neighbourhood: $('#Emitente').find('span').eq(4).text(),
            postalCode: $('#Emitente').find('span').eq(5).text(),
            numberCity: $('#Emitente').find('span').eq(6)
                    .text().replace(/\s+/g, ' ').split(' - ')[0],
            nameCity: $('#Emitente').find('span').eq(6)
                    .text().replace(/\s+/g, ' ').split(' - ')[1],
            phone: $('#Emitente').find('span').eq(7).text(),
            uf: $('#Emitente').find('span').eq(8).text(),
          },
        },
        target: {
          name: $('#DestRem').find('span').eq(0).text().trim(),
          id: $('#DestRem').find('span').eq(1).text(),
          email: $('#DestRem').find('span').eq(13).text(),
          address: {
            street: $('#DestRem').find('span').eq(2)
                    .text().replace(/\s+/g, ' ').trim(),
            neighbourhood: $('#DestRem').find('span').eq(3).text(),
            postalCode: $('#DestRem').find('span').eq(4).text(),
            numberCity: $('#DestRem').find('span').eq(5)
                    .text().replace(/\s+/g, ' ').split(' - ')[0],
            nameCity: $('#DestRem').find('span').eq(5)
                    .text().replace(/\s+/g, ' ').split(' - ')[1],
            phone: $('#DestRem').find('span').eq(6).text(),
            uf: $('#DestRem').find('span').eq(7).text(),
          },
        },
        paymentMethod: $('#Cobranca').find('span').eq(0)
                    .text().trim().split(' - ')[1],
        totalIcms: {
          icmsBase: toFloat($('#Totais').find('span').eq(0).text()),
          icms: toFloat($('#Totais').find('span').eq(1).text()),
          ipi: toFloat($('#Totais').find('span').eq(9).text()),
          pis: toFloat($('#Totais').find('span').eq(13).text()),
          cofins: toFloat($('#Totais').find('span').eq(14).text()),
          tax: toFloat($('#Totais').find('span').eq(15).text()),
        },
        transport:{
          kind: $('#Transporte').find('span').eq(0)
                .text().trim().split(' - ')[1],
        },
        order: products,
      };
      callback(null, data);
    } else {
      callback('Problemas para obter a nota no SEFAZ.', null);
      return null;
    }
  });
}

module.exports = crawlerSefaz;
