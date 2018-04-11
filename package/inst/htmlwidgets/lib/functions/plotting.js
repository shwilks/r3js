

function normalise_coord(coord,
                         lims,
                         aspect){
    return(coord - lims[0])*aspect/(lims[1] - lims[0]);
}

function normalise_coords(coords, 
                          lims, 
                          aspect){

    return([
        normalise_coord(coords[0], lims[0], aspect[0]),
        normalise_coord(coords[1], lims[1], aspect[1]),
        normalise_coord(coords[2], lims[2], aspect[2])
    ]);

}

function get_object_material(object){

    // Convert colors
    if(!object.properties.color.isColor){
        object.properties.color = new THREE.Color(object.properties.color.red[0],
                                                  object.properties.color.green[0],
                                                  object.properties.color.blue[0]);
    }

    // Set object material
    if(object.properties.mat == "basic")    { var mat = new THREE.MeshBasicMaterial();   }
    if(object.properties.mat == "lambert")  { var mat = new THREE.MeshLambertMaterial(); }
    if(object.properties.mat == "phong")    { var mat = new THREE.MeshPhongMaterial();   }
    if(object.properties.mat == "line")     { var mat = new THREE.LineBasicMaterial();   }
    if(object.properties.mat == "linemesh") { 
        var mat = new MeshLineMaterial( {
            useMap: false,
            color: object.properties.color,
            resolution: new THREE.Vector2( object.viewport.offsetWidth, 
                                           object.viewport.offsetHeight ),
            sizeAttenuation: !false,
            lineWidth: object.properties.lwd*0.01,
            near: object.viewport.camera.near,
            far: object.viewport.camera.far
        });
    }

    // Set object material properties
    Object.assign(mat, object.properties);
    mat.side = THREE.DoubleSide;

    // Set clipping
    if(!object.properties.xpd){
        mat.clippingPlanes = object.viewport.clippingPlanes;
    }

    return(mat);

}


// Function for plotting an object such as a line or a shape
function make_object(object){

    if(object.type == "point"){
    	var plotobject = make_point(object);
    }
    if(object.type == "line"){
    	var plotobject = make_line(object);
    }
    if(object.type == "arrow"){
    	var plotobject = make_arrow(object);
    }
    if(object.type == "surface"){
    	var plotobject = make_surface(object);
    }
    if(object.type == "grid"){
    	var plotobject = make_grid(object);
    }
    
    return(plotobject);

}

function make_point(object){
    
    // Set object geometry
    var geometries = get_geos(object.properties.dimensions);
    var geo = geometries[object.shape](object);
  	
    // Set object material
    var mat = get_object_material(object);

    // Make object
    var point = new THREE.Mesh(geo, mat);

    // Scale object
    point.scale.set(object.size/10, 
    	            object.size/10, 
    	            object.size/10);

    // Normalise the coords
    if(object.normalise){
        object.position = normalise_coords(object.position,
                                           object.lims,
                                           object.aspect);
    }

    // Position object
    point.position.set(object.position[0],
    	               object.position[1],
    	               object.position[2]);
    if(!point.position.z){
    	point.position.z = 0;
    }

    // Return object
    return(point);

}


function make_lineMeshGeo(from, to, linewidth, dimensions){

    // Get direction and length
    var direction = new THREE.Vector3(to[0]-from[0],
                                      to[1]-from[1],
                                      to[2]-from[2]);
    var line_length = direction.length();

    // Set object geometry
    var geometries = get_geos(dimensions);
    var geo = geometries.line(line_length, linewidth/20);

    // Make translation matrix
    var transmat = new THREE.Matrix4();
    transmat.makeTranslation(to[0], to[1], to[2]);

    // Make rotation matrix
    var axis = new THREE.Vector3(0, 1, 0);
    var quat = new THREE.Quaternion().setFromUnitVectors(axis, direction.clone().normalize());

    var rotmat = new THREE.Matrix4();
    rotmat.makeRotationFromQuaternion(quat);
    
    // Rotate to match direction and position
    geo.applyMatrix(rotmat);
    geo.applyMatrix(transmat);

    return(geo);

}


