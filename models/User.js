const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    account: String,
    plan: String,
    userId: String,
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
});

mongoose.model('users', userSchema);