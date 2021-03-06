"use strict";
const MongoDB = require("mongodb").MongoClient,
	dbURL = "mongodb://db:27017",
	dbName = "recipe_db";

MongoDB.connect(dbURL, (error, client) => {
	if(error) throw error;
	let db = client.db(dbName);
	db.collection("contacts")
		.find()
		.toArray((error, data) => {
			if(error) throw error;
			console.log(data);
		});
})
const express = require("express"),
	app = express();
const homeController = require("./controllers/homeController");
const errorController =require("./controllers/errorController");
const layouts = require("express-ejs-layouts");

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use(layouts);
app.use(express.static("public"))

app.get("/", (req, res) => {
	res.send("Welcome to Confetti Cuisine!");
});

app.use(
	express.urlencoded({
		extended: false
	})
);
app.use(express.json());

app.get("/courses", homeController.showCourses);
app.get("/contact", homeController.showSignUp);
app.post("/contact", homeController.postedSignUpForm);

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
	console.log(
		`Server running at http://localhost:${app.get("port")}`
		);
});
