const request = require("postman-request");

const geocode = (address, callback) => {
	const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURIComponent(address) + ".json?access_token=pk.eyJ1IjoiZHlsYW52dWtlbGljaCIsImEiOiJjbG81Yjd2azMwODFhMmtsNTN1NHB0YTE0In0.J9u5fz9URxOWCk9AnLb27w&limit=1";
	
	request({url, json: true}, (error, {body}) => {
		if (error) {
			callback("undable to connect to geocode service", undefined); //js will automatically make data be undefined if there is an error, so this undefined specification is optional.
		} else if (body.features.length === 0) {
			callback("Unable to find location, try another search", undefined);
		} else {
			callback(undefined, {
				latitude: body.features[0].center[1],
				longitude: body.features[0].center[0],
				location: body.features[0].place_name
			});
		};
	});
	//if there is no network connection, response will be undefined, so with no error handeling you'll get the default error saying can't read body of undefined.
};

module.exports = geocode;