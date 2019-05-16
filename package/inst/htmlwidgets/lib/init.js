
// Setup object
R3JS = {};
R3JS.Viewer = class R3JSviewer {

    // Constructor function
    constructor(container, plotData, settings){

        // Set variables
        this.sceneChange    = false;
        this.raytraceNeeded = false;
        this.name           = "r3js viewer";

        // Set the container
        this.container = container;

        // Create viewport
        this.viewport = new R3JS.Viewport(this);
        this.navigation_bind();

        // Create scene
        this.scene = new R3JS.Scene();
        this.scene.setBackgroundColor({
            r : 1,
            g : 1,
            b : 1
        })

        // Create renderer and append to dom
        this.renderer = new R3JS.Renderer();
        this.renderer.attachToDOM(this.viewport.div);
        this.renderer.setSize(
            this.viewport.width,
            this.viewport.height
        );

        // Create camera
        this.camera = new R3JS.PerspCamera();
        this.camera.setSize(
            this.viewport.width,
            this.viewport.height
        );

        // Add raytracer
        this.raytracer = new R3JS.Raytracer();

        // Start animation loop
        var viewer = this;
        function animate() {

            if(viewer.raytraceNeeded || viewer.sceneChange){
                viewer.raytraceNeeded = false;
                viewer.raytrace();
            }
            if(viewer.sceneChange){
                viewer.sceneChange = false;
                viewer.render();
            }
            requestAnimationFrame(animate);

        }
        animate();

    }

    // Render function
    render(){
        this.renderer.render(
            this.scene, 
            this.camera
        );
    }

    // Raytrace function
    raytrace(){
        this.raytracer.raytrace(
            this,
            this.scene,
            this.camera,
            this.viewport.mouse
        )
    }

    // Rest transformation
    resetTransformation(){
        this.sceneChange = true;
        this.scene.resetTransformation();
        this.camera.setZoom(3);
        this.scene.showhideDynamics(this.camera.camera);
    }

    
    
    // // Set render function
    // this.render = function(){};

    // // Bind event listeners
    // bind_events(this.viewport);

    // // Bind navigation functions
    // bind_navigation(this.viewport);

    // // Bind api functions
    // bind_api(container, this.viewport);

    // // Bind highlight functions
    // bind_highlight_fns(this.viewport);

    // // Bind raytracing
    // bind_raytracing(this.viewport);

    // // Add buttons
    // addButtons(this.viewport);

    // // Animate the scene
    // this.render();
    // function animate() {

    //     if(this.scene){
    //         if(this.raytraceNeeded || this.sceneChange){
    //             this.raytraceNeeded = false;
    //             this.raytrace();
    //         }
    //         if(this.animate || this.sceneChange){
    //             this.sceneChange = false;
    //             this.render();
    //         }
    //     }
    //     requestAnimationFrame(animate);

    // }

    // // Start the animation
    // animate();

    // // Dispatch viewer loaded event
    // var r3jsViewerLoaded_event = new CustomEvent('r3jsViewerLoaded', { detail : viewport });
    // window.dispatchEvent(r3jsViewerLoaded_event);

}

