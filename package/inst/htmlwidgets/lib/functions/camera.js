

function addCamera(viewport, plotData){

	// Position the camera and add to viewport
	viewport.ortho_camera = makeOrthographicCamera(viewport);
	viewport.persp_camera = makePerspectiveCamera(viewport);
	viewport.camera = viewport.persp_camera;
    
    if(!plotData.scene.zoom){ plotData.scene.zoom = [1] }
	viewport.camera.defaultZoom = plotData.scene.zoom[0];

}


// Perspective camera
function makePerspectiveCamera(viewport){

    // Build the perspective camera
	var camera = new THREE.PerspectiveCamera( 45, viewport.offsetWidth / viewport.offsetHeight, 0.1, 10000 );
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 4;

	camera.renderer   = viewport.renderer;
	camera.scene      = viewport.scene;
	camera.viewport   = viewport;
	

	// Set zoom controls
	camera.min_zoom = 0.75;
	camera.max_zoom = 8;
	camera.zoom_damper = 0.15;

	// Set resize function
	camera.resize = function(){
	  this.renderer.setSize( this.viewport.offsetWidth, this.viewport.offsetHeight );
	  if(this.viewport.labelRenderer){
	 	this.viewport.labelRenderer.setSize( this.viewport.offsetWidth, this.viewport.offsetHeight);
	  }
	  this.aspect = this.viewport.offsetWidth / this.viewport.offsetHeight;
	  this.updateProjectionMatrix();
	  // this.viewport.render();
	}

	// Set the function to center the camera
	camera.setDistance = function(){
		
	    var objectSize = Math.max.apply(Math, viewport.plotData.aspect)/2;
	    var fov = this.fov * ( Math.PI / 180 ); 
	    this.position.setComponent(2, Math.abs( objectSize / Math.sin( fov / 2 ) ));
	    this.updateProjectionMatrix();

	}

	// Set the function to zoom the camera
	camera.setDefaultZoom = function(){

		this.zoom = this.defaultZoom;
		this.updateProjectionMatrix();

	}
	camera.rezoom = function(zoom){
		zoom = -zoom;
		var min_zoom = this.min_zoom;
		var max_zoom = this.max_zoom;
		zoom = zoom*camera.zoom_damper;
		if(this.position.z + zoom <= max_zoom 
			&& this.position.z + zoom >= min_zoom){
		  this.position.z += zoom;
		} else if(zoom < 0){
			this.position.z = min_zoom;
		} else {
			this.position.z = max_zoom;
		}
		this.updateProjectionMatrix();
		return(zoom);
	}

	camera.getZoom = function(){
		return(this.position.z);
	}

	camera.setZoom = function(zoom){
		this.position.z      = zoom;
		viewport.sceneChange = true;
	}
    
    // Return the camera
	camera.resize();
	return(camera);

}






// Orthographic camera
function makeOrthographicCamera(viewport){

    // Build the orthographic camera
    var camera = new THREE.OrthographicCamera();
    camera.near = -100;
    camera.far  = 100;

    camera.renderer   = viewport.renderer;
    camera.scene      = viewport.scene;
    camera.viewport   = viewport;
    
    // Set resize function
    camera.resize = function(){
    	this.renderer.setSize( this.viewport.offsetWidth, this.viewport.offsetHeight);
    	if(this.viewport.labelRenderer){
	 	  this.viewport.labelRenderer.setSize( this.viewport.offsetWidth, this.viewport.offsetHeight);
	    }
    	var aspect = this.viewport.offsetWidth / this.viewport.offsetHeight;
		this.left   = -aspect/2;
		this.right  = aspect/2;
		this.top    = 1/2;
		this.bottom = -1/2;
		this.updateProjectionMatrix();
		// this.viewport.render();
    }

    // Set the function to center the camera
    camera.setDistance = function(){

    	var scene_objects = [];
    	var plotPoints    = this.viewport.scene.plotPoints;

    	for(var i=0; i<plotPoints.children.length; i++){
    		scene_objects.push(plotPoints.children[i].position);
    	}

    	var scene_bbox = new THREE.Box3().setFromPoints(scene_objects);
	    var scene_height = scene_bbox.max.y - scene_bbox.min.y;
	    var scene_width  = scene_bbox.max.x - scene_bbox.min.x;

        var start_zoom = 0.8/scene_height;
	    var min_zoom = 0.5*start_zoom;

	    this.viewport.scene.scale.set(start_zoom,
	    	                          start_zoom,
	    	                          start_zoom);
	    
    }

    // Set the function to zoom the camera
	camera.rezoom = function(zoom){

		var scene = this.viewport.scene;
		var start_scale = scene.scale.x;

		// Scale points
		if(zoom > 0){
			var scale = 1+zoom*0.05;
			var new_scale = start_scale*scale;
		} else{
			var scale = 1-zoom*0.05;
			var new_scale = start_scale/scale;
		}
		scene.scale.set(new_scale,
	    	            new_scale,
	    	            new_scale);

		// Do panning
		var current_centerx = -scene.position.x;
		var current_centery = -scene.position.y;
		var asp = this.viewport.offsetWidth / this.viewport.offsetHeight;
		var mouse = this.viewport.mouse;

		var height = 1/scene.scale.x;
		var width  = asp/scene.scale.x;
		var x_pos = -((-mouse.x/2)*asp+scene.position.x)/start_scale;
		var y_pos = -(-mouse.y/2+scene.position.y)/start_scale;

		var new_x_pos = -((-mouse.x/2)*asp+scene.position.x)/new_scale;
		var new_y_pos = -(-mouse.y/2+scene.position.y)/new_scale;

		var delta_x_pos = new_x_pos - x_pos;
		var delta_y_pos = new_y_pos - y_pos;

		scene.position.x += delta_x_pos/height;
		scene.position.y += delta_y_pos/height;
		return(new_scale);

	}

	camera.getZoom = function(){
		return(this.viewport.scene.scale.x);
	}

	// Return the camera
	camera.resize();
	return(camera);

}




