var MongoClient = require('mongodb').MongoClient,
		ObjectID = require('mongodb').ObjectID,
		request = require('request'),
		cheerio = require('cheerio'),
		iconv  = require('iconv-lite');

MongoClient.connect('mongodb://localhost:27017/nfe', function(err, db) {
	var locations = {};
	db.collection('nfe').find().toArray(function(err, items) {
		items.forEach(function(item){
			// if(item._id == '56b422b7a16acf93c7300ee7' || item._id == '56b422b9a16acf93c7300ee9'){
			// if(item._id == '56b422b7a16acf93c7300ee7'){

				key = item.key;
				console.log(key);
				data = {
					uri: 'https://www.sefaz.rs.gov.br/ASP/AAE_ROOT/NFE/SAT-WEB-NFE-COM_2.asp?HML=false&chaveNFe='+key,
					method: 'POST'
				};
				request(data, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						var dataUtf8 = iconv.decode(new Buffer(body), "ISO-8859-1");
						var $ = cheerio.load(dataUtf8);
						$('#Prod').find('.toggle.box').each(function(index){
							toggableBox = $('#Prod').find('.toggable.box');
							code = toggableBox.eq(index).find('span').eq(0).text();
							ncm = toggableBox.eq(index).find('span').eq(1).text();
							cfop = toggableBox.eq(index).find('span').eq(4).text();
							discount = toggableBox.eq(index).find('span').eq(6).text();
							ean = toggableBox.eq(index).find('span').eq(10).text();
							db.collection('nfe').update(
								{'_id':new ObjectID(item._id)},
								{$set: {
									'data.order[].product.code':code
									'data.order[].product.ncm':ncm
									'data.order[].product.ean':ean
									'data.order[].product.cfop':cfop
									'data.order[].product.discount':discount
									// tax icms, pis, cofins
								}},
								function(err, results) {});
						});
					}
				});
			// }

		});
		// db.close();
	});
});
