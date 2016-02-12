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
				// cnpj = item.data.source.id;
				ie = item.data.source.ie;
				console.log('ie '+ie);
				data = {
					url: 'https://saplic.receita.pb.gov.br/sintegra/SINf_ConsultaSintegra',
					qs: {'tpDocumento':'1','nrDocumento':ie,'B2':'Consulta+por+IE'},
					method: 'POST'
				};
				request(data, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						var dataUtf8 = iconv.decode(new Buffer(body), "ISO-8859-1");
						var $ = cheerio.load(dataUtf8);
						cnae = $('table:nth-child(3) p:nth-child(7) table:nth-child(2) td:nth-child(2) font').text().replace('(ICMS)','').trim().split(/ - /)[1];
						console.log('cnae '+cnae);
						db.collection('nfe').update({'_id':new ObjectID(item._id)}, {$set: {'data.source.cnae':cnae}}, function(err, results) {});
					}
				});
			// }

		});
		// db.close();
	});
});
