   

exports.saveBeneficiary = function(req,beneficiaryData,callback){
    console.log("Entering UserHandler.saveBeneficiary");
    connectionpool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
              res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            console.log("UserHandler.saveBeneficiary - Connection Success");
            connection.query('select max(id) AS maxId from beneficiary', function(err,rows,fields){
                if(err){
                    console.error("SELECT ERROR: " + err);
                    return false;
                }
                var maxId = rows[0].maxId;
                maxId = maxId + 1;
                console.log("UserHandler.saveBeneficiary - maxID:::"+ maxId);
                var query = "INSERT INTO BENEFICIARY(id,category,name,street1,street2,city,state,zip,country,id_type,id_value,fb_link,tw_link,status) VALUES(" 
                	+ maxId + 
                	",'" + beneficiaryData.category + "'" +
                	",'" + beneficiaryData.name + "'" +
                	",'" + beneficiaryData.street1 + "'" +
                	",'" + beneficiaryData.street2 + "'" +
                	",'" + beneficiaryData.city + "'" +
                	",'" + beneficiaryData.state + "'" +
                	",'" + beneficiaryData.zip + "'" +
                	",'" + beneficiaryData.country + "'" +
                	",'" + beneficiaryData.id_type + "'" +
                	",'" + beneficiaryData.id_value + "'" +
                	",'" + beneficiaryData.fb_link + "'" +
                	",'" + beneficiaryData.tw_link + "'" +
                	",'" + "A" + "')";
                console.log("UserHandler.saveBeneficiary - InsertQuery::" + query);
                connection.query(query, 
                    function(err, rows, fields){
                        if(err){
                            console.error("UserHandler.insertLogin - INSERT ERROR: " + err);
                            return false;
                        }
                        console.log("UserHandler.saveBeneficiary - Record inserted Successfully");
                        if(rows && rows.length > 0 ){
            				var beneficiary = new varModel.Beneficiary();
                    		beneficiary.name = rows[0].name;
                            callback(null,beneficiary);
            			}
                });
            });
        }
    });
};


exports.searchBeneficiary = function(req,searchCriteria,beneficiaryData,callback){
	console.log("Entering UserHandler.searchBeneficiary");
	connectionpool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
              res.send({
                result: 'error',
                err:    err.code
            });
        } else {
        	console.log("UserHandler.searchBeneficiary - Connection Success");
        	var query = null;
        	if(null != searchCriteria){
        		query = buildBeneficiaryQueryForCriteria(beneficiaryData,searchCriteria);
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

function buildBeneficiaryQueryForCriteria(beneficiaryData,searchCriteria){
	console.log("UserHandler.buildBeneficiaryQueryForCriteria Criteria::" + JSON.stringify(beneficiaryData));
	var query = "SELECT id,category,name,street1,street2,city,state,zip,country,id_type,id_value,fb_link,tw_link from BENEFICIARY WHERE status = 'A' ";
    
	if(searchCriteria == "BENEFICIARY_ID" && beneficiaryData.id != null){
		query = query + " and id = '" + beneficiaryData.id + "'";
	}
	return query;
};

/*
exports.searchLogin = function(userEmail,callback){
    console.log("Entering UserHandler.searchUserEmail");
    connectionpool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
              res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            var query = "SELECT email from wlogin WHERE email='"+ userEmail + "'";
            connection.query(query, function(err,rows,fields){
                if(err){
                    console.error("SELECT ERROR: " + err);
                    callback(err);
                    return;
                }
                if(rows.length == 0){
                    console.log("UserHandler.searchUserEmail:: ResultSet is null for Email:: " + userEmail);
                    var result = "USER_NEW";
                    callback(result);
                    return;
                }
                var userInfo = new varDTO.UserDTO();
                userInfo.name = rows[0].username;
                console.log("UserHandler.username ::" + userInfo.name);
                callback(userInfo);
                return;
            });
        }
    });
};
*/
