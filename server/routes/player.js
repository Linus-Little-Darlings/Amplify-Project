const request = require('request')

module.exports = app => {
  app.put('/play-track', function(req, res){
		console.log(req.body)
    var options = {
      url: 'https://api.spotify.com/v1/me/player/play',
      headers: { 'Authorization': 'Bearer ' + req.cookies.access_token },
      data: {
        uris: [req.body.id]
      }
    };

    // use the access token to access the Spotify Web API
    request.put(options, function(error, response, body) {
      console.log('err',error)
      console.log('res',response.statusCode)
      console.log('bod',body);
      res.send(body)
    });
	})
}