"use strict";

const mongoose =require("mongoose"),
	Subscriber = require("./models/subscriber");

mongoose.connect(
	"mongodb://db:27017/recipe_db",
	{ useNewUrlParser: true }
);

mongoose.connection;

var contacts = [
	{	
		name: "jon Wexler",
		email: "jon@jonwexler.com",
		zipCode: 10016
	},
	{
		name: "Chef Eggplang",
		email: "eggplang@resipeapp.com",
		zipCode: 20331
	},
	{
		name: "Professor Souffle",
		email: "souffle@recipeapp.com",
		zipCode: 19103
	}
];

Subscriber.deleteMany()
	.exec()
	.then(() => {
		console.log("Subscriber data is empty!");
	});

var commands = [];

contacts.forEach((c) => {
	commands.push(Subscriber.create({
		name: c.name,
		email: c.email
	}));
});

Promise.all(commands)
	.then(r => {
		console.log(JSON.stringify(r));
		mongoose.connection.close();
	})
	.catch(error => {
		console.log(`ERROR: ${error}`);
	});