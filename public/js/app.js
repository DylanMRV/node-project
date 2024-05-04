//This is a Client side JS file

//selects tag "form" from index.hbs (since it uses this file) this sites that tag and uses what's in it. what comes back is a JS representation of that element.
const weatherForm = document.querySelector("form");

const search = document.querySelector("input");

//querySelector matches first thing it finds with the same name. with multiple <p> for example, it might not grab the one you want.
//to target by a class inside () you would use ".ClassName", but our paragraphs in index.hbs have id's, so we use in (): "#id_name"
const messageOne = document.querySelector("#message-1");
const messageTwo = document.querySelector("#message-2");

messageOne.textContent = "";
messageTwo.textContent = "";

//listener takes name of string trying to listen for, second is a callback function that runs every single time that event occurs. BTW: 'e' stands for 'event'.
weatherForm.addEventListener("submit", (e) => {
	//prevents default behavior of refreshing the browser, allowing the server to render a new page, instead it's going to do nothing. so for us it'll let this function run.
	e.preventDefault(); 
	
	const location = search.value; //value method extracts value from search.
	
	messageOne.textContent = "Loading...";
	messageTwo.textContent = "";
	
	//using fetch will start an asyncronous IO opperation (like calling a request in node), so we don't have access to data right away, so we provide a function that will run in future when data is available.
	//http://localhose:3000/weather?address in "" before + location, if we were not using heroku.
	fetch("/weather?address=" + location).then((response) => {
		response.json().then((data) => {
			if (data.error) {
				messageOne.textContent = data.error;
			} else {
				messageOne.textContent = data.location;
				messageTwo.textContent = data.forecast;
			};
		});
	});
});
//the default behavior of forms is to reload the page, so you'll see the location for a split second before it vanishes in the browser console.