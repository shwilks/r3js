

// General function to populate the plot
function populatePlot(viewport,
                      plotData,
                      directcoords){
    if(plotData.plot){
        for(var i=0; i<plotData.plot.length; i++){
            addPlotObject(plotData.plot[i], 
                          plotData,
                          viewport,
                          directcoords);
        }
    }
}

// Plot points
function addPlotObject(plotobj, 
                       plotData,
                       viewport,
                       directcoords){

    // Check whether the coordinates of the point should be normalised
    if(directcoords){
        plotobj.normalise = false;
    } else {
        plotobj.normalise = true;
    }

    // Check if object is part of a group
    if(plotobj.type == "group"){
        var group_objects = [];
        for(var i=0; i<plotobj.plot.length; i++){
            var obj = addPlotObject(plotobj.plot[i]);
            group_objects.push(obj);
            obj.group = group_objects;
        }
    } else {

        // Set defaults for interactivity
        if(typeof plotobj.properties.interactive === "undefined"){
            plotobj.properties.interactive = plotobj.properties.label 
                                             || plotobj.highlight;
        }
        
        // Generate the plot object
        if(!plotobj.properties.dimensions){
            plotobj.properties.dimensions = 3
        }
        plotobj.lims     = plotData.lims;
        plotobj.aspect   = plotData.aspect;
        plotobj.viewport = viewport;
        var object = make_object(plotobj);

        // Add interactivity
        if(plotobj.properties.interactive){
            viewport.selectable_objects.push(object);
        }

        // Add highlighted point
        if(plotobj.highlight){
            var hlobj = plotobj.highlight;

            // Generate the plot object
            if(!hlobj.properties.dimensions){
                hlobj.properties.dimensions = 3
            }
            hlobj.lims     = plotData.lims;
            hlobj.aspect   = plotData.aspect;
            hlobj.viewport = viewport;
            hlobj.normalise = true;
            var highlight = make_object(hlobj);

            // Link plot and highlight objects
            highlight.visible = false;
            object.highlight = highlight;
            viewport.plotPoints.add(highlight);

        }

        // Work out toggle behaviour
        if(plotobj.properties.toggle){
            var toggle = plotobj.properties.toggle;
            var tog_index = viewport.toggles.names.indexOf(toggle);
            if(tog_index == -1){
                viewport.toggles.names.push(toggle);
                viewport.toggles.objects.push([object]);
            } else {
                viewport.toggles.objects[tog_index].push(object);
            }
        }
        
        // Add label info
        if(plotobj.properties.label){
            object.label = plotobj.properties.label;
        }

        // Work out if object is dynamically associated with a face
        if(plotobj.properties.faces){
            viewport.dynamic_objects.push(object);
            if(plotobj.properties.faces.indexOf("x+") != -1){ viewport.dynamicDeco.faces[0].push(object) }
            if(plotobj.properties.faces.indexOf("y+") != -1){ viewport.dynamicDeco.faces[1].push(object) }
            if(plotobj.properties.faces.indexOf("z+") != -1){ viewport.dynamicDeco.faces[2].push(object) }
            if(plotobj.properties.faces.indexOf("x-") != -1){ viewport.dynamicDeco.faces[3].push(object) }
            if(plotobj.properties.faces.indexOf("y-") != -1){ viewport.dynamicDeco.faces[4].push(object) }
            if(plotobj.properties.faces.indexOf("z-") != -1){ viewport.dynamicDeco.faces[5].push(object) }
        }

        // Add the object to the plot
        object.viewport = viewport;
        viewport.plotPoints.add(object);

        // Return the object
        return(object);
    }
}


function normalise_coord(coord,
                         lims,
                         aspect){
    return(coord - lims[0])*aspect/(lims[1] - lims[0]);
}

function normalise_coords(coords, 
                          lims, 
                          aspect){

    norm_coords = [];
    for(var i=0; i<coords.length; i++){
        norm_coords.push(
            normalise_coord(coords[i], lims[i], aspect[i])
        );
    }
    return(norm_coords);

}

