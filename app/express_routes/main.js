"use strict";

const homeController = require("./controllers/homeController");

const port = 3000,
	express = require("express"),
	app = express();

app.use(homeController.logRequestPaths);

app.get("/items/:vegetable", homeController.sendReqParam);

app.use(
	express.urlencoded({
		extended: false
	})
);
app.use(express.json());

app.post("/sign_up", homeController.userSignUpProcessor);

app.post("/", (req, res) => {
	console.log(req.body);
	console.log(req.query);
	res.send("POST Successful!");
});

app.listen(port, () => {
	console.log(`Server running on port: ${port}`);
});