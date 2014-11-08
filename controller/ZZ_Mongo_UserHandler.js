

var createData = function(userInfo) {
  
  	return {
  		name:userInfo.name
  		};
 };


exports.UserHandler = function() {
	this.dbNameName = "LIVE";
	this.collectionName = "USER";
	this.insertUser = function(userInfo){
		var MongoClient = require('mongodb').MongoClient;
		MongoClient.connect("mongodb://localhost:27017/test/LIVE", function(err, db) {
			if(err){ 
		  		return console.log(err); 
		  	}
		  	var collection = db.collection("USER");
		  	var jsonData = createData(userInfo);
		  	collection.insert(jsonData,function(err){
				if(err){ 
					console.log("ERROR");
				}
				else{
					console.log("Inserted");
				}
			});
		});
	};
	this.print = function(userInfo){
		console.log(" ********** Printing User Start **************");
		console.log("Name:" + userInfo.name);
		console.log(" ********** Printing User End **************");	
	};
};
