const request = require('request')


module.exports = app => {
  var artist;
	app.get('/top-artists', function(req, res){
		
		console.log('q', req.cookies)
		var options = {
      url: 'https://api.spotify.com/v1/me/top/artists',
      headers: { 'Authorization': 'Bearer ' + req.cookies.access_token },
      json: true
    };
    console.log(app);

    // use the access token to access the Spotify Web API
    request.get(options, function(error, response, body) {
      console.log('err',error)
      console.log('res',response.statusCode)
      console.log('bod',body);
      artist = body.data.items.id;
      res.send(body)
    });
	})

	app.get('/top-tracks', function(req, res){
		
		console.log('q', req.cookies)
		var options = {
      url: 'https://api.spotify.com/v1/me/top/tracks',
      headers: { 'Authorization': 'Bearer ' + req.cookies.access_token },
      json: true
    };

    // use the access token to access the Spotify Web API
    request.get(options, function(error, response, body) {
      console.log('err',error)
      console.log('res',response.statusCode)
      console.log('bod',body);
      res.send(body)
    });
	})
<<<<<<< HEAD

app.get('/playback', function(req, res){  
    
    console.log('q', req.cookies)
    var options = {
      url: 'https://api.spotify.com/v1/me/player',
      headers: { 'Authorization': 'Bearer ' + req.cookies.access_token },
      json: true
    };

    // use the access token to access the Spotify Web API
    request.get(options, function(error, response, body) {
      console.log('err',error)
      console.log('res',response.statusCode)
      console.log('bod',body);
      res.send(body)
    });
  })

app.get('/featured-playlists', function(req, res){
    
    console.log('q', req.cookies)
    var options = {
      url: 'https://api.spotify.com/v1/browse/featured-playlists?country=US&limit=10&offset=5',
      headers: { 'Authorization': 'Bearer ' + req.cookies.access_token },
      json: true
    };

<<<<<<< HEAD
    // use the access token to access the Spotify Web API
    request.get(options, function(error, response, body) {
      console.log('err',error)
      console.log('res',response.statusCode)
      console.log('bod',body);
      res.send(body)
    });
  })
app.get('/recomendations', function(req, res){
    
    console.log('q', req.cookies)
    var options = {
      url: 'https://api.spotify.com/v1/recommendations?limit=1&market=US&seed_artists=' + artist,
      headers: { 'Authorization': 'Bearer ' + req.cookies.access_token },
      json: true
    };
    console.log(options);

    // use the access token to access the Spotify Web API
    request.get(options, function(error, response, body) {
      console.log('err',error)
      console.log('res',response.statusCode)
      console.log('bod',body);
      res.send(body)
    });
  })
=======
//     // use the access token to access the Spotify Web API
//     request.get(options, function(error, response, body) {
//       console.log('err',error)
//       console.log('res',response.statusCode)
//       console.log('bod',body);
//       res.send(body)
//     });
//   })
=======
>>>>>>> c67e20adf232aa3170c5aceda192d9c926313998
>>>>>>> master
}