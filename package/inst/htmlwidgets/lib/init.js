
function r3js(container, plotData, settings){

    // Clear container and style it
    container.innerHTML = null;

    // Create overall container
    var viewer = document.createElement( 'div' );
    viewer.id = "viewer";
    viewer.container = container;
    container.appendChild(viewer);

    // Create viewport
    var viewport = generateViewport(plotData, viewer);

    // Generate the scene from the plot data
    addScene(viewport,    plotData);
    addRenderer(viewport, plotData);
    addCamera(viewport,   plotData);


    // Rotate scene
    if(plotData.scene.rotation){
      viewport.scene.setRotationDegrees(plotData.scene.rotation);
    }
    if(plotData.scene.translation){
      viewport.scene.setTranslation(plotData.scene.translation);
    }

    // Zoom scene
    if(plotData.scene.zoom){
      viewport.camera.setZoom(plotData.scene.zoom[0]);
    } else {
      viewport.camera.setDistance();
      plotData.scene.zoom = [viewport.camera.getZoom()];
    }

    // Update visibility of dynamic components
    viewport.scene.showhideDynamics( viewport.camera );
    
    // Bind event listeners
    bind_events(viewport);
    
    // Bind navigation functions
    bind_navigation(viewport);

    // Bind api functions
    bind_api(container, viewport);

    // Bind highlight functions
    bind_highlight_fns(viewport);

    // Bind raytracing
    bind_raytracing(viewport);

    // Add buttons
    addButtons(viewport);

    // Add toggles
    addToggles(viewport);


    // Animate the scene
    viewport.render();
    function animate() {
        
        if(viewport.raytraceNeeded || viewport.sceneChange){
            viewport.raytraceNeeded = false;
            viewport.raytrace();
        }
        if(viewport.animate || viewport.sceneChange){
            viewport.sceneChange = false;
            viewport.render();
        }
        requestAnimationFrame(animate);

    }
    animate();


 //    // Add container variables
 //    viewport.viewer             = viewer;
 //    viewport.scene              = scene;
 //    viewport.plotPoints         = plotPoints;
 //    viewport.plotHolder         = plotHolder;
 //    viewport.intersected        = null;
 //    viewport.dragmode           = false;
 //    viewport.plotData           = plotData;
 //    viewport.labels             = [];
 //    viewport.axes               = [];
 //    viewport.toggles            = {names:[], objects:[]};
 //    viewport.dynamic_objects    = [];
 //    viewport.animate            = false;
 //    viewport.selectable_objects = [];
 //    //viewport.style.backgroundColor = "#"+bg_col.getHexString();


 //    // Add axes
 //    if(plotData.axes){
 //        for(var i=0; i<plotData.axes.length; i++){
 //            add_axis(viewport, plotData.axes[i]);
 //        }
 //    }

 

    // Create legend
    if(plotData.legend){
      addLegend(viewport, plotData);  
    }

 //    // Bind event listeners
 //    bind_events(viewport);

 //    // Bind point movement functions
 //    bind_point_movement(viewport);   

}

