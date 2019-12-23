"use strict";
const Subscriber = require("./subscriber");
const mongoose = require("mongoose"),
	{Schema} = mongoose,
	bcrypt = require("bcrypt"),
	passportLocalMongoose = require("passport-local-mongoose"),

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
		subscribedAccount: {type: Schema.Types.ObjectId, ref: "Subscriber"}
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

// userSchema.methods.passwordComparison = function(inputPassword){
// 	let user = this;
// 	return bcrypt.compare(inputPassword, user.password);
// };

module.exports = mongoose.model("User", userSchema);