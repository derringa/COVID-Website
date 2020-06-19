
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
            script: ['/js/home.min.js'],
            title: 'COVID Home'
    };
        res.render('email-form', context);
    }) 
}
