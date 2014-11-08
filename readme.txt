At Template make sure we have below data model:
1 48 24 22 48  test-106-1@yahoo.com

npm config set registry https://registry.npmjs.org/

1) data.loggedIn ="true"||"false"

		.
2) data.user ( for loggedin user data )
	2.1) data.user.id
	2.2) data.user.name
	2.3) data.user.email
	2.4) data.user.fbLink
	2.5) data.user.twLink
	2.6) data.user.requestArray[request]
4) request:
			request.id
			request.raisedBy
			request.category
			request.description
			request.imagePath
			request.beneficiary.id
			request.beneficiary.category
			request.beneficiary.name
			request.beneficiary.address
									.street1
									.street2
									.city
									.state
									.zip
									.country
			request.beneficiary.identity
									.type
									.value
			request.beneficiary.socialMedia
											.fbLink
											.twLink
			
