"use strict";
const mongoose = require("mongoose");
mongoose.connect(
	"mongodb://db:27017/recipe_db",
	{useNewUrlParse: true}
);
const db = mongoose.connection;

db.once("open", () => {
	console.log("Successfully connected to MongoDB using Mongoose!");
});

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

// app.get("/subscribers", subscribersController.getAllSubscribers, (req, res, next) => {
// 	console.log(req.data);
// 	// res.send(req.data);
// 	// res.render("subscribers", {subscribers: req.data});
// });

app.get("/subscribers", subscribersController.getAllSubscribers);


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
