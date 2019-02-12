
function bind_raytracing(viewport){
    
    // Add raycaster and function
    var raycaster = new THREE.Raycaster();
	viewport.raytrace = function(){

		// Do raystracing and find intersections
		raycaster.setFromCamera( this.mouse, this.camera );
        
        var intersects  = raycaster.intersectObjects( this.scene.selectable_objects, false );
        if(this.keydown && this.keydown.key == "Shift"){
            var intersected = intersects;
        } else {
            var intersected = intersects.slice(0,1);
        }

		// Check if you have any intersections
		if ( intersects.length > 0 ) {

		  // Check if you've scrolled onto a new point
		  if ( this.intersected != intersected) {

		    // Restore emission to previously intersected point if not null
		    if (this.intersected){
		        this.dehover_intersects(this.intersected);
		    }

		    // Update intersected
		    this.intersected = intersected;

		    // Color new point accordingly
		    this.hover_intersects(this.intersected);
		  }
		} else {
		  if (this.intersected) {
		    this.dehover_intersects(this.intersected);
		  }
		  this.intersected = null;
		}

	}

}

