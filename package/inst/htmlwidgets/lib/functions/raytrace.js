
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
		this.raycaster.camera = camera.camera;
		this.raycaster.aspect = viewer.getAspect();
		this.raycaster.setFromCamera( 
			mouse, 
			camera.camera
		);
	    
	    // Find intersections with selectable objects
	    var intersects  = this.raycaster.intersectObjects( 
	    	scene.selectable_elements, 
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
		    	viewer.dehoverElements(
		    		this.intersectedElementIDs()
		    	);
		    }

		    // Update intersected
		    this.intersected = intersected;

		    // Color new point accordingly
		    viewer.hoverElements(
		    	this.intersectedElementIDs()
		    );
		  }
		} else {
		  if (this.intersected) {
		    viewer.dehoverElements(
		    	this.intersectedElementIDs()
		    );
		  }
		  this.intersected = null;
		}

	}

	// Fetch objects from intersected
	intersectedElementIDs(){
		
		var element_ids = [];
		var uuids    = [];
		
		for(var i=0; i<this.intersected.length; i++){
			if(uuids.indexOf(this.intersected[i].object.uuid) == -1){
				element_ids.push(this.intersected[i].object.element.id);
	          	uuids.push(this.intersected[i].object.uuid);
	        }
		}
		
		return(element_ids);

	}

}



