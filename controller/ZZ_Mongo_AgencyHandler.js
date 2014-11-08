var varAgency = require('../models/UserDTO');
var MongoClient = require('mongodb').MongoClient;
		
var createData = function(agency) {
  
  	return {
  		agencyEmail:agency.email,
  		agencyName:agency.agencyName,
  		registrationNumber:agency.registrationNumber,
  		registrationDate:agency.registrationDate,
  		addressStreet:agency.addressDTO.street,
  		addressLocality:agency.addressDTO.locality,
  		addressCity:agency.addressDTO.city,
		addressState:agency.addressDTO.state,
  		addressCountry:agency.addressDTO.country,
  		addressPincode:agency.addressDTO.pincode
  		};
 };


exports.AgencyHandler = function() {
	this.dbNameName = "LIVE";
	this.collectionName = "AGENCY";
	this.insertAgency = function(agencyInfo){
		var MongoClient = require('mongodb').MongoClient;
		MongoClient.connect("mongodb://localhost:27017/test/LIVE", function(err, db) {
			if(err){ 
		  		return console.log(err); 
		  	}
		  	var collection = db.collection("AGENCY");
		  	var jsonData = createData(agencyInfo);
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
	
	this.searchAgency = function(city,callback){
		try{
			var MongoClient = require('mongodb').MongoClient;
			MongoClient.connect("mongodb://localhost:27017/test/LIVE", function(err, db) {
				if(err){ 
		  			return console.log(err); 
		  		}
		  		var collection = db.collection("USER");
		  		collection.find({addressCity:city}).toArray(function(err, docs) {
	          		if(err){
	          			return console.log("ERROR");
	          		}
	          		var agencyInfoArray =  new Array();
    				var keys = Object.keys(docs);
    				keys.forEach(function(key){
    				agencyInfoArray.push(docs[key]);
    				});
    				callback(docs);
        		});
    		});
    	}catch(e){
    		console.log(e.toString);
    	}
    	
	};
	
	this.print = function(agency){
		console.log(" ********** Printing AgencyDTO Start **************");
		console.log("Name:" + agency.agencyName);
		console.log("Registration Number:"+agency.registrationNumber);
		console.log("Registration Date:"+agency.registrationDate);
		console.log("Registration Date:"+agency.email);
		console.log("Address Street:"+agency.addressDTO.street);
		console.log("Address Locality:"+agency.addressDTO.locality);
		console.log("Address City:"+agency.addressDTO.city);
		console.log("Address State:"+agency.addressDTO.state);
		console.log("Address Country:"+agency.addressDTO.country);
		console.log("Address Pincode:"+agency.addressDTO.pincode);
		console.log(" ********** Printing AgencyDTO End **************");	
	};
	
};