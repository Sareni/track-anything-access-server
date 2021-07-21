const mongoose = require('mongoose');
const axios = require('axios');

const { PLAN_PROPERTIES } = require('./constants/PLANS');
const { trackingServers } = require('./config/track_anything_access_server_config');

const User = mongoose.model('users');

let globalAccessList;

function reduceTrackingAmount(data) {
    const response = {};
    Object.entries(data).forEach((entry) => {
        const [key, value] = entry;
        if(globalAccessList[key]) {
            globalAccessList[key] -= value;
            if (globalAccessList[key] <= 0) {
                response[key] = false;
                console.log('res', response);
            }
        }
    });
    if (Object.keys(response).length !== 0 && response.constructor === Object) {
        updateGlobalListOnServers(response);
    }
}

function updateTrackingAmount(key, amount) {
    let prevAmount;
    let update = false;
    const response = {};

    if (globalAccessList[key]) {
        prevAmount = globalAccessList[key];
        globalAccessList[key] += amount;
    } else {
        globalAccessList[key] = amount;
        response[key] = amount > 0 ? true : false;

        update = true;
    }

    if (prevAmount && prevAmount > 0 && globalAccessList[key] <= 0) {
        response[key] = false;

        update = true;
    } else if (prevAmount && prevAmount <= 0 && globalAccessList[key] > 0) {
        response[key] = true;

        update = true;
    }

    if (update) {
        updateGlobalListOnServers(response);
    }
}

function removeUser(key) {
    if (globalAccessList[key]) {
        updateTrackingAmount(key, 0);
        delete globalAccessList[key];
    }
}

function updateGlobalListOnServers(update) {
    const updateGlobalAccessListURL = '/updateGlobalAccessList';
    trackingServers.forEach((ts) => {
        axios.post(`${ts.protocol}://${ts.host}:${ts.port}${updateGlobalAccessListURL}`, update)
        .catch(() => {
            console.log('error: ', ts);
        });
    });
}

async function initGlobalAccessList() {
    const users = await User.find()
        .select({ _id: 0, account: 1, plan: 1 })
        .lean()
        .exec();
    globalAccessList = {};
    if(users) {
        users.forEach((user) => {
            globalAccessList[user.account] = PLAN_PROPERTIES[user.plan].trackAmount;
        })
    }
}

function getGlobalAccessList() {
    // returns global access list as { key: true/false }-pair
    const response = {};
    Object.entries(globalAccessList).forEach((entry) => {
        const [key, value] = entry; // TODO shorten entry
        response[key] = value > 0 ? true : false;
    });
    return response;
}

module.exports = {
    getGlobalAccessList,
    reduceTrackingAmount,
    initGlobalAccessList,
    updateTrackingAmount,
    removeUser
}