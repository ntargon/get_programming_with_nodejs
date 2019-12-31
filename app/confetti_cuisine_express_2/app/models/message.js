'use strict';

const mongoose = require('mongoose'),
    User = require('./user'),
    {Schema} = require('mongoose');

const messageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true});


messageSchema.pre('save', function(next){
    User.findById(this.user)
        .then((user) => {
            if(user) next();
            else next(new Error(`Error in saving message. User id ${this.user} does not exist.`));
        })
        .catch(error => {
            console.log(`Error in finding user by id:${error.message}`);
            next(error);
        })
});

module.exports = mongoose.model('Message', messageSchema);