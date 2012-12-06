
/*
 * GET users listing.
 */

var ValidateModule = function(){


	return {
		isAuthorized: function(req,res,next) {
			console.log(authorized);
			next();
		}
	};
};

module.exports = ValidateModule;