"use strict";

const mongoose = require("mongoose");
mongoose.connect(
	"mongodb://db:27017/recipe_db",
	{useNewUrlParse: true}
);
mongoose.Promise = global.Promise;

const subscribersController = require("./controllers/subscribersController");


const express = require("express"),
	app = express(),
	router = express.Router();
const homeController = require("./controllers/homeController");
const errorController =require("./controllers/errorController");
const layouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
router.use(methodOverride("_method", {
	methods: ["POST", "GET"]
}));

app.use("/", router);
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
router.use(layouts);
router.use(express.static("public"))

router.get("/", (req, res) => {
	res.send("Welcome to Confetti Cuisine!");
}); 

router.get("/subscribers", subscribersController.index, subscribersController.indexView);
router.get("/subscribers/:id", subscribersController.show, subscribersController.showView);


router.use(
	express.urlencoded({
		extended: false
	})
);
router.use(express.json());


const usersController = require("./controllers/usersController");
router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post("/users/create", usersController.create, usersController.redirectView);

router.get("/contact", subscribersController.getSubscriptionPage);
router.post("/subscribe", subscribersController.saveSubscriber);
router.get("/users/:id", usersController.show, usersController.showView);
router.get("/users/:id/edit", usersController.edit);
router.put("/users/:id/update", usersController.update, usersController.redirectView);
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView);

router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
	console.log(
		`Server running at http://localhost:${app.get("port")}`
		);
});
