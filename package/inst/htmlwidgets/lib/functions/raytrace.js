
R3JS.Raytracer = class Raytracer {

	// Constructor function
	constructor(){
		this.raycaster = new THREE.Raycaster();
	}

	// Raytrace function
	raytrace(
		viewer,
		scene, 
		camera,
		mouse
		){

		// Do raystracing and find intersections
		this.raycaster.setFromCamera( 
			mouse, 
			camera.camera
		);
	    
	    // Find intersections with selectable objects
	    var intersects  = this.raycaster.intersectObjects( 
	    	scene.selectable_objects, 
	    	false 
	    );

	    // Get the first or all intersected depending on key hold
	    if(document.keydown 
	       && document.keydown.key == "Shift"){
	        var intersected = intersects;
	    } else {
	        var intersected = intersects.slice(0,1);
	    }

		// Check if you have any intersections
		if ( intersects.length > 0 ) {

		  // Check if you've scrolled onto a new point
		  if ( this.intersected !== intersected) {

		    // Restore emission to previously intersected point if not null
		    if (this.intersected){
		    	scene.dehoverElements(
		    		this.intersectedElements()
		    	);
		    	viewer.sceneChange = true;
		    }

		    // Update intersected
		    this.intersected = intersected;

		    // Color new point accordingly
		    scene.hoverElements(
		    	this.intersectedElements()
		    );
		    viewer.sceneChange = true;
		  }
		} else {
		  if (this.intersected) {
		    scene.dehoverElements(
		    	this.intersectedElements()
		    );
		    viewer.sceneChange = true;
		  }
		  this.intersected = null;
		}

	}

	// Fetch objects from intersected
	intersectedElements(){
		
		var elements = [];
		var uuids    = [];
		
		for(var i=0; i<this.intersected.length; i++){
			if(uuids.indexOf(this.intersected[i].object.uuid) == -1){
				elements.push(this.intersected[i].object.element);
	          	uuids.push(this.intersected[i].object.uuid);
	        }
		}

		return(elements);

	}

}



