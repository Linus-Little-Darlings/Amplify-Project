const request = require('request')



module.exports = app => {
  function getArtist(req){
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
      return body;
    });
}
  app.get('/top-artists', function(req, res){
    var body = getArtist(req);
    res.send(body);
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

    // use the access token to access the Spotify Web API
    request.get(options, function(error, response, body) {
      console.log('err',error)
      console.log('res',response.statusCode)
      console.log('bod',body);
      res.send(body)
    });
  })
app.get('/recomendations', function(req, res){
    var art = getArtist();
    art = art.data.items;
    for(var i = 0; i < 5; i++)
    {
      var artist = art.artist[0].id;
      console.log('q', req.cookies)
      var options = {
        url: 'https://api.spotify.com/v1/recommendations?limit=1&market=US&seed_artists=' + artist,
        headers: { 'Authorization': 'Bearer ' + req.cookies.access_token },
        json: true
      };
      console.log(options);
      request.get(options, function(error, response, body) {
        console.log('err',error)
        console.log('res',response.statusCode)
        console.log('bod',body);
        res.send(body)
      });
    }
    // use the access token to access the Spotify Web API
    
  })

}