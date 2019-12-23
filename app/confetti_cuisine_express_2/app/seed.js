"use strict";

const mongoose =require("mongoose"),
	Subscriber = require("./models/subscriber"),
	Course = require("./models/course"),
	User = require("./models/user");

mongoose.connect(
	"mongodb://db:27017/recipe_db",
	{ useNewUrlParser: true }
);

mongoose.connection;

var contacts = [
	{	
		name: {
			first: "jon",
			last: "Wexler"
		},
		email: "jon@jonwexler.com",
		zipCode: 10016,
		password: "jon"
	},
	{
		name: {
			first: "Chef",
			last: "Eggplang"
		},
		email: "eggplang@resipeapp.com",
		zipCode: 20331,
		password: "Chef"
	},
	{
		name: {
			first: "Professor",
			last: "Souffle"
		},
		email: "souffle@recipeapp.com",
		zipCode: 19103,
		password: "Professor"
	}
];

Subscriber.deleteMany()
	.exec()
	.then(() => {
		console.log("Subscriber data is empty!");
	});


Course.deleteMany()
	.exec()
	.then(() => {
		console.log("Course data is empty!");
	});


User.deleteMany()
	.exec()
	.then(() => {
		console.log("User data is empty!");
	});

var commands = [];

contacts.forEach((c) => {
	let newUser = new User({
		name: c.name,
		email: c.email,
		zipCode: c.zipCode
	})
	commands.push( User.register(newUser, c.password) );
});

Promise.all(commands)
	.then(r => {
		console.log(JSON.stringify(r));
		mongoose.connection.close();
	})
	.catch(error => {
		console.log(`ERROR: ${error}`);
	});