function line_geo2D(from, to, 
                    lwd, cap, 
                    shrinkage, 
                    offset,
                    arrow){

    var lwd = lwd/2;
    // Get direction and length
    var direction = new THREE.Vector3(to[0]-from[0],
                                      to[1]-from[1],
                                      to[2]-from[2]);
    var length = direction.length();
    if(shrinkage){
        length = length - shrinkage;
    }
    if(arrow){
        length = length - arrow.headlength;
    }

    // Set object geometry
    var geo = new THREE.PlaneGeometry( lwd, length, 1, 1);
    geo.translate( 0, -length/2, 0 );
    if(shrinkage){
        geo.translate( 0, -shrinkage/2, 0 );
    }
    if(offset){
        geo.translate( offset[0], offset[1], offset[2] );
    }
    if(arrow){
        geo.translate( 0, -arrow.headlength, 0 );
        var arrowhead = new THREE.Geometry();
        arrowhead.vertices.push( new THREE.Vector3(arrow.headwidth/2, -arrow.headlength, 0) );
        arrowhead.vertices.push( new THREE.Vector3(-arrow.headwidth/2, -arrow.headlength, 0) );
        arrowhead.vertices.push( new THREE.Vector3(0, 0, 0) );
        arrowhead.faces.push( new THREE.Face3( 0, 2, 1 ) );
        geo.merge(arrowhead);
    }
    
    // Add cap if requested
    if(cap){
        var cap = new THREE.CircleGeometry( lwd/2, 16, 0, Math.PI );
        geo.merge(cap);
        var cap = new THREE.CircleGeometry( lwd/2, 16, Math.PI, Math.PI );
        cap.translate(0,-length,0);
        geo.merge(cap);
    }

    // Make translation matrix
    var transmat = new THREE.Matrix4();
    transmat.makeTranslation(to[0], to[1], to[2]);

    // Make rotation matrix
    var axis = new THREE.Vector3(0, 1, 0);
    var quat = new THREE.Quaternion().setFromUnitVectors(axis, direction.clone().normalize());
    var rotmat = new THREE.Matrix4().makeRotationFromQuaternion(quat);

    // Rotate to match direction and position
    geo.applyMatrix(rotmat);
    geo.applyMatrix(transmat);

    return(geo);

}

function line_geo3D(from, 
                    to, 
                    lwd, 
                    cap, 
                    shrinkage, 
                    offset, 
                    box, 
                    arrow){

    var lwd = lwd/2;

    // Get direction and length
    var direction = new THREE.Vector3(to[0]-from[0],
                                      to[1]-from[1],
                                      to[2]-from[2]);
    var length = direction.length();
    if(arrow){
        length = length - arrow.headlength;
    }
    if(shrinkage){
        length = length - shrinkage;
    }

    // Set object geometry
    if(!box){
        var geo = new THREE.CylinderGeometry( lwd/2, lwd/2, length, 32);
    } else {
        var geo = new THREE.BoxGeometry( lwd, length, lwd );
    }
    geo.translate( 0, (-length/2), 0 );
    if(shrinkage){
        geo.translate( 0, -shrinkage/2, 0 );
    }
    if(offset){
        geo.translate( offset[0], offset[1], offset[2] );
    }
    if(arrow){
        geo.translate( 0, -arrow.headlength, 0 );
        var arrowhead = new THREE.ConeGeometry( arrow.headwidth/2, arrow.headlength, 32 );
        arrowhead.translate(0,-arrow.headlength/2,0);
        geo.merge(arrowhead);
    }
    
    // Add cap if requested
    if(cap){
        var cap = new THREE.SphereGeometry( lwd/2, 16, 16, 0, Math.PI );
        geo.merge(cap);
        var cap = new THREE.SphereGeometry( lwd/2, 16, 16, 0, Math.PI*2, Math.PI, Math.PI );
        cap.translate(0,-length,0);
        geo.merge(cap);
    }

    // Make translation matrix
    var transmat = new THREE.Matrix4();
    transmat.makeTranslation(to[0], to[1], to[2]);

    // Make rotation matrix
    var axis = new THREE.Vector3(0, 1, 0);
    var quat = new THREE.Quaternion().setFromUnitVectors(axis, direction.clone().normalize());
    var rotmat = new THREE.Matrix4().makeRotationFromQuaternion(quat);

    // Rotate to match direction and position
    geo.applyMatrix(rotmat);
    geo.applyMatrix(transmat);

    return(geo);

}


