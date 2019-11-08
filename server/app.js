
const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const cors = require('cors');
require('dotenv').config()

const querystring = require('querystring');
const cookieParser = require('cookie-parser');
<<<<<<< HEAD

const loginRouter = require('./routes/login')
const callbackRouter = require('./routes/callback')
const refreshRouter = require('./routes/refresh')
const metricsRouter = require('./routes/metrics')

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static('./src'))
   .use(cors())
   .use(cookieParser());

app.get('/home', function(req, res) {
  res.sendFile('views/home.html', {root: 'src'})
})
=======
const session = require('express-session')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const spotifyLoginRouter = require('./routes/spotifyLogin')
const callbackRouter = require('./routes/callback')
const refreshRouter = require('./routes/refresh')
const metricsRouter = require('./routes/metrics')
const amplifyLoginRouter = require('./routes/amplifyLogin')
var stateKey = 'spotify_auth_state';

var app = express();
mongoose.connect('mongodb://localhost:27017/amplifyDB', {useNewUrlParser:true})

var db = mongoose.connection;
db.once('open',function(){
	console.log('connected to db')
})
app.use(express.static('./src'))
  .use(cors())
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
>>>>>>> c67e20adf232aa3170c5aceda192d9c926313998

app.get('/apitest', function(req, res){
  res.sendFile('views/apitest.html', {root: 'src'})
})
<<<<<<< HEAD

app.get('/testdata', function(req, res){
  res.send({msg: 'from the server'})
})


loginRouter(app)
=======
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
>>>>>>> c67e20adf232aa3170c5aceda192d9c926313998
callbackRouter(app)
refreshRouter(app)
metricsRouter(app)
console.log('Listening on 3000');
console.log(process.env.REDIRECT_URI)
app.listen(3000);
