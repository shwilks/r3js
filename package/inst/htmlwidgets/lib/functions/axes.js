

function add_rotation_listener(viewport){

    // Set variables
    var lims   = viewport.plotData.lims;
    var aspect = viewport.plotData.aspect;

    // Set box vertices
    var vertices = [];
    for(var i=0; i<2; i++){
        for(var j=0; j<2; j++){
            for(var k=0; k<2; k++){
                vertices.push([
                    i*aspect[0],
                    j*aspect[1],
                    k*aspect[2]
                ]);
            }
        }
    }

    // Store variables for bounding box
    viewport.boundingBox = {
        edge_vertices : [
            [0,1],
            [0,2],
            [0,4],
            [1,3],
            [1,5],
            [2,3],
            [2,6],
            [3,7],
            [4,5],
            [4,6],
            [5,7],
            [6,7]
        ],
        edge_faces : [
            [3,4],
            [3,5],
            [4,5],
            [2,3],
            [2,4],
            [1,3],
            [1,5],
            [1,2],
            [0,4],
            [0,5],
            [0,2],
            [0,1]
        ],
        face_normals : [
            [1,0,0],  // x+
            [0,1,0],  // y+
            [0,0,1],  // z+
            [-1,0,0], // x-
            [0,-1,0], // y-
            [0,0,-1]  // z-
        ],
        face_vertices : [
            [5,6,4,7],//0
            [2,7,3,6],//1
            [1,7,3,5],//2
            [0,3,2,1],//3
            [0,5,4,1],//4
            [0,6,4,2] //5
        ],
        vertices : vertices
    }

    // Set holders for dynamic plot components
    dynamicFaces = [];
    for(var i=0; i<6; i++){
        dynamicFaces.push([]);
    }
    viewport.dynamicDeco = {
        faces : dynamicFaces
    }
    

    // Add event listener
    viewport.plotHolder.rotation.onChangeCallback = function(){

        // Set variables
        var face_normals  = viewport.boundingBox.face_normals;
        var edge_vertices = viewport.boundingBox.edge_vertices;
        var face_vertices = viewport.boundingBox.face_vertices;

        // Work out which faces are visible
        var visible_faces = [];
        for(var face=0; face<3; face++){
            var face_norm = new THREE.Vector3().fromArray(face_normals[face]);
            face_norm.applyQuaternion(viewport.plotHolder.quaternion);
            
            var origin = viewport.plotPoints.position.clone();
            origin.add( new THREE.Vector3(aspect[0]/2, aspect[1]/2, aspect[2]/2) );
            origin.applyQuaternion(viewport.plotHolder.quaternion);
            camera_to_origin = origin.clone().sub( viewport.camera.position );
            var face_angle   = camera_to_origin.angleTo(face_norm);
            var face_visible = face_angle < 3.142/2;

            if(face_visible){
                visible_faces.push(face);
            } else {
                visible_faces.push(face+3);
            }
        }
        

        // Work out visible vertices
        var visible_vertices = [];
        for(var i=0; i<visible_faces.length; i++){
            visible_vertices = visible_vertices.concat(face_vertices[visible_faces[i]]);
        }
        
        // Set the visibility of box edges
        for(var i=0; i<edge_vertices.length; i++){
            if(visible_vertices.indexOf(edge_vertices[i][0]) == -1 
               || visible_vertices.indexOf(edge_vertices[i][1]) == -1){
                edge_vertices[i].visible = false;
            } else {
                edge_vertices[i].visible = true;
            }
        }
        
        // Hide all objects associated with dynamic faces
        var boxfaces = viewport.dynamicDeco.faces;
        for(var i=0; i<boxfaces.length; i++){
            for(var j=0; j<boxfaces[i].length; j++){
                boxfaces[i][j].visible = false;
            }
        }
        
        // Show objects associated with shown box faces
        for(var i=0; i<visible_faces.length; i++){
            for(var j=0; j<boxfaces[visible_faces[i]].length; j++){
                boxfaces[visible_faces[i]][j].visible = true;
            }
        }

        // Find the invisible vertex
        for(var i=0; i<8; i++){
            if(visible_vertices.indexOf(i) == -1){
                var hidden_vertex = i;
            }
        }

        // Get the position of the hidden vertex
        var hidden_vertex_pos = vertices[hidden_vertex];

        // Work out which axis to show
        for(var i=0; i<viewport.axes.length; i++){
            var axis = viewport.axes[i];
            if(axis.loc != "fixed"){
                var main_dim = axis.main_dim;
                var sub_dims = axis.sub_dims;
                
                var axis_pos1 = [0,0,0];
                axis_pos1[sub_dims[0]] = hidden_vertex_pos[sub_dims[0]];
                axis_pos1[sub_dims[1]] = -(hidden_vertex_pos[sub_dims[1]] - aspect[sub_dims[1]]/2) + aspect[sub_dims[1]]/2;
                axis_pos1[main_dim]    = -(hidden_vertex_pos[main_dim] - aspect[main_dim]/2) + aspect[main_dim]/2;

                var axis_pos2 = [0,0,0];
                axis_pos2[sub_dims[0]] = -(hidden_vertex_pos[sub_dims[0]] - aspect[sub_dims[0]]/2) + aspect[sub_dims[0]]/2;
                axis_pos2[sub_dims[1]] = hidden_vertex_pos[sub_dims[1]];
                axis_pos2[main_dim]    = -(hidden_vertex_pos[main_dim] - aspect[main_dim]/2) + aspect[main_dim]/2;

                // var axis_pos1 = [axis_pos[0], -(axis_pos[1] - aspect[1]/2) + aspect[1]/2, 0];
                // var axis_pos2 = [-(axis_pos[0] - aspect[0]/2) + aspect[0]/2, axis_pos[1], 0];

                var axis_test1 = new THREE.Vector3().fromArray(axis_pos1).applyMatrix4(viewport.plotPoints.matrix).applyQuaternion(viewport.plotHolder.quaternion).toArray();
                var axis_test2 = new THREE.Vector3().fromArray(axis_pos2).applyMatrix4(viewport.plotPoints.matrix).applyQuaternion(viewport.plotHolder.quaternion).toArray();

                if(axis.loc == "left")   { var axis_comp = axis_test1[0] < axis_test2[0] }
                if(axis.loc == "right")  { var axis_comp = axis_test1[0] > axis_test2[0] }
                if(axis.loc == "bottom") { var axis_comp = axis_test1[1] < axis_test2[1] }
                if(axis.loc == "top")    { var axis_comp = axis_test1[1] > axis_test2[1] }
                if(axis.loc == "back")   { var axis_comp = axis_test1[2] < axis_test2[2] }
                if(axis.loc == "front")  { var axis_comp = axis_test1[2] > axis_test2[2] }
                
                if(axis_comp){
                    var keypos = axis_pos1;
                } else {
                    var keypos = axis_pos2;
                }
                
                // Show and hide dynamic axis
                axis.objects[0].visible = keypos[sub_dims[0]] == 0 && keypos[sub_dims[1]] == 0;
                axis.objects[1].visible = keypos[sub_dims[0]] == 0 && keypos[sub_dims[1]] != 0;
                axis.objects[2].visible = keypos[sub_dims[0]] != 0 && keypos[sub_dims[1]] == 0;
                axis.objects[3].visible = keypos[sub_dims[0]] != 0 && keypos[sub_dims[1]] != 0;
            }
        }

    };

}

