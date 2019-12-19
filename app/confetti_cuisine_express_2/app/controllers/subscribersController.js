"use strict";

const Subscriber = require("../models/subscriber");

module.exports = {
	getAllSubscribers: (req, res) => {
		Subscriber.find({})
			.exec()
			.then((subscribers) => {
				res.render("subscribers", {
					subscribers: subscribers
				});
			})
			.catch((error) => {
				console.log(error.message);
				return [];
			})
			.then(() => {
				console.log("promise complete");
			});
	},
	getSubscriptionPage: (req, res) => {
		res.render("contact");
	},
	saveSubscriber: (req, res) => {
		let newSubscriber = new Subscriber({
			name: req.body.name,
			email: req.body.email,
			zipCode: req.body.zipCode
		});

		newSubscriber.save()
			.then(() => {
				res.render("thanks");
			})
			.catch(error => {
				res.send(error);
			});
	},
	index: (req, res, next) => {
		Subscriber.find()
			.then(subscribers => {
				res.locals.subscribers = subscribers;
				next();
			})
			.catch(error => {
				console.log(`Error fetching subscribers: ${error.message}`);
				next(error);
			});
		},
	indexView: (req, res) => {
		res.render("subscribers/index");
	},
	show: (req, res, next) => {
		let subscriberId = req.params.id;
		Subscriber.findById(subscriberId)
			.then(subscriber => {
				res.locals.subscriber = subscriber;
				next();
			})
			.catch(error => {
				console.log(`Error fetching subscriber by ID: ${error.message}`);
				next(error);
			});
	},
	showView: (req, res) => {
		res.render("subscribers/show");
	}
}
