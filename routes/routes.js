
module.exports = function (app) {
    app.get('/', function (req, res) {
        let context = {
            script: ['/js/home.min.js'],
            title: 'COVID Home'
	};
	
        res.render('home', context);
    });
}
