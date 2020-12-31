const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const tracking = require('./tracking');
const { PLANS, PLAN_PROPERTIES } = require('./constants/PLANS');

const User = mongoose.model('users');


async function createAccount(data) {
    // expected format
    /* {
        plan: 'BASIC', 'STANDARD', 'PREMIUM'
    } */
    const account = createAccountKey();
    const plan = PLANS[data.plan];
    const user = await new User({ account, plan }).save();

    tracking.updateTrackingAmount(account, PLAN_PROPERTIES[plan].trackAmount);
    return user;
}

function createAccountKey() {
    return uuidv4();
}

function getAmountDifference(oldPlan, newPlan) {
    return PLAN_PROPERTIES[newPlan].trackAmount - PLAN_PROPERTIES[oldPlan].trackAmount;
}

async function updateAccount(data) {
    // expected format
    /* {
        account: 'xxx',
        plan: 'BASIC', 'STANDARD', 'PREMIUM'
    } */
    const { account } = data;
    const plan = PLANS[data.plan];
    const user = await User.findOne({ account });
    if (user) {
        const prevPlan = user.plan;
        user.plan = plan;
        user.updated = Date.now();

        const updatedUser = await user.save();
        tracking.updateTrackingAmount(account, getAmountDifference(prevPlan, plan));
        return updatedUser;
    }
}

async function deleteAccount(data) {
 // expected format
    /* {
        account: 'xxx'
    } */
    const { account } = data;
    const deleteUser = await User.deleteOne({ account });
    tracking.removeUser(account);
    return deleteUser;
}


module.exports = {
    createAccount,
    updateAccount,
    deleteAccount
}