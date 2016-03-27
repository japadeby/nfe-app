var MongoClient = require('mongodb').MongoClient,
		ObjectID = require('mongodb').ObjectID;
MongoClient.connect('mongodb://localhost:27017/nfe', function(err, db) {
	var locations = {};
	db.collection('nfe').find().toArray(function(err, items) {
		items.forEach(function(item){
			if(item.data.source.address.location.latitude == ""){
				address = item.data.source.address;
				address = [
					address.street,
					address.neighbourhood,
					address.nameCity,
					address.uf,
					// address.postalCode,
					'brasil'
				].join(', ');
				var geocoder = require('node-geocoder')('google', 'https',{'apiKey':'AIzaSyCTkYUF2DfyvN1nQtQDgIFKcy8sco1kZgc', 'formatter': null});
				// if(locations[address] == undefined){
					geocoder.geocode(address, function(err, res) {
						console.log(res);
						if(res[0] != undefined){
							location = {'latitude':res[0].latitude,'longitude':res[0].longitude};
							// locations[address] = location;
							// console.log(locations[address]);
							db.collection('nfe').update({'_id':new ObjectID(item._id)}, {$set: {'data.source.address.location':location}}, function(err, results) {
								// console.log({error: err, affected: results});
								// db.close();
							});
						}
					});
				// }else{
				// 	console.log(locations[address]);
				// 	collection.update({_id:item._id}, {$set: {'data.source.address.location':locations[address]}});
				// }
			}
		});
		// db.close();
	});
});
