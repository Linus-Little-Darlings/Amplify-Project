angular.module('amplifyApp').directive('visualizer', ['$http', function($http){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var scene, camera, renderer;
			var container = angular.element('<div>')[0];
			element[0].appendChild(container)
	    async function checkPlaying(){
        console.log('check')
        var track = await $http.get('/currently-playing')
        console.log('track', track)
        getAnalysis(track.data.item.id)
      }
      async function getAnalysis(id){
        var analysis = await $http.get('/track-analysis', {params: {id: id}})
        var features = await $http.get('/track-features', {params: {id: id}})
        console.log('features', features)
        var songFeatures = features.data;
        console.log('analysis', analysis)
        var sections = analysis.data.sections;
        var controls, stats, nucleus;
        var backColor = [];
        var objColor = [];
        var WIDTH = element[0].innerWidth,
          HEIGHT = element[0].innerHeight,
          FOV = 60,
          NEAR = 1,
          FAR = 1000;
        var electrons = [], numElectrons = 50; // more electrons = slower updating
        function updateElectrons(){
          var obj = null;
          for(var i = 0; i < numElectrons; ++i){
            obj = electrons[i]
            obj.position.applyAxisAngle(obj.angle, obj.orbitSpeed);
          }
        }
        function setObjectColorFamily(){ //this about to be tedious
          objColor = [0,0,0];
          if (songFeatures.danceability >= .8) //red - high danceability
          {
            objColor = [.92, .13, .24]; // ea213e - (234, 33, 62)
          }
          if(songFeatures.valence >= .6 && (songFeatures.danceability > .5 && songFeatures.danceability < .8)) { //yellow - happy stuff
            objColor = [.98, .78, .19]; // fcc732 - (252, 199, 50)
          }
          else if ((songFeatures.valence >= .4 && songFeatures.valence < .6) && (songFeatures.danceability >= .5 && songFeatures.danceability < .8)) { //mids valence and danceability - fushia
           objColor = [.86, .07, .717] //dd12b7 - (221, 18, 183)
          }
          else if (songFeatures.valence < .4  && (songFeatures.danceability >= .5 && songFeatures.danceability < .8)) { //low valence and mids danceability - dark blue
           objColor = [.086, .019, .427] //16056d - (22, 5, 109)
          }
          if ((songFeatures.acousticness > .5 && songFeatures.acousticness < .8)  && (songFeatures.danceability >= .5 && songFeatures.danceability < .8)) { //acoustic and dancy - green
           objColor = [.19, .8, .46 ] //32cc77 - (50, 204, 119)
          }
          if (songFeatures.energy < .4  && songFeatures.danceability < .5) { //lowfi probs - lilac
           objColor = [.76, .59, .84] //3c298d8 - (194, 152, 216)
          }
          else if (songFeatures.energy > .4  && songFeatures.danceability < .5) { //most likely tame impala
            objColor = [.97, .07, .74] // f912bd - (249, 18, 189)
          }
          if(songFeatures.acousticness > .8 && songFeatures.energy < .5) { //dark purple - acoustic and slow
            objColor = [.44, .08, .57] // 711593 - (113, 21, 147)
          }
        }
        function setBGColorFamily(){
          if(songFeatures.energy >= .7 && songFeatures.valence > .6) { //orange - high energy and valence
            backColor = [.93, .62, .30]; //0xed9e4f - (237,158,79)
          }
          else if(songFeatures.energy >= .7 && (songFeatures.valence >= .4 && songFeatures.valence <= .6)) { //blue - high energy but mids valence
            backColor = [.29, .72, .87]; // 4bb8dd - (75, 184, 221)
          }
          else if(songFeatures.valence < .4 && songFeatures.energy > .5) { //deep pink - high energy and low valence
            backColor = [.717, .24, .56]; // b73e8f - (183, 62, 143)
          }
          else if((songFeatures.energy >= .4 && songFeatures.energy <= .6) && (songFeatures.valence >= .4 && songFeatures.valence <= .6)) {//light pink - mids valence and energy
            backColor = [.8, .53, .73]; // cc87ba - (204, 135, 186)
          }
          else if((songFeatures.energy >= .4 && songFeatures.energy <= .6) && songFeatures.valence > .6) { //mids energy and high valence
            backColor = [.38, .71, .75]; // 62b6bf - (98, 182, 191)
          }
          else if (songFeatures.valence < .4 && songFeatures.energy < .5) { //purple - low energy and valence
            backColor = [.7, .435, .788]; // b36fc9 - (179, 111, 201)
          }
          else { //in case I missed something
            backColor = [.82, .97, .898]; // d2f9e5 - (210, 249, 229)
          }
        }
        function init() {
          renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
          });
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      		container.appendChild(renderer.domElement)
          
          scene = new THREE.Scene();
          scene.background = new THREE.Color( 0x000000 );
          camera = new THREE.PerspectiveCamera(FOV, WIDTH / HEIGHT, NEAR, FAR);
          camera.position.z = 100;
          scene.add(camera);
          controls = new THREE.TrackballControls(camera, renderer.domElement);
          controls.dynamicDampingFactor = 0.5;
          controls.rotateSpeed = 3;
          var light = new THREE.PointLight(0xffffff, 1, Infinity);
          camera.add(light);
          //scene.fog = new THREE.Fog(0x03544e, 0.001);
          

          ///////////////////////////////////////////////////////////////////////////////////////////////
          // Populate the scene
          var geo = new THREE.SphereBufferGeometry(1, 16, 16);
          var mat = new THREE.MeshPhongMaterial({color:"blue"});
          var electron = null, plane = new THREE.Plane(), point = new THREE.Vector3();
          geo = new THREE.SphereBufferGeometry(5, 16, 16);
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
            electron.position.setLength(40);
            electron.position.applyAxisAngle(electron.angle, 6.28);
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
            var background_values = [];
            var opacity_values = [];
            var z_values = [];
            var orbit_norm;
            var i;
            var op = 1;
            var scale = .6;
            setObjectColorFamily();
            setBGColorFamily();
            var r = backColor[0];
            var g = backColor[1];
            var b = backColor[2];
            var ro = objColor[0];
            var go = objColor[1];
            var bo = objColor[2];
            function bumpUp()
            {
              op = op + (10*i)/10;
              opacity_values[i] = op;
            }
            function bumpDown()
            {
              op = op - (5*i)/10;
              if (op < 0)
              {
                op = 0.05;
              }
              opacity_values[i] = op;
            }
            for (i=0; i < sections.length; i++) {
              times[i] = sections[i].start;
              orbit_norm = 0.01 + (sections[i].tempo - 60)*0.0011875;
              orbit_values[i] = orbit_norm;
              if(op <= .05)
              {
                bumpUp();
              }
              else {
                bumpDown();
              }
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
              //changing colors starting from color family and incrementing rgb equally to fade
              //object colors
              ro += (((i+1)*1.3)/100);
              go += (((i+1)*1.3)/100);
              bo += (((i+1)*1.3)/100);
              if(r > 1) { //checks to keep range [0, 1]
                ro = ro - (((2*(i+1))/100))
              }
              if(ro < 0){
                ro +=.5;
              }
              color_values[i] = ro //red
              if(go > 1) {
                go = go - (((2*(i+1))/100)*1.5);    //green
              }
              if(go < 0){
                go+=.5;
              }
              color_values[i+1] = go
              if(bo > 1) {
                bo = bo - (((2*(i+1))/100)*1.5);    //blue
              }
              if(bo < 0){
                bo+=.5;
              }
              color_values[i+2] = bo
              //background colors
              r += (((i+1)*1.5)/100);
              g += (((i+1)*1.5)/100);
              b += (((i+1)*1.5)/100);
              if(r > 1) { //checks to keep range [0, 1]
                r = r - (((2*(i+1))/100))
              }
              if(r < 0){
                r +=.5;
              }
              background_values[i] = r //red
              if(g > 1) {
                g = g - (((2*(i+1))/100)*1.5);    //green
              }
              if(g < 0){
                g+=.5;
              }
              background_values[i+1] = g
              if(b > 1) {
                b = b - (((2*(i+1))/100)*1.5);    //blue
              }
              if(b < 0){
                r+=.5;
              }
              background_values[i+2] = b
              console.log(r + " " + g + " " + b + " VS:" + ro + " " + go + " " + bo)
              scale += (songFeatures.tempo - 10*i)/500
              if(scale > 1 )
              {
                  scale = -(scale - i/100);
              }
              if(scale < .1)
              {
                scale = scale - i/100;
              }
              if(scale < -1)
              {
                scale = -(scale + i/100);
              }
              z_values[i] = scale;
              z_values[i+1] = scale;
              z_values[i+2] = scale;
              console.log("scale: " + scale)
            }
            /////////////////////////////////////////////////////////////////////////////////////////
            // console.log('times', times);
            // console.log('values', values);
            // I believe the times of all tracks would need to be the same - maybe not, but shouldn't be an issue regardless
            var orbitSpeedKF = new THREE.NumberKeyframeTrack('.orbitSpeed', times, orbit_values);
            //var distanceKF = new THREE.VectorKeyframeTrack('.position.scale', times, distance_values);
            // Below is a KeyframeTrack - it matches time segments with animation values, basically representing one component of an animation like changing color or changing speed.
            // In the values array (named color_values below) you'll define what you want the animation's value to look like during that time interval.
            // There are different kinds of Keyframe tracks. To change color, you'll use a THREE.ColorKeyframeTrack. The name will be '.material.color', because that is the component
            // of the object you want to change. Then you will pass in an array of the times (already grabbed from the track_analysis above) and your array of color values.
            var colorKF = new THREE.ColorKeyframeTrack('.material.color', times, color_values);
            var backKF = new THREE.ColorKeyframeTrack('.background', times, background_values);
            var opacityKF = new THREE.NumberKeyframeTrack('.material.opacity', times, opacity_values);
            var zKF = new THREE.NumberKeyframeTrack('.scale', times, z_values);
            //var xKF = new THREE.NumberKeyframeTrack('position', times, z_values);
            //var yKF = new THREE.NumberKeyframeTrack('.position', times, z_values);
            // Animation Clip creation
            // The AnimationClip takes multiple KeyframeTracks and basically adds them to one object to create and a complex animation.
            // Passing negative value forces AnimationClip to calcuate its duration based on the KeyframeTracks passed.
            // Any KeyframeTrack you want included in the animation should be listed in the KeyframeTrack array in the third argument.
            var clip = new THREE.AnimationClip('Action', -1, [orbitSpeedKF, colorKF, opacityKF, zKF]);
            
          var clipBack = new THREE.AnimationClip('Action2', -1, [backKF]);
          // Animation Mixer creation
          // Currently just animating one electron - due to the way animation works, I can't just use a for loop and apply it to a bunch of objects. Currently working on a fix for that.
          var anim_electron = electrons[0];
          // The Mixer is basically a player for an animation on a specific object - in this case, we're animating the single electron I have in the scene
          mixer = new THREE.AnimationMixer(anim_electron);
          mixerBack = new THREE.AnimationMixer(scene)
          // This creates an AnimationClip and plays it for all electrons
          var particle = null;
          for(i = 0; i < numElectrons; i++ ){
            particle = electrons[i];
            particle.material.transparent = true;
            var clipBackA = mixer.clipAction(clipBack, scene);
            var clipAction = mixer.clipAction(clip, particle);
            clipAction.play();
            clipBackA.play();
          }

          resize();
          window.onresize = resize;
          clock = new THREE.Clock()
        }
        function animate() {
          requestAnimationFrame(animate);
          updateElectrons();
          render();
          controls.update();
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
          WIDTH = (element[0].offsetWidth);
          HEIGHT = (element[0].offsetHeight);
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
        threeReady()
      }   
      checkPlaying()
		}
	}
}])