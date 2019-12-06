const request = require('request')

module.exports = app => {
	app.get('/track-analysis', function(req, res){
		var options = {
			url: 'https://api.spotify.com/v1/audio-analysis/' + req.query.id,
			headers: { 'Authorization': 'Bearer ' + req.cookies.access_token},
			json: true
		}
		request.get(options, function(error, response, body){
			console.log('err',error)
      console.log('res',response.statusCode)
      console.log('bod',body);
      res.send(body)
		})
	})

	app.get('/track-features', function(req, res){
		var options = {
			url: 'https://api.spotify.com/v1/audio-features/' + req.query.id,
			headers: {'Authorization': 'Bearer ' + req.cookies.access_token},
			json: true
		}
		request.get(options, function(error, response, body){
			console.log('err',error)
			console.log('res',response.statusCode)
			console.log('bod',body)
			res.send(body)
		})
	})

	app.get('/currently-playing', function(req, res){
		var options = {
			url: 'https://api.spotify.com/v1/me/player/currently-playing',
			headers: { 'Authorization': 'Bearer ' + req.cookies.access_token},
			json: true
		}

		request.get(options, function(error, response, body){
			console.log('err',error)
			console.log('res',response.statusCode)
			console.log('currently playing',body)
			res.send(body)
		})
	})
}