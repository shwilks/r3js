
function get_viewer_data(viewer){
  
  // Store the viewer data as an object
  var viewerData = {};
  
  // Get map rotation and transformation
  var transform_matrix = new THREE.Matrix4;
  transform_matrix.extractRotation(viewer.viewport.mapHolder.matrix);
  if(viewer.mapData.dimensions == 2){
    transform_matrix.copyPosition(viewer.viewport.scene.matrix);
  } else {
    transform_matrix.copyPosition(viewer.viewport.mapPoints.matrix);
  }
  viewerData.transform = transform_matrix.elements;

  // Get map zoom
  if(viewer.mapData.dimensions == 2){
    viewerData.zoom = viewer.viewport.scene.scale.x;
  } else {
    viewerData.zoom = viewer.viewport.camera.position.z;
  }

  // Get background color
  viewerData.background = viewer.viewport.background;

  // Return the data
  return(viewerData);

}

function set_viewer_data(viewer, viewerData){

  // Set map rotation and transformation
  if(viewerData.transform){
    
    var transform_matrix = new THREE.Matrix4();
    transform_matrix.fromArray(viewerData.transform);

    var rotation_matrix  = new THREE.Matrix4();
    rotation_matrix.extractRotation(transform_matrix);
    viewer.viewport.mapHolder.applyMatrix(rotation_matrix);

    if(viewer.mapData.dimensions == 2){
        var rotation_matrix_inverse = new THREE.Matrix4();
        rotation_matrix_inverse.getInverse(rotation_matrix);
        for(var i=0; i<viewer.viewport.pt_objects.length; i++){
            viewer.viewport.pt_objects[i].applyMatrix(rotation_matrix_inverse);
        }
      }

    var translation_matrix = new THREE.Matrix4();
    translation_matrix.copyPosition(transform_matrix);

    if(viewer.mapData.dimensions == 2){
      viewer.viewport.scene.matrix.copyPosition(translation_matrix);
    } else {
      viewer.viewport.mapPoints.matrix.copyPosition(translation_matrix);
    }
  }
  
  // Set map zoom
  if(viewerData.zoom){
    if(viewer.mapData.dimensions == 2){
      viewer.viewport.scene.scale.set( viewerData.zoom,
                     viewerData.zoom,
                     viewerData.zoom );
    } else {
      viewer.viewport.camera.position.z = viewerData.zoom;
    }
  }

  // Set background
  if(viewerData.background){
    if(viewerData.background == "black" 
      && viewer.viewport.scene.background.b == 1){
      toggleBgCol(viewer.viewport);
    }
    if(viewerData.background == "white" 
      && viewer.viewport.scene.background.b == 0){
      toggleBgCol(viewer.viewport);
    }
  }

  // Apply button settings
  if(viewerData.blobs){
      calculateBlobs(viewer.viewport.pt_objects, 
                     viewerData.blobs);
  }

}
