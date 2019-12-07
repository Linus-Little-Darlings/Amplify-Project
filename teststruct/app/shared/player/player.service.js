angular.module('amplifyApp').service('playerService', function($http){
	this.token = '';
	this.device_id = '';
	this.ready = false;
	this.volume = .5;

	this.init = () => {
		window.onSpotifyWebPlaybackSDKReady = async () => {
	    this.token = (await $http.get('/getSpotifyAuthToken')).data;
	    console.log('auth token', this.token)
	    const player = new Spotify.Player({
	      name: 'Web Playback SDK Quick Start Player',
	      getOAuthToken: cb => { cb(this.token); }
	    });

	    // Error handling
	    player.addListener('initialization_error', ({ message }) => { console.error(message); });
	    player.addListener('authentication_error', ({ message }) => { console.error(message); });
	    player.addListener('account_error', ({ message }) => { console.error(message); });
	    player.addListener('playback_error', ({ message }) => { console.error(message); });

	    // Playback status updates
	    player.addListener('player_state_changed', state => { console.log('state change', state); });

	    // Ready
	    player.addListener('ready', ({ device_id }) => {
	    	this.device_id = device_id
	    	this.ready = true;
	      console.log('Ready with Device ID', device_id);
	      this.setActiveDevice(device_id)
	    });

	    // Not Ready
	    player.addListener('not_ready', ({ device_id }) => {
	    	this.device_id = device_id;
	    	this.ready = false;
	      console.log('Device ID has gone offline', device_id);
	    });

	    // Connect to the player!
	    player.connect();
	  };

	}

	this.playTrack = async (id) => {
    await this.setActiveDevice(this.device_id)

    if(!this.token){
			this.token = (await $http.get('/getSpotifyAuthToken')).data
		}
    var options = {
    	headers: { 'Authorization': 'Bearer ' + this.token},
    }
    $http.put('https://api.spotify.com/v1/me/player/play', {uris: ['spotify:track:'+id]}, {headers: { 'Authorization': 'Bearer ' + this.token}})
  }
  this.setActiveDevice = async (device_id) => {
  	if(!this.token){
			this.token = (await $http.get('/getSpotifyAuthToken')).data
		}
  	return $http.put('https://api.spotify.com/v1/me/player', {device_ids: [device_id]}, {headers: {'Authorization': 'Bearer ' + this.token}})
  }

	this.play = async () => {
		    await this.setActiveDevice(this.device_id)

		if(!this.token){
			this.token = (await $http.get('/getSpotifyAuthToken')).data
		}
		$http.put('https://api.spotify.com/v1/me/player/play', {}, {headers: { 'Authorization': 'Bearer ' + this.token}})
	}

	this.pause = async () => {
		    await this.setActiveDevice(this.device_id)

		if(!this.token){
			this.token = (await $http.get('/getSpotifyAuthToken')).data
		}
		$http.put('https://api.spotify.com/v1/me/player/pause', {}, {headers: { 'Authorization': 'Bearer ' + this.token}})
	}

	this.next = async () => {
		    await this.setActiveDevice(this.device_id)

		if(!this.token){
			this.token = (await $http.get('/getSpotifyAuthToken')).data
		}
		$http.post('https://api.spotify.com/v1/me/player/next', {}, {headers: { 'Authorization': 'Bearer ' + this.token}})
	}

	this.previous = async () => {
		    await this.setActiveDevice(this.device_id)

		if(!this.token){
			this.token = (await $http.get('/getSpotifyAuthToken')).data
		}
		$http.post('https://api.spotify.com/v1/me/player/previous', {}, {headers: { 'Authorization': 'Bearer ' + this.token}})
	}

	//incomplete. parameters/updating with change from volume slider not set yet
	this.volume = () => {
		$http.put('https://api.spotify.com/v1/me/player/volume?volume_percent=', {volume_percent: random}, {headers: { 'Authorization': 'Bearer ' + this.token}})
	}

  this.init()
})