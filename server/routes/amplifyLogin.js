require('dotenv').config()

var User = require('../models/user')

module.exports = app => {
	app.post('/registerUser', (req, res) => {
		console.log(req.body)
		var e = req.body.emailAddress,
	      p = req.body.passwordFirst;
	  var u = e.slice(0, e.indexOf('@'))
		if (p !== req.body.passwordConfirm) {
	    var err = new Error('Passwords do not match.');
	    err.status = 400;
	    res.send("passwords dont match");
	    return next(err);
	  }
	  
		if(e && p && u && req.body.passwordConfirm){
			var userData = {
				email: e,
				username: u,
				password: p
			}
			console.log('creating user', userData)
			User.create(userData, function(err, user){
				if(err){
					console.log('error adding user', err)
					return next(err)
				}else{
					//req.session.userId = user._id
					console.log(user)
					return res.redirect('/home')
				}
			})
		}
	})
}