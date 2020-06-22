let CovidTracking = require('../serverFunctions/CovidTracking.js').CovidTracking;
covidTracking = new CovidTracking();
let db = require('../dao.js');

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
}
