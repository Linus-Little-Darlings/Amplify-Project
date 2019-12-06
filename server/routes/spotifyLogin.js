require('dotenv').config()

const querystring = require('querystring')

var generateRandomString = function(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

module.exports = app => {
  const stateKey = 'spotify_auth_state';

  app.get('/spotifyLogin', function(req, res) {
    console.log('login called')
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization

    const scope = 'user-read-private user-read-email streaming user-library-read user-top-read user-read-currently-playing user-modify-playback-state user-read-recently-played';
    console.log(process.env.REDIRECT_URI)
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.REDIRECT_URI,
        state: state
      }));
  });
}