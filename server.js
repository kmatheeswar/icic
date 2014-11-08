
'use strict';

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var mysql_host = process.env.OPENSHIFT_MYSQL_DB_HOST || "localhost" ;
var mysql_port = process.env.OPENSHIFT_MYSQL_DB_PORT || "8889" ;
var mysql_user = process.env.OPENSHIFT_MYSQL_DB_USERNAME || "root" ;
var mysql_password = process.env.OPENSHIFT_MYSQL_DB_PASSWORD || "root" ;


var flash    = require('connect-flash');
var express = require('express');
var cookieParser = require('cookie-parser');

var http = require('http');
var path = require('path');
var router = require('./routes/router');
var loginHandler = require('./controller/LoginHandler');
var util = require('./models/Util');

var dust = require('dustjs-linkedin');
var dusthelper = require('dustjs-helpers');
var cons = require('consolidate');

var fb = require('fbgraph');
var mysql   = require('mysql');
var connection  = require('express-myconnection');

//Session and Authentication
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session      = require('express-session');
var model = require('./models/Model');
var pageData = require('./models/PageData');
var user = new model.User() ;
var app = express();


app.configure(function() {
    app.engine('dust', cons.dust);
    app.set('port',port);
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.static(path.join(__dirname , 'public')));
    app.set('view engine', 'dust');
    app.use(
        connection(mysql,{
            host: mysql_host,
            port: mysql_port,
            user: mysql_user,
            password : mysql_password,
            database:'ICIC'
        },'request')
    );
    app.use(express.cookieParser('keyboard cat'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({secret: "123456789rakesh"}));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
});


	passport.serializeUser(function(user, done) {
	    done(null, user);
	});

	passport.deserializeUser(function(id, done) {
        done(null, user);
	});
	
	passport.use('local',new LocalStrategy({
	    usernameField : 'email',
	    passwordField : 'password',
	    passReqToCallback : true},
	  function(req,email,password, done) {
	    process.nextTick(function () {
	    	loginHandler.authUser(req,function(err,userResponse){
	    		if(err){
	    			console.log(err.message);
	    		}
		        return done(null, userResponse);
	    	});
	    });
	  }
	));


//ICIC Routes Starts here

app.get('/', router.index);
app.get('/login', function(req,res){
    res.render('login');
});

app.get('/lightBox', function(req,res){
    res.render('lightBox');
});

app.get('/logout', router.index);

app.post('/logout', function(req, res){
	  req.logout();
	  util.render(req,res);
	});

app.get('/create',function(req,res){
		res.render('create-request' ,{ data: req.session.passport.user});
	});

app.post('/createRequest',router.createRequest);

app.post('/login', 
    passport.authenticate('local', { failureRedirect: '/failed', failureFlash: true }),
    function(req, res) {
		util.render(req,res);
    });

app.post('/signup', router.saveUser); 

app.get('/signup', router.index);

app.get('/searchRequest/:category',router.searchRequest);

app.get('/loadRequest',router.searchRequest);

app.get('/failed', function(req, res, next) {
    res.send('Failed to authenticate');
});

http.createServer(app).listen(app.get('port'),ipaddress, function(){
  console.log('Express server listening on port ' + app.get('port'));
});
