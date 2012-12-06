
/**
 * Module dependencies.
 */

var express = require('express')
	, routes = require('./routes')
	, user = require('./routes/user')()
	, validate = require('./routes/validate')()
	, http = require('http')
	, path = require('path');

var app = express();

console.log('user lib:');
console.log(user);


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

/**
 * Param pre-requisites
 */
app.param(':id', function(req,res,next,id){
	// might consider getting the user or creating it here in the future
	console.log('=======url: ' + req.originalUrl);
	next();
});

/**
 * API Route definitions
 */
app.post('/api/*', validate.isAuthorized); // all API requests require authorization
app.post('/api/whosdrinkin', user.whosDrinkin);
app.post('/api/user/touch/:id', user.touch);
app.post('/api/user/update/:id', user.update);
app.post('/api/push', user.push);
app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
