"use strict";

const mongoose = require("mongoose"),
	Subscriber = require("./models/subscriber"),
	Course = require("./models/course"),
	User = require("./models/user");

var testCourse,
	testSubscriber,
	testUser,
	targetSubscriber;

mongoose.connect(
	"mongodb://db:27017/recipe_db",
	{useNewUrlParser: true}
);

mongoose.Promise = global.Promise;

Subscriber.remove({})
	.then((items) => console.log(`Removed ${items.n} records!`))
	.then(() => {
		return Course.remove({});
	})
	.then((items) => console.log(`Removed ${items.n} records!`))
	.then(() => {
		return Subscriber.create({
			name: "Jon",
			email: "jon@jonwexler.com",
			zipCode: "12345"
		});
	})
	.then(subscriber => {
		console.log(`Created Subscriber: ${subscriber.getInfo()}`);
	})
	.then(() => {
		return Subscriber.findOne({
			name: "Jon"
		});
	})
	.then(subscriber => {
		testSubscriber = subscriber;
		console.log(`Found one subscriber: ${subscriber.getInfo()}`);
	})
	.then(() => {
		return Course.create({
			title: "Tomato Land",
			description: "Locally farmed tomatoes only",
			zipCode: 12345,
			items: ["cherry", "heirloom"]
		});
	})
	.then(course => {
		testCourse = course;
		console.log(`Created course: ${course.title}`);
	})
	.then(() => {
		testSubscriber.courses.push(testCourse);
		testSubscriber.save();
	})
	.then(() => {
		return Subscriber.populate(testSubscriber, "courses");
	})
	.then(subscriber => console.log(subscriber))
	.then(() => {
		return Subscriber.find({courses: mongoose.Types.ObjectId(testCourse._id)});
	})
	.then(subscriber => console.log(subscriber))
	.then(() => {
		return User.remove({});
	})
	.then((items) => console.log(`Removed ${items.n} records!`))
	.then(() => {
		return User.create({
			name: {
				first: "Jon",
				last: "Wexler"
			},
			email: "jon@jonwexler.com",
			password: "pass123"
		});
	})
	.then((user) => {
		testUser = user;
	})
	.then(() => console.log(testUser))
	.then(() => {
		return Subscriber.findOne({
			email: testUser.email
		});
	})
	.then(subscriber => {
		testUser.subscribedAccount = subscriber;
		return testUser.save();
	})
	.then(user => console.log("user updated"))
	.then(() => console.log(testUser));
