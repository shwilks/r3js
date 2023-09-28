
R3JS.Viewer.prototype.load = function(plotData, settings = {}){

    // Hide the placeholder
    this.viewport.hidePlaceholder();
    this.contentLoaded = true;
    this.settings = settings;
    this.id = settings.ID;
    this.container.id = this.id;

    // Link any other viewers already loaded
    this.linkedviewers = [];
    if (settings.linked !== undefined) {
        this.linkedids = settings.linked;
        for (var i=0; i<this.linkedids.length; i++) {

            let id = this.linkedids[i];
            let linked = document.getElementById(id);
            if (id != this.id && linked && this.linkedviewers.indexOf(linked.viewer) === -1) {
                this.linkedviewers.push(linked.viewer);
            }

        }
    }

    // Set plot title
    if (settings.title !== undefined) this.name = settings.title;

    // Set background color
    if (plotData.scene && plotData.scene.background) {
        this.scene.setBackgroundColor({
            r: plotData.scene.background.r[0],
            g: plotData.scene.background.g[0],
            b: plotData.scene.background.b[0]
        });
    }

    // Set lims and aspect
    this.setPlotDims({
        lims   : plotData.lims,
        aspect : plotData.aspect,
        dimensions : 3
    });

    // Clear the plot
    this.scene.empty();

    // Populate the plot
    this.scene.populatePlot(plotData);

    // Link elements to the viewer
    this.scene.elements.map(element => {
        element.viewer = this;
    });

    // Add any toggles
    this.addToggles();

    // Lights
    this.scene.clearLights();

    if(!plotData.light){

        // Default lighting
        this.scene.addLight({
            position: [-1,1,1],
            lighttype: "directional"
        });

    } else {

        // Add specified lighting
        for(var i=0; i<plotData.light.length; i++){

            this.scene.addLight(plotData.light[i]);

        }

    }

    // Reset transformation
    this.resetTransformation();

    // Fire any resize event listeners
    this.viewport.onwindowresize();

    // Render the plot
    if(plotData.scene){
        if(plotData.scene.translation) this.scene.setTranslation(plotData.scene.translation)
        if(plotData.scene.rotation)    this.scene.setRotation(plotData.scene.rotation)
        if(plotData.scene.zoom)        this.camera.setZoom(plotData.scene.zoom)
    }

    this.render();

    // Add a plot loaded event
    window.addEventListener('r3jsPlotLoaded', e => {
        if (e.detail.id != this.id && this.linkedids.indexOf(e.detail.id) !== -1 && this.linkedviewers.indexOf(e.detail) === -1) {
            this.linkedviewers.push(e.detail);
        }
    });

    // Dispatch a plot loaded event
    window.dispatchEvent(
        new CustomEvent('r3jsPlotLoaded', { detail : this })
    );

}

