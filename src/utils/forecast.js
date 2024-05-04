const request = require("postman-request");

const forecast = (latitude, longitude, callback) => {
	const url = "http://api.weatherstack.com/current?access_key=8e6f10920ee9fa4754e20138bc04bdc8&query=" + latitude + "," + longitude + "&units=f";
	
	request({url, json: true}, (error, {body}) => { /*this is a function that makes http requests. takes 2 args: an options object which outlines what we'd like to do/use, and a func to run when you have that response (destructured to be {body})*/
	//console.log(response); this shows the entire http response, notice it has the json needed as as string
	//with request(), if there is an error there is no response, and vice versa, thats why the if statement works.
		if (error) {
			callback("undable to connect to weather service", undefined);
		} else if (body.error) {
			callback("Unable to find location", undefined);
		} else {
			callback(undefined, body.current.weather_descriptions[0] + ". It is currently " + body.current.temperature + " degrees out. It feels like " + body.current.feelslike + " degrees out. The humidity is " + body.current.humidity + "%.");
		};
	});
	//if there is no network connection, response will be undefined, so with no error handeling you'll get the default error saying can't read body of undefined.
};

module.exports = forecast;