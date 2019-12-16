"use strict";

const express = require("express"),
	app = express();

const homeController = require("./controllers/homeController");
const layouts = require("express-ejs-layouts");

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use(layouts);

app.get("/name/:myName", homeController.respondWithName);

app.listen(app.get("port"), () => {
	console.log(`Server running at http://localhost:${app.get("port")}`);
});