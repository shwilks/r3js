
function addRenderer(viewport, plotData){

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

    // Add label renderer if needed
    if(plotData.label_renderer){
        labelRenderer = new THREE.CSS2DRenderer();
        labelRenderer.setSize( viewport.offsetWidth, viewport.offsetHeight);
        viewport.labelRenderer = labelRenderer;
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0';
        labelRenderer.domElement.style.pointerEvents = 'none';
        viewport.appendChild(labelRenderer.domElement);
        viewport.render = function(){
            this.renderer.render( this.scene, this.camera );
            labelRenderer.render( this.scene, this.camera );
        }
    }

}

