"use strict";
const Subscriber = require("./subscriber");
const mongoose = require("mongoose"),
	{Schema} = mongoose,
	bcrypt = require("bcrypt"),
	passportLocalMongoose = require("passport-local-mongoose"),
	randToken = require('rand-token'),
	userSchema = new Schema({
		name: {
			first: {
				type: String,
				trim: true
			},
			last: {
				type: String,
				trim: true
			}
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
			unique: true
		},
		zipCode: {
			type: Number,
			min: [1000, "Zip code too short"],
			max: 99999
		},
		courses: [{type: Schema.Types.ObjectId, ref: "Course"}],
		subscribedAccount: {type: Schema.Types.ObjectId, ref: "Subscriber"},
		apiToken: {
			type: String
		},
	}, {
		timestamps: true
	});

userSchema.virtual("fullName")
	.get(function() {
		return `${this.name.first} ${this.name.last}`;
	});


userSchema.plugin(passportLocalMongoose, {
	usernameField: "email"
});

userSchema.pre('save', function(next) {
	let user = this;

	if(!user.apiToken) user.apiToken = randToken.generate(16);

	if(user.subscribedAccount === undefined ){
		Subscriber.findOne({
			email: user.email
		})
			.then(subscriber => {
				user.subscribedAccount = subscriber;
				next();
			})
			.catch(error => {
				console.log(`Error in connecting subscriber:${error.message}`);
				next(error);
			})
	}else{
		next();
	}
});

module.exports = mongoose.model("User", userSchema);