
// Setup object
R3JS = {};
R3JS.utils = {};
R3JS.Viewer = class R3JSviewer {

    // Constructor function
    constructor(container, plotData, settings){

        // Set the container
        this.container = container;

        // Create viewport
        this.viewport = new R3JS.Viewport(this);
        this.navigation_bind();

        // Create scene
        this.scene = new R3JS.Scene();

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

        // Start animation loop
        this.render();
        var viewer = this;
        function animate() {

            // if(this.scene){
            //     if(this.raytraceNeeded || this.sceneChange){
            //         this.raytraceNeeded = false;
            //         this.raytrace();
            //     }
            //     if(this.animate || this.sceneChange){
            //         this.sceneChange = false;
            //         this.render();
            //     }
            // }
            viewer.render();
            requestAnimationFrame(animate);

        }

        // Start the animation
        animate();

    }

    // Render function
    render(){
        this.renderer.render(
            this.scene.scene, 
            this.camera.camera
        );
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

