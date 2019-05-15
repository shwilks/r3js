
// GL line constructor
R3JS.objects.constructors.glline = function(
    plotobj,
    plotdims
    ){

    // Setup object
    var object

    // Normalise coords
    if(plotdims){
        plotobj.position = R3JS.normalise_coords(
            plotobj.position,
            plotdims
        )
    }

    object = new R3JS.objects.gllines_thin({
        coords : plotobj.position
    });
    // if(plotobj.properties.lwd > 1){
    //     line = make_fatline(object);
    // } else {
    //     line = make_thinline(object);
    // }
    return(object);

}


// Make a thin line object
R3JS.objects.gllines_thin = class GLLines_thin {

    constructor(args){

        var ncoords = args.coords.length;

        // Set default properties
        if(!args.properties){
            args.properties = {
                mat : "line",
                lwd : 1,
                color : [
                    Array(ncoords).fill(0),
                    Array(ncoords).fill(0),
                    Array(ncoords).fill(0)
                ]
            };
        }

        // Set position and color
        var positions = new Float32Array( ncoords * 3 );
        var color     = new Float32Array( ncoords * 4 );
        
        // Fill in info
        for(var i=0; i<args.coords.length; i++){

            positions[i*3]   = args.coords[i][0];
            positions[i*3+1] = args.coords[i][1];
            positions[i*3+2] = args.coords[i][2];

            color[i*4]   = args.properties.color[0][i];
            color[i*4+1] = args.properties.color[1][i];
            color[i*4+2] = args.properties.color[2][i];
            color[i*4+3] = 1;

        }

        // Create buffer geometry
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.addAttribute( 'color',    new THREE.BufferAttribute( color,     4 ) );

        // Create the material
        var material = R3JS.Material(args.properties);
        material.color = new THREE.Color();
        material.vertexColors = THREE.VertexColors;
        material.linewidth = args.properties.lwd;

        // Make the actual line object
        if(args.segments){
            this.object = new THREE.LineSegments( geometry, material );
        } else {
            this.object = new THREE.Line( geometry, material );
        }
        if(args.gapSize){
            this.object.computeLineDistances();
        }

    }

    show(){ this.object.visible = true  }
    hide(){ this.object.visible = false }

}




function make_glline(object){

    var line;
    if(object.properties.lwd > 1){
        line = make_fatline(object);
    } else {
        line = make_thinline(object);
    }
    return(line);

}


function make_thinline(object){

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
    var positions = new Float32Array( coords.length * 3 );
    var color     = new Float32Array( coords.length * 4 );
    
    // Fill in info
    for(var i=0; i<coords.length; i++){

        positions[i*3]   = coords[i][0];
        positions[i*3+1] = coords[i][1];
        positions[i*3+2] = coords[i][2];

        color[i*4]   = object.properties.color[0][i];
        color[i*4+1] = object.properties.color[1][i];
        color[i*4+2] = object.properties.color[2][i];
        color[i*4+3] = 1;

    }

    // Create buffer geometry
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'color',    new THREE.BufferAttribute( color,     4 ) );

    // Create the line material
    var material = get_object_material(object);
    material.color = new THREE.Color();
    material.vertexColors = THREE.VertexColors;
    material.linewidth = object.properties.lwd;

    if(object.segments){
        var lines = new THREE.LineSegments( geometry, material );
    } else {
        var lines = new THREE.Line( geometry, material );
    }
    if(material.gapSize){
        lines.computeLineDistances();
    }

    // Generate the points
    return(lines);

}


function make_fatline(object){

    // Set default dimensionality
    if(!object.properties.dimensions){
        object.properties.dimensions = 3;
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

    // Set colors and positions
    var positions = [];
    var colors    = [];
    for(var i=0; i<coords.length; i++){
        positions.push(
            coords[i][0], 
            coords[i][1], 
            coords[i][2]
        );
        colors.push(
            object.properties.color[0][i], 
            object.properties.color[1][i], 
            object.properties.color[2][i]
        );
    }
    
    // Make geometry
    var geometry = new THREE.LineGeometry();
    geometry.setPositions( positions );
    geometry.setColors( colors );

    // Make material
    var matLine = new THREE.LineMaterial( {
        color: 0xffffff,
        vertexColors: THREE.VertexColors
    } );
    matLine.linewidth = object.properties.lwd;

    if(object.properties.gapSize){
        matLine.dashed    = true;
        matLine.dashScale = 200;
        matLine.dashSize  = object.properties.dashSize;
        matLine.gapSize   = object.properties.gapSize;
        matLine.defines.USE_DASH = "";
    }
    
    
    // Add matline to viewport
    viewport.onResize.push(
        function(){
            var size = viewport.renderer.getSize();
            matLine.resolution.set( size.width, size.height );
        }
    );

    // Make line
    line = new THREE.Line2( geometry, matLine );
    line.computeLineDistances();
    return(line);

}