function get_object_material(object){

    // Convert colors
    if(!object.properties.color.isColor){
        object.properties.color = new THREE.Color(object.properties.color.red,
                                                  object.properties.color.green,
                                                  object.properties.color.blue);
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
    if(object.type == "sphere"){
        var plotobject = make_sphere(object);
    }
    if(object.type == "shape"){
        var plotobject = make_shape(object);
    }
    if(object.type == "triangle"){
        var plotobject = make_triangle(object);
    }
    if(object.type == "text"){
        var plotobject = make_textobject(object);
    }
    
    return(plotobject);

}


function make_triangle(object){

    // Make geometry
    var geo = new THREE.Geometry();

    // Create vertices
    for(var i=0; i<object.vertices.length; i++){

        // Normalise the coordinates
        var vertex = object.vertices[i];
        if(object.normalise){
            vertex = normalise_coords(vertex,
                                      object.lims,
                                      object.aspect);
        }

        // Append the vertex
        geo.vertices.push( 
            new THREE.Vector3().fromArray(vertex)
        );

    }

    // Create faces
    geo.faces.push(
        new THREE.Face3(0, 1, 2)
    );
    geo.computeFaceNormals();

    // Convert to buffer geometry
    geo = new THREE.BufferGeometry().fromGeometry(geo);

    // Get material
    var mat = get_object_material(object);

    // Make shape
    var triangle = new THREE.Mesh(geo, mat);

    // Return the shape
    return(triangle);

}

function make_shape(object){

    // Make geometry
    var geo = new THREE.Geometry();

    // Create vertices
    for(var i=0; i<object.vertices.length; i++){

        // Normalise the coordinates
        var vertex = object.vertices[i];
        if(object.normalise){
            vertex = normalise_coords(vertex,
                                      object.lims,
                                      object.aspect);
        }

        // Append the vertex
        geo.vertices.push( 
            new THREE.Vector3().fromArray(vertex)
        );

    }

    // Create faces
    for(var i=0; i<object.faces.length; i++){

        var face = object.faces[i];
        geo.faces.push(
            new THREE.Face3(face[0],
                            face[1],
                            face[2])
        );

    }
    
    //geo.mergeVertices();
    geo.computeFaceNormals();
    //geo.computeVertexNormals();
    // geo.computeMorphNormals();

    // Convert to buffer geometry
    geo = new THREE.BufferGeometry().fromGeometry(geo);
    
    
    var mat = get_object_material(object);
    // mat.flatShading = true;
    // mat.morphNormals = true;
    // mat.morphTargets = true;
    // mat.vertexColors = THREE.FaceColors;
    // console.log(mat);

    // Make shape
    var shape = new THREE.Mesh(geo, mat);

    // Return the shape
    return(shape);

}

function make_sphere(object){

    // Make geo
    var geo = new THREE.SphereGeometry(object.radius, 32, 32);
    var mat = get_object_material(object);

    // Normalise the coords
    if(object.normalise){
        var lims   = object.lims;
        var aspect = object.aspect;
        for(var i=0; i<geo.vertices.length; i++){
            geo.vertices[i].x = geo.vertices[i].x*aspect[0]/(lims[0][1] - lims[0][0]);
            geo.vertices[i].y = geo.vertices[i].y*aspect[1]/(lims[1][1] - lims[1][0]);
            geo.vertices[i].z = geo.vertices[i].z*aspect[2]/(lims[2][1] - lims[2][0]);
        }
        object.position = normalise_coords(object.position,
                                           object.lims,
                                           object.aspect);
    }
    geo.computeFaceNormals();
    geo.computeVertexNormals();

    // Make object
    var sphere = new THREE.Mesh(geo, mat);

    // Position object
    sphere.position.set(object.position[0],
                        object.position[1],
                        object.position[2]);
    if(!sphere.position.z){
        sphere.position.z = 0;
    }

    // Return point
    return(sphere);

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
    if(object.normalise){
        point.scale.set(object.size/10, 
                        object.size/10, 
                        object.size/10);
    }

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

    // Set from and to
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

    // Set object geometry
    var arrow = {
        headwidth  : 0.015,
        headlength : 0.03
    };
    var geo = line_geo3D(from, 
                         to, 
                         object.properties.lwd*0.01, 
                         false, 
                         0, 
                         0, 
                         false,
                         arrow);

    // Set object material
    var mat = get_object_material(object);

    // Make arrow object
    var arrow = new THREE.Mesh(geo, mat);

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

function make_textobject(object){

    if(object.normalise){
        object.position = normalise_coords(object.position,
                                           object.lims,
                                           object.aspect);
    }
    
    if(object.rendering == "geometry"){
        object.alignment[0] = -object.alignment[0]/2 + 0.5;
        object.alignment[1] = -object.alignment[1]/2 + 0.5;
        
        if(object.normalise){
            object.offset[0] = object.offset[0]*0.025;
            object.offset[1] = object.offset[1]*0.025;
            object.size = object.size*0.025
        }
        var textobject = make_text(object.text,
                                   object.position,
                                   object.size,
                                   object.alignment,
                                   object.offset,
                                   object.properties.color);
        object.viewport.labels.push(textobject);
    }
    if(object.rendering == "html"){
        var textobject = make_htmltext(object);
    }
    return(textobject);

}

function make_htmltext(object){


    // Create text div
    var textdiv     = document.createElement( 'div' );
    
    // Define color as hex
    if(object.properties.color.red){
        var color = new THREE.Color(
                object.properties.color.red, 
                object.properties.color.green, 
                object.properties.color.blue
        );
        textdiv.style.color = '#'+color.getHexString();
    } else {
        textdiv.style.color = 'inherit';
    }
    
    // Set other styles and content
    textdiv.style.fontSize = object.size*100+"%";
    textdiv.textContent = object.text;
    apply_style(textdiv, object.style);
    
    // Create CSS text object
    var textobject = new THREE.CSS2DObject( textdiv );

    // Set text object alignment
    textobject.alignment = {
        x: -50 + 50*object.alignment[0],
        y: -50 - 50*object.alignment[1]
    };

    // Set text offset
    textdiv.style.marginLeft = object.offset[0]+"px";
    textdiv.style.marginTop  = object.offset[1]+"px";

    // Set text object position
    textobject.position.set(
        object.position[0],
        object.position[1],
        object.position[2]
    );

    return(textobject);

}

function make_text(string, pos, size, alignment, offset, color){

    var shapes    = font.generateShapes( string, size, 4 );
    var geometry  = new THREE.ShapeGeometry( shapes );
    var textShape = new THREE.BufferGeometry();
    textShape.fromGeometry( geometry );

    if(color && color.red){
        color = new THREE.Color(
            color.red, 
            color.green, 
            color.blue
        );
    } else {
        color = new THREE.Color("#000000");
    }
    var matLite = new THREE.MeshBasicMaterial( {
        color: color,
        side: THREE.DoubleSide
    } );

    // Align text
    textShape.computeBoundingBox();
    xMid = - 0.5 * ( textShape.boundingBox.max.x - textShape.boundingBox.min.x );
    yMid = - 0.5 * ( textShape.boundingBox.max.y - textShape.boundingBox.min.y );
    textShape.translate( xMid*2*alignment[0], yMid*2*alignment[1], 0 );

    // Offset text
    if(offset){
        textShape.translate( offset[0], offset[1], 0 );
    }

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






