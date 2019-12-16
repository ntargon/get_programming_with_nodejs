"use strict";

exports.sendReqParam = (req, res) => {
	let veg = req.params.vegetable;
	res.send(`This is the page for ${veg}`);
};

exports.logRequestPaths = (req, res, next) => {
	console.log(`request made to: ${req.url}`);
	next();
};

exports.userSignUpProcessor = (req, res) => {
	console.log(req.body);
	console.log("Sign Up");
};