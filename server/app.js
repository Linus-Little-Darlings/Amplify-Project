const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const cors = require('cors');
const path = require('path')
const https = require('https')
const fs = require('fs')
require('dotenv').config()

const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const spotifyLoginRouter = require('./routes/spotifyLogin')
const callbackRouter = require('./routes/callback')
const refreshRouter = require('./routes/refresh')
const metricsRouter = require('./routes/metrics')
const amplifyLoginRouter = require('./routes/amplifyLogin')
const trackAnalysisRouter = require('./routes/trackAnalysis')
var stateKey = 'spotify_auth_state';

var app = express();
mongoose.connect('mongodb://localhost:27017/amplifyDB', {useNewUrlParser:true})

var key, cert;
if(process.env.HTTPS){
  key = fs.readFileSync(path.resolve(__dirname, '../cert/key.pem'));
  cert = fs.readFileSync(path.resolve(__dirname, '../cert/cert.pem'));
}


var db = mongoose.connection;
db.once('open',function(){
  console.log('connected to db')
})

if(process.env.HTTPS || true){
  app.use(express.static('./teststruct'))
}else{
  app.use(express.static('./src'))
  app.get('/home', function(req, res) {
    console.log(req.session.userId)
    res.sendFile('views/home.html', {root: 'src'})
  })

  app.get('/metrics', function(req, res){
    res.sendFile('views/metrics.html', {root: 'src'})
  })

  app.get('/apitest', function(req, res){
    res.sendFile('views/apitest.html', {root: 'src'})
  })

  app.get('/testdata', function(req, res){
    res.send({msg: 'from the server'})
  })
  app.get('/amplifyLogin', function(req, res){
    res.sendFile('views/login.html', {root: 'src'})
  })
  app.get('/register', function(req, res){
    res.sendFile('views/register.html', {root: 'src'})
  })
}

app.use(cors())
  .use(cookieParser())
  .use(session({
    secret:'p38u3m4ucp98ut3m9u0c9348umc0',
    resave: true,
    saveUninitialized: false
  }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/home', function(req, res) {
  console.log(req.session.userId)
  res.sendFile('views/home.html', {root: 'src'})
})
app.get('/metrics', function(req, res){
  res.sendFile('views/metrics.html', {root: 'src'})
})

app.get('/threetest', function(req, res){
  res.sendFile('views/threetest.html', {root: 'src'})
})

app.get('/apitest', function(req, res){
  res.sendFile('views/apitest.html', {root: 'src'})
})
app.get('/testdata', function(req, res){
  res.send({msg: 'from the server'})
})
app.get('/amplifyLogin', function(req, res){
  res.sendFile('views/login.html', {root: 'src'})
})
app.get('/register', function(req, res){
  res.sendFile('views/register.html', {root: 'src'})
})

app.get('/getSpotifyAuthToken', function(req, res){
  res.send(req.cookies.access_token)
})


spotifyLoginRouter(app)
amplifyLoginRouter(app)
callbackRouter(app)
refreshRouter(app)
metricsRouter(app)
trackAnalysisRouter(app)
console.log('Listening on 3000');
console.log(process.env.REDIRECT_URI)
if(process.env.HTTPS){
  https.createServer({
    key: key,
    cert: cert,
  }, app).listen(3000);
}else{
  app.listen(3000)
}
