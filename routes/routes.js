
module.exports = function (app) {
    app.get('/', function (req, res) {
        let context = {
            script: ['/js/home.min.js'],
            title: 'COVID Home'
	};
	
        res.render('home', context);
    });
    app.get('/data', function (req, res) {
        let context = {
            script: ['/js/data.min.js'],
            title: 'COVID Data'
	};
	
        res.render('data', context);
    });
}
