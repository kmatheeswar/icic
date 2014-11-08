/*
var varDTO = require('../models/UserDTO');
var varAgencyHandler = require('../controller/AgencyHandler');
var varUserHandler = require('../controller/UserHandler');
var varLoginHandler = require('../controller/LoginHandler');
var LocalStrategy   = require('passport-local').Strategy;


exports.authenticateUser = function(req,res,passport,callback){
    console.log("Entering AuthenticateUser");

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy(function(username, password, done) {
        process.nextTick(function() {
            varLoginHandler.searchUser(email,function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }

                if (user.password != password) {
                    return done(null, false);
                }
                return done(null, user);
                callback(true);
            });
        });
    }));
}
*/
/*
exports.searchLogin = function(email,callback){
	console.log("Entering Controller.searchLogin");
	varUserHandler.searchLogin(email, function(result){ 
		console.log("control return:" + result);
		callback(result);
		return;	
	});	
};

exports.insertUser = function(userInfo){
	console.log("Entering Controller.insertUser");
	return varUserHandler.insertUser(userInfo);
};

exports.insertLogin = function(userInfo,callback){
	console.log("Entering Controller insertLogin");
	varUserHandler.insertLogin(userInfo,function(userid){
		console.log("Controller::InsertLogin - User Inserted with Id::" + userid);
		callback(userid);
		return;
	});
};

exports.registerAgency = function(agencyInfo,callback){
	console.log("Entering Controller.registerAgency");
  	varAgencyHandler.registerAgency(agencyInfo, function(agencyInfo){
  		if(agencyInfo != null){
  			varAgencyHandler.registerUserAgencyMapping(agencyInfo);
  			callback(agencyInfo);

  		}
  	});
  	return;
 };

exports.searchAgency = function(city,callback){
	console.log("Entering Controller::SearchAgency:: City - "+city);
	//var agencyHandler = varAgencyHandler.getInstance();
	try{
		//console.log(cityList.options[cityList.selectedIndex].value);
		varAgencyHandler.searchAgency(city, function(agencyInfoArray){
			callback(agencyInfoArray);
			console.log("After response" + agencyInfoArray);
			console.log("Agency response Length:" + agencyInfoArray.length);
			agencyInfoArray.forEach(function(key){
				console.log(key.addressCity);
			});
			callback(agencyInfoArray);
		});
	}catch(e){
		console.log(e.toString);
	}
};
*/

/*
var AgencyHandlerSingleton = (function(){
	var instance;
	return {
		getInstance: function(){
			if(!instance){
				instance = new varAgencyHandler.AgencyHandler();	
			}
			return instance; 
		}
	};
})();

var UserHandlerSingleton = (function(){
	var instance;
	return {
		getInstance: function(){
			if(!instance){
				instance = new varUserHandler.UserHandler();	
			}
			return instance; 
		}
	};
})();

exports.registerAgency = function(agencyInfo){
	
  return varAgencyHandler.insertAgency(agencyInfo);
 };

exports.registerUser = function(userInfo){
  var userHandler = UserHandlerSingleton.getInstance();
  userHandler.print(userInfo);
  try{
  	console.log("Before Insert");
  	userHandler.insertUser(userInfo);
  	res.status(200).send("SUCCESS");	
  }catch(e){
  	console.log(e.toString);
 }
  
};

exports.searchAgency = function(city,callback){
	console.log("Entering Controller::SearchAgency:: City - "+city);
	var agencyHandler = AgencyHandlerSingleton.getInstance();
	try{
		//console.log(cityList.options[cityList.selectedIndex].value);
		agencyHandler.searchAgency(city, function(agencyInfoArray){
			callback(agencyInfoArray);
		//	console.log("After response" + agencyInfoArray);
		//	console.log("Agency response Length:" + agencyInfoArray.length);
		//	agencyInfoArray.forEach(function(key){
		//		console.log(key.addressCity);
		//	});
		//	console.log(agencyInfoArray);
		//	res.render("welcome.dust", {agencyModel: agencyInfoArray});	
		});
		
		
	}catch(e){
		console.log(e.toString);
	}
};
*/
