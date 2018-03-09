

// Functions called by raycaster
function hover_intersects(intersects){
  var uuids = [];
  for(var i=0; i<intersects.length; i++){
    if(uuids.indexOf(intersects[i].object.uuid) == -1){
      hover_point(intersects[i].object);
      uuids.push(intersects[i].object.uuid);
    }
  }
}

function dehover_intersects(intersects){
  for(var i=0; i<intersects.length; i++){
    dehover_point(intersects[i].object);
  }
}


// What to do when a point is hovered over
function hover_point(object){
  if(!object.group){
    highlight_object(object);
  } else {
    for(var i=0; i<object.group.length; i++){
      highlight_object(object.group[i]);
    }
  }
  // Show name in browser
  if(object.label){
    show_label(object);
  }
};


// What to do when a point is dehovered over
dehover_point = function(object){
  if(!object.group){
    dehighlight_object(object);
  } else {
    for(var i=0; i<object.group.length; i++){
      dehighlight_object(object.group[i]);
    }
  }
  // Clear browser
  if(object.label){
    hide_label(object);
  }
};


// Highlight an object
function highlight_object(object){
  if(object.highlight){
    object.material.visible = false;
    object.highlight.visible = true;
  }
}

// Dehighlight an object
function dehighlight_object(object){
  if(object.highlight){
    object.material.visible = true;
    object.highlight.visible = false;
  }
}


// Show the object label
function show_label(object){
  var select_div = object.viewport.selectionInfoDiv;
  var object_div = document.createElement( 'div' );
  object_div.innerHTML = object.label;
  select_div.appendChild(object_div);
  select_div.style.display = "block";
}

// Hide the object label
function hide_label(object){
  var select_div = object.viewport.selectionInfoDiv;
  select_div.style.display = "none";
  select_div.innerHTML = "";
}










