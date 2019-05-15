
R3JS.Viewer.prototype.load = function(plotData){

    // Set scene lims and aspect
    this.scene.setLims(plotData.lims);
    this.scene.setAspect(plotData.aspect);
	
    // Add positional light
    var light       = new THREE.DirectionalLight(0xe0e0e0);
    light.position.set(-1,1,1).normalize();
    light.intensity = 1.0;
    this.scene.scene.add( light );
    
    // Position camera
    this.camera.setZoom(5);

    // Populate the plot
    this.scene.populatePlot(plotData);

    // Show hide dynamics
    this.scene.showhideDynamics(this.camera.camera);

    // console.log(plotData.plot[plotData.plot.length-1]);
    
    // var sphere1 = new R3JS.objects.sphere({
    //     radius : 0.1
    // });
    // sphere1.setPosition([0,-0.1,-0.1]);
    // this.scene.add(sphere1.object);

    // var sphere2 = new R3JS.objects.sphere({
    //     radius : 0.1
    // });
    // sphere2.setPosition([0,0.3,0.3]);
    // this.scene.add(sphere2.object);

    


    // this.camera.camera.position.z = 5;

	// // Bind plot data
 //    this.plotData = plotData;

 //    // Generate the scene from the plot data
 //    addRenderer(this.viewport, plotData);
 //    addCamera(this.viewport,   plotData);
 //    addScene(this.viewport,    plotData);

 //    this.viewport.scene.render = function(){
 //        this.render();
 //    };

 //    // Add toggles
	// addToggles(this.viewport);


 //    if(!plotData.scene.zoom){ plotData.scene.zoom = [1] }
 //    this.viewport.camera.defaultZoom = plotData.scene.zoom[0];

 //    // Set camera limits
 //    if(plotData.camera){
 //        if(plotData.camera.min_zoom){
 //            this.viewport.camera.min_zoom = plotData.camera.min_zoom;
 //        }
 //        if(plotData.camera.max_zoom){
 //            this.viewport.camera.max_zoom = plotData.camera.max_zoom;
 //        }
 //    }

 //    // Rotate scene
 //    if(plotData.scene.rotation){
 //      this.scene.setRotationDegrees(plotData.scene.rotation);
 //    }
 //    if(plotData.scene.translation){
 //      this.scene.setTranslation(plotData.scene.translation);
 //    }

 //    // Zoom scene
 //    if(plotData.scene.zoom){
 //      this.viewport.camera.setZoom(plotData.scene.zoom[0]);
 //    } else {
 //      this.viewport.camera.setDistance();
 //      plotData.scene.zoom = [this.camera.getZoom()];
 //    }

 //    // Update visibility of dynamic components
 //    this.viewport.scene.showhideDynamics( this.viewport.camera );

 //    // Run any resize functions
 //    for(var i=0; i<this.viewport.onResize.length; i++){
 //        this.viewport.onResize[i]();
 //    }

}

