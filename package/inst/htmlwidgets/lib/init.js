
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

    // Create point arrays
    var selectable_objects = [];

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

    // Plot points
    function addPlotObject(plotobj){
        if(plotobj.type == "group"){
            var group_objects = [];
            for(var i=0; i<plotobj.plot.length; i++){
                var obj = addPlotObject(plotobj.plot[i]);
                group_objects.push(obj);
                obj.group = group_objects;
            }
        } else {

            // Set defaults for interactivity
            if(typeof plotobj.properties.interactive === "undefined"){
                plotobj.properties.interactive = plotobj.properties.label 
                                                 || plotobj.highlight;
            }
            
            // Generate the plot object
            if(!plotobj.properties.dimensions){
                plotobj.properties.dimensions = 3
            }
            plotobj.lims     = plotData.lims;
            plotobj.aspect   = plotData.aspect;
            plotobj.viewport = viewport;
            var object = make_object(plotobj);

            // Add interactivity
            if(plotobj.properties.interactive){
                selectable_objects.push(object);
            }

            // Add highlighted point
            if(plotobj.highlight){
                var hlobj = plotobj.highlight;

                // Generate the plot object
                if(!hlobj.properties.dimensions){
                    hlobj.properties.dimensions = 3
                }
                hlobj.lims     = plotData.lims;
                hlobj.aspect   = plotData.aspect;
                hlobj.viewport = viewport;
                var highlight = make_object(hlobj);

                // Link plot and highlight objects
                highlight.visible = false;
                object.highlight = highlight;
                plotPoints.add(highlight);

            }

            // Work out toggle behaviour
            if(plotobj.properties.toggle){
                var toggle = plotobj.properties.toggle;
                var tog_index = viewport.toggles.names.indexOf(toggle);
                if(tog_index == -1){
                    viewport.toggles.names.push(toggle);
                    viewport.toggles.objects.push([object]);
                } else {
                    viewport.toggles.objects[tog_index].push(object);
                }
            }
            
            // Add label info
            if(plotobj.properties.label){
                object.label = plotobj.properties.label;
            }

            // Work out if object is dynamically associated with a face
            if(plotobj.properties.faces){
                viewport.dynamic_objects.push(object);
                if(plotobj.properties.faces.indexOf("x+") != -1){ viewport.dynamicDeco.faces[0].push(object) }
                if(plotobj.properties.faces.indexOf("y+") != -1){ viewport.dynamicDeco.faces[1].push(object) }
                if(plotobj.properties.faces.indexOf("z+") != -1){ viewport.dynamicDeco.faces[2].push(object) }
                if(plotobj.properties.faces.indexOf("x-") != -1){ viewport.dynamicDeco.faces[3].push(object) }
                if(plotobj.properties.faces.indexOf("y-") != -1){ viewport.dynamicDeco.faces[4].push(object) }
                if(plotobj.properties.faces.indexOf("z-") != -1){ viewport.dynamicDeco.faces[5].push(object) }
            }

            // Add the object to the plot
            object.viewport = viewport;
            plotPoints.add(object);

            // Return the object
            return(object);
        }
    }

    // Cycle through data and add points
    if(plotData.plot){
        for(var i=0; i<plotData.plot.length; i++){
            addPlotObject(plotData.plot[i]);
        }
    }
    
    // Create toggles
    var toggle_holder = document.createElement("div");
    toggle_holder.style.position = "absolute";
    toggle_holder.style.top      = "8px";
    toggle_holder.style.right    = "8px";
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

    // Add some general event listeners
    window.addEventListener("resize", function(){ 
    	viewport.camera.resize();
    });

    // Function to get mouse position
    function getMousePos(event, container){
        var offsets = container.getBoundingClientRect();
        var top     = offsets.top;
        var left    = offsets.left;
        var mouseX  = ( (event.clientX-left) / container.offsetWidth ) * 2 - 1;
        var mouseY  = -( (event.clientY-top) / container.offsetHeight ) * 2 + 1;
        return({
            x:mouseX,
            y:mouseY
        });
    }

    // Add a mouse move event listener
    function viewportMouseMove(event) {
        var mouse = getMousePos(event, this);
		this.mouse.deltaX = mouse.x - this.mouse.x;
		this.mouse.deltaY = mouse.y - this.mouse.y;
		this.mouse.x = mouse.x;
		this.mouse.y = mouse.y;
	}
	viewport.addEventListener("mousemove", viewportMouseMove);

    // Add a touch move event listener
    function viewportTouchMove(event) {
        event.preventDefault();

        // // Make a fake additional touch for testing
        // event = {touches:[
        //     {clientX : event.touches[0].clientX,
        //      clientY : event.touches[0].clientY},
        //     {clientX : 530,
        //      clientY : 630}
        // ]};
        
        var mouse = getMousePos(event.touches[0], this);
        this.mouse.deltaX = mouse.x - this.mouse.x;
        this.mouse.deltaY = mouse.y - this.mouse.y;
        this.mouse.x = mouse.x;
        this.mouse.y = mouse.y;
        
        if(this.touch.num > 1){
            
            // this.mouse.scrollX = -20*this.mouse.deltaX;
            // this.mouse.scrollY = -20*this.mouse.deltaY;
            for(var i=0; i<event.touches.length; i++){
                var touch = getMousePos(event.touches[i], this);
                this.touch.touches[i].last_x = this.touch.touches[i].x;
                this.touch.touches[i].last_y = this.touch.touches[i].y;
                this.touch.touches[i].x = touch.x;
                this.touch.touches[i].y = touch.y;
                this.touch.touches[i].deltaX = this.touch.touches[i].last_x - this.touch.touches[i].x;
                this.touch.touches[i].deltaY = this.touch.touches[i].last_y - this.touch.touches[i].y;
            }
            var dist1 = Math.sqrt(
                Math.pow(this.touch.touches[0].last_x - this.touch.touches[1].last_x, 2) +
                Math.pow(this.touch.touches[0].last_y - this.touch.touches[1].last_y, 2)
            );
            var dist2 = Math.sqrt(
                Math.pow(this.touch.touches[0].x - this.touch.touches[1].x, 2) +
                Math.pow(this.touch.touches[0].y - this.touch.touches[1].y, 2)
            );
            // this.mouse.scrollX = -20*this.mouse.deltaX;
            this.mouse.scrollY = (dist2 - dist1)*20;
        }
    }
    viewport.addEventListener("touchmove", viewportTouchMove);

	// Add mouse down and up listeners
    function viewportMouseDown(event) {
    	//event.preventDefault();
    	document.activeElement.blur();
        this.mouse.down  = true;
        this.mouse.event = event;
	}
	function viewportMouseUp(event) {
		this.mouse.down  = false;
        this.mouse.event = event;
	}

    function viewportTouchDown(event) {
        event.preventDefault();
        document.activeElement.blur();

        // // Make a fake additional touch for testing
        // event = {touches:[
        //     {clientX : event.touches[0].clientX,
        //      clientY : event.touches[0].clientY},
        //     {clientX : 530,
        //      clientY : 630}
        // ]};

        this.touch.num = event.touches.length;
        if(event.touches.length == 1){
            var mouse = getMousePos(event.touches[0], this);
            this.mouse.x = mouse.x;
            this.mouse.y = mouse.y;
            this.mouse.down  = true;
            this.mouse.event = event;
            raytrace();
        } else {
            this.mouse.down  = false;
            var touches = [];
            for(var i=0; i<event.touches.length; i++){
              var touch = getMousePos(event.touches[i], this);
              touches.push(touch);
            }
            this.touch.touches = touches;
        }
    }
    function viewportTouchUp(event) {
        this.mouse.down  = false;
        this.mouse.event = event;
        this.touch.num = event.touches.length;
        if(viewport.intersected){
            dehover_intersects(viewport.intersected);
            viewport.intersected = null;
        }
    }

	function viewportContextMenu(event){
		this.mouse.down = false;
	}
	viewport.addEventListener("mouseup",     viewportMouseUp);
	viewport.addEventListener("mousedown",   viewportMouseDown);
    viewport.addEventListener("touchend",    viewportTouchUp);
    viewport.addEventListener("touchstart",  viewportTouchDown);
	viewport.addEventListener('contextmenu', viewportContextMenu);

  // Add mouse over mouse out listeners
  function viewportMouseOver() {
      this.mouse.over = true;
  }
  function viewportMouseOut() {
      this.mouse.over = false;
      this.mouse.down = false;
      if(viewport.intersected){
        dehover_point(viewport.intersected);
        viewport.intersected = null;
      }
      viewport.render();
  }

    viewport.addEventListener("mouseover", viewportMouseOver);
	viewport.addEventListener("mouseout", viewportMouseOut);

	// Add a mouse scroll event listener
	function viewportMouseScroll(event){
		event.preventDefault();
		this.mouse.scrollX = dampScroll(event.deltaX);
		this.mouse.scrollY = dampScroll(event.deltaY);
	}
	viewport.addEventListener("wheel", viewportMouseScroll);

    // Add key down event listeners
    function windowKeyDown(event){
    	viewport.keydown = event;
    	if(viewport.keydown.key == "Meta"){
            viewport.style.cursor = "all-scroll";
            viewport.dragmode = true;
    	}
    }
    function windowKeyUp(event){
    	viewport.keydown = null;
    	viewport.style.cursor = "default";
    	viewport.dragmode = false;
    }
    document.addEventListener("keydown", windowKeyDown);
    document.addEventListener("keyup",   windowKeyUp);

    // Window focus event listener
    function windowBlur(){
    	windowKeyUp();
    	viewport.mouse.down = false;
    	viewport.style.cursor = "default";
    }
    window.addEventListener("blur", windowBlur);

	// Bind navigation functions
	bind_navigation(viewport, 3);

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

        // Rotate the scene
        rotateLocalAxes(viewport, new THREE.Vector3(1,0,0), Math.PI*(settings.rotation[0]/180));
        rotateLocalAxes(viewport, new THREE.Vector3(0,1,0), Math.PI*(settings.rotation[1]/180));
        rotateLocalAxes(viewport, new THREE.Vector3(0,0,1), Math.PI*(settings.rotation[2]/180));
        update_labels(viewport);
        viewport.plotHolder.rotation.onChangeCallback();

        // Zoom the scene
        viewport.camera.position.z = viewport.camera.position.z*settings.zoom;

        // Pan the scene
        plotPoints.position.x += settings.translation[0];
        plotPoints.position.y += settings.translation[1];
        plotPoints.position.z += settings.translation[2];
        plotPoints.updateMatrixWorld();

        if(settings.show_rotation){
            viewport.transform.style.display = "block";
        }

    }


    // Animate the scene
    function animate() {
        
        if(viewport.mouse.over && !viewport.mouse.down){
            raytrace();
        }
        viewport.render();
        viewport.animationFrame = requestAnimationFrame(animate);
    }


    // Call the rotation event listener
    viewport.plotHolder.rotation.onChangeCallback();

    // Start the animation
    viewport.animate = animate;
    viewport.render();
    animate();

}

