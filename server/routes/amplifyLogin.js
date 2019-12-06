require('dotenv').config()

var User = require('../models/user')

module.exports = app => {
	app.post('/registerUser', (req, res, next) => {
		console.log(req.body)
		var e = req.body.email,
	      p = req.body.password;
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
					req.session.userId = user._id
					console.log(user)
					return res.send(user._id)
				}
			})
		}
	})
	app.post('/loginUser', (req, res, next) => {
		console.log('logging in', req.body)
		if(!req.body.email || !req.body.password){
			var error = new Error('All fields required')
			error.status = 400;
			return next(error)
		}

		User.authenticate(req.body.email, req.body.password, (err, user) => {
			if(err || !user){
				var error = new Error('Incorrect Credentials')
				error.status = 401
				return next(error)
			}else{
				req.session.userId = user._id
				return res.send(user._id)
			}
		})
	})
	app.get('/logoutUser', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/home');
      }
    });
  }
});
}