

// General function to populate the plot
function populatePlot(parent,
                      plotData,
                      scene){
    
    if(plotData.plot){
        for(var i=0; i<plotData.plot.length; i++){
            addPlotObject(plotData.plot[i],
                          plotData,
                          parent,
                          scene);
        }
    }

}

// Plot points
function addPlotObject(plotobj, 
                       plotData,
                       parent,
                       scene){

    // Make the object
    var object = make_object(plotobj, plotData, parent, scene);

    // Add highlighted point
    if(plotobj.highlight){
        
        // Link plot and highlight objects
        var hlobj = make_object(plotobj.highlight, plotData, parent, scene);
        hlobj.visible = false;
        object.highlight = hlobj;
        parent.add(hlobj);

    }

    // Add interactivity
    if(plotobj.properties.interactive || plotobj.properties.label){
        scene.selectable_objects.push(object);
    }

    // Work out toggle behaviour
    if(plotobj.properties.toggle){
        var toggle = plotobj.properties.toggle;
        var tog_index = scene.toggles.names.indexOf(toggle);
        if(tog_index == -1){
            scene.toggles.names.push(toggle);
            scene.toggles.objects.push([object]);
        } else {
            scene.toggles.objects[tog_index].push(object);
        }
    }
    
    // Add label info
    if(plotobj.properties.label){
        object.label = plotobj.properties.label;
    }

    // Work out if object is dynamically associated with a face
    if(plotobj.properties.faces){
        scene.dynamic_objects.push(object);
        if(plotobj.properties.faces.indexOf("x+") != -1){ scene.dynamicDeco.faces[0].push(object) }
        if(plotobj.properties.faces.indexOf("y+") != -1){ scene.dynamicDeco.faces[1].push(object) }
        if(plotobj.properties.faces.indexOf("z+") != -1){ scene.dynamicDeco.faces[2].push(object) }
        if(plotobj.properties.faces.indexOf("x-") != -1){ scene.dynamicDeco.faces[3].push(object) }
        if(plotobj.properties.faces.indexOf("y-") != -1){ scene.dynamicDeco.faces[4].push(object) }
        if(plotobj.properties.faces.indexOf("z-") != -1){ scene.dynamicDeco.faces[5].push(object) }
    }
    if(plotobj.properties.corners){
        
        scene.dynamic_objects.push(object);
        
        var corners  = plotobj.properties.corners[0];
        var edgecode = corners.substring(0,3);
        var poscode  = corners.substring(3,4);
        var a;
        var b;

        if(edgecode == "x--"){ a = 0  }
        if(edgecode == "x-+"){ a = 1  }
        if(edgecode == "x++"){ a = 2  }
        if(edgecode == "x+-"){ a = 3  }
        if(edgecode == "-y-"){ a = 4  }
        if(edgecode == "-y+"){ a = 5  }
        if(edgecode == "+y+"){ a = 6  }
        if(edgecode == "+y-"){ a = 7  }
        if(edgecode == "--z"){ a = 8  }
        if(edgecode == "-+z"){ a = 9  }
        if(edgecode == "++z"){ a = 10 }
        if(edgecode == "+-z"){ a = 11 }

        if(poscode == "r"){ b = 0 } // Up
        if(poscode == "u"){ b = 1 } // Down
        if(poscode == "f"){ b = 2 } // Front
        if(poscode == "l"){ b = 3 } // Left
        if(poscode == "d"){ b = 4 } // Right
        if(poscode == "b"){ b = 5 } // Back

        scene.dynamicDeco.edges[a][b].push(object);

    }

    // Add the object to the plot
    object.scene = scene;
    parent.add(object);

    // Add reference of object to primary object list
    scene.primary_objects.push(object);
    
    // Sort out groupings
    if(plotobj.group){
        object.group = [];
        for(var i=0; i<plotobj.group.length; i++){
            object.group.push(plotobj.group[i]-1);
        }
    }

    // Return the object
    return(object);

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

    var scene = object.parent.parent.parent;
    var plotPoints = object.parent;

    // Convert colors
    if(!object.properties.color.isColor){
        object.properties.color = new THREE.Color(object.properties.color[0][0],
                                                  object.properties.color[1][0],
                                                  object.properties.color[2][0]);
    }

    // Set object material
    if(object.properties.mat == "basic")    { var mat = new THREE.MeshBasicMaterial();   }
    if(object.properties.mat == "lambert")  { var mat = new THREE.MeshLambertMaterial(); }
    if(object.properties.mat == "phong")    { var mat = new THREE.MeshPhongMaterial();   }
    if(object.properties.mat == "line")     { 
        if(object.properties.gapSize){
            var mat = new THREE.LineDashedMaterial({
                scale: 200
            });
        } else {
            var mat = new THREE.LineBasicMaterial();
        }
    }

    // Set object material properties
    Object.assign(mat, object.properties);
    mat.side = THREE.DoubleSide;

    // Set clipping
    mat.clippingPlanes = [];
    if(object.properties.clippingPlanes){
        var clippingPlanes = scene.clippingPlanes.includeAndReferencePlaneData(object);
        mat.clippingPlanes = mat.clippingPlanes.concat(
            clippingPlanes
        );
    }
    if(!object.properties.xpd){
        mat.clippingPlanes = mat.clippingPlanes.concat(
            plotPoints.clippingPlanes
        );
    }

    return(mat);

}