function make_lineMesh(from, to, material, linewidth, dimensions){

    // Get geo
    var geo = make_lineMeshGeo(from, 
                               to, 
                               linewidth, 
                               dimensions);

    // Make line object
    geo = new THREE.BufferGeometry().fromGeometry( geo );
    var line = new THREE.Mesh(geo, material);

    // Return line
    return(line);

}

function make_line(object){

    // Get line coordinates and material
    if(object.normalise){
        var from = normalise_coords(object.position.from, 
                                    object.lims, 
                                    object.aspect);
        var to   = normalise_coords(object.position.to, 
                                    object.lims, 
                                    object.aspect);
    } else {
        var from = object.position.from;
        var to   = object.position.to;
    }
    var material = get_object_material(object);

    // Make the line
    var line = make_lineMesh(from, to, material, object.properties.lwd, object.properties.dimensions);

    // Return line
	return(line);
	
}

function make_lineShader(object){

    var from = normalise_coords(object.position.from, 
                                object.lims, 
                                object.aspect);
    var to   = normalise_coords(object.position.to, 
                                object.lims, 
                                object.aspect);
    
    object.properties.mat = "linemesh";
    var material = get_object_material(object);

    var geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vector3().fromArray(from) );
    geometry.vertices.push( new THREE.Vector3().fromArray(to)   );

    var line = new MeshLine();
    line.setGeometry( geometry );

    var mesh = new THREE.Mesh( line.geometry, material );
    return(mesh);

}

function make_arrow(object){

    // Get direction and length
	var from = object.position.from;
	var to   = object.position.to;
	var direction = new THREE.Vector3(to[0]-from[0],
      	                              to[1]-from[1],
      	                              to[2]-from[2]);
    var line_length = direction.length();

	// Set object geometry
    var geometries = get_geos(object.properties.dimensions, object.properties.lwd);
	var geo = new THREE.Geometry();
	var line_geo = geometries.line(line_length-object.arrowhead_length, object.properties.lwd);
	line_geo.translate(0,-object.arrowhead_length,0);
	var head_geo = geometries.arrow(object.arrowhead_length, object.arrowhead_width);
	geo.merge ( line_geo );
	geo.merge ( head_geo );
	geo = new THREE.BufferGeometry().fromGeometry( geo );

	// Set object material
    var mat = get_object_material(object);

    // Make arrow object
    var arrow = new THREE.Mesh(geo, mat);
	
	// Rotate to match direction and position
	var axis = new THREE.Vector3(0, 1, 0);
	arrow.position.set(to[0], to[1], to[2]);
	arrow.quaternion.setFromUnitVectors(axis, direction.clone().normalize());

    // Return arrow
	return(arrow);       
	
}

