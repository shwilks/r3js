

function recursivelyReflectObject(object, matrix){
   
   if(object.children.length > 0){
       for(var i=0; i<object.children.length; i++){
           recursivelyReflectObject(object.children[i], matrix);
       }
   } else {
       object.applyMatrix(matrix);
   }

}

function reflectScene(viewport){

    var objects = viewport.pt_objects;
    var vector = new THREE.Vector3( 1, 0, 0 );

    var mapPoints_reflection = vector.clone();
    var mapPoints_rotation = new THREE.Matrix4();
    mapPoints_rotation.extractRotation(viewport.mapPoints.matrixWorld);
    mapPoints_rotation.getInverse(mapPoints_rotation);
    mapPoints_reflection.applyMatrix4(mapPoints_rotation);
    viewport.mapPoints.position.reflect(mapPoints_reflection);
    for(var i=0; i<objects.length; i++){
      var object = objects[i].parent;
      var object_reflection = vector.clone();
      var object_rotation = new THREE.Matrix4();
      object_rotation.extractRotation(object.matrixWorld);
      object_rotation.getInverse(object_rotation);
      object_reflection.applyMatrix4(object_rotation);
      object.position.reflect(object_reflection);
    }

    // Recalculate blobs if shown
    if(viewport.viewer.blobsShown){
        calculateBlobs(viewport.pt_objects, 
                       viewport.viewer.blobSettings);
    }

}

function flip_OutlineFill(viewer){
    var objects = viewer.selected_objects;
    if(objects.length > 0){
      for(var i=0; i<objects.length; i++){
        var fill_col    = colorGet(objects[i].children[0]);
        var outline_col = colorGet(objects[i].children[1]);
        colorPoint(objects[i].children[0], outline_col, true);
        colorPoint(objects[i].children[1], fill_col, true);
        mark_point(objects[i]);
      }
      updateGraphics(objects[objects.length-1]);
    }
}

function toggle_graphics(viewer){

    if(viewer.graphics){
      hide_graphics(viewer);
    } else {
      show_graphics(viewer);
    }

}

// Function to update the graphics
function updateGraphics(object){
  var colorPickers = object.viewer.colorPickers;

  for(var i=0; i<2; i++){
    if(object.children[i].transparent){
      colorPickers[i].fromString("#ffffff");
      colorPickers[i].input.value = "transparent";
      colorPickers[i].transparent.checked = false;
    } else {
      colorPickers[i].fromString(object.children[i].material.color.getHexString());
      colorPickers[i].transparent.checked = true;
    }
  }
}

function disableGraphics(viewer){
  
  var colorPickers = viewer.colorPickers;
  for(var i=0; i<2; i++){
    colorPickers[i].fromString("#111111");
    colorPickers[i].input.value = "";
    colorPickers[i].transparent.checked = false;
    colorPickers[i].transparent.disabled = true;
    colorPickers[i].input.disabled = true;
  }

  for(var i=0; i<viewer.graphics_btns.length; i++){
    var btn = viewer.graphics_btns[i];
    btn.style.cursor = "default";
    btn.style.color = "#555555";
    btn.disabled = true;
  }

}

function enableGraphics(viewer){
  
  var colorPickers = viewer.colorPickers;
  for(var i=0; i<2; i++){
    colorPickers[i].transparent.disabled = false;
    colorPickers[i].input.disabled = false;
  }

  for(var i=0; i<viewer.graphics_btns.length; i++){
    var btn = viewer.graphics_btns[i];
    btn.style.cursor = "pointer";
    btn.style.color = null;
    btn.disabled = false;
  }

}

