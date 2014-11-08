var varModel = require('../models/Model'),
    async = require("async");


exports.searchRequest = function(req,searchCriteria,requestDTO,callback) {
    console.log("Entering FundRequestHandler.searchRequest" + JSON.stringify(req.body));
    req.getConnection(function (err, connection) {
        if (err) {
        	console.log("FundRequestHandler.searchRequest - Error" + err);
        	callback(err,null);
        }
        else {
        	console.log("FundRequestHandler.searchRequest - Connection Success");
        	var query = null;
        	if(null !== searchCriteria){
        		query = buildRequestQueryForCriteria(requestDTO,searchCriteria);
        	} else {
                query = "SELECT id,raised_by_id,category,title,beneficiary_id from USER_REQUEST  WHERE status = 'A' ORDER BY time_created LIMIT 5";
            }
            console.log("Entering FundRequestHandler.searchRequest - Query :" + query );
            connection.query(query, function (err, rows, fields) {
            	console.log("Entering FundRequestHandler.searchRequest - Query Executed" + rows.length);
            	if(err){
            		console.log("Entering FundRequestHandler.searchuser - Query Failed");
            		callback(err,null);
            	}
            	else if(rows && rows.length == 0){
            		var error = new Error('REQUEST_NOT_FOUND');
            		callback(error,null);
            	}
            	else if(rows && rows.length > 0){

                    var requestDataArray = [];
                    async.forEach(Object.keys(rows), function (item, next){ 
                        var temp = new varModel.RequestDTO();
                        temp.raisedBy = rows[item].raised_by_id;
                        temp.category = rows[item].category;
                        temp.title = rows[item].title;
                        requestDataArray.push(temp);
                        next();
                    }, function(err) {
                            console.log('iterating done');
                    }); 
                    callback(null,requestDataArray);
                }
            });
        }
    });
};

function buildRequestQueryForCriteria(requestDTO,searchCriteria){
	console.log("Criteria::" + JSON.stringify(requestDTO));
	//var query = "SELECT id,raised_by,beneficiary_id,category,request_type,description,fb_link,tw_link,expiry_date,date_created from REQUEST WHERE status = 'A' ";
	var query = "SELECT id,raised_by_id,category,title,beneficiary_id from USER_REQUEST  WHERE status = 'A'";
    
	if(searchCriteria == "REQUEST_ID" && requestDTO.id != null){
		query = query + " and id = '" + requestDTO.id + "'";
	}
	else if(searchCriteria == "RAISED_BY" && requestDTO.raisedBy != null){
		query = query + " and raised_by_id = '" + requestDTO.raisedBy + "'";
	}
	else if(searchCriteria == "BENEFICIARY_ID" && requestDTO.beneficiaryId != null){
		query = query + " and beneficiary_id = '" + requestDTO.beneficiaryId + "'";
	}
	else if(searchCriteria == "CATEGORY" && requestDTO.category != null){
		query = query + " and category = '" + requestDTO.category + "'";
	}
	return query;
};


exports.registerFundRequest = function(req,requestDTO,callback){
	console.log("Entering FundRequestHandler.registerFundRequest");
	req.getConnection(function(err, connection){
        if (err) {
        	console.log("FundRequestHandler.registerFundRequest - Connection Failed" + err);
        	callback(err,null);
        } else {
        	console.log("FundRequestHandler.registerFundRequest: Connection Success");
           		var query = "INSERT INTO USER_REQUEST(raised_by_id,category," +
            				"title,beneficiary_id,time_created,status) VALUES(" +
            				"'" + requestDTO.raisedBy + "'," +
            				"'" + requestDTO.category + "'," +
            				"'" + requestDTO.title + "'," +
                            "'" + requestDTO.beneficiaryId + "'," +
                            "'" + now.getTime() + "'," +
                            "'" + "A" + "'" +
            				")";
                    console.log("FundRequestHandler.registerFundRequest:  Query" + query);
            		connection.query(query,function(err, rows, fields){
            			if(err){
            				console.log("LoginHandler.saveUser - Unable to Save User Data" + err);
            	           	callback(err,null);
            			}
            			if(rows && rows.affectedRows > 0 ){
                            delete req.session.defaultrequestDataArray;
            				var request = new varModel.RequestDTO();
            				request.id = rows.insertId;
            				request.raised_by = requestDTO.raised_by;
            				request.beneficiary_id = requestDTO.raised_by;
            				request.category = requestDTO.category;
            				request.description = requestDTO.description;
                            callback(null,request);
            			}
            			else{
            				callback(null,null);
            			}
            		});
        	}
        });
};