function make_grid(object){

    var colors  = Object.assign({}, object.properties.color);
    var mat = get_object_material(object);
    
    var vertex_cols = colors.red.length > 1;
    if(vertex_cols){
        mat.color = new THREE.Color();
        mat.vertexColors = THREE.VertexColors;
    }

    var geo = new THREE.Geometry();
    for(var i=0; i<object.x.length; i++){
        for(var j=0; j<object.x[0].length-1; j++){
            if(!isNaN(object.z[i][j]) && 
               !isNaN(object.z[i][j+1])){
                var coords1 = normalise_coords(
                    [object.x[i][j], object.y[i][j], object.z[i][j]],
                    object.lims,
                    object.aspect
                );
                var coords2 = normalise_coords(
                    [object.x[i][j+1], object.y[i][j+1], object.z[i][j+1]],
                    object.lims,
                    object.aspect
                );
                geo.vertices.push(
                    new THREE.Vector3(
                        coords1[0],
                        coords1[1],
                        coords1[2]
                    ),
                    new THREE.Vector3(
                        coords2[0],
                        coords2[1],
                        coords2[2]
                    )
                );
                if(vertex_cols){
                    var n1 = i*(object.x[0].length)+j;
                    var n2 = i*(object.x[0].length)+(j+1);
                    geo.colors.push(new THREE.Color(colors.red[n1],
                                                    colors.green[n1],
                                                    colors.blue[n1]));
                    geo.colors.push(new THREE.Color(colors.red[n2],
                                                    colors.green[n2],
                                                    colors.blue[n2]));
                }
            }
        }
    }

    for(var i=0; i<object.x[0].length; i++){
        for(var j=0; j<object.x.length-1; j++){
            if(!isNaN(object.z[j][i]) && 
               !isNaN(object.z[j+1][i])){
                var coords1 = normalise_coords(
                    [object.x[j][i], object.y[j][i], object.z[j][i]],
                    object.lims,
                    object.aspect
                );
                var coords2 = normalise_coords(
                    [object.x[j+1][i], object.y[j+1][i], object.z[j+1][i]],
                    object.lims,
                    object.aspect
                );
                geo.vertices.push(
                    new THREE.Vector3(
                        coords1[0],
                        coords1[1],
                        coords1[2]
                    ),
                    new THREE.Vector3(
                        coords2[0],
                        coords2[1],
                        coords2[2]
                    )
                );
                if(vertex_cols){
                    var n1 = j*(object.x[0].length)+i;
                    var n2 = (j+1)*(object.x[0].length)+i;
                    geo.colors.push(new THREE.Color(colors.red[n1],
                                                    colors.green[n1],
                                                    colors.blue[n1]));
                    geo.colors.push(new THREE.Color(colors.red[n2],
                                                    colors.green[n2],
                                                    colors.blue[n2]));
                }
            }
        }
    }

    var surface = new THREE.LineSegments(geo, mat, object.properties.lwd);
    return(surface);

}

