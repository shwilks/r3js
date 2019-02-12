

function bind_highlight_fns(viewport){

    // Functions called by raycaster
    viewport.hover_intersects = function(intersects){
      var uuids = [];
      for(var i=0; i<intersects.length; i++){
        if(uuids.indexOf(intersects[i].object.uuid) == -1){
          viewport.hover_point(intersects[i].object);
          uuids.push(intersects[i].object.uuid);
        }
      }
    }

    viewport.dehover_intersects = function(intersects){
      for(var i=0; i<intersects.length; i++){
        viewport.dehover_point(intersects[i].object);
      }
    }


    // What to do when a point is hovered over
    viewport.hover_point = function(object){
      if(!object.group){
        viewport.highlight_object(object);
      } else {
        for(var i=0; i<object.group.length; i++){
          viewport.highlight_object(object.group[i]);
        }
      }
      // Show name in browser
      if(object.label){
        viewport.show_label(object);
      }
    };


    // What to do when a point is dehovered over
    viewport.dehover_point = function(object){
      if(!object.group){
        viewport.dehighlight_object(object);
      } else {
        for(var i=0; i<object.group.length; i++){
          viewport.dehighlight_object(object.group[i]);
        }
      }
      // Clear browser
      if(object.label){
        viewport.hide_label(object);
      }
    };


    // Highlight an object
    viewport.highlight_object = function(object){
      if(object.highlight){
        object.material.visible = false;
        object.highlight.visible = true;
        viewport.sceneChange = true;
      }
    }

    // Dehighlight an object
    viewport.dehighlight_object = function(object){
      if(object.highlight){
        object.material.visible = true;
        object.highlight.visible = false;
        viewport.sceneChange = true;
      }
    }


    // Show the object label
    viewport.show_label = function(object){
      var select_div = viewport.selectionInfoDiv;
      var object_div = document.createElement( 'div' );
      object_div.innerHTML = object.label;
      select_div.appendChild(object_div);
      select_div.style.display = "block";
    }

    // Hide the object label
    viewport.hide_label = function(object){
      var select_div = viewport.selectionInfoDiv;
      select_div.style.display = "none";
      select_div.innerHTML = "";
    }

}