/*

exports.registerUserAgencyMapping = function(agencyInfo){
    console.log("Entering AgencyHandler.registerUserAgencyMapping");
    connectionpool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
              res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            console.log("AgencyHandler.registerUserAgencyMapping - Fetching Max Id");
            connection.query('SELECT MAX(id) AS maxId FROM WUSER_AGENCY', function(err,rows,fields){
                if(err){
                    console.error("SELECT ERROR: " + err);
                    return false;
                }
                var maxId = rows[0].maxId;
                maxId = maxId + 1;
                console.log("maxID:::"+ maxId + " and Name: "  + agencyInfo.agencyName);
                var query = "INSERT INTO WUSER_AGENCY(id,userid,agencyid,agencystatus,flags,date)" +
                "VALUES(" + maxId + 
                ",'" + agencyInfo.userid + "'" +
                ",'" + agencyInfo.agencyid + "'" +
                ",'" + agencyInfo.agencystatus + "'" +
                ",'" + agencyInfo.flags + "'" +
                ",'" + agencyInfo.date + "')";
                console.log("AgencyHandler.registerUserAgencyMapping - Agency Insert Query::" + query);
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


exports.searchUserAgencyMapping = function(agencyInfo,callback){
    console.log("Entering AgencyHandler.searchUserAgencyMapping");
    connectionpool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
              res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            console.log("AgencyHandler.searchUserAgencyMapping - Fetching Max Id");
            var query = "SELECT agencyid as agencyid FROM WUSER_AGENCY WHERE userid='"+ agencyInfo.userid + "'";
            connection.query(query, function(err,rows,fields){
                if(err){
                    console.error("SELECT ERROR: " + err);
                    return false;
                }
                if(rows.length == 0){
                    console.log("AgencyHandler.searchUserAgencyMapping:: Agency ResultSet for userid:: " + agencyInfo.userid);
                    var result = "AGENCY_NEW";
                    callback(result);
                    return;
                }
                callback(agencyInfo);
                return;
            });
        }
    });
};
   

exports.registerAgency = function(agencyInfo,callback){
	console.log("Entering AgencyHandler.registerAgency");
	connectionpool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
              res.send({
                result: 'error',
                err:    err.code
            });
        } else {
        	console.log("AgencyHandler.registerAgency - Fetching Max Id");
        	connection.query('SELECT MAX(id) AS maxId FROM WAGENCY', function(err,rows,fields){
        		if(err){
        			console.error("SELECT ERROR: " + err);
        			return false;
        		}
        		var maxId = rows[0].maxId;
        		maxId = maxId + 1;
        		console.log("maxID:::"+ maxId + " and Name: "  + agencyInfo.agencyName);
        		var query = "INSERT INTO WAGENCY(id,name,isregistered,regno,street,locality,city,state,pincode,country)" +
        		"VALUES(" + maxId + 
        		",'" + agencyInfo.name + "'" +
        		",'" + agencyInfo.isregistered + "'" +
        		",'" + agencyInfo.regno + "'" +
        		",'" + agencyInfo.addressDTO.street + "'" +
        		",'" + agencyInfo.addressDTO.locality + "'" +
        		",'" + agencyInfo.addressDTO.city + "'" +
        		",'" + agencyInfo.addressDTO.state + "'" +
        		",'" + agencyInfo.addressDTO.pincode + "'" +
        		",'" + agencyInfo.addressDTO.country + "')";
        		console.log("AgencyHandler.registerAgency - Agency Insert Query::" + query);
        		connection.query(query, 
        			function(err, rows, fields){
        				if(err){
        					console.error("INSERT ERROR: " + err);
        					return false;
        				}
                        agencyInfo.agencyid = maxId;
                        callback(agencyInfo);
        				console.log("After Success");	
        		});
            });
        }
    });
};

exports.searchAgency = function(city,callback){
    console.log("Entering AgencyHandler.searchAgency");
    connectionpool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
              res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            var agencyInfoArray = [];
            console.log("AgencyHandler.searchAgency - Searching Agency");
            var query = "SELECT id,name,isregistered,regno,street,locality,city,state,pincode FROM WAGENCY WHERE CITY ='" + city + "'";
            console.log("Search Agency Query::" + query);
            connection.query(query, function(err,rows,fields){
                if(err){
                    console.error("SELECT ERROR: " + err);
                    callback(err);
                    return;
                }
                if(rows.length == 0){
                    console.log("AgencyHandler.searchagency:: ResultSet is null for City:: " + city);
                    callback(agencyInfoArray);
                    return;
                }
                rows.forEach(function(row){
                    var agencyInfo = new varDTO.AgencyInfoDTO();
                    agencyInfo.id = row.id;
                    agencyInfo.name = row.name;
                    agencyInfo.isregistered = row.isregistered;
                    agencyInfo.regno = row.regno;
                    var addressInfo = new varDTO.AddressDTO();
                    addressInfo.street = row.street;
                    addressInfo.locality = row.locality;
                    addressInfo.city = row.city; 
                    addressInfo.state = row.state;
                    addressInfo.pincode = row.pincode;
                    agencyInfo.addressDTO = addressInfo;
                    agencyInfoArray.push(agencyInfo);   
                    
                });
                callback(agencyInfoArray);
                return;
            });
        }
    });
};

*/