function show_graphics(viewer){
  
  // Hide filters
  viewer.closeOptions();

  // Open graphics
  viewer.graphics = true;
  highlightBtnLink(viewer.controls.graphicsBtn);

  // Make array for storing buttons
  var graphics_btns = [];
  viewer.graphics_btns = graphics_btns;

  // Make graphics box
  var graphicBox = document.createElement("div");
  graphicBox.style.position = "absolute";
  graphicBox.style.fontFamily = "sans-serif";
  graphicBox.style.fontSize = "12px";
  graphicBox.style.backgroundColor = "#333333";
  graphicBox.style.color = "#ffffff";
  graphicBox.style.padding = "12px";
  graphicBox.style.borderRadius = "6px";
  graphicBox.style.bottom = "8px";
  graphicBox.style.right = "8px";
  graphicBox.style.width = "200px";
  graphicBox.addEventListener("mousedown", function(event){
    event.stopPropagation();
  });
  graphicBox.addEventListener("mouseup", function(event){
    event.stopPropagation();
  });
  viewer.viewport.appendChild(graphicBox);
  viewer.graphicBox = graphicBox;
  
  // Make title
  var graphicBoxTitle = document.createElement("div");
  graphicBoxTitle.innerHTML = "Graphics";
  graphicBoxTitle.style.marginBottom = "10px";
  graphicBoxTitle.style.fontSize = "20px";
  graphicBox.appendChild(graphicBoxTitle);

  // Function for making graphics buttons
  function graphics_btn(content,
                        event,
                        parent){
      
      var btn = document.createElement("div");
      btn.innerHTML = content;
      btn.style.display = "inline-block";
      btn.style.marginLeft = "6px";
      btn.style.marginRight = "6px";
      btn.style.cursor = "pointer";
      btn.style.fontSize = "20px";
      btn.disabled = false;
      btn.addEventListener("mouseup", event);
      btn.addEventListener("mouseover", function(){
        if(!this.disabled){
          this.style.color = "#33cccc";
        }
      });
      btn.addEventListener("mouseout", function(){
        if(!this.disabled){
          this.style.color = null;
        }
      });
      parent.appendChild(btn);
      graphics_btns.push(btn);
      return(btn);
  }

  // Make scale div
  var scaleDiv = document.createElement("div");
  scaleDiv.style.marginTop = "4px";
  graphicBox.appendChild(scaleDiv);

  var scaleDivTitle = document.createElement("div");
  scaleDivTitle.innerHTML = "Point size:";
  scaleDivTitle.style.display = "inline-block";
  scaleDivTitle.style.width = "60px";
  scaleDiv.appendChild(scaleDivTitle);
  
  var scaleGrow = graphics_btn("+",
                               function(){
                                 scale_pointsUp(viewer.selected_objects, 1.2);
                               },
                               scaleDiv);
  
  var scaleShrink = graphics_btn("&#8211;",
                                 function(){
                                   scale_pointsDown(viewer.selected_objects, 1.2);
                                 },
                                 scaleDiv);

  var scaleEqual = graphics_btn("=",
                                function(){
                                  scale_pointsEqual(viewer.selected_objects);
                                },
                                scaleDiv);


  // Make line width div
  var lwidthDiv = document.createElement("div");
  lwidthDiv.style.marginTop = "-2px";
  lwidthDiv.style.marginBottom = "10px";
  graphicBox.appendChild(lwidthDiv);

  var lwidthDivTitle = document.createElement("div");
  lwidthDivTitle.innerHTML = "Line width:";
  lwidthDivTitle.style.display = "inline-block";
  lwidthDivTitle.style.width = "60px";
  lwidthDiv.appendChild(lwidthDivTitle);

  var lwidthGrow = graphics_btn("+",
                                function(){
                                  scale_lwidthUp(viewer.selected_objects, 1.2);
                                },
                                lwidthDiv);
  
  var lwidthShrink = graphics_btn("&#8211;",
                                  function(){
                                    scale_lwidthDown(viewer.selected_objects, 1.2);
                                  },
                                  lwidthDiv);

  var lwidthEqual = graphics_btn("=",
                                 function(){
                                   scale_lwidthEqual(viewer.selected_objects);
                                 },
                                 lwidthDiv);


  // Make color options
  var colorPickers = [];
  var colorDiv = document.createElement("div");

  var flipCols = document.createElement("div");
  flipCols.innerHTML = "&#8645";
  flipCols.style.float = "right";
  flipCols.style.width = "20px";
  flipCols.style.marginRight = "10px";
  flipCols.style.fontSize = "28px";
  flipCols.style.cursor = "pointer";
  flipCols.addEventListener("mouseup", function(){ 
    flip_OutlineFill(viewer);
  });
  graphics_btns.push(flipCols);
  colorDiv.appendChild(flipCols);

  for(var i=0; i<2; i++){
    var colorChange = document.createElement("div");
    var colorInput = document.createElement( 'input' );
    colorInput.style.borderStyle = "none";
    var colorPicker = new jscolor(colorInput, {width:101, 
                                               shadow:false, 
                                               borderWidth:0, 
                                               backgroundColor:'#777777', 
                                               insetColor:'#000', 
                                               position:'top', 
                                               onFineChange:function(){
                                                colorPoints(viewer.selected_objects, "#"+this, this.outline);
                                                this.transparent.checked = true;
                                                viewer.viewport.renderer.render( viewer.viewport.scene,
                                                                                 viewer.viewport.camera );
                                               }, 
                                               //showOnClick:false,
                                               showOnClick:true,
                                               required:false});
    var colorTransparent = document.createElement("input");
    colorTransparent.type = "checkbox";
    colorTransparent.colorInput  = colorInput;
    colorTransparent.colorPicker = colorPicker;
    colorTransparent.addEventListener("change", function(){
      if(this.checked){
        this.colorPicker.fromString("#ff0000");
        colorPoints(viewer.selected_objects, "#"+this.colorPicker, this.outline);
      } else {
        this.colorPicker.fromString("#ffffff");
        this.colorInput.value = "transparent";
        colorPoints(viewer.selected_objects, "transparent", this.outline);
      }
    })
    
    colorPicker.outline = i;
    colorTransparent.outline = i;
    colorPicker.transparent = colorTransparent;
    colorPicker.input = colorInput;
    
    colorChange.appendChild(colorInput);
    colorChange.appendChild(colorTransparent);
    colorDiv.appendChild(colorChange);
    colorPickers.push(colorPicker);
  }
  viewer.colorPickers = colorPickers;
  graphicBox.appendChild(colorDiv);

  // Update graphics to match any selected objects
  if(viewer.selected_objects.length > 0){
    enableGraphics(viewer);
    updateGraphics(viewer.selected_objects[viewer.selected_objects.length - 1]);
  } else {
    disableGraphics(viewer);
  }

}


