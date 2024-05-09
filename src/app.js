const path = require("path");
const express = require("express"); //express is a function called to create an express application
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

//when linking public folder, needs to be an absolute path, not a relative one.

const app = express(); //we configure the server by using methods provided on the application itself

//since we provided logical 'or' with 3000 we could leave it even without heroku since it will use 3000 if process.env.PORT fails in abscence of heroku.
//this line is for heroku to be able to use this file. 
//process.env is an object where we can access environment variables, heroku will set this. this sets port equal to environment variable value.
const port = process.env.PORT || 3000; 

//define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public"); // ../ goes up a directory from the folder this file (app.js) lives in
const viewsPath = path.join(__dirname, "../templates/views"); //you don't need this if you don't want to rename the views folder [to templates, then later added a sub-folder named views which holds the style hbs files]. with this we could put views in a nested directory by updating this path
const partialsPath = path.join(__dirname, "../templates/partials");

//we need to tell express which templating engine was installed, we do this with app.set
//sets a value for a given express setting
//syntax: app.set("key - the setting name", "value we want to set for the setting")
//to set up a view engine (in other words, to use a views folder), like express, we use 'view engine' for the key name. value will be the name of the nmp module we installed, in our case hbs.
app.set("view engine", "hbs");

//if you didn't need to rename the views path you wouldn't need this app.set
//this points express to the custom directory (i.e. template. we just renamed views to temples)
app.set("views", viewsPath);

//configures the partials. takes path to where partials are
hbs.registerPartials(partialsPath);

//set up static directory to serve
//app.use is a way to costomize the server. we're using it to customize the server to serve up that folder
//express.static() is a function that takes the path to the folder we want to serve up. static means assets are static, they don't change, as opposed to dynamic.
app.use(express.static(publicDirectoryPath));

//app.get is an express route handler for webpage
//app.get is equivalent to setting up a url

//res.render allows us to render our views. no need to specify named file extension, name just needs to match up with the file name in views folder.
//syntax: res.render("file name", object containing all of the values you want that view to access)
app.get("", (req, res) => {
	res.render("index", {
		title: "Weather",
		name: "Dylan Vukelich"
	});
});

app.get("/about", (req, res) => {
	res.render("about", {
		title: "About",
		name: "Dylan Vukelich"
	});
});

app.get("/help", (req, res) => {
	res.render("help", {
		helpText: "Help Page",
		title: "Help",
		name: "Dylan Vukelich"
	});
});

//syntax: app.get("route address partial", function to perform when route is visted). configures what server should do when someone tries to get the resource at a specific URL
//the callback function has two arguments: an object containing information about the incoming request to the server, and the response (what we're going to send back); even in browser this is what would display
//provide an object or an array in res.send to have res.send send JSON. Express stringifies the JSON for us.
//how to provide address in url: localhost:3000/weather?address=fargo
app.get("/weather", (req, res) => {
	if (!req.query.address) {
		return res.send({
			error: "Provide an address"
		});
	};
	
	geocode(req.query.address, (error, {latitude, longitude, location} = {}) => { //setting a default value for the object parameter is good, because if you enter a bad input in the url for ?address= the site will crash because you can't destructure lattitude of undefined.
		if (error) {
			return res.send({error});
		};
		
		forecast(latitude, longitude, (error, forecastData) => {
			if (error) {
				return res.send({error});
			};
			
			res.send({
				forecast: forecastData,
				location,
				address: req.query.address
			});
		});
	});
});

app.get("/products", (req, res) => {
	//req.query. query is an object, contains all querry string information. console.log(req.query) will provide all key value pairs provided in search querry url, and is displayed in CMD terminal when ran, will not appear on site. 
	//req.query.search grabs value from the "search" key name's value pair in url. specifically, grabs the value of "search" key name
	if (!req.query.search) { //so this if statement only runs when there is no search term in querry string url
		return res.send({ //remember return stops function execution, in this case the block. to avoid two http response error.
			error: "You must provide a search term."
		});
	};
	res.send({
		products: [] //sends json with an empty array for products
	});
});

//ex. localhost:3000/weather?address=Fargo

//matching anything after /help will bring you to this specific error page, ex. /help/wow. this allows customized errors ex. if someone is trying to find a specific help page, but didn't type the right one. instead of a generic one
app.get("/help/*", (req, res) => {
	res.render("404" /*because we want to use 404.hbs just with different content than in the general 404 page below*/, {
		title: "404",
		name: "Dylan Vukelich",
		errorMessage: "404 Error: Help Article Not Found"
	});
});

//this is the 404 page. this must come last
//* is the wildcard character, express has it. catches everything not used above in order, why 404 page's app.get must come last.
app.get("*", (req, res) => {
	res.render("404", {
		title: "404",
		name: "Dylan Vukelich",
		errorMessage: "404 Error: Page Not Found"
	});
});

//for heroku's provided port value
app.listen(port, () => {
	console.log("Server is up on port " + port); //this will not display to someone in browser
});

/*this starts up the server and has it listen on a specific port. 3000 is a common development port. this is not the default port, when you visit a website you
don't provide the port because there are default ports, for an http site it's port 80*/
//the callback function executes when server is up and running. the process of starting a server is an asyncronous process, although it will happen almost instantly
//use this app.listen to run this project locally on computer. if this block used, would not have app.listen for heroku, or port constant near top (but since we provided logical or with 3000 we could leave it even without heroku), on this file.
/*
app.listen(3000, () => {
	console.log("Server is up on port 3000"); //this will not display to someone in browser
});
*/

//localhost:3000