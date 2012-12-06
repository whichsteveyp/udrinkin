
/*
 * GET users listing.
 */

var UsersModule = function(){
	// nano db select
	var nano = require('nano')('https://'+process.env.dbUser+':'+process.env.dbPass+'@approxit.cloudant.com');

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

	var _getAll = function(req, res){
		res.send("respond with a resource");
	};

	var _update = function(req, res){
		res.send("respond with a resource");
	};

	var _create = function(req, res){
		res.send("respond with a resource");
	};

	return {
		getAll: _getAll,
		create: _create,
		update: _update
	};

};

module.exports = UsersModule;

