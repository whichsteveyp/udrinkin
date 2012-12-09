
/*
 * GET users listing.
 */

var ValidateModule = function(){

	var crypto = require('crypto'),
		nano = require('nano')('https://'+process.env.dbUser+':'+process.env.dbPass+'@approxit.cloudant.com'),
		udrinkinCouch;

	nano.db.get('udrinkin', function(err, body){
		if(!err) {
			udrinkinCouch = nano.db.use('udrinkin');
		} else {
			nano.db.create('udrinkin', function(err, body) {
				// created approxit
				if(!err) {
					udrinkinCouch = nano.db.use('udrinkin');
				} else {
					console.log('could not create');
				}
			});
		}
	});

	var _validateAuthorization = function(data, auth, key){
		var sha256 = crypto.createHash('sha256');

		if(typeof data == 'object') {
			sha256.update(JSON.stringify(data) + auth);
		} else {
			sha256.update(data + auth);
		}

		var authConfirm = sha256.digest('hex');

		return (authConfirm === key);
	};

	var _isAuthorized = function(req,res,next) {

		var rc = req.body;

		if(rc.key && rc.auth && rc.data) {
			udrinkinCouch.get(rc.key, { revs_info: true}, function(err, doc){
				if(!err) {
					if( _validateAuthorization(rc.data, doc.api_key, rc.auth) ) {
						next();
					} else {
						res.end('Unable to validate request [Bad Authorization]');
					}
				} else {
					res.end('Unable to fetch public key credentials');
				}
			});
		} else {
			res.end('Invalid API request data format, missing required fields');
		}

	};

	return {
		isAuthorized: _isAuthorized
	};
};

module.exports = ValidateModule;