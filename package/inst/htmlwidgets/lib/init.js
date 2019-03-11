
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

    // Bind event listeners
    bind_events(viewport);

    // Generate the scene from the plot data
    addRenderer(viewport, plotData);
    addScene(viewport,    plotData);
    addCamera(viewport,   plotData);

    // Set camera limits
    if(plotData.camera){
        if(plotData.camera.min_zoom){
            viewport.camera.min_zoom = plotData.camera.min_zoom;
        }
        if(plotData.camera.max_zoom){
            viewport.camera.max_zoom = plotData.camera.max_zoom;
        }
    }

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
    
    // Run any resize functions
    for(var i=0; i<viewport.onResize.length; i++){
        viewport.onResize[i]();
    }

    // Animate the scene
    viewport.render();
    viewport.scene.render = function(){
        viewport.render()
    };
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

    // Create legend
    if(plotData.legend){
      addLegend(viewport, plotData);  
    }

}

