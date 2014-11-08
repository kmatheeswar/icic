"use strict"

var UserData = function(){
	this.id = null;
	this.name = null;
	this.email = null;
	this.fbLink = null;
	this.twLink = null;
	this.requestArray = null;
};

exports.RequestData = function() {
	this.id = null;
	this.raisedBy = null;
	this.category = null;
	this.description = null;
	this.imagePath = null;
	this.beneficiary = null;
};

exports.BeneficiaryData = function(){
	this.id = null;
	this.name = null;
	this.category = null;
	this.address = null;
	this.identity = null;
	this.socialMedia = null;
};

exports.Identity = function(){
	this.idType = null;
	this.idValue = null;
};

exports.SocialMedia = function(){
	this.fbLink = null;
	this.twLink = null;
};

exports.Address = function(){
	this.street1 = null;
	this.street2 = null;
	this.city = null;
	this.state = null;
	this.zip = null;
	this.country = null;
};

exports.Data = function() {
	this.loggedIn = null;
	this.userData_name = null;
};

