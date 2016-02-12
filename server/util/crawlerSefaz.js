var request = require('request'),
    cheerio = require('cheerio'),
    iconv  = require('iconv-lite');

var toFloat = function(number){
  number = number.replace(',','.');
  if(typeof Number(number) == 'number' && Number(number) != 0 && !isNaN(number)){
    return parseFloat(number);
  }else{
    return 0;
  }
}

function crawlerSefaz(id, callback){
  // TODO retry 5x and try connection error pool thread & CAPTCHA
  var key = id;
  var requestOptions  = {
    encoding: null,
    method: "POST",
    uri: 'https://www.sefaz.rs.gov.br/ASP/AAE_ROOT/NFE/SAT-WEB-NFE-COM_2.asp?HML=false&chaveNFe='+ key
  };
  request(requestOptions, function(error, response, html){

    if(error){return callback(error)};
    if(!error && response.statusCode == 200){
      var dataUtf8 = iconv.decode(new Buffer(html), "ISO-8859-1");
      var $ = cheerio.load(dataUtf8);

      // CAPTCHA
      // <script type='text/javascript'>alert('Favor informar novamente os caracteres de segurança.');location.href = 'SAT-WEB-NFE-COM_1.asp?HML=false&chaveNFe=25150900289351000164650010000275641002130370';</script>
      // curl 'https://www.sefaz.rs.gov.br/ASP/AAE_ROOT/NFE/SAT-WEB-NFE-COM_1.asp?HML=&chaveNFe=' -H 'Accept-Encoding: gzip, deflate, sdch' -H 'Accept-Language: pt-BR,pt;q=0.8,en-US;q=0.6,en;q=0.4' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.97 Safari/537.36' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' -H 'Referer: https://www.sefaz.rs.gov.br/ASP/AAE_ROOT/NFE/SAT-WEB-NFE-COM_2.asp' -H 'Cookie: AffinitySefaz=33786eb18450c9bf97885dafb8af616c27e79212d760fa0d7f1cd275e6c033cb; ASPSESSIONIDSGSADBCA=CKAJPLMAGFKMJEGAPBDHLOOO' -H 'Connection: keep-alive' --compressed
      // IMG_CAPTCHA https://www.sefaz.rs.gov.br/nfe/captchaweb/prCaptcha.aspx?f=getimage&rld=0&rdn=QlPhvoD6lb18f86Ck20mOv34bsvNv0VD
      // curl 'https://www.sefaz.rs.gov.br/ASP/AAE_ROOT/NFE/SAT-WEB-NFE-COM_2.asp' -H 'Cookie: AffinitySefaz=33786eb18450c9bf97885dafb8af616c27e79212d760fa0d7f1cd275e6c033cb; ASPSESSIONIDSGSADBCA=CKAJPLMAGFKMJEGAPBDHLOOO' -H 'Origin: https://www.sefaz.rs.gov.br' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: pt-BR,pt;q=0.8,en-US;q=0.6,en;q=0.4' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.97 Safari/537.36' -H 'Content-Type: application/x-www-form-urlencoded' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' -H 'Cache-Control: max-age=0' -H 'Referer: https://www.sefaz.rs.gov.br/ASP/AAE_ROOT/NFE/SAT-WEB-NFE-COM_1.asp?HML=&chaveNFe=' -H 'Connection: keep-alive' --data 'HML=false&chaveNFe=25151033014556021193655090000316249858368027&captchaCode=G5WDV&captchaRdnKey=QlPhvoD6lb18f86Ck20mOv34bsvNv0VD&Action=Avan%E7ar' --compressed
      // --data HML=false&
      // chaveNFe=25151033014556021193655090000316249858368027&
      // captchaCode=G5WDV&
      // captchaRdnKey=QlPhvoD6lb18f86Ck20mOv34bsvNv0VD&
      // Action=Avan%E7ar

      if(/Favor informar novamente os caracteres de segurança/.test(dataUtf8)){
        callback('Bloqueio do CAPTCHA no SEFAZ.', null)
        return null;
      }

      if($('.GeralXslt .box td span').eq(0).text().replace(/\s/g, '') == ''){
        require('fs').writeFileSync(id+'.html', dataUtf8);
        callback('Nota '+id+' não encontrada na base do SEFAZ.', null)
        return null;
      }
/******************************GET PRODUCTS**********************************/
      var products = [];
      var toggleBox;
      $('#Prod').find('.toggle.box').each(function(index){
         toggleBox = $('#Prod').find('.toggle.box');
         toggableBox = $('#Prod').find('.toggable.box');
         icms = {
           "origin": toggableBox.eq(index).find('span').eq(22).text(),
           "kind": toggableBox.eq(index).find('span').eq(23).text()
         };
         pis = {};
         cofins = {};
         products.push({
            item: index+1,
            product: {
                "code": toggableBox.eq(index).find('span').eq(0).text(),
                "ncm": toggableBox.eq(index).find('span').eq(1).text(),
                "cfop": toggableBox.eq(index).find('span').eq(4).text(),
                "discount": toggableBox.eq(index).find('span').eq(6).text(),
                "ean": toggableBox.eq(index).find('span').eq(10).text(),
                "name": toggleBox.eq(index).find('.fixo-prod-serv-descricao span').text(),
                "unity": toggleBox.eq(index).find('.fixo-prod-serv-uc span').text(),
                "quantity": toFloat(toggleBox.eq(index).find('.fixo-prod-serv-qtd span').text()),
                "price": toFloat(toggleBox.eq(index).find('.fixo-prod-serv-vb span').text()),
                "tax":{
                  "icms": icms,
                  "pis": pis,
                  "cofins": cofins
                }
            }
          });
      });
  /****************************************************************************/
      var data = {
        "chaveNFe": key,
        'info': {
          model: $('#NFe').find('span').eq(0).text(),
          serie: $('#NFe').find('span').eq(1).text(),
          number: $('#NFe').find('span').eq(2).text(),
          emission_date: new Date($('#NFe').find('span').eq(3).text().replace(/(\d{2})\/(\d{2})/,"$2/$1")),
          total: toFloat($('#NFe').find('span').eq(5).text())
        },
        'source':{
          name: $('#Emitente').find('span').eq(0).text().trim(),
          fantasy: $('#Emitente').find('span').eq(1).text(),
          id: $('#Emitente').find('span').eq(2).text(),
          ie: $('#Emitente').find('span').eq(10).text(),
          crt: $('#Emitente').find('span').eq(15).text(),
          address: {
            street: $('#Emitente').find('span').eq(3).text().replace(/\s+/g,' ').trim(),
            neighbourhood: $('#Emitente').find('span').eq(4).text(),
            postal_code: $('#Emitente').find('span').eq(5).text(),
            number_city: $('#Emitente').find('span').eq(6).text().replace(/\s+/g,' ').split(" - ")[0],
            name_city: $('#Emitente').find('span').eq(6).text().replace(/\s+/g,' ').split(" - ")[1],
            phone: $('#Emitente').find('span').eq(7).text(),
            uf: $('#Emitente').find('span').eq(8).text()
          }
        },
        'target':{
          name: $('#DestRem').find('span').eq(0).text().trim(),
          id: $('#DestRem').find('span').eq(1).text(),
          email: $('#DestRem').find('span').eq(13).text(),
          address: {
            street: $('#DestRem').find('span').eq(2).text().replace(/\s+/g,' ').trim(),
            neighbourhood: $('#DestRem').find('span').eq(3).text(),
            postal_code: $('#DestRem').find('span').eq(4).text(),
            number_city: $('#DestRem').find('span').eq(5).text().replace(/\s+/g,' ').split(" - ")[0],
            name_city: $('#DestRem').find('span').eq(5).text().replace(/\s+/g,' ').split(" - ")[1],
            phone: $('#DestRem').find('span').eq(6).text(),
            uf: $('#DestRem').find('span').eq(7).text()
          }
        },
        'payment_method': $('#Cobranca').find('span').eq(0).text().trim().split(" - ")[1],
        'total_icms':{
            icms_base: toFloat($('#Totais').find('span').eq(0).text()),
            icms: toFloat($('#Totais').find('span').eq(1).text()),
            ipi: toFloat($('#Totais').find('span').eq(9).text()),
            pis: toFloat($('#Totais').find('span').eq(13).text()),
            cofins: toFloat($('#Totais').find('span').eq(14).text()),
            tax: toFloat($('#Totais').find('span').eq(15).text())
        },
        'transport':{
          kind: $('#Transporte').find('span').eq(0).text().trim().split(" - ")[1],
        },
        'order': products
      }
      callback(null, data);
    }else{
      callback('Problemas para obter a nota no SEFAZ.', null);
      return null;
    }
  });
};

module.exports = crawlerSefaz;
