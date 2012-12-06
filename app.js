
/**
 * Module dependencies.
 */

var express = require('express')
	, routes = require('./routes')
	, user = require('./routes/user')
	, http = require('http')
	, path = require('path')
	, nano = require('nano')('https://'+process.env.dbUser+':'+process.env.dbPass+'@approxit.cloudant.com')
	, udrinkinCouch;


console.log(process.env);


nano.db.get('udrinkin', function(err, body){
		if(!err) {
			console.log('connected');
			udrinkinCouch = nano.db.use('udrinkin');
		} else {
			console.log('Could not find approxit DB, creating one...');
			nano.db.create('udrinkin', function(err, body) {
				// created approxit
				if(!err) {
					console.log('created');
					udrinkinCouch = nano.db.use('udrinkin');
				} else {
					console.log('could not create');
				}
			});
		}
	});

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());
	app.use(app.router);
	app.use(require('stylus').middleware(__dirname + '/public'));
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
