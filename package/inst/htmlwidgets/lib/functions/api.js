
function bind_api(container, viewport){
   
    // Function for snapshot
    container.snapshot = function(filename){
        saveImg(viewport, filename);
    }

    // Functions to rotate the scene
    container.rotateSceneEuclidean = function(rotation){
        viewport.scene.rotateSceneEuclidean(rotation);
        viewport.scene.showhideDynamics( viewport.camera );
        if(viewport.mouse.over){
          viewport.raytrace();	
        }
        viewport.render();
    }

    container.zoom = function(zoom){
    	viewport.camera.rezoom(zoom);
    	if(viewport.mouse.over){
          viewport.raytrace();	
        }
        viewport.render();
    }

    container.viewport = viewport;

}

