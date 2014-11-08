exports.dataModel = function(){
	this.loggedIn = null;
	this.user = null;
};
exports.User = function(){
	this.id = null;
	this.email = null;
	this.password = null;
	this.name = null;
	this.signupType = null;
	this.token = null;
};

exports.SessionDTO = function() {
	this.email = null;
	this.userid = null;
	this.username = null;
};

exports.RequestDTO = function(){
	this.raisedBy = null;
    this.category = null;
    this.title = null;
	this.beneficiaryId = null;
	this.description = null;
	this.fbLink = null;
	this.twLink = null;
	this.expiryDate = null;
	this.dateCreated = null;
	this.status = null;
};


exports.beneficiaryData = function(){
	this.name = null;
};