
/*
 * GET users listing.
 */

 var Step = require('step');

var UsersModule = function(){
	// nano db select
	var nano = require('nano')('https://'+process.env.dbUser+':'+process.env.dbPass+'@approxit.cloudant.com'),
		udrinkinCouch;

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

	var _whosDrinkin = function(req, res) {
		console.log('whos drinkin?');
		res.json({ status: "success", data: { whosDrinkin: "errbody" }});
	};

	var _update = function(req, res) {
		res.send("respond with an update");
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
				console.log('user fetch by id is back: ');
				console.dir(arguments);

				if(!err) {
					// delete doc revs info first?
					userDoc = doc;
					this(null, doc); // advance to next?
				} else {
					udrinkinCouch.insert({}, id, this);
				}

			},
			function sendResults(err, doc){
				console.log('send touch results');
				console.dir(arguments);
				res.json({ status: "success", data: doc });
			}
		);
		
	};

	var _push = function(req, res) {
		res.send('response from push');
	};

	return {
		whosDrinkin: _whosDrinkin,
		touch: _touch,
		update: _update,
		push: _push
	};

};

module.exports = UsersModule;