colorPoints = function(objects, color, outline){
  for(var i=0; i<objects.length; i++){
    colorPoint(objects[i].children[outline], color, true);
    mark_point(objects[i]);
  }
};


function hide_graphics(viewer){
  viewer.graphics = false;
  dehighlightBtnLink(viewer.controls.graphicsBtn);
  viewer.viewport.removeChild(viewer.graphicBox);
}


function colorPoint(object, col, set_default){
  if(col == "transparent"){
    object.transparent = true;
  } else {
  	var three_col = new THREE.Color(col);
  	object.transparent = false;
    object.material.color = three_col;
    if(object.material.emissive){
      object.material.emissive = three_col;
    }
  }
  if(set_default){
  	object.color = col;
  }
}

function colorGet(object){
  var col = object.material.color;
  if(object.transparent){
    col = "transparent";
  }
  return(col);
}


function colorPointsByYear(viewport){
  // Get maximum and minimum stress
  var max_year;
  var min_year;
  var black = new THREE.Color( 0, 0, 0 );
  
  var objects = [];
  objects = objects.concat(viewport.ag_objects);
  objects = objects.concat(viewport.sr_objects);

  for(var i=0; i<objects.length; i++){
    var year = objects[i].year;
    if(year > max_year || i==0){ max_year = year }
    if(year < min_year || i==0){ min_year = year }
  }

  for(var i=0; i<objects.length; i++){
    var year = objects[i].year;
    var rel_year = (year - min_year)/(max_year - min_year);
    var color  = new THREE.Color();
    color.setHSL(0.64*rel_year, 1.0, 0.5);
    colorPoint(objects[i].children[0], color, false);
    colorPoint(objects[i].children[1], black, false);
    mark_point(objects[i]);
  }

}


function colorPointsByProcrustes(viewport){
  // Get maximum and minimum stress
  var max_pc;
  var min_pc;
  var mapData= viewport.viewer.mapData;
  var black = new THREE.Color( 0, 0, 0 );
  
  var objects = [];
  objects = objects.concat(viewport.ag_objects);
  objects = objects.concat(viewport.sr_objects);
  
  function get_dist(from, to){
    var a = new THREE.Vector3( from[0], from[1], from[2] );
    var b = new THREE.Vector3( to[0], to[1], to[2] );
    return(a.distanceTo(b));
  }

  for(var i=0; i<objects.length; i++){
    var pc = objects[i].parent.position.distanceTo(objects[i].procrustes);
    if(pc > max_pc || i==0){ max_pc = pc }
    if(pc < min_pc || i==0){ min_pc = pc }
  }

  for(var i=0; i<objects.length; i++){
    var pc = objects[i].parent.position.distanceTo(objects[i].procrustes);
    var rel_pc = (pc - min_pc)/(max_pc - min_pc);
    var color  = new THREE.Color( rel_pc, 0, 1-rel_pc );
    colorPoint(objects[i].children[0], color, false);
    colorPoint(objects[i].children[1], black, false);
    mark_point(objects[i]);
  }

}


