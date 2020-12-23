const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    account: String,
    plan: String,
    created: Date
});

mongoose.model('users', userSchema);