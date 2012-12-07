
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { title: 'U Drinkin? | iOS Social Drinking App' });
};