function colorPointsByStress(viewport){
	// Get maximum and minimum stress
	var max_stress;
	var min_stress;
  var black = new THREE.Color( 0, 0, 0 );
	
	for(var obj=0; obj<2; obj++){
		
		if(obj == 0){ var objects = viewport.ag_objects }
		if(obj == 1){ var objects = viewport.sr_objects }

		for(var i=0; i<objects.length; i++){
			var stress = sum_point_stress(objects[i]);
			if(stress > max_stress || i==0){ max_stress = stress }
			if(stress < min_stress || i==0){ min_stress = stress }
		}

    for(var i=0; i<objects.length; i++){
    	var stress = sum_point_stress(objects[i]);
    	var rel_stress = (stress - min_stress)/(max_stress - min_stress);
    	var color  = new THREE.Color( rel_stress, 0, 1-rel_stress );
    	colorPoint(objects[i].children[0], color, false);
      colorPoint(objects[i].children[1], black, false);
      mark_point(objects[i]);
    }
  }
}

function colorPointsByDefault(viewport){
	var objects = viewport.pt_objects;
    for(var i=0; i<objects.length; i++){
    	colorPoint(objects[i].children[0], objects[i].children[0].color, false);
      colorPoint(objects[i].children[1], objects[i].children[1].color, false);
      mark_point(objects[i]);
    }
}

function toggleBgCol(viewport){
    
    var scene = viewport.scene;
    if(scene.background.b == 1){
    	scene.background = new THREE.Color("#000000");
    	viewport.btns.color = "#cccccc";
    	viewport.btns.style.color = "#cccccc";
    	viewport.btns.style.background = "black";
    	viewport.selectionInfoDiv.style.background = "black";
    	viewport.selectionInfoDiv.style.color = "#ffffff";
    	viewport.viewport_holder.style.borderColor = "#333333";
    	viewport.mapStress_div.style.color = "#ffffff";
      viewport.background = "black";
    } else {
    	scene.background = new THREE.Color("#ffffff");
        viewport.btns.color = "#999999";
        viewport.btns.style.color = "#999999";
        viewport.btns.style.background = "white";
        viewport.selectionInfoDiv.style.background = "white";
    	viewport.selectionInfoDiv.style.color = "#000000";
    	viewport.viewport_holder.style.borderColor = "#eeeeee";
    	viewport.mapStress_div.style.color = "#000000";
      viewport.background = "white";
    }

    var grid = viewport.grid;
    for(var i=0; i<grid.children.length; i++){
    	var obj = grid.children[i];
    	for(var j=0; j<obj.geometry.colors.length; j++){
    		var col = obj.geometry.colors[j].clone();
    		var white = new THREE.Color("#ffffff");
    		white.sub(col);
    		obj.geometry.colors[j] = white;
    	}
    	obj.geometry.colorsNeedUpdate = true;
    }


}

function scale_pointsDown(objects, scale){
	for(var i=0; i<objects.length; i++){
      if(!objects[i].blob){
    	  objects[i].scale.x = objects[i].scale.x/scale;
    	  objects[i].scale.y = objects[i].scale.y/scale;
    	  objects[i].scale.z = objects[i].scale.z/scale;
      }
    };
}

function scale_pointsUp(objects, scale){
  for(var i=0; i<objects.length; i++){
      if(!objects[i].blob){
    	  objects[i].scale.x = objects[i].scale.x*scale;
    	  objects[i].scale.y = objects[i].scale.y*scale;
    	  objects[i].scale.z = objects[i].scale.z*scale;
      }
  };
}

function scale_pointsEqual(objects){
    for(var i=0; i<(objects.length-1); i++){
      if(!objects[i].blob){
        objects[i].scale.x = objects[objects.length-1].scale.x;
        objects[i].scale.y = objects[objects.length-1].scale.y;
        objects[i].scale.z = objects[objects.length-1].scale.z;
      }
    };
}


function scale_lwidthDown(objects, scale){
  for(var i=0; i<objects.length; i++){
      objects[i].children[1].material.linewidth = objects[i].children[1].material.linewidth/scale;
    };
}

function scale_lwidthUp(objects, scale){
    for(var i=0; i<objects.length; i++){
      objects[i].children[1].material.linewidth = objects[i].children[1].material.linewidth*scale;
    };
}

function scale_lwidthEqual(objects){
    for(var i=0; i<(objects.length-1); i++){
      objects[i].children[1].material.linewidth = objects[objects.length-1].children[1].material.linewidth;
    };
}



