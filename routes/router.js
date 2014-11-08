var varModel = require('../models/Model');
var baseModel = require('../models/BaseModel');
var varPageData = require('../models/PageData');
var loginHandler = require('../controller/LoginHandler');
var fundRequestHandler = require('../controller/FundRequestHandler');
var util = require('../models/Util');

/** ICIC Route Controller Starts Here
 * @param req
 * @param callback
 */

exports.index = function(req, res){
    console.log("Entering Router.Index");
   	util.render(req,res);
};

exports.saveUser = function (req,res,next){
    console.log("Entering Rouer.saveUser");
   	req.model = new varModel.dataModel();
    console.log("saveUser::" + JSON.stringify(req.body));
    var userData = new varModel.User();
    userData.email = req.body.email;
    userData.userName = req.body.fname;
    userData.password = req.body.password;
    userData.signupType = "WEB";
    loginHandler.saveUser(req,userData,function(callback,user){
    	if(user !== undefined){
    		console.log("LoginHandler.saveUser - Query Executed - Success");
    		req.login(user, function(err) {
    			  if (err) { return next(err); }
    		    	req.model.loggedIn = "true";
    		        req.model.user = new varModel.User();
    		        req.model.user.name = req.session.passport.user.userName;
    		        console.log("newly created User session::" + JSON.stringify(req.session.passport));
    		    	util.render(req,res);
    		});
    	}
    });
};

exports.searchRequest = function (req,res){
    console.log("Entering Rouer.searchRequest Query Parameter: " + req.params.category);
   	req.data = new varPageData.Data();
   	setCommonPageData(req);
    console.log("searchRequest::" + JSON.stringify(req.data));
    var searchCriteria = null;;
    var requestDTO = new varModel.RequestDTO();
    if(req.params.category){
    	requestDTO.category = req.params.category;
    }
    console.log("Search Criteria:" + req.body.category);
    console.log("Criteria::" + JSON.stringify(requestDTO))
    if(requestDTO.category || !req.session.defaultrequestDataArray) {
        fundRequestHandler.searchRequest(req,searchCriteria,requestDTO,function(err,requestDataArray){
            if(!req.params.category) {
                req.session.defaultrequestDataArray = requestDataArray;
            }
            req.data.requestDataArray = requestDataArray;
            util.send(req,res);
            //res.send(JSON.stringify(req.data.requestDataArray));
            //res.send((req.data.requestDataArray[0]));
            //res.render('new_index', { data: req.data.requestDataArray });
        });
    } else {
        req.data.requestDataArray = req.session.defaultrequestDataArray;
        util.send(req,res);
    }

};

exports.createRequest = function (req,res){
	 console.log("Entering Rouer.createRequest");
   	req.data = new varPageData.Data();
    validateFundRequest(req);
    var requestDTO = new varModel.RequestDTO();
    requestDTO.raisedBy = req.body.raised_by;
    requestDTO.category = req.body.request_category;
    requestDTO.title = req.body.request_title;
    requestDTO.description = req.body.request_desc;
    requestDTO.fbLink = req.body.fb_link;
    requestDTO.twLink = req.body.tw_link;

    fundRequestHandler.registerFundRequest(req,requestDTO,function(err,requestDTO){
    	console.log("Callback of registerFundRequest" + JSON.stringify(requestDTO));
    	if(undefined != requestDTO){
       		var temp = new varPageData.RequestData();
       		temp.raised_by = requestDTO.raised_by;
       		temp.category = requestDTO.category;
       		temp.description = requestDTO.description;
       		temp.id = requestDTO.id;
        	req.data.requestDataArray = temp;
        	req.session.requestDataArray += temp;
        	//res.send(JSON.stringify(req.session.requestDataArray));
        	
    	}
    	util.send(req,res);
    });
};

function hasValidSession(req) {
    console.log("Entering Router.hasValidSession?");
    if(null != req.session.passport.user){
    	console.log("Router.hasValidSession - Session Is not null");
    	req.data.loggedInState = "loggedIn";
        req.data.userName = req.session.passport.user.userName;
    	return true;
    }
    return false;
};

function setCommonPageData(req) {
	if(false == hasValidSession(req)){
        req.data.loggedIn = "true";
    }
	req.data.requestDataArray = req.session.requestDataArray;
}

function validateFundRequest(req) {
  console.log("Entering ValidateFundRequest");
  console.log("ValidateFundRequest: - Request - Body - " + JSON.stringify(req.body));
  
}

/** ICIC Route Controller Ends Here
 *
 * @param req
 * @param callback
 */

