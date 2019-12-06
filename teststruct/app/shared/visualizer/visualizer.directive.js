angular.module('amplifyApp').directive('visualizer', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var scene, camera, renderer;
			var container = angular.element('<div>')[0];
			element[0].appendChild(container)
			scope.width = element[0].offsetWidth;
			scope.height = element[0].offsetHeight;
			scope.init = function(){
				scene = new THREE.Scene();
	      camera = new THREE.PerspectiveCamera( 75, scope.width / scope.height, 0.1, 1000 );
	      renderer = new THREE.WebGLRenderer();
	      renderer.setSize( scope.width, scope.height );
	      container.appendChild(renderer.domElement)
	      //element[0].appendChild(renderer.domElement);
	      var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	      var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	      var cube = new THREE.Mesh( geometry, material );
	      scene.add( cube );
	      camera.position.z = 5;	      
	    }
	    scope.animate = function(){
	    	scene.traverse(function (element) {
          if (element instanceof THREE.Mesh) {
              element.rotation.x += 0.0065;
              element.rotation.y += 0.0065;
          }
          renderer.render(scene, camera);
        });
	    	requestAnimationFrame(scope.animate)
	    	renderer.render(scene, camera)
	    }

	    scope.init()
	    scope.animate()
		}
	}
}})
