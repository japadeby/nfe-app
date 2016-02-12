var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/nfe', function(err, db) {
	var collection = db.collection('nfe');
	collection.find().toArray(function(err, items) {
		items.forEach(function(item){
			console.log(
				item.key.slice(0,2)+', '+item.key.slice(2,4)+', '+item.key.slice(4,6)+', '+item.key.slice(6,20)+', '+item.key.slice(20,22)+', '+item.key.slice(22,25)+', '+item.key.slice(25,34)+', '+item.key.slice(34,43)+', '+item.key.slice(43,44)
			);
		});
	});
});