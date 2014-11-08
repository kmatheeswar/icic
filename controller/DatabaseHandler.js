var mysql   = require('mysql');
var connection = null;


exports.connect = function(callback){
    console.log("Entering DatabaseHandler.Connect");
    if(null == connection){
        var connection = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : 'root',
            database : 'ICIC'
        });

    }

};

