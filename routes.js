const tracking = require('./tracking');
const account = require('./account');

module.exports = (app) => {
    app.get('/fullList', (req, res) => {
        res.send(tracking.getGlobalAccessList());
      });
      
    app.post('/trackingList', (req, res) => {
        tracking.reduceTrackingAmount(req.body);
        res.send();
    });

    app.get('/getAccount/:userId', async (req, res) => {
        res.send(await account.getAccount(req.params.userId));
    });

    app.get('/getAccounts', async (req, res) => {
        res.send(await account.getAccounts());
    });

    app.post('/createAccount', async (req, res) => {
        res.send(await account.createAccount(req.body));
    });

    app.post('/updateAccount', async (req, res) => {
        res.send(await account.updateAccount(req.body));
    });

    app.post('/deleteAccount', async (req, res) => {
        res.send(await account.deleteAccount(req.body));
    });
       
}