function make_surface(object){

    //console.log(object.properties.color);
    // Get number of rows and columns
    var nrow = object.x.length;
    var ncol = object.x[0].length;

    // Set object geometry
    var geo = new THREE.PlaneGeometry(5, 5, ncol-1, nrow-1);


    var surface_cols = Object.assign({}, object.properties.color);
    var mat = get_object_material(object);

    // Color surface by vertices if more than one color supplied
    if(surface_cols.red.length > 1){
        for(var i=0; i<geo.faces.length; i++){
            geo.faces[i].vertexColors[0] = new THREE.Color(
                surface_cols.red[geo.faces[i].a],
                surface_cols.green[geo.faces[i].a],
                surface_cols.blue[geo.faces[i].a],
            );
            geo.faces[i].vertexColors[1] = new THREE.Color(
                surface_cols.red[geo.faces[i].b],
                surface_cols.green[geo.faces[i].b],
                surface_cols.blue[geo.faces[i].b],
            );
            geo.faces[i].vertexColors[2] = new THREE.Color(
                surface_cols.red[geo.faces[i].c],
                surface_cols.green[geo.faces[i].c],
                surface_cols.blue[geo.faces[i].c],
            );
        }
        mat.vertexColors = THREE.VertexColors;
        mat.color = new THREE.Color();
    }
    
    
    // // Find a safe vertex
    // var safe_vertex = null;
    // for(var i=0; i<object.z.length; i++){
    //     if(safe_vertex){ break; }
    //     for(var j=0; j<object.z[0].length; j++){
    //         if(!isNaN(object.z[i][j])){
    //             safe_vertex = new THREE.Vector3(
    //                 object.x[i][j],
    //                 object.y[i][j],
    //                 object.z[i][j]
    //             );
    //             break;
    //         }
    //     }
    // }

    // Set vertices
    var n = 0;
    var nas = [];
    for(var i=0; i<object.x.length; i++){
    	for(var j=0; j<object.x[0].length; j++){
            if(!isNaN(object.z[i][j])){
                if(object.normalise){
                    var coords = normalise_coords(
                        [object.x[i][j], object.y[i][j], object.z[i][j]],
                        object.lims,
                        object.aspect
                    );
                } else {
                    var coords = [object.x[i][j], object.y[i][j], object.z[i][j]];  
                }
                geo.vertices[n].set(
                    coords[0],
                    coords[1],
                    coords[2],
                )
            } else {
                geo.vertices[n].set(
                    null,
                    null,
                    null
                );
            	nas.push(n);
            };
            n++;
    	}
    }

    // Remove faces with nas
    var i=0
    while(i<geo.faces.length){
    	var face = geo.faces[i];
    	if(nas.indexOf(face.a) != -1 || 
    	   nas.indexOf(face.b) != -1 || 
    	   nas.indexOf(face.c) != -1){
            geo.faces.splice(i,1);
    	} else {
    		i++;
    	}
    }

    // Calculate normals
    geo.computeVertexNormals();
    geo = new THREE.BufferGeometry().fromGeometry( geo );

    // Make object
    var surface = new THREE.Mesh(geo, mat);
    return(surface);

}