// Function for plotting an object such as a line or a shape
function make_object(object, plotData, parent, scene){

    // Set defaults
    object.lims      = plotData.lims;
    object.aspect    = plotData.aspect;
    object.normalise = plotData.normalise;
    object.parent    = parent;
    object.scene     = scene;

    // Check object type has been defined
    if(typeof(object.type) === "undefined"){
        throw("Object type undefined");
    }

    // Create the plotting object
    if(object.type == "point"){
        var plotobject = make_point(object);
    }
    if(object.type == "glpoint"){
        var plotobject = make_glpoint(object);
    }
    if(object.type == "line"){
        var plotobject = make_line(object);
    }
    if(object.type == "glline"){
        var plotobject = make_glline(object);
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
    
    // Apply any rotations
    if(object.properties.rotation){
        plotobject.geometry.rotateX(object.properties.rotation[0]);
        plotobject.geometry.rotateY(object.properties.rotation[1]);
        plotobject.geometry.rotateZ(object.properties.rotation[2]);
    }

    // Apply renderOrder
    if(object.properties.renderOrder){
        plotobject.renderOrder = object.properties.renderOrder;
    }

    // Apply any special transformations
    if(object.properties.renderSidesSeparately){
        plotobject = separate_sides(plotobject);
    }
    if(object.properties.removeSelfTransparency){
        plotobject = remove_self_transparency(plotobject);
    }
    if(object.properties.breakupMesh){
        plotobject = breakup_mesh(plotobject);
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
    
    var vertex_cols = colors[0].length > 1;
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
                    geo.colors.push(new THREE.Color(colors[0][n1],
                                                    colors[1][n1],
                                                    colors[2][n1]));
                    geo.colors.push(new THREE.Color(colors[0][n2],
                                                    colors[1][n2],
                                                    colors[2][n2]));
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
                    geo.colors.push(new THREE.Color(colors[0][n1],
                                                    colors[1][n1],
                                                    colors[2][n1]));
                    geo.colors.push(new THREE.Color(colors[0][n2],
                                                    colors[1][n2],
                                                    colors[2][n2]));
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
    if(surface_cols[0].length > 1){
        for(var i=0; i<geo.faces.length; i++){
            geo.faces[i].vertexColors[0] = new THREE.Color(
                surface_cols[0][geo.faces[i].a],
                surface_cols[1][geo.faces[i].a],
                surface_cols[2][geo.faces[i].a]
            );
            geo.faces[i].vertexColors[1] = new THREE.Color(
                surface_cols[0][geo.faces[i].b],
                surface_cols[1][geo.faces[i].b],
                surface_cols[2][geo.faces[i].b]
            );
            geo.faces[i].vertexColors[2] = new THREE.Color(
                surface_cols[0][geo.faces[i].c],
                surface_cols[1][geo.faces[i].c],
                surface_cols[2][geo.faces[i].c]
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
                    coords[2]
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






function make_textobject(object){

    if(object.normalise){
        object.position = normalise_coords(object.position,
                                           object.lims,
                                           object.aspect);
    }
    if(object.properties.poffset){
        object.position[0] = object.position[0] + object.properties.poffset[0];
        object.position[1] = object.position[1] + object.properties.poffset[1];
        object.position[2] = object.position[2] + object.properties.poffset[2];
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
        object.scene.labels.push(textobject);
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

function breakup_mesh(full_mesh){

    // Make a group for the new broken mesh
    var broken_mesh = new THREE.Group();

    // Get the geometry
    var geo = full_mesh.geometry;
    if(!geo.isBufferGeometry){
        geo = new THREE.BufferGeometry().fromGeometry(geo);
    }

    // Get the material
    var mat = clone_material(full_mesh.material);

    // Break apart the geometry
    for(var i=0; i<(geo.attributes.position.count/3); i++){
    
        var x_mean = (geo.attributes.position.array[i*9] + geo.attributes.position.array[i*9+3] + geo.attributes.position.array[i*9+6])/3
        var y_mean = (geo.attributes.position.array[i*9+1] + geo.attributes.position.array[i*9+4] + geo.attributes.position.array[i*9+7])/3
        var z_mean = (geo.attributes.position.array[i*9+2] + geo.attributes.position.array[i*9+5] + geo.attributes.position.array[i*9+8])/3
        var g = new THREE.BufferGeometry();
        var v = new Float32Array( [
            geo.attributes.position.array[i*9] - x_mean,
            geo.attributes.position.array[i*9+1] - y_mean,
            geo.attributes.position.array[i*9+2] - z_mean,
            geo.attributes.position.array[i*9+3] - x_mean,
            geo.attributes.position.array[i*9+4] - y_mean,
            geo.attributes.position.array[i*9+5] - z_mean,
            geo.attributes.position.array[i*9+6] - x_mean,
            geo.attributes.position.array[i*9+7] - y_mean,
            geo.attributes.position.array[i*9+8] - z_mean
        ] );
        g.addAttribute( 'position', new THREE.BufferAttribute( v, 3 ) );
        var c = new Float32Array( [
            geo.attributes.color.array[i*9],
            geo.attributes.color.array[i*9+1],
            geo.attributes.color.array[i*9+2],
            geo.attributes.color.array[i*9+3],
            geo.attributes.color.array[i*9+4],
            geo.attributes.color.array[i*9+5],
            geo.attributes.color.array[i*9+6],
            geo.attributes.color.array[i*9+7],
            geo.attributes.color.array[i*9+8]
        ] );
        g.addAttribute( 'color', new THREE.BufferAttribute( c, 3 ) );
        var n = new Float32Array( [
            geo.attributes.normal.array[i*9],
            geo.attributes.normal.array[i*9+1],
            geo.attributes.normal.array[i*9+2],
            geo.attributes.normal.array[i*9+3],
            geo.attributes.normal.array[i*9+4],
            geo.attributes.normal.array[i*9+5],
            geo.attributes.normal.array[i*9+6],
            geo.attributes.normal.array[i*9+7],
            geo.attributes.normal.array[i*9+8]
        ] );
        g.addAttribute( 'normal', new THREE.BufferAttribute( n, 3 ) );
        
        // Set clipping
        var mesh = new THREE.Mesh( g, mat );
        mesh.position.set(x_mean, y_mean, z_mean);
        broken_mesh.add(mesh);

    }
    
    // Return the mesh as a new group
    return(broken_mesh);

}


function separate_sides(full_mesh){
    
    var mat = full_mesh.material;
    var geo = full_mesh.geometry;

    // mat.colorWrite = false;
    mat.side = THREE.FrontSide;
    var mat_cw = clone_material(mat);
    // mat_cw.colorWrite = true;
    mat_cw.side = THREE.BackSide;

    var mesh  = THREE.SceneUtils.createMultiMaterialObject( 
        geo,[mat,mat_cw]
    );

    return(mesh);

}


function remove_self_transparency(full_mesh){
    
    var mat = full_mesh.material;
    var geo = full_mesh.geometry;

    mat.colorWrite = false;
    // mat.side = THREE.FrontSide;
    var mat_cw = clone_material(mat);
    mat_cw.colorWrite = true;
    // mat_cw.side = THREE.BackSide;

    var mesh  = THREE.SceneUtils.createMultiMaterialObject( 
        geo,[mat,mat_cw]
    );

    return(mesh);

}


function clone_material(material){
    
    var mat = material.clone();
    if(material.clippingPlanes){
        mat.clippingPlanes = material.clippingPlanes;
    }

    return(mat);

}


