
R3JS.Scene.prototype.hoverElements = function(elements){

  for(var i=0; i<elements.length; i++){
    
    // elements[i].showLabel();
    elements[i].highlightGroup();

  }

}

R3JS.Scene.prototype.dehoverElements = function(elements){

  for(var i=0; i<elements.length; i++){
    
    // elements[i].hideLabel();
    elements[i].dehighlightGroup();

  }

}