function get_geos(dimensions, lwd){
	if(dimensions == 2){
		var square = function(object){
			return(new THREE.PlaneBufferGeometry(0.3, 0.3));
		};
		var circle = function(object){
			return(new THREE.CircleBufferGeometry(0.2, 32));
		}
        var ocircle = function(object){
            return(new THREE.RingGeometry( 0.2-object.properties.lwd/25, 0.2, 32 ));
            
            // var shape = new THREE.Shape();
            // shape.moveTo(-0.1, -0.1);
            // shape.lineTo(0.1, -0.1);
            // shape.lineTo(0.1, 0.1);
            // shape.lineTo(-0.1, 0.1);

            // var hole = new THREE.Path();
            // hole.moveTo(-0.08, -0.08);
            // hole.lineTo(0.08, -0.08);
            // hole.lineTo(0.08, 0.08);
            // hole.lineTo(-0.08, 0.08);

            // shape.holes.push(hole);
            // var extrudeSettings = {
            //     steps: 1,
            //     amount: 0.1,
            //     bevelEnabled: false
            // };
            // var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
            // return(geometry);
        }
        var osquare = function(object){
            var lwd  = object.properties.lwd/25;
            var size = 0.3;
            var inner = Math.sqrt((Math.pow(size,2))/2);
            var outer = Math.sqrt((Math.pow(size+lwd,2))/2);
            var geo = new THREE.RingBufferGeometry(inner, outer, 4, 1);
            geo.rotateZ( Math.PI/4 );
            return(geo);
        }
		var line = function(length, width){
			var geo = new THREE.PlaneGeometry( width*0.05, length );
			geo.translate( 0, -length/2, 0 );
			return(geo);
		};
		var arrow = function(length, width){
			var geo = new THREE.Geometry();
			geo.vertices.push(
				new THREE.Vector3( 0, 0, 0 ),
				new THREE.Vector3( width/2, length, 0 ),
				new THREE.Vector3( -width/2, length, 0 )
			);
			geo.faces.push( new THREE.Face3( 0, 1, 2 ) );
			return(geo);
		};
	}
	if(dimensions == 3){
		var circle = function(){
			return(new THREE.SphereBufferGeometry(0.2, 25, 25));
		}
		var square = function(){
			return(new THREE.BoxBufferGeometry( 0.3, 0.3, 0.3 ));
		};
		var line = function(length, width){
			var geo = new THREE.CylinderGeometry( width*0.025, width*0.025, length, 32 );
			geo.translate( 0, -length/2, 0 );
			return(geo);
		};
		var arrow = function(length, width){
			var geo = new THREE.ConeGeometry( width/2, length, 32 );
            geo.translate( 0, -length/2, 0 );
			return(geo);
		};
        var osquare = function(object){
            var size = 0.3;
            var lwd  = object.properties.lwd/25;
            var geo = new THREE.Geometry();
            var lims = [-size/2-lwd/4, size/2+lwd/4];

            // Draw lines
            for(var i=0; i<2; i++){
              for(var j=0; j<2; j++){
                var line = line_geo3D([lims[i], 
                                       lims[j],
                                       lims[0]], 
                                      [lims[i], 
                                       lims[j],
                                       lims[1]], 
                                       lwd, false, lwd/2, 0, true);
                geo.merge(line);
              }
            }
            for(var i=0; i<2; i++){
              for(var j=0; j<2; j++){
                var line = line_geo3D([lims[0], 
                                       lims[i],
                                       lims[j]], 
                                      [lims[1], 
                                       lims[i],
                                       lims[j]], 
                                       lwd, false, lwd/2, 0, true);
                geo.merge(line);
              }
            }
            for(var i=0; i<2; i++){
              for(var j=0; j<2; j++){
                var line = line_geo3D([lims[i], 
                                       lims[0],
                                       lims[j]], 
                                      [lims[i], 
                                       lims[1],
                                       lims[j]], 
                                       lwd, false, lwd/2, 0, true);
                geo.merge(line);
              }
            }

            // Add corner pieces
            for(var i=0; i<2; i++){
              for(var j=0; j<2; j++){
                for(var k=0; k<2; k++){
                  var corner = new THREE.BoxGeometry( lwd/2, lwd/2, lwd/2 );
                  corner.translate(lims[i], lims[j], lims[k]);
                  geo.merge(corner);
                }
              }
            }
            
            geo.mergeVertices();
            geo = new THREE.BufferGeometry().fromGeometry(geo);
            return(geo);
        };
        var ocircle = circle;
	}
	return({
		square:  square,
        osquare: osquare,
		circle:  circle,
        ocircle: ocircle,
		line:    line,
		arrow:   arrow
	})
}


function make_text(string, pos, size, alignment){

    var shapes    = font.generateShapes( string, size, 4 );
    var geometry  = new THREE.ShapeGeometry( shapes );
    var textShape = new THREE.BufferGeometry();
    textShape.fromGeometry( geometry );

    var matLite = new THREE.MeshBasicMaterial( {
        color: "black",
        side: THREE.DoubleSide
    } );

    // Align text
    textShape.computeBoundingBox();
    xMid = - 0.5 * ( textShape.boundingBox.max.x - textShape.boundingBox.min.x );
    yMid = - 0.5 * ( textShape.boundingBox.max.y - textShape.boundingBox.min.y );
    textShape.translate( xMid*2*alignment[0], yMid*2*alignment[1], 0 );

    var text = new THREE.Mesh( textShape, matLite )
    text.position.set(pos[0], pos[1], pos[2])
    return(text);

}

function lineMeshSegments(geo, mat, lwd){
    
    var segments = new THREE.Geometry();
    for(var i=0; i<geo.vertices.length; i+=2){
        var linegeo = make_lineMeshGeo(geo.vertices[i].toArray(), 
                                       geo.vertices[i+1].toArray(),
                                       lwd, 
                                       3);
        segments.merge(linegeo);
    }
    segments = new THREE.BufferGeometry().fromGeometry( segments );
    return(new THREE.Mesh(segments, mat));

}