function update_labels(viewport){
    viewport.plotHolder.updateMatrixWorld();
    for(var i=0; i<viewport.labels.length; i++){
        var lab = viewport.labels[i];
        // Negate any world rotation
        var qrot = lab.parent.getWorldQuaternion();
        lab.rotation.setFromQuaternion(qrot.conjugate());
    }
}

function make_label(viewport, label_object, scene_object){

    label_object.scene_object = scene_object;
    viewport.labels.push(label_object);
    viewport.scene.add(label_object);

}


function make_axis(dim, 
                   at,
                   labels,
                   title,
                   loc, 
                   mat, 
                   lwd, 
                   tcl, 
                   mgp,
                   cex,
                   viewport){

    var axis = new THREE.Object3D();
    var lims   = viewport.plotData.lims;
    var aspect = viewport.plotData.aspect;

    // Work out main and sub dimensions
    var sub_dim = [];
    for(var i=0; i<3; i++){
        if(i != dim){ sub_dim.push(i) }
    }

    // Draw main line
    var from = [0,0,0];
    for(var i=0; i<2; i++){
        if(loc[i] == 0){ from[sub_dim[i]] = 0                  }
        else           { from[sub_dim[i]] = aspect[sub_dim[i]] }
    }

    from[dim] = normalise_coord(Math.min.apply(Math, at),
                                lims[dim],
                                aspect[dim]);

    var to = from.slice();
    to[dim]   = normalise_coord(Math.max.apply(Math, at),
                                lims[dim],
                                aspect[dim]);

    var line = make_lineMesh(from,
                             to, 
                             mat, 
                             lwd, 
                             3);
    axis.add(line);


    for(var n=0; n<at.length; n++){
        
        // Draw tick marks and labels
        var tick_from = from.slice();
        tick_from[dim] = normalise_coord(at[n],
                                         lims[dim],
                                         aspect[dim]);

        var tick_to = tick_from.slice();
        for(var i=0; i<2; i++){
            if(loc[i] == 0){ tick_to[sub_dim[i]] -= tcl/10 }
            else           { tick_to[sub_dim[i]] += tcl/10 }
        }

        var tick = make_lineMesh(tick_from,
                                 tick_to, 
                                 mat, 
                                 lwd, 
                                 3);
        axis.add(tick);


        // Draw labels
        var label_pos = tick_from.slice();
        for(var i=0; i<2; i++){
            if(loc[i] == 0){ label_pos[sub_dim[i]] -= mgp[1]/20 }
            else           { label_pos[sub_dim[i]] += mgp[1]/20 }
        }

        var text = make_text(labels[n], label_pos, cex*0.025, [0.5,0.5]);
        viewport.labels.push(text);
        axis.add(text);

    }

    // Add title if not undefined
    if(title !== undefined){
        var title_pos = from.slice();
        title_pos[dim] = aspect[dim]/2;
        for(var i=0; i<2; i++){
            if(loc[i] == 0){ title_pos[sub_dim[i]] -= mgp[0]/20 }
            else           { title_pos[sub_dim[i]] += mgp[0]/20 }
        }
        var text = make_text(title, title_pos, cex*0.025, [0.5,0.5]);
        viewport.labels.push(text);
        axis.add(text);
    }

    // Return the axis object
    return(axis);

}

