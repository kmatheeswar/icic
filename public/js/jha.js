jQuery(document).ready(function() {
	$("#signup_div").hide();
	$("#login_div").hide();
	$("#create_request").hide();
	$("#create-care").hide();
    $("#content").show();
    $("#main-sign-in").hide();
    $("#main-signup").hide();

	var request = $.ajax({
		 url: '/loadRequest',
		 type: "get",
		 dataType: "json",
		 success: function(data)
		 	{
			 	showRequestDataJha(data);
			 }
	});

	$( "#autocomplete" ).autocomplete({
	  source: [ "nature", "environment", "charity", "new delhi", "bangalore", "rakesh", "manisha", "education" ]
	});
	
	//
	
	$('input:radio[name="forSelf"]').change(function(){
	    if($(this).val() === 'No'){
	       $("#request-beneficiary").show();
	    }
	    if($(this).val() === 'Yes'){
		   $("#request-beneficiary").hide();
		}
	});

    $('input:radio[name="isNGO"]').change(function(){
        showNGOFields(this);
    });
	
	/*$("#create-request").submit(function(e){
		
		var raised_by = $("#raised_by").val();
		e.preventDefault();
		var customUrl = "/createRequest";
	    var request = $.ajax({
	        url: customUrl,
	        type: "post",
	        data: { raised_by: $("#raised_by").val() , raised_by: $("#raised_by").val()   },
	        dataType: "json",
	        success: function(response)
		 	{   
	        	alert(response);
			 	showRequestDataJha(response);
			 }
	    });
	    //request.done(showRequestDataJha(response));
	});
*/


});

function showNGOFields(e) {
    $('#lightbox').hide();
}

function loadRequest(e) {
    var customUrl = "/searchRequest/" + e;
    var request = $.ajax({
        url: customUrl,
        type: "GET",
        dataType: "json"
    });
    request.done(showRequestDataJha,function(){
    	$("#login_div").hide();
    	$("#signup_div").hide();
    	$("#create-care").hide();
    	$("#request-image-content").show();
    });
}

function fnDisplayRegister(){
	$("#maincontent-right").hide();
    $("#maincontent-left").hide();
    $("#login_div").hide();
    $("#create-care").hide();
    $("#slideshow").hide();
    $("#main-content-head").hide();
	$("#signup_div").show();
    $("#signup_facebbok").show();
    $("#signup_form").hide();
}

function fnDisplayLogin(){
	$("#maincontent-right").hide();
	$("#maincontent-left").hide();
    $("#signup_div").hide();
    $("#create-care").hide();
    $("#slideshow").hide();
    $("#main-content-head").hide();
	$("#login_div").show();
    $('#login_facebook').show();
    $("#login_main").hide();
}

function displayCreateCare(){
	
	$("#request-image-content").hide();
	$("#signup_div").hide();
	$("#login_div").hide();
    $("#maincontent-right").hide();
    $("#maincontent-left").hide();
    $("#slideshow").hide();
    $("#main-content-head").hide();
	$("#create-care").show();
}

function fnLogout(){
	alert("logout");
	var request = $.ajax({
        url: "/logout",
        type: "GET",
        dataType: "json"
    });
	request.done(window.location.reload());
}

function showRequestPage(){
	deleteAllRow('request_TABLE');
	$("#create_request").show();
}

function showRequestDataJha(response)
{
    deleteAllRow('request_TABLE');
    var requestTable = document.getElementById('request_TABLE');
    var requestCount = response.requestDataArray.length;
    var j  = 0;
    var requestCounter = 0;
    for(var i = 0 ; i < 2 ; i++) {
        var row = requestTable.insertRow(i);
        var j  = 0 ;
        while( j < 3 && requestCounter < requestCount){
            var cell1 = row.insertCell(j);
           var innerHtml = "<td>" + response.requestDataArray[requestCounter].title +
                "</br>"  +
                '<img class="request-image" width="75%" height="150" src="' + "images/poverty.jpg" + '" />' +
                "</br>" +
                '<a href="/iciclarvelphp/server.php/icic/users/' + response.requestDataArray[requestCounter].id + '">' + response.requestDataArray[requestCounter].raisedBy + "</a>" +
                "</br>" +

                "</td>";
           j++;
           requestCounter++;
           cell1.innerHTML = innerHtml;
        }
    }
}

function deleteAllRow(tableID){

    var Parent = document.getElementById(tableID);
    while(Parent.hasChildNodes())
    {
        Parent.removeChild(Parent.firstChild);
    }
}

function fnDisplayCreateSection(e){
    alert(e.value);
}



/*
function validateUser(e){

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var request = $.ajax({
        url: 'server.php/login',
        type: "post",
        data: { email : email , password : "1234"}

    });
    request.done(showRequestDataJha);
    request.fail(callFailed);
}


function loadRequest(e) {
	
    var customUrl = "/searchRequest?" + e;
    var request = $.ajax({
        url: customUrl,
        type: "GET",
        dataType: "json"
    });
    request.done(showRequestDataJha);
    request.fail(callFailed);
}

function showRequestDataJha(response)
    {
        deleteAllRow('request_TABLE');
        var requestTable = document.getElementById('request_TABLE');
        var requestCount = response.length;
        var j  = 0;
        var requestCounter = 0;
        for(var i = 0 ; i < 2 ; i++) {
            var row = requestTable.insertRow(i);
            var j  = 0 ;
            while( j < 3 && requestCounter < requestCount){
                var cell1 = row.insertCell(j);
               var innerHtml = "<td>" + response[requestCounter].description +
                    "</br>"  +
                    '<img class="frimg" width="230" height="150" src="' + "images/poverty.jpg" + '" />' +
                    "</br>" +
                    '<a href="/iciclarvelphp/server.php/icic/users/' + response[requestCounter].id + '">' + response[requestCounter].raised_by + "</a>" +
                    "</br>" +

                    "</td>";
               j++;
               requestCounter++;
               cell1.innerHTML = innerHtml;
               
            }
        }
    }

function loadImage(){
    var request = $.ajax({
        url: "server.php/icic/requests/2005/images",
        type: "GET",
        dataType: "image/jpeg",
        Accept: ""
    });
    request.done(showRequestData);
    request.fail(callFailed);
}

function showRequestData(response){

    alert(response);
    alert('<img class="frimg" width="230" height="150" src="http://3b4efb995be6c5c64252-c03f075f8191fb4e60e74b907071aee8.r12.cf1.rackcdn.com/1626715_1404092827.6877.jpg" />');
}

function deleteAllRow(tableID){

    var Parent = document.getElementById(tableID);
    while(Parent.hasChildNodes())
    {
        Parent.removeChild(Parent.firstChild);
    }
}

function callFailed(){
    alert("Ajax Call to loadRequest Failed");
}
*/