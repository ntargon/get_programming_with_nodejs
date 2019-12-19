"use strict";

const mongoose = require("mongoose");
mongoose.connect(
	"mongodb://db:27017/recipe_db",
	{useNewUrlParse: true}
);
mongoose.Promise = global.Promise;

const subscribersController = require("./controllers/subscribersController");


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

app.get("/subscribers", subscribersController.getAllSubscribers);

const usersController = require("./controllers/usersController");
app.get("/users", usersController.index, usersController.indexView);

app.use(
	express.urlencoded({
		extended: false
	})
);
app.use(express.json());

app.get("/contact", subscribersController.getSubscriptionPage);
app.post("/subscribe", subscribersController.saveSubscriber);

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
	console.log(
		`Server running at http://localhost:${app.get("port")}`
		);
});
