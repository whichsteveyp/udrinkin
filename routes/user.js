
/*
 * GET users listing.
 */

 var Step = require('step'),
 	apns = require('apn');

var UsersModule = function(){
	// nano db select
	var nano = require('nano')('https://'+process.env.dbUser+':'+process.env.dbPass+'@approxit.cloudant.com'),
		udrinkinCouch;

	nano.db.get('udrinkin', function(err, body){
		if(!err) {
			udrinkinCouch = nano.db.use('udrinkin');
		} else {
			nano.db.create('udrinkin', function(err, body) {
				// created udrinkin
				if(!err) {
					udrinkinCouch = nano.db.use('udrinkin');
				}
			});
		}
	});

	var _whosDrinkin = function(req, res) {
		var rc = JSON.parse(req.body.data),
			drinkinFriends = [],
			notDrinkinFriends = [],
			friendsNotHavingAnyFunAtAll = [],
			i, j;

		// error check this undefined flop
		udrinkinCouch.fetch({ "keys" : rc.drinkers }, function(err, body){
			if(!err) {
				var rows = body.rows || [];
				res.json({ status: "success", data: rows });
			} else {
				res.end('there was a couch error: ' + err);
			}

		});
	};

	var _update = function(req, res) {

		var id = req.params.id,
			rc = req.body,
			updateDoc;

		rc.data._id = id;

		Step(
			function updateUserDoc(){
				udrinkinCouch.insert(rc.data, id);
			},
			function sendResults(err, doc){
				var result = {
					status: 'error',
					message: 'unknown'
				};

				if(!err) {
					result.data = doc;
					result.status = 'success';
					delete result.message;
				} else {
					result.message = err;
				}

				res.json({ status: "success", data: doc });
			}
		);
	};

	var _touch = function(req, res) {
		var id = req.params.id,
			rc = req.body,
			userDoc;

		Step(
			function getUserByID(){
				udrinkinCouch.get(id, {revs_info: true}, this);
			},
			function storeUser(err, doc){
				if(!err) {
					userDoc = doc;
					this(null, doc);
				} else {
					udrinkinCouch.insert({}, id, this);
				}

			},
			function sendResults(err, doc){
				var result = {
					status: "error",
					message: 'unknown'
				};

				if(!err) {
					result.status = "success";
					result.data = doc;
					delete result.message;
				} else {
					result.message = err;
				}

				res.json({ status: "success", data: doc });
			}
		);
	};

	var _push = function(req, res) {
		var rc = req.body;

		var options = {
			cert: 'cert.pem',
			key: 'key.pem',
			passphrase: null,
			gateway: 'gateway.sandbox.push.apple.com',
			port: 2195,
			enhanced: true,
			errorCallback: function(){
				console.dir(arguments);
			},
			cacheLength: 10
		};

		var apnsConnection = new apns.Connection(options);

		udrinkinCouch.fetch({ "keys" : rc.keys }, function(err, body){
			// loop through all keys, if they have push note, send push note
			console.log('pushes:');
			console.log(body.rows);

			var rows = body.rows || [];

			for(i=0, j = rows.length; i < j; i++) {
				var newDoc = rows[i],
					myDevice;

				if (newDoc.pushToken) {
					myDevice = new apns.Device(token);
				}
			}

		});
	};

	return {
		whosdrinkin: _whosDrinkin,
		touch: _touch,
		update: _update,
		push: _push
	};

};

module.exports = UsersModule;

