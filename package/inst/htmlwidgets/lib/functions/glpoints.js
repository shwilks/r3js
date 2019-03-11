

function make_glpoint(object){

    // Set default dimensionality
    if(!object.properties.dimensions){
        object.properties.dimensions = 2;
    }

	// Get coordinates
	var coords = object.position;

	// Normalise coords
	if(object.normalise){
		for(var i=0; i<coords.length; i++){
            coords[i] = normalise_coords(coords[i],
                                         object.lims,
                                         object.aspect);
		}
    }
    
    // Plot map data
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
        if(object.shape[i].charAt(0) == "o"){ 

            fillColor[i*4+3] = 0;
            
            outlineColor[i*4]   = object.properties.color[0][i];
            outlineColor[i*4+1] = object.properties.color[1][i];
            outlineColor[i*4+2] = object.properties.color[2][i];
            outlineColor[i*4+3] = 1;

        } else {
            
            outlineColor[i*4+3] = 0;

            fillColor[i*4]   = object.properties.color[0][i];
            fillColor[i*4+1] = object.properties.color[1][i];
            fillColor[i*4+2] = object.properties.color[2][i];
            fillColor[i*4+3] = 1;
            fillAlpha[i] = object.properties.opacity;

        }
        
        // Set shape
        if(object.shape[i] == "circle")   { shape[i] = 0 }
        if(object.shape[i] == "ocircle")  { shape[i] = 0 }
        if(object.shape[i] == "square")   { shape[i] = 1 }
        if(object.shape[i] == "osquare")  { shape[i] = 1 }
        if(object.shape[i] == "triangle") { shape[i] = 2 }
        if(object.shape[i] == "otriangle"){ shape[i] = 2 }

        outlineWidth[i] = 1;
        sizes[i]   = object.size[i];
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
    
    var texture = get_sprite_texture("ball");

    var viewport_size = viewport.renderer.getSize();
    
    if(object.properties.dimensions == 3){
        var material = new THREE.ShaderMaterial( { 
            uniforms: { 
                scale:   { value: 2.0*window.devicePixelRatio }, 
                opacity: { value: 1.0 }, 
                viewportWidth: { value: viewport_size.width }, 
                viewportHeight: { value: viewport_size.height },
                viewportPixelRatio: { value: viewport.renderer.getPixelRatio() },
                circleTexture: { value: texture }
            }, 
            vertexShader:   get_vertex_shader3D(),
            fragmentShader: get_fragment_shader3D(),
            alphaTest: 0.9,
            transparent: true,
            blending: THREE.NormalBlending
        } );
    } else {
        var material = new THREE.ShaderMaterial( { 
            uniforms: { 
                scale:   { value: 2.0*window.devicePixelRatio }, 
                opacity: { value: 1.0 }, 
                viewportWidth: { value: viewport_size.width }, 
                viewportHeight: { value: viewport_size.height },
                viewportPixelRatio: { value: viewport.renderer.getPixelRatio() }
            }, 
            vertexShader:   get_vertex_shader3D(),
            fragmentShader: get_fragment_shader2D(),
            alphaTest: 0.9,
            transparent: true,
            blending: THREE.NormalBlending
        } );
    }

    // Generate the points
    var points = new THREE.Points( geometry, material );

    // Add window resize event listeners
    viewport.onResize.push(function(){
        var viewport_size = viewport.renderer.getSize();
        points.material.uniforms.viewportHeight.value     = viewport_size.height;
        points.material.uniforms.viewportWidth.value      = viewport_size.width;
        points.material.uniforms.viewportPixelRatio.value = viewport.renderer.getPixelRatio();
    });

    return(points);

}



