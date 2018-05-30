
function r3js(container, plotData, settings){

    // Set option variables
    var light_power = 1.0;

    // Clear container and style it
    container.innerHTML = null;

    // Create overall container
    var viewer = document.createElement( 'div' );
    viewer.style.width = "100%";
    viewer.style.height = "100%";
    viewer.style.position = "relative";
    viewer.container = container;
    container.appendChild(viewer);

    // Create viewport
    var viewport = document.createElement( 'div' );
    viewport.className += " r3js-viewport";
    viewport.style.width = "100%";
    viewport.style.height = "100%";
    viewport.style.position = "relative";
    viewport.container = container;

    var viewport_holder = document.createElement( 'div' );
    viewport_holder.style.position = "absolute";
    viewport_holder.style.top    = 0;
    viewport_holder.style.bottom = 0;
    viewport_holder.style.left   = 0;
    viewport_holder.style.right  = 0;
    viewport_holder.style.border = '6px solid #eeeeee';
    viewport_holder.style.boxSizing = "border-box";
    viewport_holder.style.display = "inline-block";
    viewport_holder.appendChild( viewport );
    viewer.appendChild( viewport_holder );
    viewport.viewport_holder = viewport_holder;
    viewer.viewport_holder = viewport_holder;
    viewer.viewport = viewport;

    // Create selection info div
    var selection_info_div = document.createElement( 'div' );
    selection_info_div.style.position = "absolute";
    selection_info_div.style.bottom = "4px";
    selection_info_div.style.right = "4px";
    selection_info_div.style.padding = "4px";
    selection_info_div.style.background = "#ffffff";
    selection_info_div.style.fontFamily = "sans-serif";
    selection_info_div.style.fontSize = "80%";
    selection_info_div.style.display = "none";
    viewport.appendChild( selection_info_div );
    viewport.selectionInfoDiv = selection_info_div;

    // Setup the scene and subscenes
    var scene = new THREE.Scene();
    var plotHolder = new THREE.Object3D();
    var plotPoints = new THREE.Object3D();
    plotHolder.add(plotPoints);
    scene.add(plotHolder);

    // Set scene background color
    scene.background = new THREE.Color("#ffffff");

    // Add container variables
    viewport.viewer = viewer;
    viewport.scene = scene;
    viewport.plotPoints = plotPoints;
    viewport.plotHolder = plotHolder;
    viewport.mouse = new THREE.Vector2();
    viewport.mouse.down = false;
    viewport.mouse.over = false;
    viewport.touch = {num:0};
    viewport.intersected = null;
    viewport.dragmode = false;
    viewport.plotData = plotData;
    viewport.labels = [];
    viewport.axes = [];
    viewport.toggles = {names:[], objects:[]};
    viewport.damper = {};
    viewport.dynamic_objects = [];
    viewport.animate = false;

    // Create point arrays
    var selectable_objects = [];
    viewport.selectable_objects = selectable_objects;

    // // Add buttons
    addButtons(viewport);

    // Add ambient light
    var ambient_light = new THREE.AmbientLight( 0x404040 );
    scene.add( ambient_light );

    // Position light
    var light = new THREE.DirectionalLight(0xe0e0e0);
    light.position.set(-1,1,1).normalize();
    light.intensity = light_power;
    viewport.light = light;
    scene.add( light );

    // Add WebGL renderer
    var renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.localClippingEnabled = true;
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( viewport.offsetWidth, viewport.offsetHeight);
    viewport.renderer = renderer;
    viewport.appendChild(renderer.domElement);
    viewport.render = function(){
      this.renderer.render( this.scene, this.camera );
    }

	// Add camera
    addCamera(viewport, 3);

    // Add rotation listener
    add_rotation_listener(viewport);

    // Add axes
    if(plotData.axes){
        for(var i=0; i<plotData.axes.length; i++){
            add_axis(viewport, plotData.axes[i]);
        }
    }

    // Add the clipping planes
    viewport.clippingPlanes = [
        new THREE.Plane( new THREE.Vector3( 1, 0, 0 ),  plotData.aspect[0]/2 ),
        new THREE.Plane( new THREE.Vector3( -1, 0, 0 ), plotData.aspect[0]/2 ),
        new THREE.Plane( new THREE.Vector3( 0, 1, 0 ),  plotData.aspect[1]/2 ),
        new THREE.Plane( new THREE.Vector3( 0, -1, 0 ), plotData.aspect[1]/2 ),
        new THREE.Plane( new THREE.Vector3( 0, 0, 1 ),  plotData.aspect[2]/2 ),
        new THREE.Plane( new THREE.Vector3( 0, 0, -1 ), plotData.aspect[2]/2 )
    ];

    // Populate the plot with plot objects
    populatePlot(viewport, plotData);
    
    // Create toggles
    var toggle_holder = document.createElement("div");
    toggle_holder.style.position = "absolute";
    toggle_holder.style.top      = "8px";
    toggle_holder.style.left     = "8px";
    toggle_holder.style.fontFamily = "sans-serif";
    viewport.appendChild(toggle_holder);
    
    for(var i=0; i<viewport.toggles.names.length; i++){
        var toggle = document.createElement("div");
        toggle.innerHTML = viewport.toggles.names[i];
        toggle.classList.add('not-selectable');
        toggle.style.fontSize = "80%";
        toggle.style.margin = "8px";
        toggle.style.marginBottom = "12px";
        toggle.style.padding = "10px";
        toggle.style.borderRadius = "4px";
        toggle.style.cursor = "default";
        toggle.objects = viewport.toggles.objects[i];
        toggle_holder.appendChild(toggle);

        // Add toggle functions
        toggle.on = false;
        toggleBtn = function(){
            // Toggle button
            this.on = !this.on;

            // Hide/show objects
            for(var i=0; i<this.objects.length; i++){
                this.objects[i].visible = this.on;
            }

            // Style button
            if(this.on){
                this.style.background = "#eeeeee";
                this.style.color    = "#444444";
            } else {
                this.style.background = "#f6f6f6";
                this.style.color    = "#cccccc";
            }
        }
        toggle.toggleBtn = toggleBtn;
        
        // Add the click event listener
        toggle.addEventListener("mouseup", toggleBtn);
        toggle.addEventListener("touchend", toggleBtn);
        toggle.toggleBtn();
        
    }

    // Create legend
    if(plotData.legend){
      addLegend(viewport);  
    }

    // Bind event listeners
    bind_events(viewport);

	// Bind navigation functions
	bind_navigation(viewport, 3);

    // Bind point movement functions
    bind_point_movement(viewport);

	// Add raycaster and function
    var raycaster = new THREE.Raycaster();
	function raytrace() {

		// Do raystracing and find intersections
		raycaster.setFromCamera( viewport.mouse, viewport.camera );
        
        var intersects  = raycaster.intersectObjects( selectable_objects, false );
        if(viewport.keydown && viewport.keydown.key == "Shift"){
            var intersected = intersects;
        } else {
            var intersected = intersects.slice(0,1);
        }

		// Check if you have any intersections
		if ( intersects.length > 0 ) {

		  // Check if you've scrolled onto a new point
		  if ( viewport.intersected != intersected) {

		    // Restore emission to previously intersected point if not null
		    if (viewport.intersected){
		      dehover_intersects(viewport.intersected);
		    }

		    // Update intersected
		    viewport.intersected = intersected;

		    // Color new point accordingly
		    hover_intersects(viewport.intersected);
		  }
		} else {
		  if (viewport.intersected) {
		    dehover_intersects(viewport.intersected);
		  }
		  viewport.intersected = null;
		}


	}

    
    // Position the scene
    viewport.positionScene();
    viewport.camera.center();


    // Apply viewer settings
    if(settings){

        if(settings.rotation){
            // Rotate the scene
            // rotateLocalAxes(viewport, new THREE.Vector3(1,0,0), Math.PI*(settings.rotation[0]/180));
            // rotateLocalAxes(viewport, new THREE.Vector3(0,1,0), Math.PI*(settings.rotation[1]/180));
            // rotateLocalAxes(viewport, new THREE.Vector3(0,0,1), Math.PI*(settings.rotation[2]/180));
            var euler_rot = new THREE.Euler(
                settings.rotation[0]/180,
                settings.rotation[1]/180,
                settings.rotation[2]/180,
                'XYZ'
            )
            viewport.plotHolder.setRotationFromEuler(euler_rot);
            update_labels(viewport);
            viewport.plotHolder.rotation.onChangeCallback();
        }

        // Zoom the scene
        if(settings.zoom){
            viewport.camera.position.z = viewport.camera.position.z*settings.zoom;
        }

        // Pan the scene
        if(settings.translation){
            plotPoints.position.x += settings.translation[0];
            plotPoints.position.y += settings.translation[1];
            plotPoints.position.z += settings.translation[2];
            plotPoints.updateMatrixWorld();
        }

        if(settings.show_rotation){
            viewport.transform.style.display = "block";
        }

    }


    // Animate the scene
    function animate() {
        
        if(viewport.mouse.over || viewport.animate){
            if(!viewport.mouse.down){
                raytrace();
            }
            viewport.render();
        }
        requestAnimationFrame(animate);

    }


    // Call the rotation event listener
    viewport.plotHolder.rotation.onChangeCallback();

    // Start the animation
    viewport.animate = animate;
    viewport.render();
    animate();

    var rotnum = 0;
    function rotate_axes(){
        rotnum++;
        rotateLocalAxes(viewport, new THREE.Vector3(1,0,0), Math.PI*(0.25/180));
        saveImg(viewport);
    }
    
    //setInterval(function(){ rotate_axes(); }, 10);
    // for(var i=0; i<(360*4-1); i++){
    //     rotate_axes();
    // }
    

}

