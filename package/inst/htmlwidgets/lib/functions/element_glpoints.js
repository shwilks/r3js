
// GL line constructor
R3JS.element.constructors.glpoints = function(
    plotobj,
    scene
    ){

    // Generate the point object
    var glpoints = new R3JS.element.glpoints({
        coords : plotobj.position,
        size : plotobj.size,
        shape : plotobj.shape,
        properties : plotobj.properties,
        dimensions : plotobj.properties.dimensions,
        viewport : scene.viewer.viewport,
        renderer : scene.viewer.renderer,
        camera : scene.viewer.camera
    });

    // var element = glpoints.elements;

    return(glpoints);

}


// Make a thin line object
R3JS.element.glpoints = class GLPoints {

    constructor(args){

        var coords = args.coords;

        // Set variables
        var positions    = new Float32Array( coords.length * 3 );
        var fillColor    = new Float32Array( coords.length * 4 );
        var outlineColor = new Float32Array( coords.length * 4 );
        var outlineWidth = new Float32Array( coords.length );
        var fillAlpha    = new Float32Array( coords.length );
        var sizes        = new Float32Array( coords.length );
        var aspect       = new Float32Array( coords.length );
        var shape        = new Float32Array( coords.length );
        var visible      = new Float32Array( coords.length );

        // Fill in info
        for(var i=0; i<coords.length; i++){

            positions[i*3]   = coords[i][0];
            positions[i*3+1] = coords[i][1];
            positions[i*3+2] = coords[i][2];

            // Set color
            if(args.shape[i].charAt(0) == "o"){ 

                fillColor[i*4+3] = 0;
                
                outlineColor[i*4]   = args.properties.color.r[i];
                outlineColor[i*4+1] = args.properties.color.g[i];
                outlineColor[i*4+2] = args.properties.color.b[i];
                outlineColor[i*4+3] = 1;

                outlineWidth[i] = 4;

            } else {

                fillColor[i*4]   = args.properties.color.r[i];
                fillColor[i*4+1] = args.properties.color.g[i];
                fillColor[i*4+2] = args.properties.color.b[i];
                fillColor[i*4+3] = 1;
                fillAlpha[i]     = args.properties.opacity;

                outlineWidth[i] = 0;

            }
            
            // Set shape
            if(args.shape[i] == "circle")   { shape[i] = 0 }
            if(args.shape[i] == "ocircle")  { shape[i] = 0 }
            if(args.shape[i] == "square")   { shape[i] = 1 }
            if(args.shape[i] == "osquare")  { shape[i] = 1 }
            if(args.shape[i] == "triangle") { shape[i] = 2 }
            if(args.shape[i] == "otriangle"){ shape[i] = 2 }

            sizes[i]   = args.size[i];
            aspect[i]  = 1;
            visible[i] = 1;

        }

        // Create buffer geometry
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position',     new THREE.BufferAttribute( positions,    3 ) );
        geometry.addAttribute( 'fillColor',    new THREE.BufferAttribute( fillColor,    4 ) );
        geometry.addAttribute( 'fillAlpha',    new THREE.BufferAttribute( fillAlpha,    1 ) );
        geometry.addAttribute( 'outlineColor', new THREE.BufferAttribute( outlineColor, 4 ) );
        geometry.addAttribute( 'outlineWidth', new THREE.BufferAttribute( outlineWidth, 1 ) );
        geometry.addAttribute( 'size',         new THREE.BufferAttribute( sizes,        1 ) );
        geometry.addAttribute( 'aspect',       new THREE.BufferAttribute( aspect,       1 ) );
        geometry.addAttribute( 'shape',        new THREE.BufferAttribute( shape,        1 ) );
        geometry.addAttribute( 'visible',      new THREE.BufferAttribute( visible,      1 ) );

        // var texture = get_sprite_texture("ball");

        var vwidth  = args.viewport.getWidth();
        var vheight = args.viewport.getWidth();
        var pixelratio = args.renderer.getPixelRatio();

        // if(args.properties.dimensions == 3){
        //     var material = new THREE.ShaderMaterial( { 
        //         uniforms: { 
        //             scale:   { value: 2.0*pixelratio }, 
        //             opacity: { value: 1.0 }, 
        //             viewportWidth: { value: vwidth }, 
        //             viewportHeight: { value: vheight },
        //             viewportPixelRatio: { value: pixelratio },
        //             circleTexture: { value: texture }
        //         }, 
        //         vertexShader:   get_vertex_shader3D(),
        //         fragmentShader: get_fragment_shader3D(),
        //         alphaTest: 0.9,
        //         transparent: true,
        //         blending: THREE.NormalBlending
        //     } );
        // } else {
            var material = new THREE.ShaderMaterial( { 
                uniforms: { 
                    scale:   { value: 1.0 }, 
                    opacity: { value: 1.0 }, 
                    viewportWidth: { value: vwidth }, 
                    viewportHeight: { value: vheight },
                    viewportPixelRatio: { value: pixelratio }
                }, 
                vertexShader:   args.renderer.shaders.vertexShader,
                fragmentShader: args.renderer.shaders.fragmentShader,
                alphaTest: 0.9,
                transparent: true,
                blending: THREE.NormalBlending
            } );
        // }

        // Generate the points
        var points = new THREE.Points( geometry, material );
        this.object = points;

        // Add a resize event listener to the viewport
        args.viewport.onresize.push(
            function(){
                points.material.uniforms.viewportWidth.value = args.viewport.getWidth();
                points.material.uniforms.viewportHeight.value  = args.viewport.getHeight();
                points.material.uniforms.viewportPixelRatio.value = args.renderer.getPixelRatio();
            }
        );

        // args.camera.zoom_events.push(
        //     function(){
        //         points.material.uniforms.scale.value = 1 / args.camera.distance;
        //     }
        // );

        // Make individual elements
        this.ielements = [];
        for(var i=0; i<coords.length; i++){
            this.ielements.push(
                new R3JS.element.glpoint(
                    this.object,
                    i,
                    {
                        size  : args.size[i],
                        shape : args.shape[i]
                    }
                )
            );
        }


    }

    elements(){
        return(this.ielements);
    }

}


