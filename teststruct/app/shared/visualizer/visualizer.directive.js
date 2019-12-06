angular.module('amplifyApp').directive('visualizer', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var scene, camera, renderer;
			console.log(element[0])
			scope.width = element[0].offsetWidth;
			scope.height = element[0].offsetHeight;
			scope.init = function(){
				// API Requests
	      window.onSpotifyWebPlaybackSDKReady = async () => {
	        const token = await axios.get('/getSpotifyAuthToken');
	        //console.log(token)
	        const player = new Spotify.Player({
	          name: 'Web Playback SDK Quick Start Player',
	          getOAuthToken: cb => { cb(token.data); }
	        });

	        // Error handling
	        player.addListener('initialization_error', ({ message }) => { console.error(message); });
	        player.addListener('authentication_error', ({ message }) => { console.error(message); });
	        player.addListener('account_error', ({ message }) => { console.error(message); });
	        player.addListener('playback_error', ({ message }) => { console.error(message); });

	        // Playback status updates
	        player.addListener('player_state_changed', state => { console.log(state); });

	        // Ready
	        player.addListener('ready', ({ device_id }) => {
	          console.log('Ready with Device ID', device_id);
	        });

	        // Not Ready
	        player.addListener('not_ready', ({ device_id }) => {
	          console.log('Device ID has gone offline', device_id);
	        });

	        // Connect to the player!
	        player.connect();
	        checkPlaying();
	      };

	      async function checkPlaying(){
	        console.log('check')
	        var track = await axios.get('/currently-playing')
	        //console.log('track', track)
	        getAnalysis(track.data.item.id)

	      }

	      async function getAnalysis(id){


	          var analysis = await axios.get('/track-analysis', {params: {id: id}})
	          console.log('analysis', analysis)


	          var sections = analysis.data.sections;


	          var renderer, scene, camera, controls, stats, nucleus;

	          var WIDTH = window.innerWidth,
	            HEIGHT = window.innerHeight,
	            FOV = 60,
	            NEAR = 1,
	            FAR = 1000;

	          var electrons = [], numElectrons = 50; // more electrons = slower updating

	          // function populateScene() {
	          //
	          //   //geo.verticesNeedUpdate = true;
	          // }


	          function updateElectrons(){
	            var obj = null;
	            for(var i = 0; i < numElectrons; ++i){
	                obj = electrons[i]
	                obj.position.applyAxisAngle(obj.angle, obj.orbitSpeed);
	            }
	          }


	          function init() {
	            document.body.style.backgroundColor = "white";

	            renderer = new THREE.WebGLRenderer({
	              antialias: true,
	              alpha: true
	            });
	            renderer.shadowMap.enabled = true;
	            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	            document.body.appendChild(renderer.domElement);
	            document.body.style.overflow = "hidden";
	            document.body.style.margin = "0";
	            document.body.style.padding = "0";

	            scene = new THREE.Scene();

	            camera = new THREE.PerspectiveCamera(FOV, WIDTH / HEIGHT, NEAR, FAR);
	            camera.position.z = 100;
	            scene.add(camera);

	            controls = new THREE.TrackballControls(camera, renderer.domElement);
	            controls.dynamicDampingFactor = 0.5;
	            controls.rotateSpeed = 3;

	            var light = new THREE.PointLight(0xffffff, 1, Infinity);
	            camera.add(light);

	            stats = new Stats();
	            stats.domElement.style.position = 'absolute';
	            stats.domElement.style.top = '0';
	            document.body.appendChild(stats.domElement);


	            ///////////////////////////////////////////////////////////////////////////////////////////////
	            // Populate the scene
	            var geo = new THREE.SphereBufferGeometry(1, 16, 16);
	            var mat = new THREE.MeshPhongMaterial({color:"blue"});


	            var electron = null, plane = new THREE.Plane(), point = new THREE.Vector3();

	            geo = new THREE.SphereBufferGeometry(0.75, 16, 16);
	            mat = new THREE.MeshPhongMaterial({color:"white"});


	            for(var i = 0; i < numElectrons; ++i){
	              electron = new THREE.Mesh(geo, mat);
	              electrons.push(electron);

	              electron.angle = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
	              electron.orbitSpeed = 0.025;

	              // Reverses direction randomly (half)
	              //if(Math.random() > 0.5) electron.orbitSpeed *= -1;

	              plane.normal.copy(electron.angle);

	              point.set(Math.random(), Math.random(), Math.random());

	              plane.projectPoint(point, electron.position);

	              electron.position.setLength(30);
	              electron.position.applyAxisAngle(electron.angle, 6.28);

	              // var temp = new THREE.Vector3();
	              // temp.set( 10, 10, 10 );
	              // electron.scale = temp;


	              scene.add(electron);
	            }


	            /////////////////////////////////////////////////////////////////////////////////////////
	            // This is where dynamic animation is coming into play

	            // orbit values are looking best in the range between 0.01 and 0.2
	            // Tempo normalization assuming ranges of [60, 220] for targeted bpm and [0.01, 0.2] for orbit speed:
	            // Orbit Speed = 0.1 + (tempo - 60) * ((0.2 - 0.01)/(220 - 60))

	            //Distance normaliztion assuming ranges of [-28, -6] for db loudness and [10, 48] for particle distance from center:
	            // Distance = 10 + ((-loudness) - 6)*((48-10)/(28-6))

	            // Creating KeyframeTracks
	            // Starting with orbit speed.
	            var times = [];
	            var orbit_values = [];
	            var distance_values = [];
	            var color_values = [];

	            var orbit_norm;

	            var distance_mag;
	            var vector_prox;

	            var i;
	            for (i=0; i < sections.length; i++) {
	              times[i] = sections[i].start;

	              distance_mag = 10 + ((-sections[i].loudness - 6)*1.7272);
	              // console.log('distance', distance_mag);
	              vector_prox = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
	              // console.log('vector_prox', vector_prox);
	              vector_prox.setLength(distance_mag);
	              distance_values[i] = vector_prox;
	              // console.log('distance val', distance_values[i]);
	              // console.log('length', distance_values[i].length());

	              orbit_norm = 0.1 + (sections[i].tempo - 60)*0.0011875;
	              orbit_values[i] = orbit_norm;
	            }

	            for (i=0; i < (sections.length*3); i+=3){
	              //console.log(orbit_values[i]);
	              // Right now, I'm just creating a random set of values for color. As far as I can tell, they need to be in the [0,1] range of rgb - ie, if we're thinking in typical terms of
	              // color, 1 would be 255 and 0 would be 0. The color of each segement will be the additions of three values into the array - the constructor will divide the color ray by
	              // the number of time segments I pass it, and each section of that division should have one value between 0 and 1
	              // Example: if we had three time segements and we wanted the color to go from red, to green, to blue, our color array would look like this:
	              //      [1, 0, 0, 0, 1, 0, 0, 0, 1]
	              //      |  red  | greeen |  blue  |
	              // So for each particle, you'll add three values to the array.
	              color_values[i] = Math.random();    //Red
	              color_values[i+1] = Math.random();    //Green
	              color_values[i+2] = Math.random();    //Blue
	            }




	            /////////////////////////////////////////////////////////////////////////////////////////


	            // console.log('times', times);
	            // console.log('values', values);

	            // I believe the times of all tracks would need to be the same - maybe not, but shouldn't be an issue regardless
	            var orbitSpeedKF = new THREE.NumberKeyframeTrack('.orbitSpeed', times, orbit_values);

	            //var distanceKF = new THREE.VectorKeyframeTrack('.position', times, distance_values);

	            // Below is a KeyframeTrack - it matches time segments with animation values, basically representing one component of an animation like changing color or changing speed.
	            // In the values array (named color_values below) you'll define what you want the animation's value to look like during that time interval.
	            // There are different kinds of Keyframe tracks. To change color, you'll use a THREE.ColorKeyframeTrack. The name will be '.material.color', because that is the component
	            // of the object you want to change. Then you will pass in an array of the times (already grabbed from the track_analysis above) and your array of color values.
	            var colorKF = new THREE.ColorKeyframeTrack('.material.color', times, color_values);



	            // Animation Clip creation
	            // The AnimationClip takes multiple KeyframeTracks and basically adds them to one object to create and a complex animation.
	            // Passing negative value forces AnimationClip to calcuate its duration based on the KeyframeTracks passed.
	            // Any KeyframeTrack you want included in the animation should be listed in the KeyframeTrack array in the third argument.
	            var clip = new THREE.AnimationClip('Action', -1, [orbitSpeedKF, colorKF]);




	            // Animation Mixer creation

	            // Currently just animating one electron - due to the way animation works, I can't just use a for loop and apply it to a bunch of objects. Currently working on a fix for that.
	            var anim_electron = electrons[0];
	            // The Mixer is basically a player for an animation on a specific object - in this case, we're animating the single electron I have in the scene
	            mixer = new THREE.AnimationMixer(anim_electron);

	            // This creates an AnimationClip and plays it for all electrons
	            var particle = null;
	            for(i = 0; i < numElectrons; i++ ){
	              particle = electrons[i];
	              var clipAction = mixer.clipAction(clip, particle);
	              clipAction.play();
	            }




	            resize();
	            window.onresize = resize;

	            //populateScene();


	            clock = new THREE.Clock()



	          }



	          function animate() {
	            requestAnimationFrame(animate);
	            updateElectrons();
	            render();
	            controls.update();
	            stats.update();
	            renderer.render(scene, camera);
	          }


	          function helper_sectionAnimation(volume, tempo){
	            var particle = null;

	            for(var i = 0; i < numElectrons; ++i){
	                particle = electrons[i]
	                particle.orbitSpeed = (tempo/20);
	                particle.orbitSpeed *= -1;
	                particle.position.setLength(-volume);
	            }
	          }


	          function resize() {
	            WIDTH = window.innerWidth;
	            HEIGHT = window.innerHeight;
	            if (renderer && camera && controls) {
	              renderer.setSize(WIDTH, HEIGHT);
	              camera.aspect = WIDTH / HEIGHT;
	              camera.updateProjectionMatrix();
	              controls.handleResize();
	            }
	          }

	          function render() {
	            renderer.render(scene, camera);
	            var delta = clock.getDelta();

	    				if ( mixer ) {
	    					mixer.update( delta );
	            }
	          }


	          function threeReady() {
	            init();
	            animate();
	          }

	          (function() {
	            function addScript(url, callback) {
	              callback = callback || function() {};
	              var script = document.createElement("script");
	              script.addEventListener("load", callback);
	              script.setAttribute("src", url);
	              document.head.appendChild(script);
	            }

	            addScript("https://threejs.org/build/three.js", function() {
	              addScript("https://threejs.org/examples/js/controls/TrackballControls.js", function() {
	                addScript("https://threejs.org/examples/js/libs/stats.min.js", function() {
	                  threeReady();
	                })
	              })
	            })
	          })();

	        }

		}
	}
}})
