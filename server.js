//require('dotenv').config();

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
const url = require('url');

var session = require('express-session');
//var mysql = require('./dbcon.js');

let hbs = require('express-handlebars').create({
    defaultLayout: 'main',
    extname: 'hbs',
    layoutDir: `${__dirname}/views/layouts`,
    partialsDir: `${__dirname}/views/partials`,
    //    helpers: require('./views/helpers.js').helpers
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


/* Fire off email interval process */
let EmailController = require('./serverFunctions/Email').EmailController;
let emailController = new EmailController();
// comment out for production - will cause email cascade events to start
//emailController.startEmailIntervals();

require('./routes/routes.js')(app);
require('./routes/ajaxRoutes.js')(app);
app.use(express.static('dist'));

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', (__dirname) + '/views')
app.set('port', 6798);

let imgFile;
app.get(`/img/${imgFile}`, function (req, res) {
    res.send(`/img/${imgFile}`);
    res.end();
});

let jsFile;
app.get(`/js/${jsFile}`, function (req, res) {
    res.send(`/js/${jsFile}`);
    res.end();
});

app.post('/emailsubmit', function (req, res) {
    db.addRecipient(req.body)
    .then(user => {
        db.addDataRequest(user);
    })
    .catch(err => {
        console.log(err);
    });
});

app.use(function (req, res) {
    var context = {};
    console.log('404 route');

    context.loggedIn = false;

    context.script = ['utility.js'];
    context.style = ['styles.css', '404.css', 'font_size.css'];
    context.title = "Page not found...";

    res.status(404);
    res.render('404', context)
});

app.use(function (err, req, res, next) {
    var context = {};
    console.error(err.stack);
    console.log('500 route');

    context.loggedIn = false;

    context.script = ['utility.js'];
    context.style = ['styles.css', '404.css', 'font_size.css'];
    context.title = "Server error";

    res.status(500);


    res.render('404', context);
});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
