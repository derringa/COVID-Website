let CovidTracking = require('../serverFunctions/CovidTracking.js').CovidTracking;
covidTracking = new CovidTracking();
let db = require('../dao.js');

// const MailingList = require("../dao.js").MailingList;
// const db = new MailingList("./db/covid-listserv.db");

module.exports = function (app) {

    app.get('/getUs', (req, res) => {
        covidTracking.getUs(req.query.date, req.query.historic)
            .then(context => {
                res.send(context);
            })
    });

    app.get('/getAllStates', (req, res) => {
        covidTracking.getAllStates(req.query.historic)
            .then(context => {
                res.send(context);
            })
    });

    app.get('/getState', (req, res) => {
        covidTracking.getState(req.query.state, req.query.date, req.query.historic)
            .then(context => {
                res.send(context);
            })
    });

    app.get('/unsubscribe', (req, res) => {
        console.log(req.query.tok);

    });

    // app.post('/emailsubmit', function (req, res) {
    //     db.addRecipient(req.body)
    //     .then(user => {
    //         //db.addDataRequest(user);
    //         db.deleteRecipient('nnnn');
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
    // });

}
