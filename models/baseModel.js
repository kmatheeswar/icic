var BaseModel = function(){
    this.data = {
        requestData: {
            "requestId" : "",
            "raisedBy" : "",
            "category" : "",
            "title" : "",
            "description" : "",
            "beneficiaryName" : ""
        },
        beneficiaryData: {
            "beneficiaryId" : "",
            "name" : "",
            "type" : ""
        },
        inputModel : {
            "guestName" : "Guest",
            "isLoggedIn" : "false"
        }
    }
}