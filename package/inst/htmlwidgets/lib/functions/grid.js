
function median(values) {

    values.sort( function(a,b) {return a - b;} );

    var half = Math.floor(values.length/2);

    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}


function generateGrid(viewport, plotPoints, dimensions){

	var bbox    = new THREE.Box3().setFromObject(plotPoints);
	var bsphere = bbox.getBoundingSphere();

	// Get maximum distance from origin
	var max_dist = bsphere.radius/viewport.scene.scale.x;

	var min_val  = Math.floor(-max_dist);
	var max_val  = Math.ceil(max_dist);
	bbox.min.x = min_val;
	bbox.min.y = min_val;
	bbox.min.z = min_val;
	bbox.max.x = max_val;
	bbox.max.y = max_val;
	bbox.max.z = max_val;

    // Set variables based on number of dimensions
	if(dimensions == 2){
		var num_grids = 1;
		bbox.min.z = -20;
		bbox.max.z = -20;
		var range_x = bbox.max.x - bbox.min.x;
		var range_y = bbox.max.y - bbox.min.y;
		bbox.min.x = bbox.min.x - range_x;
		bbox.max.x = bbox.max.x + range_x;
		bbox.min.y = bbox.min.y - range_y;
		bbox.max.y = bbox.max.y + range_y;
		var grid_col = new THREE.Color( "#eeeeee" );
	} else {
		var num_grids = 3;
		var grid_col = new THREE.Color( "#cccccc" );
	}

    // Generate the geometry
    var grid_geo   = new THREE.Geometry();
	for(var j=0; j<num_grids; j++){

		if(j==2){ var k = 0;   }
		else    { var k = j+1; }
		if(k==2){ var l = 0;   }
		else    { var l = k+1; }

		var min0 = bbox.min.getComponent(j);
		var max0 = bbox.max.getComponent(j);
		var min1 = bbox.min.getComponent(k);
		var max1 = bbox.max.getComponent(k);
		var min2 = bbox.min.getComponent(l);
		var max2 = bbox.max.getComponent(l);

		for(var i=min0; i<=max0; i++){
		  var vector1 = new THREE.Vector3(min2,min2,min2);
		  var vector2 = new THREE.Vector3(min2,min2,min2);
		  vector1.setComponent ( j, i );
		  vector1.setComponent ( k, min1 );
		  vector2.setComponent ( j, i );
		  vector2.setComponent ( k, max1 );
		  grid_geo.vertices.push(vector1, 
		                         vector2);
		  grid_geo.colors.push(grid_col,
		  	                   grid_col);
		}
		for(var i=min1; i<=max1; i++){
		  var vector1 = new THREE.Vector3(min2,min2,min2);
		  var vector2 = new THREE.Vector3(min2,min2,min2);
		  vector1.setComponent ( k, i );
		  vector1.setComponent ( j, min0 );
		  vector2.setComponent ( k, i );
		  vector2.setComponent ( j, max0 );
		  grid_geo.vertices.push(vector1, 
		                         vector2);
		  grid_geo.colors.push(grid_col,
		  	                   grid_col);
		}

	}

    // Set the grid material
	var grid_mat = new THREE.LineBasicMaterial( {
		//color: new THREE.Color("#cccccc"),
		vertexColors: THREE.VertexColors
	} );
	var grid = new THREE.LineSegments(grid_geo, grid_mat);

	// Add to a grid holder
	var grid_holder = new THREE.Object3D();
	grid_holder.add(grid);


	// Rotate grid and fade grid lines
	if(dimensions == 3){
		
		grid_holder.rotateX(Math.PI/16);
		grid_holder.rotateY(-Math.PI/4);
		grid_holder.updateMatrixWorld();

	    // Fade grid lines
	    var max_vertex_z = 0;
	    var min_vertex_z = 0;
	    var vertices_z   = [];
	    for(var i=0; i < grid.geometry.colors.length; i++){
	    	var vertex_pos = grid.geometry.vertices[i].clone();
	    	vertex_pos.applyMatrix4(grid.matrixWorld);
	    	vertices_z.push(vertex_pos.z);
	    	if(vertex_pos.z > max_vertex_z){ max_vertex_z = vertex_pos.z }
	    	if(vertex_pos.z < min_vertex_z){ min_vertex_z = vertex_pos.z }
	    }
	    var z_range = max_vertex_z - min_vertex_z;
	    var max_col_val = 0.95;
	    var min_col_val = 0.5;
	    for(var i=0; i < vertices_z.length; i++){
	    	var col_val = 1 - (vertices_z[i]-min_vertex_z)/z_range;
	    	col_val = Math.pow(col_val, 0.4);
	    	col_val = col_val*(max_col_val - min_col_val) + min_col_val;
	    	var vertex_col = new THREE.Color(col_val, col_val, col_val);
	    	grid.geometry.colors[i] = vertex_col;
	    }

	    // Add thicker grid lines for edges
	    var grid_outline_geo = new THREE.Geometry();
	    var grid_outline_col1 = new THREE.Color( "#eeeeee" );
	    var grid_outline_col2 = new THREE.Color( "#aaaaaa" );

	    grid_outline_geo.vertices.push(new THREE.Vector3(min_val, min_val, min_val), 
			                           new THREE.Vector3(max_val, min_val, min_val));
	    grid_outline_geo.colors.push(grid_outline_col1, 
			                         grid_outline_col2);
	    grid_outline_geo.vertices.push(new THREE.Vector3(min_val, min_val, min_val), 
			                           new THREE.Vector3(min_val, max_val, min_val));
	    grid_outline_geo.colors.push(grid_outline_col1, 
			                         grid_outline_col1);
	    grid_outline_geo.vertices.push(new THREE.Vector3(min_val, min_val, min_val), 
			                           new THREE.Vector3(min_val, min_val, max_val));
	    grid_outline_geo.colors.push(grid_outline_col1, 
			                         grid_outline_col2);

	    var grid_outline = new THREE.LineSegments(grid_outline_geo, grid_mat);
	    grid_holder.add(grid_outline);

	}

	// Return the grid object
	return(grid_holder);

}




