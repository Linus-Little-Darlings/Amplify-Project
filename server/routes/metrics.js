const request = require('request')

module.exports = app => {
	app.get('/top-artists', function(req, res){
		
		console.log('q', req.cookies)
		var options = {
      url: 'https://api.spotify.com/v1/me/top/artists',
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

// app.get('/recommendations', function(req, res){  
    
//     console.log('q', req.cookies)
//     var options = {
//       url: 'https://api.spotify.com/v1/recommendations?limit=10&seed_genres=hip-hop&min_acousticness=0&max_acousticness=50&target_acousticness=20&min_danceability=20&max_danceability=100&target_danceability=70&min_popularity=50&max_popularity=100&target_popularity=80',
//       headers: { 'Authorization': 'Bearer ' + req.cookies.access_token },
//       json: true
//     };

//     // use the access token to access the Spotify Web API
//     request.get(options, function(error, response, body) {
//       console.log('err',error)
//       console.log('res',response.statusCode)
//       console.log('bod',body);
//       res.send(body)
//     });
//   })

// app.get('/featured-playlists', function(req, res){
    
//     console.log('q', req.cookies)
//     var options = {
//       url: 'https://api.spotify.com/v1/browse/featured-playlists?country=US&limit=10&offset=5',
//       headers: { 'Authorization': 'Bearer ' + req.cookies.access_token },
//       json: true
//     };

//     // use the access token to access the Spotify Web API
//     request.get(options, function(error, response, body) {
//       console.log('err',error)
//       console.log('res',response.statusCode)
//       console.log('bod',body);
//       res.send(body)
//     });
//   })
}