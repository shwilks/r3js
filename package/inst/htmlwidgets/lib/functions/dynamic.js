
function add_dynamicObjects(scene, plotData){

    // Set variables
    var lims   = plotData.lims;
    var aspect = plotData.aspect;

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
    scene.boundingBox = {
        edge_vertices : [
            [0,4], // y-z-  x 0
            [1,5], // z+y-  x 1
            [3,7], // y+z+  x 2
            [2,6], // y+z-  x 3
            [0,2], // x-z-  y 4
            [1,3], // z+x-  y 5
            [5,7], // x+z+  y 6
            [4,6], // x+z-  y 7
            [0,1], // x-y-  z 8
            [4,5], // x+y-  z 11
            [6,7], // x+y+  z 10
            [2,3], // y+x-  z 9
        ],
        edge_faces : [
            [4,5], // y-z-  x
            [2,4], // z+y-  x
            [1,2], // y+z+  x
            [1,5], // y+z-  x
            [3,5], // x-z-  y
            [2,3], // z+x-  y
            [0,2], // x+z+  y
            [0,5], // x+z-  y
            [3,4], // x-y-  z
            [1,3], // y+x-  z
            [0,1], // x+y+  z
            [0,4]  // x+y-  z
        ],
        face_normals : [
            [1,0,0],  // x+ 0
            [0,1,0],  // y+ 1
            [0,0,1],  // z+ 2
            [-1,0,0], // x- 3
            [0,-1,0], // y- 4
            [0,0,-1]  // z- 5
        ],
        face_vertices : [
            [5,6,4,7], //0
            [2,7,3,6], //1
            [1,7,3,5], //2
            [0,3,2,1], //3
            [0,5,4,1], //4
            [0,6,4,2]  //5
        ],
        vertices : vertices
    }

    // Work out edge midpoints
    var edge_midpoints = [];
    for(var i=0; i<12; i++){
        edge_midpoints.push( new THREE.Vector3( 
            (vertices[scene.boundingBox.edge_vertices[i][0]][0] + vertices[scene.boundingBox.edge_vertices[i][1]][0])/2,
            (vertices[scene.boundingBox.edge_vertices[i][0]][1] + vertices[scene.boundingBox.edge_vertices[i][1]][1])/2,
            (vertices[scene.boundingBox.edge_vertices[i][0]][2] + vertices[scene.boundingBox.edge_vertices[i][1]][2])/2
        ));
    }
    scene.boundingBox.edge_midpoints = edge_midpoints;

    // Set holders for dynamic plot components
    dynamicFaces = [];
    for(var i=0; i<6; i++){
        dynamicFaces.push([]);
    }
    dynamicEdges = [];
    for(var i=0; i<12; i++){
        dynamicEdges.push([
            [],[],[],[],[],[]
        ]);
    }
    scene.dynamicDeco = {
        faces : dynamicFaces,
        edges : dynamicEdges
    }
    

    // Add event listener
    scene.showhideDynamics = function(camera){

        // Set variables
        var face_normals   = this.boundingBox.face_normals;
        var edge_vertices  = this.boundingBox.edge_vertices;
        var face_vertices  = this.boundingBox.face_vertices;
        var edge_faces     = this.boundingBox.edge_faces;
        var edge_midpoints = this.boundingBox.edge_midpoints;

        // Work out which faces are visible
        var face_visibility = [0,0,0,0,0,0];
        for(var face=0; face<3; face++){
            var face_norm = new THREE.Vector3().fromArray(face_normals[face]);
            face_norm.applyQuaternion(this.plotHolder.quaternion);
            
            var origin = this.plotPoints.position.clone();
            origin.add( new THREE.Vector3(aspect[0]/2, aspect[1]/2, aspect[2]/2) );
            origin.applyQuaternion(this.plotHolder.quaternion);
            camera_to_origin = origin.clone().sub( camera.position );
            var face_angle   = camera_to_origin.angleTo(face_norm);
            var face_visible = face_angle < Math.PI/2;

            if(face_visible){
                face_visibility[face] = 1;
            } else {
                face_visibility[face+3] = 1;
            }
        }
        
        // Show hide functions that also work with CSS2D objects
        hide_object = function(object){
            if(object.element){
                object.element.hidden = true;
            } else {
                object.visible = false;
            }
        }
        show_object = function(object){
            if(object.element){
                object.element.hidden = false;
            } else {
                object.visible = true;
            }
        }

        // Hide all objects associated with dynamic faces
        var dynamic_objects = this.dynamic_objects;
        for(var i=0; i<dynamic_objects.length; i++){
            hide_object(dynamic_objects[i]);
        }

        // Show objects associated with shown box faces
        var boxfaces = this.dynamicDeco.faces;
        for(var i=0; i<6; i++){
            if(face_visibility[i] == 1){
                for(var j=0; j<boxfaces[i].length; j++){
                    boxfaces[i][j].visible = true;
                }
            }
        }

        // Apply plot rotation to edge midpoints
        var rotated_midpoints = [];
        for(var i=0; i<12; i++){
            rotated_midpoints.push( edge_midpoints[i].clone().applyQuaternion(this.plotHolder.quaternion) );
        }

        // Cycle through edges
        var visible_edges = [];
        for(var i=0; i<12; i++){
            visible_edges.push([0,0,0,0]);
        }
        for(var i=0; i<12; i=i+4){
            
            if(face_visibility[edge_faces[i][0]] + 
               face_visibility[edge_faces[i][1]] == 1){
                var a = i;
                var b = i+2;
            } else {
                var a = i+1;
                var b = i+3;
            }

            visible_edges[a][0] = 1;
            visible_edges[b][0] = 1;

            if(rotated_midpoints[a].x >= rotated_midpoints[b].x) { visible_edges[a][1] = 1 }
            else                                                 { visible_edges[b][1] = 1 }
            if(rotated_midpoints[a].y >= rotated_midpoints[b].y) { visible_edges[a][2] = 1 }
            else                                                 { visible_edges[b][2] = 1 }
            if(rotated_midpoints[a].z >= rotated_midpoints[b].z) { visible_edges[a][3] = 1 }
            else                                                 { visible_edges[b][3] = 1 }

        }

        // Show objects associated with shown dynamic edges
        var boxedges = this.dynamicDeco.edges;
        for(var i=0; i<12; i++){
            
            if(visible_edges[i][0] == 1){
                for(var j=0; j<3; j++){
                    if(visible_edges[i][j+1] == 1){
                        
                        for(var k=0; k<boxedges[i][j].length; k++){
                            show_object(boxedges[i][j][k]);
                        }

                    } else {

                        for(var k=0; k<boxedges[i][j+3].length; k++){
                            show_object(boxedges[i][j+3][k]);
                        }

                    }
                }
            }

        }

        // // Work out visible vertices
        // var visible_vertices = [];
        // for(var i=0; i<visible_faces.length; i++){
        //     visible_vertices = visible_vertices.concat(face_vertices[visible_faces[i]]);
        // }
        
        // // Set the visibility of box edges
        // for(var i=0; i<edge_vertices.length; i++){
        //     if(visible_vertices.indexOf(edge_vertices[i][0]) == -1 
        //        || visible_vertices.indexOf(edge_vertices[i][1]) == -1){
        //         edge_vertices[i].visible = false;
        //     } else {
        //         edge_vertices[i].visible = true;
        //     }
        // }
        
        

        // // Find the invisible vertex
        // for(var i=0; i<8; i++){
        //     if(visible_vertices.indexOf(i) == -1){
        //         var hidden_vertex = i;
        //     }
        // }

        // // Get the position of the hidden vertex
        // var hidden_vertex_pos = vertices[hidden_vertex];

        // axis_midpoints = [];
        // axis_midpoints.push([0,         0,         aspect[2]/2]);
        // axis_midpoints.push([0,         aspect[1], aspect[2]/2]);
        // axis_midpoints.push([aspect[0], aspect[1], aspect[2]/2]);
        // axis_midpoints.push([aspect[0], 0,         aspect[2]/2]);
        
        // this.plotPoints.updateMatrixWorld();
        // var axis_midpoint_projections = [];
        // for(var i=0; i<axis_midpoints.length; i++){
        // 	var vec = new THREE.Vector3().fromArray(axis_midpoints[i]);
        // 	vec.applyMatrix4(this.plotPoints.matrixWorld).project(camera);
        // 	axis_midpoint_projections.push(vec.toArray());
        // }

        // // Get axis x and y coordinates
        // var leftmost_val = 0;
        // var leftmost_i;
        // for(var i=0; i<axis_midpoint_projections.length; i++){
        //     if(axis_midpoint_projections[i][0] < leftmost_val){
        //     	leftmost_val = axis_midpoint_projections[i][0];
        //     	leftmost_i   = i;
        //     }
        // }

        // Work out plot orientation
        //console.log(this.plotPoints.matrixWorld);

        // if(leftmost_i == 0){
        // 	scene.plotPoints.cube.visible = true;
        // } else {
        // 	scene.plotPoints.cube.visible = false;
        // }
        

        // // Work out which axis to show
        // for(var i=0; i<this.axes.length; i++){
        //     var axis = this.axes[i];
        //     if(axis.loc != "fixed"){
        //         var main_dim = axis.main_dim;
        //         var sub_dims = axis.sub_dims;
                
        //         var axis_pos1 = [0,0,0];
        //         axis_pos1[sub_dims[0]] = hidden_vertex_pos[sub_dims[0]];
        //         axis_pos1[sub_dims[1]] = -(hidden_vertex_pos[sub_dims[1]] - aspect[sub_dims[1]]/2) + aspect[sub_dims[1]]/2;
        //         axis_pos1[main_dim]    = -(hidden_vertex_pos[main_dim] - aspect[main_dim]/2) + aspect[main_dim]/2;

        //         var axis_pos2 = [0,0,0];
        //         axis_pos2[sub_dims[0]] = -(hidden_vertex_pos[sub_dims[0]] - aspect[sub_dims[0]]/2) + aspect[sub_dims[0]]/2;
        //         axis_pos2[sub_dims[1]] = hidden_vertex_pos[sub_dims[1]];
        //         axis_pos2[main_dim]    = -(hidden_vertex_pos[main_dim] - aspect[main_dim]/2) + aspect[main_dim]/2;

        //         // var axis_pos1 = [axis_pos[0], -(axis_pos[1] - aspect[1]/2) + aspect[1]/2, 0];
        //         // var axis_pos2 = [-(axis_pos[0] - aspect[0]/2) + aspect[0]/2, axis_pos[1], 0];

        //         var axis_test1 = new THREE.Vector3().fromArray(axis_pos1).applyMatrix4(this.plotPoints.matrix).applyQuaternion(this.plotHolder.quaternion).toArray();
        //         var axis_test2 = new THREE.Vector3().fromArray(axis_pos2).applyMatrix4(this.plotPoints.matrix).applyQuaternion(this.plotHolder.quaternion).toArray();

        //         if(axis.loc == "left")   { var axis_comp = axis_test1[0] < axis_test2[0] }
        //         if(axis.loc == "right")  { var axis_comp = axis_test1[0] > axis_test2[0] }
        //         if(axis.loc == "bottom") { var axis_comp = axis_test1[1] < axis_test2[1] }
        //         if(axis.loc == "top")    { var axis_comp = axis_test1[1] > axis_test2[1] }
        //         if(axis.loc == "back")   { var axis_comp = axis_test1[2] < axis_test2[2] }
        //         if(axis.loc == "front")  { var axis_comp = axis_test1[2] > axis_test2[2] }
                
        //         if(axis_comp){
        //             var keypos = axis_pos1;
        //         } else {
        //             var keypos = axis_pos2;
        //         }
                
        //         // Show and hide dynamic axis
        //         axis.objects[0].visible = keypos[sub_dims[0]] == 0 && keypos[sub_dims[1]] == 0;
        //         axis.objects[1].visible = keypos[sub_dims[0]] == 0 && keypos[sub_dims[1]] != 0;
        //         axis.objects[2].visible = keypos[sub_dims[0]] != 0 && keypos[sub_dims[1]] == 0;
        //         axis.objects[3].visible = keypos[sub_dims[0]] != 0 && keypos[sub_dims[1]] != 0;
        //     }
        // }

    };

}

