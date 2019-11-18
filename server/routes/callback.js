require('dotenv').config()

const request = require('request')
const querystring = require('querystring')

module.exports = app => {
  const stateKey = 'spotify_auth_state';

  app.get('/callback', function(req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter
    console.log('callback')
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      res.clearCookie(stateKey);
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: process.env.REDIRECT_URI,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
        },
        json: true
      };

      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          res.cookie('access_token', body.access_token)
          res.cookie('refresh_token', body.refresh_token)
          res.cookie('code', code)

          var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + body.access_token },
            json: true
          };

          // use the access token to access the Spotify Web API
          request.get(options, function(error, response, body) {
            console.log(body);
          });
          // we can also pass the token to the browser to make requests from there
          /*res.redirect('/#' +
            querystring.stringify({
              access_token: body.access_token,
              refresh_token: body.refresh_token
            }));*/
          res.redirect('/home')
        } else {
          res.redirect('/#' +
            querystring.stringify({
              error: 'invalid_token'
            }));
        }
      });
    }
  });
}
