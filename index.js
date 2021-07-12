const express = require('express');
const mongoose = require('mongoose');
const schedule = require('node-schedule');

const { connectionString: mongodbConnectionString } = require('./config/track_anything_access_server_config').databases.mongodb;

require('./models/User');
const tracking = require('./tracking');

const app = express();


app.use(express.json());

// run at 4 AM, TODO: add randomness?
schedule.scheduleJob('0 4 * * *', () => {
  tracking.initGlobalAccessList(); // await is not needed
});

require('./routes')(app);

const connectWithRetry = async () => {
  try {
    return await mongoose.connect(mongodbConnectionString, { useNewUrlParser: true });
  } catch(err) {
      await new Promise((resolve) => setTimeout(resolve, 30000));
      return connectWithRetry();
  }
};

(async () => {
    try {
      await connectWithRetry();
      console.log('db access');
      await tracking.initGlobalAccessList();
      console.log('list loaded');
      const PORT = process.env.PORT || 5000; 
      app.listen(PORT);
      console.log('listening...');
    } catch (err) {
      console.log('error: ' + err)
    }
  })();



