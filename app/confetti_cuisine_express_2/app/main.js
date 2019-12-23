"use strict";

const mongoose = require("mongoose");
mongoose.connect(
	"mongodb://db:27017/recipe_db",
	{useNewUrlParser: true}
);
mongoose.Promise = global.Promise;

const subscribersController = require("./controllers/subscribersController");
const usersController = require("./controllers/usersController");
const coursesController = require("./controllers/coursesController");

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

const expressSession = require("express-session"),
	cookieParser = require("cookie-parser"),
	connectFlash = require("connect-flash");

const expressValidator = require("express-validator");



app.use("/", router);
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
router.use(layouts);
router.use(express.static("public"))
router.use(cookieParser("secret_passcode"));
router.use(expressSession({
	secret: "secret_passcode",
	cookie: {
		maxAge: 4000000
	},
	resave: false,
	saveUninitialized: false
}));
router.use(connectFlash());


router.use(
	express.urlencoded({
		extended: false
	})
);
router.use(express.json());
router.use(expressValidator());

const passport = require("passport");
router.use(passport.initialize());
router.use(passport.session());

const User = require("./models/user");
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


router.use((req, res, next) => {
	res.locals.flashMessages = req.flash();
	res.locals.loggedIn = req.isAuthenticated();
	console.log(res.locals.loggedIn);
	res.locals.currentUser = req.user;
	next();
});

router.get("/", (req, res) => {
	// res.send("Welcome to Confetti Cuisine!");
	res.render("index");
}); 

router.use(errorController.internalServerError);


router.get("/subscribers", subscribersController.index, subscribersController.indexView);
router.get("/subscribers/new", subscribersController.new);
router.post("/subscribers/create", subscribersController.create, subscribersController.redirectView);
router.get("/subscribers/:id", subscribersController.show, subscribersController.showView);
router.get("/subscribers/:id/edit", subscribersController.edit);
router.put("/subscribers/:id/update", subscribersController.update, subscribersController.redirectView);
router.delete("/subscribers/:id/delete", subscribersController.delete, subscribersController.redirectView);

router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post("/users/create", usersController.validate, usersController.create, usersController.redirectView);
router.get("/users/login", usersController.login);
router.get("/users/logout", usersController.logout, usersController.redirectView);
// router.post("/users/login", usersController.authenticate, usersController.redirectView);
router.post("/users/login", usersController.authenticate);
router.get("/users/:id", usersController.show, usersController.showView);
router.get("/users/:id/edit", usersController.edit);
router.put("/users/:id/update", usersController.update, usersController.redirectView);
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView);

router.get("/courses", coursesController.index, coursesController.indexView);
router.get("/courses/new", coursesController.new);
router.post("/courses/create", coursesController.create, coursesController.redirectView);
router.get("/courses/:id", coursesController.show, coursesController.showView);
router.get("/courses/:id/edit", coursesController.edit);
router.put("/courses/:id/update", coursesController.update, coursesController.redirectView);
router.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView);

router.use(errorController.pageNotFoundError);



router.get("/contact", subscribersController.getSubscriptionPage);
router.post("/subscribe", subscribersController.saveSubscriber);


app.listen(app.get("port"), () => {
	console.log(
		`Server running at http://localhost:${app.get("port")}`
		);
});
