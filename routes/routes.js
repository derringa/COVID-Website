const MailingList = require("../dao.js").MailingList;
const db = new MailingList("./db/covid-listserv.db");
const jwt = require('../serverFunctions/jwt.js');

module.exports = function (app) {
    app.get('/', function (req, res) {
        let context = {
            script: ['/js/home.min.js'],
            title: 'COVID Home'
	};
        res.render('home', context);
    });

    app.get('/email-form', function (req, res) {
        let context = {
            script: ['/js/home.min.js', '/js/emailform.min.js'],
            title: 'COVID Home'
    };
        res.render('email-form', context);
    }); 

    app.get('/data', function (req, res) {
        let context = {
            script: ['/js/data.min.js'],
            title: 'COVID Data'
	};
        res.render('data', context);
    });

    app.get('/more', function (req, res) {
        let context = {
            script: ['/js/home.min.js'],
            title: 'COVID Home'
    };
        res.render('page4', context);
    }); 

    app.post('/emailsubmit', function (req, res) {
        db.addRecipient(req.body)
        .then( user => {
            console.log('here1');
            return db.addDataRequest(user) })
        .then( () => {
            console.log('here2');
            //res.redirect('/email-form');
            res.send( {success: true} );
        })
        .catch(err => {
            //res.redirect('/email-form' + '?error=1');
            //console.log(err);
            res.send( {error: true} );
        });
    });

    app.get('/unsubscribe', (req, res) => {
        let dec;

        jwt.jwtDecode(req.query.tok)
        .then(decoded => {
            dec = decoded;
            return db.deleteRecipient(decoded.to);
        })
        .then(() => {
            res.send(`${dec.to} has been unsubscribed.`)
        })
        .catch(err => {
            console.log(err);
            res.send(err);
        })


    });
}
