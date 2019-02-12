
function generateViewport(plotData, viewer){

    var viewport = document.createElement( 'div' );
    viewport.id = "viewport";
    viewport.className += " r3js-viewport";

    var viewport_holder = document.createElement( 'div' );
    viewport_holder.id = "viewport-holder";
    viewport_holder.appendChild( viewport );
    viewer.appendChild( viewport_holder );
    viewport.viewport_holder = viewport_holder;
    viewer.viewport_holder = viewport_holder;
    viewer.viewport = viewport;

    // Bind plot data
    viewport.plotData = plotData;

    // Create selection info div
    var selection_info_div = document.createElement( 'div' );
    selection_info_div.id  = "selection-info-div";
    viewport.appendChild( selection_info_div );
    viewport.selectionInfoDiv = selection_info_div;

    // Create info div
    var info_div = document.createElement( 'div' );
    info_div.id  = "info-div";
    info_div.style.display = "none";
    viewport.appendChild( info_div );
    viewport.infoDiv = info_div;


    // Function to make the info inputs
    function makeInfoInput(fun){
      
      // Make the div
      var infoInputDiv = document.createElement('div');
      
      // Style the div
      infoInputDiv.contentEditable = true;

      // Add key input event listeners
      infoInputDiv.addEventListener("keydown", function(e){
        
        if(e.key == "Enter"){

          // Run the function
          fun();

          // Render the scene
          viewport.render();

          e.preventDefault();

          this.blur();

        }

      });

      infoInputDiv.addEventListener("mousedown", function(e){
        this.contentEditable = true;
      });
      
      infoInputDiv.addEventListener("blur", function(e){
        this.contentEditable = false;
      });

      // Return the div
      return(infoInputDiv);

    }


    // Create the table
    var info_table = document.createElement( 'table' );
    info_div.appendChild(info_table);

    // Table header
    var info_table_header = document.createElement('th');
    info_table_header.colspan = 5;
    info_table.appendChild(info_table_header)

    // Rotation info
    var info_table_rotationRow = document.createElement('tr');
    info_table.appendChild(info_table_rotationRow);
    info_table_rotationRow.innerHTML = "<td>Rotation</td><td>:</td>";
    
    var info_table_rotationCell_x = document.createElement('td');
    var info_table_rotationCell_y = document.createElement('td');
    var info_table_rotationCell_z = document.createElement('td');

    info_table_rotationRow.appendChild(info_table_rotationCell_x);
    info_table_rotationRow.appendChild(info_table_rotationCell_y);
    info_table_rotationRow.appendChild(info_table_rotationCell_z);

    var setRotationFromInfo = function(){

      viewport.scene.setRotationDegrees([
        Number(info_div.rotationDiv[0].innerHTML),
        Number(info_div.rotationDiv[1].innerHTML),
        Number(info_div.rotationDiv[2].innerHTML)
      ]);

    }

    var info_table_rotationInfo_x = makeInfoInput(setRotationFromInfo);
    var info_table_rotationInfo_y = makeInfoInput(setRotationFromInfo);
    var info_table_rotationInfo_z = makeInfoInput(setRotationFromInfo);

    info_table_rotationCell_x.appendChild(info_table_rotationInfo_x);
    info_table_rotationCell_y.appendChild(info_table_rotationInfo_y);
    info_table_rotationCell_z.appendChild(info_table_rotationInfo_z);

    info_div.rotationDiv = [
      info_table_rotationInfo_x,
      info_table_rotationInfo_y,
      info_table_rotationInfo_z
    ];

    

    // Translation info
    var info_table_translationRow = document.createElement('tr');
    info_table.appendChild(info_table_translationRow);
    info_table_translationRow.innerHTML = "<td>Translation</td><td>:</td>";
    
    var info_table_translationCell_x = document.createElement('td');
    var info_table_translationCell_y = document.createElement('td');
    var info_table_translationCell_z = document.createElement('td');

    info_table_translationRow.appendChild(info_table_translationCell_x);
    info_table_translationRow.appendChild(info_table_translationCell_y);
    info_table_translationRow.appendChild(info_table_translationCell_z);

    var setTranslationFromInfo = function(){

      viewport.scene.setTranslation([
        Number(info_div.translationDiv[0].innerHTML),
        Number(info_div.translationDiv[1].innerHTML),
        Number(info_div.translationDiv[2].innerHTML)
      ]);

    }

    var info_table_translationInfo_x = makeInfoInput(setTranslationFromInfo);
    var info_table_translationInfo_y = makeInfoInput(setTranslationFromInfo);
    var info_table_translationInfo_z = makeInfoInput(setTranslationFromInfo);

    info_table_translationCell_x.appendChild(info_table_translationInfo_x);
    info_table_translationCell_y.appendChild(info_table_translationInfo_y);
    info_table_translationCell_z.appendChild(info_table_translationInfo_z);

    info_div.translationDiv = [
      info_table_translationInfo_x,
      info_table_translationInfo_y,
      info_table_translationInfo_z
    ];


    // Zoom info
    var info_table_zoomRow = document.createElement('tr');
    info_table.appendChild(info_table_zoomRow);
    info_table_zoomRow.innerHTML = "<td>Zoom</td><td>:</td>";
    
    var info_table_zoomCell = document.createElement('td');
    info_table_zoomCell.colspan = 3;
    info_table_zoomRow.appendChild(info_table_zoomCell);

    var info_table_zoomInfo = makeInfoInput(function(){
      
      // Set zoom
      viewport.camera.setZoom(
        Number(info_div.zoomDiv.innerHTML)
      );

    });
    
    info_table_zoomCell.appendChild(info_table_zoomInfo);
    info_div.zoomDiv = info_table_zoomInfo;

    

    // Add methods
    info_div.show = function(){
      this.style.display = "block";
    }
    info_div.hide = function(){
      this.style.display = "none";
    }
    info_div.toggle = function(){
      if(this.style.display == "none"){
        this.show();
      } else {
        this.hide();
      };
    }
    info_div.update = function(force){
      if(this.style.display != "none" || force){
        
        var translation = viewport.scene.getTranslation();
        var rotation    = viewport.scene.getRotation();
        var zoom        = viewport.camera.getZoom();

        // Set rotation div
        this.rotationDiv[0].innerHTML = rotation[0].toFixed(2);
        this.rotationDiv[1].innerHTML = rotation[1].toFixed(2);
        this.rotationDiv[2].innerHTML = rotation[2].toFixed(2);
        
        // Set translation div
        this.translationDiv[0].innerHTML = translation[0].toFixed(1);
        this.translationDiv[1].innerHTML = translation[1].toFixed(1);
        this.translationDiv[2].innerHTML = translation[2].toFixed(1);

        // Set zoom div
        this.zoomDiv.innerHTML = zoom.toFixed(2);

      }
    }

    info_div.addEventListener("mousemove", function(e){ e.stopPropagation() });
    info_div.addEventListener("mouseup",   function(e){ e.stopPropagation() });


    // Return the viewport
    return(viewport);

}
