var varModel = require('../models/Model'),
    now = new Date();

exports.authUser = function(req,callback) {
    console.log("Entering LoginHandler.searchuser" + JSON.stringify(req.body));
    req.getConnection(function (err, connection) {
        if (err) {
        	console.log("Entering LoginHandler.searchuser - Error:: " + err);
        	callback(err,null);
        }
        else {
        	console.log("Entering LoginHandler.searchuser - Connection Success");
        	var email = req.body.email;
        	var password = req.body.password;
            var query = "SELECT id,email,name,signup_type,user_group,fb_link,tw_link from LOGIN_USER WHERE status = 'A' and email='" + email + "' and password='" + password + "'";
            console.log("Entering LoginHandler.searchuser - Query :" + query );
            connection.query(query, function (err, rows, fields) {
            	console.log("Entering LoginHandler.searchuser - Query Executed" + rows.length);
            	if(err){
            		console.log("Entering LoginHandler.searchuser - Query Failed");
            		callback(err,null);
            	}
            	else if(rows && rows.length == 0){
            		var error = new Error('USER_NOT_FOUND');
            		error.id = 1000;
            		callback(error,null);
            	}
            	else if(rows && rows.length > 0){
            		var user = new varModel.User();
            		user.id = rows[0].id;
            		user.email = rows[0].email;
            		user.userName = rows[0].name;
            		user.signupType = rows[0].signup_type;
                    callback(null,user);
                }
            });
        }
    });
};


exports.searchUser = function(req,searchCriteria,userData,callback) {
    console.log("Entering LoginHandler.searchuser");
    req.getConnection(function (err, connection) {
        if (err) {
        	console.log("Entering LoginHandler.searchuser - Error:: " + err);
        	callback(err,null);
        }
        else {
        	console.log("Entering LoginHandler.searchuser - Connection Success");
        	var query = null;
        	if(null != searchCriteria){
        		query = buildUserQueryForCriteria(beneficiaryData,searchCriteria);
        	}
            console.log("UserHandler.searchBeneficiary - Query :" + query );
            connection.query(query, function (err, rows, fields) {
            	console.log("UserHandler.searchBeneficiary - Query Executed");
            	if(err){
            		console.log("UserHandler.searchBeneficiary - Query Failed");
            		callback(err,null);
            	}
            	else if(rows && rows.length == 0){
            		var error = new Error('BENEFICIARY_NOT_FOUND');
            		callback(error,null);
            	}
            	else if(rows && rows.length > 0){
            		var beneficiary = new varModel.beneficiaryData();
            		beneficiary.name = rows[0].name;
            		beneficiary.id = rows[0].id;
                    callback(null,beneficiary);
                }
            });
        }
    });
};

exports.saveUser = function(req,userData,callback){
	console.log("Entering LoginHandler.saveUser");
	req.getConnection(function(err, connection){
        if (err) {
        	console.log("LoginHandler.saveUser - Connection Failed" + err);
        	callback(err,null);
        } else {
        	console.log("LoginHandler.saveUser: Connection Success");
           		var query = "INSERT INTO LOGIN_USER(email,password,signup_type,remember_token,user_group,name,fb_link,tw_link,date,status) VALUES(" +
            			"'" + userData.email + "'" +
            			",'" + userData.password + "'" +
            			",'" + userData.signupType + "'" +
            			",'" + userData.remember_token + "'" +
            			",'" + userData.user_group + "'" +
            			",'" + userData.userName + "'" +
            			",'" + userData.fb_link + "'" +
            			",'" + userData.tw_link + "'" +
            			",'" + now.getTime() + "'" +
            			",'" + "A" + "')";
            		connection.query(query,function(err, rows, fields){
            			console.log("LoginHandler.saveUser with Query: " + query);
            			console.log("LoginHandler.saveUser returning to router:" + JSON.stringify(rows));
            			if(err){
            				console.log("LoginHandler.saveUser - Unable to Save User Data" + err);
            	           	callback(err,null);
            			}
            			if(rows && rows.affectedRows > 0 ){
            				var user = new varModel.User();
                    		user.id = rows.insertId;
                    		user.email = userData.email;
                    		user.userName = userData.userName;
                    		console.log("LoginHandler.saveUser returning to router:" + JSON.stringify(user));
                            callback(null,user);
            			}
            		});
        }
	});
};

function buildUserQueryForCriteria(userData,searchCriteria){
	console.log("Login Handler searchCriteria::" + JSON.stringify(userData));
	var query = "SELECT id,email,signup_type,user_group,name,fb_link,tw_link from LOGIN_USER WHERE status = 'A' ";
    
	if(searchCriteria == "USER_ID" && userData.id != null){
		query = query + " and id = '" + userData.id + "'";
	}
	return query;
};


/*

    connectionpool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            var query = "SELECT id,name as username from USER WHERE email='"+ userEmail + "'";
            connection.query(query, function(err,rows,fields){
                if(err){
                    console.error("SELECT ERROR: " + err);
                    callback(err);
                    return;
                }
                if(rows.length == 0){
                    console.log("Controller.searchuser:: ResultSet is null for Email:: " + userEmail);
                    var result = "USER_NEW";
                    callback(result);
                    return;
                }
                var userInfo = new varDTO.UserDTO();
                userInfo.name = rows[0].username;
                callback(userInfo);
                return;
            });
        }
    });
};



exports.insertLogin = function(userInfo){
	console.log("Entering DBConn.insertUser");
	connectionpool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
              res.send({
                result: 'error',
                err:    err.code
            });
        } else {
        	console.log("DBConn.insertUser - Before Success");
        	connection.query('select max(id) AS maxId from user', function(err,rows,fields){
        		if(err){
        			console.error("SELECT ERROR: " + err);
        			return false;
        		}
        		var maxId = rows[0].maxId;
        		maxId = maxId + 1;
        		console.log("maxID:::"+ maxId + " and Name: "  + userInfo.name);
        		var query = "INSERT INTO USER(id,name,email,fblink,isfbuser) VALUES(" + maxId + ",'" + userInfo.name + "'" +
        		",'" + userInfo.email + "'" +
        		",'" + userInfo.fblink + "'" +
        		",'" + userInfo.isfbuser + "')";
        		console.log("Query::" + query);
        		connection.query(query, 
        			function(err, rows, fields){
        				if(err){
        					console.error("INSERT ERROR: " + err);
        					return false;
        				}
        				console.log("After Success");	
        		});
            });
        }
    });
};

*/



