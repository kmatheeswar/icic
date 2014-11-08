var mysql   = require('mysql');
var varDTO = require('../models/UserDTO');

var connectionpool = mysql.createPool({
        host     : 'localhost',
        user     : 'root',
        password : 'rakesh',
        database : 'test'
   });



exports.createSession = function(sessionInfo){
    console.log("Entering SessionHandler.createSession");
    connectionpool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
              res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            console.log("SessionHandler.createSession - Creating Session for email::" + sessionInfo.email);
            var date = new Date();
            var currentTime = date.getMilliseconds(); 
            var query = "INSERT INTO WSESSION(email,userid,agencyid,sessiondata,lastaccesstime)" +
                "VALUES(" + 
                "'" + sessionInfo.email + "'" +
                ",'" + sessionInfo.userid + "'" +
                ",'" + sessionInfo.agencyid + "'" +
                ",'" + sessionInfo.sessiondata + "'" +
                ",'" + currentTime + "')";
            console.log("SessionHandler.createSession - Creating Session Insert Query::" + query);
            connection.query(query,function(err, rows, fields){
                if(err){
                    console.error("SessionHandler - INSERT Failed" + err);
                    return false;
                }
                console.log("SessionHandler - INSERT is Successful");
                return;
            });
        }
    });
};

exports.updateSession = function(sessionInfo){
    console.log("Entering SessionHandler.updateSession");
    connectionpool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
              res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            console.log("SessionHandler.updateSession - Updating Session for email::" + sessionInfo.email);
            var date = new Date();
            var currentTime = date.getMilliseconds(); 
            var query = "UPDATE WSESSION SET USERID = '" + sessionInfo.userid + "', AGENCYID = '" + sessionInfo.agencyid + "', LASTACCESSTIME = '" + currentTime + "' WHERE EMAIL = '" + sessionInfo.email + "'"; 
            console.log("SessionHandler.createSession - UPDATE Session Insert Query::" + query);
            connection.query(query,function(err, rows, fields){
                if(err){
                    console.error("SessionHandler - UPDATE Failed" + err);
                    return false;
                }
                console.log("SessionHandler - UPDATE is Successful");
                return;
            });
        }
    });
};    

exports.loadSession = function(userEmail,callback){
    console.log("Entering SessionHandler.loadSession");
    var email = userEmail;
    var sessionInfo = new varDTO.SessionDTO();
    if(email != null && email.length == 0){
        console.log("SessionHandler.loadSession - returning Empty Session");
        callback(sessionInfo);
        return;
    }
    connectionpool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
              res.send({
                result: 'error',
                err:    err.code
            });
        }else {
            var query = "SELECT email as email , userid as userid , agencyid as agencyid , sessiondata as sessiondata , lastaccesstime as lastaccesstime FROM WSESSION WHERE email='"+ email + "'";
            console.error("SessionHandler:LoadSession - Query ::" + query);
            connection.query(query, function(err,rows,fields){
                if(err){
                    console.error("SessionHandler - Select Query Failed" + err);
                    return false;
                }
                console.log("SessionHandler - SELECT is Successful");
                if(rows.length > 0){
                    console.log("SessionHandler.LoadSession - Row Count::" + rows.length);
                    sessionInfo.email = rows[0].email;
                    sessionInfo.userid = rows[0].userid;
                    sessionInfo.agencyid = rows[0].agencyid;
                    sessionInfo.sessiondata = rows[0].sessiondata;
                    sessionInfo.lastaccesstime = rows[0].lastaccesstime;
                    console.log("SessionHandler.LoadSession - Row UserID" + rows[0].userid);
                }
                callback(sessionInfo);
                return;
            });   
        }
    });
};      

exports.updateSession = function(sessionInfo,callback){
    console.log("Entering SessionHandler.updateSession");
    connectionpool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
              res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            console.log("SessionHandler.updateSession - Updating Session for email::" + sessionInfo.email);
            var query = "UPDATE WSESSION SET USERID = '" + sessionInfo.userid + "' ,AGENCYID = '" + sessionInfo.agencyid + "' SESSIONDATA = '" 
            + sessionInfo.sessiondata + "', lastaccesstime = '"  + sessionInfo.lastaccesstime + "' WHERE EMAIL = '" + sessionInfo.email + "'";
            
            console.log("SessionHandler.updateSession - Updating Session Query::" + query);
            connection.query(query,function(err, rows, fields){
                if(err){
                    console.error("SessionHandler - Update Failed" + err);
                    return false;
                }
                var date = new Date();
                var currentTime = date.getMilliseconds(); 
                console.log("SessionHandler - Update is Successful");
                var sessionInfo = new varDTO.SessionDTO();
                sessionInfo.email = rows[0].email;
                sessionInfo.userid = rows[0].userid;
                sessionInfo.agencyid = rows[0].agencyid;
                sessionInfo.sessiondata = rows[0].sessiondata;
                sessionInfo.lastaccesstime = currentTime;
                callback(sessionInfo);
            });
        }
        });
    };       
