

function addCamera(viewport, dimensions){

  if(dimensions == 2){
    
    // Build the camera
    var camera = new THREE.OrthographicCamera();
    camera.near = 0.1;
    camera.far  = 100;
    camera.position.z = 20;

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
		this.left   = aspect/2;
		this.right  = -aspect/2;
		this.top    = -1/2;
		this.bottom = 1/2;
		this.updateProjectionMatrix();
		this.viewport.render();
    }

    // Set the function to center the camera
    camera.center = function(){

    	var scene_objects = [];
    	for(var i=0; i<this.viewport.pt_objects.length; i++){
    		scene_objects.push(this.viewport.pt_objects[i].parent.position);
    	}
    	var scene_bbox = new THREE.Box3().setFromPoints(scene_objects);
    	
	    var scene_height = scene_bbox.max.y - scene_bbox.min.y;
	    var scene_width  = scene_bbox.max.x - scene_bbox.min.x;

        var start_zoom = 0.8/scene_height;
	    var min_zoom = 0.5*start_zoom;

	    this.scene.scale.set(start_zoom,
	    	                 start_zoom,
	    	                 start_zoom);
	    
    }

    // Set the function to zoom the camera
	camera.rezoom = function(zoom){
        
		var start_scale = this.scene.scale.x;

		// Scale points
		if(zoom > 0){
			var scale = 1+zoom*0.05;
			var new_scale = start_scale*scale;
		} else{
			var scale = 1-zoom*0.05;
			var new_scale = start_scale/scale;
		}
		this.scene.scale.set(new_scale,
	    	                 new_scale,
	    	                 new_scale);

		// Do panning
		var current_centerx = -this.scene.position.x;
		var current_centery = -this.scene.position.y;
		var asp = this.viewport.offsetWidth / this.viewport.offsetHeight;
		var mouse = this.viewport.mouse;

		var height = 1/this.scene.scale.x;
		var width  = asp/this.scene.scale.x;
		var x_pos = -((mouse.x/2)*asp+this.scene.position.x)/start_scale;
		var y_pos = -(mouse.y/2+this.scene.position.y)/start_scale;

		var new_x_pos = -((mouse.x/2)*asp+this.scene.position.x)/new_scale;
		var new_y_pos = -(mouse.y/2+this.scene.position.y)/new_scale;

		var delta_x_pos = new_x_pos - x_pos;
		var delta_y_pos = new_y_pos - y_pos;

		this.scene.position.x += delta_x_pos/height;
		this.scene.position.y += delta_y_pos/height;

	}

  } else {
    
    // Build the camera
    var camera = new THREE.PerspectiveCamera( 45, viewport.offsetWidth / viewport.offsetHeight, 0.1, 10000 );
    camera.position.x = 0;
    camera.position.y = 0;

    camera.renderer   = viewport.renderer;
    camera.scene      = viewport.scene;
    camera.viewport   = viewport;
    
    // Set resize function
    camera.resize = function(){
      this.renderer.setSize( this.viewport.offsetWidth, this.viewport.offsetHeight );
      if(this.viewport.labelRenderer){
	 	this.viewport.labelRenderer.setSize( this.viewport.offsetWidth, this.viewport.offsetHeight);
	  }
      this.aspect = this.viewport.offsetWidth / this.viewport.offsetHeight;
      this.updateProjectionMatrix();
      this.viewport.render();
    }
    
    // Set the function to center the camera
	camera.center = function(){
	    var objectSize = Math.max.apply(Math, this.viewport.plotData.aspect)/2;

	    var fov = this.fov * ( Math.PI / 180 ); 
	    this.position.z = Math.abs( objectSize / Math.sin( fov / 2 ) );
	}

	// Set the function to zoom the camera
	camera.rezoom = function(zoom){
		if(this.position.z >= 1 || zoom < 0){
		  this.position.z -= zoom*0.25;
		}
	}
    
  }
  
  // Position the camera and add to viewport
  viewport.camera = camera;
  camera.resize();
  camera.center();

}