function add_axis(viewport, axis){

    // Set variables
    var lims   = viewport.plotData.lims;
    var aspect = viewport.plotData.aspect;

    // Get object material
    axis.properties.xpd   = true;
    var mat = get_object_material(axis);

    // Create all the axes objects
    var axes = [];
    if(axis.loc != "fixed"){
        for(var i=0; i<2; i++){
            for(var j=0; j<2; j++){
                var object = make_axis(axis.dim, 
                                       axis.at, 
                                       axis.labels,
                                       axis.title,
                                       [i,j], 
                                       mat, 
                                       axis.lwd, 
                                       axis.tcl, 
                                       axis.mgp,
                                       axis.cex,
                                       viewport);

                // Add the axis object to the viewport
                viewport.plotPoints.add(object);
                axes.push(object);
            }
        }
    } else {
        var object = make_axis(axis.dim, 
                               axis.at, 
                               axis.labels,
                               axis.title,
                               axis.lims, 
                               mat, 
                               axis.lwd, 
                               axis.tcl, 
                               axis.mgp,
                               axis.cex,
                               viewport);

        // Add the axis object to the viewport
        viewport.plotPoints.add(object);
        axes.push(object);
    }

    // Work out sub dimensions
    var sub_dims = [];
    for(var i=0; i<3; i++){
        if(i != axis.dim){ sub_dims.push(i) }
    }
    
    // Store the axis info
    var axis_obj = {
        main_dim : axis.dim,
        sub_dims : sub_dims,
        loc      : axis.loc,
        objects  : axes
    };
    viewport.axes.push(axis_obj);

}


