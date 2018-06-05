

function update_labels(viewport){
    viewport.plotHolder.updateMatrixWorld();
    for(var i=0; i<viewport.labels.length; i++){
        var lab = viewport.labels[i];
        // Negate any world rotation
        var qrot = lab.parent.getWorldQuaternion();
        lab.rotation.setFromQuaternion(qrot.conjugate());
    }
}

function rotateLocalAxes(viewport, axis, rotation){
	var world_axis = axis.clone().applyQuaternion(viewport.plotHolder.quaternion);
	viewport.plotHolder.rotateOnAxis(axis, rotation);
	for(var i=0; i<viewport.clippingPlanes.length; i++){
		var norm = viewport.clippingPlanes[i].normal;
		norm.applyAxisAngle(world_axis, rotation);
		viewport.clippingPlanes[i].set(norm, viewport.clippingPlanes[i].constant);
	}
	viewport.plotHolder.rotation.onChangeCallback();
}


function rotatePlotHolderOnAxis(viewport, axis, rotation){
	rotateOnWorldAxis(viewport.plotHolder, axis, rotation);
	rotateClippingPlanes(viewport, axis, rotation);
	viewport.plotHolder.rotation.onChangeCallback();
}

function rotatePlotHolder(viewport, rotX, rotY){
	rotatePlotHolderOnAxis(viewport, new THREE.Vector3(0,1,0), rotX);
	rotatePlotHolderOnAxis(viewport, new THREE.Vector3(1,0,0), -rotY);
	update_labels(viewport);
	viewport.transform.update(viewport);
}

function rotationInertia(viewport){
	if(!viewport.mouse.down && (Math.abs(viewport.damper.rotX) > 0.001 || Math.abs(viewport.damper.rotY) > 0.001)){
        viewport.damper.rotX = viewport.damper.rotX*0.9;
		viewport.damper.rotY = viewport.damper.rotY*0.9;
        rotatePlotHolder(viewport, viewport.damper.rotX*3, viewport.damper.rotY*3);
        viewport.damper.timeout = window.setTimeout(function(){rotationInertia(viewport)}, 20);
        viewport.animate = true;
    } else {
    	viewport.animate = false;
    }
}

function rotateClippingPlanes(viewport, axis, angle) {
	for(var i=0; i<viewport.clippingPlanes.length; i++){
		var norm = viewport.clippingPlanes[i].normal;
		norm.applyAxisAngle(axis, angle);
		viewport.clippingPlanes[i].set(norm, viewport.clippingPlanes[i].constant);
	}
}

function rotateOnWorldAxis(object, axis, angle) {

	var q = new THREE.Quaternion();
	q.setFromAxisAngle( axis, angle );
	object.applyQuaternion( q );
	
}

function dampScroll(scrollDelta){
	if(scrollDelta < 0){ 
	  scrollDelta = -scrollDelta;
	  var n = 1;
	} else {
		var n = -1;
	}
    scrollDelta += -6;
	return((1/(1+Math.pow(Math.E, -0.3*scrollDelta)))*n);
}

function navMouseMove(viewport){
	if(viewport.navigable){
	    if(viewport.mouse.down && !viewport.dragObject){
	      if(!viewport.mouse.event.metaKey && !viewport.mouse.event.shiftKey && viewport.touch.num <= 1){
	        viewport.mouseMove(viewport.mouse.deltaX, viewport.mouse.deltaY);
	      } else if(viewport.mouse.event.metaKey || viewport.touch.num == 3){
	        viewport.mouseMoveMeta(viewport.mouse.deltaX, viewport.mouse.deltaY);
	      }
	    }
    }
}

function navScroll(viewport){
	if(!viewport.keydown){
	    viewport.mouseScroll(viewport.mouse.scrollX*0.6, viewport.mouse.scrollY*0.6);
	} else if(viewport.keydown.key == "Shift"){
	    viewport.mouseScrollShift(viewport.mouse.scrollX*0.6, viewport.mouse.scrollY*0.6);
	} else if(viewport.keydown.key == "Meta"){
		viewport.mouseScrollMeta(viewport.mouse.scrollX*0.005, -viewport.mouse.scrollY*0.005);
	}
}

