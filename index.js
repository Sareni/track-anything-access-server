const express = require('express');
const mongoose = require('mongoose');
const schedule = require('node-schedule');

const { mongodbConnectionString } = require('./config/keys');

require('./models/User');
const tracking = require('./tracking');

const app = express();


app.use(express.json());

// run at 4 AM, TODO: add randomness?
schedule.scheduleJob('0 4 * * *', () => {
  tracking.initGlobalAccessList(); // await is not needed
});

require('./routes')(app);

(async () => {
    try {
      await mongoose.connect(mongodbConnectionString, { useNewUrlParser: true })
      console.log('db access');
      await tracking.initGlobalAccessList();
      console.log('list loaded');
      const PORT = process.env.PORT || 5000; 
      app.listen(PORT);
      console.log('listening...');
    } catch (err) {
      console.log('error: ' + err)
    }
  })()