// Make a thin line object
R3JS.element.glpoint = class GLPoint extends R3JS.element.base {

    constructor(
            pointobj,
            index,
            args
        ){

        super();
        this.pointobj = pointobj;
        this.index = index;
        this.uuid = pointobj.uuid+"-"+index;
        this.object = this;
        this.element = this;
        this.size  = args.size;
        this.shape = args.shape;

        var pointobjcoords = this.pointobj.geometry.attributes.position.array;
        this.coords = [
            pointobjcoords[this.index*3],
            pointobjcoords[this.index*3+1],
            pointobjcoords[this.index*3+2]
        ];

    }

    // Method to set color
    setColor(color){

        color = new THREE.Color(color);        
        var fillCols = this.pointobj.geometry.attributes.fillColor.array;
        this.pointobj.geometry.attributes.fillColor.needsUpdate = true;
        fillCols[this.index*4]   = color.r;
        fillCols[this.index*4+1] = color.g;
        fillCols[this.index*4+2] = color.b;

    }

    // Method for raycasting to this point
    raycast(raycaster, intersects){
        
        // 2D
        // Fetch ray and project into camera space [-1, 1] for x and y
        var ray = raycaster.ray.origin.clone().project(raycaster.camera);
        
        // Project coords into camera space [-1, 1] for x and y
        var coords = new THREE.Vector3()
                              .fromArray(this.coords)
                              .applyMatrix4(this.pointobj.matrixWorld)
                              .project(raycaster.camera);


        // // Project coords into camera space [-1, 1] for x and y
        // var coords = new THREE.Vector3()
        //                       .fromArray(this.coords)
        //                       .applyMatrix4(this.pointobj.matrixWorld)
        //                       .project(raycaster.camera);

        // // 3D
        // var ray = raycaster.ray.direction.clone().project(raycaster.camera);
        
        // Correct distance for viewport aspect
        var aspect = raycaster.aspect;
        coords.x   = coords.x/aspect;
        ray.x      = ray.x/aspect;

        // Work out point radius
        var size       = this.size;
        var uniscale   = this.pointobj.material.uniforms.scale.value;
        var pixelratio = this.pointobj.material.uniforms.viewportPixelRatio.value;
        var ptRadius   = 0.03*size*uniscale;

        // Work out whether the point is intersected or not
        var ptIntersected;
        if(this.shape == "square" || this.shape == "osquare"){
            ptIntersected = ray.x < coords.x + ptRadius
                            && ray.x > coords.x - ptRadius
                            && ray.y < coords.y + ptRadius
                            && ray.y > coords.y - ptRadius
        } else {
            var dist2point = Math.sqrt(
                (coords.x - ray.x)*(coords.x - ray.x)
                + (coords.y - ray.y)*(coords.y - ray.y)
            );
            ptIntersected = dist2point < ptRadius;
        }

        // If intersected then add to intersects
        if(ptIntersected){
            intersects.push(this);
        }
        
    }

}