/*



exports.userFBloggedIn = function (req,res){
	console.log("Entering Router.userFBloggedIn");
	fbgraph.setAccessToken(req.param('token'));
	var data = new varPageData.PageData();
	fbgraph.get("me", function(err, fbResponse){
		if(err || fbResponse == null){
			console.error(err);
			res.render("welcome.dust", { error: err.toString()});
		}
		console.log("Router.userFBloggedIn - Reading FB Response");
		data.userName = fbResponse.name;
		data.userFBLink = fbResponse.link;
  		data.isUserFB = "true";
  		var email = fbResponse.email;
  		if(email == null)
  		{
  			console.log("Router.userFBloggedIn - Email is null , looks like User id loggedout:");
  			res.render("welcome.dust", { data: data });
		}
		else{

			console.log("Router.userFBloggedIn - Loading Session for email:" + email);
			req.session.isSessionValid = true;
			req.session.email = email;
			varSessionHandler.loadSession(email, function(sessionInfo){
				if(sessionInfo != null && sessionInfo.email != null){
					console.log("Router.userFBloggedIn - Session Exist");
					data.loggedInState = "loggedIn";
					data.error = false;
					req.session.email = sessionInfo.email;
					res.render("welcome.dust", { data: data });
				}
				else{
					console.log("Router.userFBloggedIn - Session Doesn't Exist");
					var userInfo = fillUserInfoFromFacebook(fbResponse);
					sessionInfo = new varUserDTO.SessionDTO();
					sessionInfo.email = fbResponse.email;
  					isUserAlreadyRegistered(userInfo.email,function(result){
  						if(result == "USER_NEW"){
  							console.log("Router:: User is not yet registered");
  							varController.insertLogin(userInfo, function(userID){
  								console.log("Router-UserFBLoggedIn - Login Table Inserted with UserId::" + userID);
  								userInfo.userid = userID;
  								req.session.userid = userid;
  								varController.insertUser(userInfo);
  								sessionInfo.userid = userID;
  								console.log("Router-UserFBLoggedIn::" + sessionInfo.userid)
								req.session.email = email;
								varSessionHandler.createSession(sessionInfo);
								res.render("welcome.dust", { data: data });
  						});
  					}
  					else{
  						console.log("Router :: User AlreadyRegistered");
  					}
  				});
			}
		});			
		}
  		
	});
};


exports.registerAgency = function(req,res){
	console.log("Entering Router.registerAgency");
	var data = new varPageData.PageData();
	var email = req.session.email;
	if(email != null){
		console.log("Router.registerAgency for - " + email);
		varSessionHandler.loadSession(email, function(sessionInfo){
			console.log("Entering Router.registerAgency");
			console.log(" Loaded Session - " + sessionInfo);
			var agencyInfo = fillAgencyInfo(req);
			agencyInfo.userid = sessionInfo.userid;
			varController.registerAgency(agencyInfo, function(agencyInfo){
				console.log("Router.registerAgency - Agency with AgencyID -" + agencyInfo.agencyid + " Created.");
				sessionInfo.agencyid = agencyInfo.agencyid;
				varSessionHandler.updateSession(sessionInfo);
			});
			var data = new varPageData.PageData();
			data.loggedInState = "loggedIn";
			data.error = false;
			res.render('welcome', { data: data });
		});
	}
	data.error = "true";
	data.error.message = "Please Login/Signup to Register Agency";
	res.render('welcome', { data: data });
};

function fillUserInfoFromFacebook(fbResponse){
	console.log("Entering Router.fillUserInfoFromFacebook");
	var userInfo = new varUserDTO.UserDTO();
	userInfo.name = fbResponse.name;
	userInfo.email = fbResponse.email;
	userInfo.isfbuser = true;
	userInfo.fblink = fbResponse.link;
	userInfo.addressDTO = new varUserDTO.AddressDTO();
	//userInfo.addressDTO.city = fbResponse.homeTown.name;
	return userInfo;
}

exports.searchAgency = function(req,res){
	var data = new varPageData.PageData();
	console.log(req.param("selectedCity"));
	varController.searchAgency(req.param("selectedCity"), function(result){
		console.log("Search Success");
		pageData = populateLoggedOutData();
		res.render("welcome.dust", {agencyModel: result , data : pageData});
  	});
};

function isUserAlreadyRegistered(email,callback){
	console.log("Entering Router.isUserAlreadyRegistered");
	varController.searchLogin(email, function(result){
		callback(result);
		return;		
	});
}

function filluserInfo(req){
	var userInfo = new varUserDTO.UserDTO();
	userInfo.name = req.param('user-name');
	return userInfo;
}


function fillAgencyInfo(req){
	var agency = new varUserDTO.AgencyInfoDTO();
	agency.agencyName = req.param('agency-name');
	agency.registrationNumber = req.param('registration-no');
	agency.registrationDate = req.param('registration-date');
	addressDTO = new varUserDTO.AddressDTO();
	addressDTO.street = req.param('address-street');
	addressDTO.locality = req.param('address-locality');
	addressDTO.city = req.param('address-city');
	addressDTO.state = req.param('address-state');
	addressDTO.country = req.param('address-country');
	addressDTO.pincode = req.param('address-pincode');
	agency.addressDTO = addressDTO;
	return agency;
}

*/
