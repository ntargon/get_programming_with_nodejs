"use strict";
const mongoose = require("mongoose");
mongoose.connect(
	"mongodb://db:27017/recipe_db",
	{useNewUrlParse: true}
);
const db = mongoose.connection;

db.once("open", () => {
	console.log("Successfully connected to MongoDB using Mongoose!");
})

const Subscriber = require("./models/subscriber");


var myQuery = Subscriber.findOne({
	name: "Jon Wexler"
})
.where("email", /wexler/);
myQuery.exec((error, data) => {
	if(data) console.log(data.name);
});


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
