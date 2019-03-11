
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