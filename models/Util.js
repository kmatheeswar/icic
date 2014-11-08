var varPageData = require('../models/PageData');

/*
exports.setPageData = function(req){
	if(undefined == req.data){
		req.data = new varPageData.Data();
		req.data.loggedIn = "false";
		req.data.userData_name = "Guest";
	}
};
*/
exports.send = function(req,res,next){
	copyModelIntoPage(req);
	console.log("Sending JSON" + JSON.stringify(req.data));
	res.send(JSON.stringify(req.data));
};

exports.render = function(req,res,next){
	copyModelIntoPage(req);
	console.log("Sending Page" + JSON.stringify(req.data));
	res.render('index', { data: req.data });
};


copyModelIntoPage = function(req){
	copyUserData(req);
	copyRequestData(req);
};

copyRequestData = function(req){
	if(undefined != req.session.requestDataArray){
		req.data.requestDataArray = req.data.requestDataArray;
	}
	
};

copyUserData = function(req){
	
	if(undefined == req.data){
		req.data = new varPageData.Data();
	}
	if(undefined === req.session.passport.user){
		req.data.loggedIn = "false";
		req.data.userData_name = "Guest";
	}
	else{
		req.data.loggedIn = "true"; 
		req.data.userData_name = req.session.passport.user.userName;
		req.data.userId = req.session.passport.user.id;
	}
};