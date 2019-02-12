
function addScene(viewport, plotData){

    viewport.scene = generate_scene(plotData);

}


function generate_scene(plotData){

	// Create scene
    var scene = new THREE.Scene();

    // Add ambient light
    var ambient_light = new THREE.AmbientLight( 0x404040 );
    scene.add( ambient_light );

    // Add positional light
    var light       = new THREE.DirectionalLight(0xe0e0e0);
    light.position.set(-1,1,1).normalize();
    light.intensity = 1.0;
    // scene.light  = light;
    scene.add( light );

    // Create plotHolder for rotation
    var plotHolder = new THREE.Object3D();
    scene.plotHolder = plotHolder;

    // Create plotPoints for panning
    var plotPoints = new THREE.Object3D();
    plotHolder.add(plotPoints);
    scene.add(plotHolder);
    scene.plotPoints = plotPoints;

    // Set scene background color
    var bg_col = new THREE.Color(plotData.scene.background[0],
                                 plotData.scene.background[1],
                                 plotData.scene.background[2]);
    scene.background = bg_col;

    // Set scene variables
    scene.selectable_objects    = [];
    scene.dynamic_objects       = [];
    scene.dynamic_cornerObjects = [];
    scene.labels                = [];
    scene.toggles = {
    	names   : [],
    	objects : []
    };

    // Define the clipping planes
    plotPoints.clippingPlanes = [
        new THREE.Plane( new THREE.Vector3( 1, 0, 0 ),  0 ),
        new THREE.Plane( new THREE.Vector3( -1, 0, 0 ), plotData.aspect[0] ),
        new THREE.Plane( new THREE.Vector3( 0, 1, 0 ),  0 ),
        new THREE.Plane( new THREE.Vector3( 0, -1, 0 ), plotData.aspect[1] ),
        new THREE.Plane( new THREE.Vector3( 0, 0, 1 ),  0 ),
        new THREE.Plane( new THREE.Vector3( 0, 0, -1 ), plotData.aspect[2] )
    ];

    scene.clippingPlanes = [];


    // Add support for dynamic objects
    add_dynamicObjects(scene, plotData);

    // Populate the plot with plot objects
    plotData.normalise = true;
    populatePlot(plotPoints, plotData, scene);

    
    // // Setup helper objects
    // scene.helperObjects = [];
    // scene.showHelpers = function(){
    // 	var helper_objects = [];
    //     for(var i=0; i<this.plotPoints.clippingPlanes.length; i++){
    // 	    var helper = new THREE.PlaneHelper( this.plotPoints.clippingPlanes[i], 1, 0xffff00 );
    // 	    helper_objects.push(helper);
    //         scene.add( helper );
    //     }
    //     scene.helperObjects = helper_objects;
    // }

    // scene.hideHelpers = function(){
    //     for(var i=0; i<scene.helperObjects.length; i++){
    // 	    scene.helperObjects[i].parent.remove(scene.helperObjects[i]);
    //     }
    // }

	// Functions to rotate scene
    scene.rotateSceneOnAxis = function(axis, rotation){

        // Rotate the plot holder
        var q = new THREE.Quaternion().setFromAxisAngle( axis, rotation );
		this.plotHolder.applyQuaternion( q );

        // Rotate the clipping planes
		var world_axis = axis.clone().applyQuaternion(q);

		for(var i=0; i<this.plotPoints.clippingPlanes.length; i++){
			var norm = this.plotPoints.clippingPlanes[i].normal;
			norm.applyAxisAngle(world_axis, rotation);
			this.plotPoints.clippingPlanes[i].set(norm, this.plotPoints.clippingPlanes[i].constant);
		}

        for(var i=0; i<this.clippingPlanes.length; i++){
            var norm = this.clippingPlanes[i].normal;
            norm.applyAxisAngle(world_axis, rotation);
            this.clippingPlanes[i].set(norm, this.clippingPlanes[i].constant);
        }

    }

	scene.rotateSceneEuclidean = function(rotation){
        
        this.rotateSceneOnAxis(new THREE.Vector3(0,0,1), rotation[2]);
        this.rotateSceneOnAxis(new THREE.Vector3(0,1,0), rotation[1]);
        this.rotateSceneOnAxis(new THREE.Vector3(1,0,0), rotation[0]);

	}

	scene.setRotation = function(rotation){
        
        // Rotate back to origin
        var rot = this.plotHolder.rotation.toVector3();
        var r = rot.negate().toArray();
        this.rotateSceneOnAxis(new THREE.Vector3(1,0,0), r[0]);
        this.rotateSceneOnAxis(new THREE.Vector3(0,1,0), r[1]);
        this.rotateSceneOnAxis(new THREE.Vector3(0,0,1), r[2]);

        // Perform the rotation
        scene.rotateSceneEuclidean(rotation);

	}

    scene.setRotationDegrees = function(rotation){
        this.setRotation([
            (rotation[0]/180)*Math.PI,
            (rotation[1]/180)*Math.PI,
            (rotation[2]/180)*Math.PI
        ])
    }

	scene.getRotation = function(location){
        var rot = this.plotHolder.rotation.toArray();
		return([
            (rot[0]/Math.PI)*180,
            (rot[1]/Math.PI)*180,
            (rot[2]/Math.PI)*180
        ]);
	}

	// Functions to pan the scene
	scene.panScene = function(translation){

        translation = new THREE.Vector3().fromArray(translation);
		this.plotPoints.position.add(translation);

		globalpos = translation.applyMatrix4(this.plotHolder.matrixWorld);
		for(var i=0; i<this.plotPoints.clippingPlanes.length; i++){
			var pos = globalpos.clone();
			var norm = this.plotPoints.clippingPlanes[i].normal.clone();
			var orignorm = norm.clone().applyMatrix4(this.plotHolder.matrixWorld);
			pos.projectOnVector(norm);
		    var offset = pos.length()*pos.clone().normalize().dot(norm);
			this.plotPoints.clippingPlanes[i].constant -= offset;
		}

        for(var i=0; i<this.clippingPlanes.length; i++){
            var pos = globalpos.clone();
            var norm = this.clippingPlanes[i].normal.clone();
            var orignorm = norm.clone().applyMatrix4(this.plotHolder.matrixWorld);
            pos.projectOnVector(norm);
            var offset = pos.length()*pos.clone().normalize().dot(norm);
            this.clippingPlanes[i].constant -= offset;
        }

	}

	scene.setTranslation = function(location){

            // Correct for scene center
	        var translation = new THREE.Vector3().fromArray(location);
	        translation.sub(new THREE.Vector3().fromArray(plotData.aspect).multiplyScalar(0.5));

	        // Get difference between current position and center position
	        var aspect = plotData.aspect;
	        translation.sub(this.plotPoints.position);
  
	        // Pan the scene
	        this.panScene(translation.toArray());

	}

	scene.getTranslation = function(){
		var center = new THREE.Vector3().fromArray(plotData.aspect).multiplyScalar(0.5);
		return(this.plotPoints.position.clone().add(center).toArray());
	}

	// Function to set the default transformation specified by the plotting data
	scene.resetTransformation = function(){
    	if(plotData.scene && plotData.scene.translation){
    	    this.setTranslation(plotData.scene.translation);
    	} else {
    		this.setTranslation([0,0,0]);
    	}

    	if(plotData.scene && plotData.scene.rotation){
    	    this.setRotation(plotData.scene.rotation);
    	} else {
    		this.setRotation([0,0,0]);
    	}
    }

	// Center and rotate the scene
    scene.resetTransformation();

    // Return the populated scene
    return(scene);

}


function scene_to_triangles(scene, camera){
    
    scene.updateMatrixWorld();
    scene.showhideDynamics( camera );
    var scene_data = [];

    scene.traverseVisible(function(object){

    	if(object.isMesh){
            
			var geo = object.geometry.clone();
			var mat = object.material;


			if(geo.isBufferGeometry){
			    geo = new THREE.Geometry().fromBufferGeometry(geo);
			}
			
			geo.applyMatrix(object.matrixWorld);

			var objdata = {
				vertices : [],
				faces    : [],
				colors   : [],
				mat      : []
			}
            
			for(var i=0; i<geo.vertices.length; i++){
				objdata.vertices.push(geo.vertices[i].toArray());
			}

			for(var i=0; i<geo.faces.length; i++){
				objdata.faces.push([
					geo.faces[i].a,
					geo.faces[i].b,
					geo.faces[i].c
				]);
			}
            
			objdata.colors.push("#"+mat.color.getHexString());
			objdata.mat.push(mat.mat);
			if(objdata.faces.length > 0){
			    scene_data.push(objdata);
			}

    	}

    });

    return(scene_data);

}