function bind_navigation(viewport, dimensions){
    
    // Add viewport variables
    viewport.navigable = true;

    // Bind mouse events
    viewport.addEventListener("mousemove", function(){ 
    	navMouseMove(this); 
    });
    viewport.addEventListener("touchmove", function(){
    	if(this.touch.num == 1){
    	    navMouseMove(this); 
    	} else {
            navScroll(this);
    	}
    });
    viewport.addEventListener("wheel", function(){
    	navScroll(this);
    });

    if(dimensions == 2){
        viewport.rotateScene = function(rotX, rotY){
            this.plotPoints.rotateZ(rotY*0.1);
            for(var i=0; i<this.pt_objects.length; i++){
            	if(!this.pt_objects[i].blob){
            	    this.pt_objects[i].rotateZ(-rotY*0.1);
                }
            }
        }
        viewport.panScene = function(panX, panY){
            var position = new THREE.Vector3(panX, panY, 0);
            position.unproject(this.camera);
            this.scene.position.x += position.x;
            this.scene.position.y += position.y;
        }
        viewport.positionScene = function(){
		    var scene         = this.scene;
		    var plotPoints    = this.plotPoints;
		    var point_objects = this.pt_objects;
		    var point_pos = [];
  
		    plotPoints.position.x = this.plotData.aspect[0]/2;
		    plotPoints.position.y = this.plotData.aspect[1]/2;
		    plotPoints.updateMatrixWorld();
  
		    scene.position.x = 0;
		    scene.position.y = 0;
		}
    }

    if(dimensions == 3){
        viewport.rotateScene = function(rotX, rotY){
			var viewport = this;
        	var plotHolder = this.plotHolder;
			rotatePlotHolder(viewport, rotX*3, rotY*3);
			this.damper.rotX = rotX;
			this.damper.rotY = rotY;
			if(this.damper.timeout){ window.clearTimeout(this.damper.timeout) }
			this.damper.timeout = window.setTimeout(function(){rotationInertia(viewport)}, 20);
        }
        viewport.rockScene = function(rotY, rotZ){
            var plotHolder = this.plotHolder;
			rotateOnWorldAxis(plotHolder, new THREE.Vector3(0,0,1), rotZ*0.2);
			rotateClippingPlanes(viewport, new THREE.Vector3(0,0,1), rotZ*0.2);
			update_labels(this);
			plotHolder.rotation.onChangeCallback();
        }
        viewport.panScene = function(panX, panY){
        	var plotHolder = this.scene.children[0];
			var plotPoints = this.plotPoints;

			var position = new THREE.Vector3(0, 0, 0);
		    position.applyMatrix4(plotHolder.matrixWorld).project(this.camera);
		    position.x += panX;
		    position.y += panY;
		    var inverse_mat = new THREE.Matrix4();
		    inverse_mat.getInverse(plotHolder.matrixWorld);
		    position.unproject(this.camera).applyMatrix4(inverse_mat);

			plotPoints.position.x += position.x;
			plotPoints.position.y += position.y;
			plotPoints.position.z += position.z;

			globalpos = position.clone().applyMatrix4(plotHolder.matrixWorld);
			for(var i=0; i<this.clippingPlanes.length; i++){
				var pos = globalpos.clone();
				var norm = this.clippingPlanes[i].normal.clone();
				var orignorm = norm.clone().applyMatrix4(plotHolder.matrixWorld);
				pos.projectOnVector(norm);
			    var offset = pos.length()*pos.clone().normalize().dot(norm);
				this.clippingPlanes[i].constant -= offset;
			}
			plotHolder.rotation.onChangeCallback();
        }
        viewport.positionScene = function(){

		  var scene         = this.scene;
		  var plotPoints    = this.plotPoints;

		  plotPoints.position.x = -this.plotData.aspect[0]/2;
		  plotPoints.position.y = -this.plotData.aspect[1]/2;
		  plotPoints.position.z = -this.plotData.aspect[2]/2;
		  plotPoints.updateMatrixWorld();

		}
    }

    viewport.zoomScene = function(deltaX, deltaY){
    	this.camera.rezoom(deltaY);
    };

    if(dimensions == 3){
	    viewport.mouseMove        = viewport.rotateScene;
	    viewport.mouseMoveMeta    = viewport.panScene;
	    viewport.mouseScroll      = viewport.zoomScene;
	    viewport.mouseScrollShift = viewport.rockScene;
	    viewport.mouseScrollMeta  = viewport.rotateScene;
    } else {
    	viewport.mouseMove        = viewport.panScene;
	    viewport.mouseMoveMeta    = function(x){};
	    viewport.mouseScroll      = viewport.zoomScene;
	    viewport.mouseScrollShift = viewport.rotateScene;
	    viewport.mouseScrollMeta  = function(x){};
    }

    // Create a little div to track rotation settings
    viewport.transform = document.createElement("div");
    viewport.transform.classList.add("transform-div");
    viewport.transform.style.display = "none";
    viewport.appendChild(viewport.transform);
    viewport.transform.update = function(viewport){
        var rotation = [
          180*(viewport.plotHolder.rotation.x/Math.PI),
          180*(viewport.plotHolder.rotation.y/Math.PI),
          180*(viewport.plotHolder.rotation.z/Math.PI)
        ];
        this.innerHTML = rotation[0].toFixed(2)+", "+rotation[1].toFixed(2)+", "+rotation[2].toFixed(2);
    }
    

}

