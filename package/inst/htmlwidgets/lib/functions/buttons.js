

function addButtons(viewport){

    // Create button viewport
    var btn_holder = document.createElement( 'div' );
    btn_holder.color = "#999999";
    btn_holder.style.position = "absolute";
    btn_holder.style.top = "5px";
    btn_holder.style.left = "5px";
    btn_holder.style.fontSize = "200%";
    btn_holder.style.color = btn_holder.color;
    btn_holder.style.display = "none";
    btn_holder.style.background = "white";
    btn_holder.style.alignItems = "center";
    viewport.appendChild(btn_holder);
    viewport.btns = btn_holder;

    // Create function to make buttons
    function hoverBtn(){
	    this.style.color = "#33cccc";
	}
	function dehoverBtn(){
	    this.style.color = null;
	}
    function createButton(title,
    	                  symbol,
    	                  event){
	    var btn = document.createElement( 'div' );
	    btn.title = title;
	    btn.innerHTML = symbol;
	    btn.addEventListener('mousedown', event);
	    btn.addEventListener('mouseover', hoverBtn);
	    btn.addEventListener('mouseout', dehoverBtn);
	    btn.style.cursor = "pointer";
	    btn.style.marginRight = "4px";
	    btn.style.width = "24px";
	    btn.style.height = "24px";
	    btn.style.lineHeight = "24px";
        //btn.style.background = "white";
	    btn_holder.appendChild(btn);
	    return(btn);
	}

	// Create button to show or hide grid
	function toggle_bgCol(){
		toggleBgCol(viewport);
	}
	var grid_btn = createButton("Change background color",
		                        "<div style='font-size:42px; margin-top:-1px; margin-left:3px'>&#9632;</div>",
		                        toggle_bgCol);


	// Create button to show or hide grid
	function toggle_gridBtn(){
		toggleGrid(viewport);
	}
	var td_style = "style='border:solid 1px black;'";
	var grid_btn = createButton("Toggle grid",
		                        "<div style='font-size:18px; margin-top:0px; margin-left:3px'>&#9638</div>",
		                        toggle_gridBtn);


    // Create button to center map
    function btn_centerMap(){
      viewport.positionScene();
      viewport.camera.center();
    }
	var centerMap_btn = createButton("Center map",
		                             "<div style='margin-left:-4px;'>&#9737;</div>",
		                             btn_centerMap);

	// Create button to download map image
	function btn_saveImg(){
      saveImg(viewport);
	}
	var saveImg_btn = createButton("Download image",
		                           "PNG",
		                           btn_saveImg);
	saveImg_btn.style.fontFamily = "sans-serif";
	saveImg_btn.style.fontSize = "10px";
	saveImg_btn.style.paddingLeft = "4px";

	// Create button to increase or decrease point size
	function enlargePoints(){
      scale_pointsUp(viewport.pt_objects, 1.2);
	}
	function shrinkPoints(){
      scale_pointsDown(viewport.pt_objects, 1.2);
	}
	var scaleUp_btn   = createButton("Enlarge points",
		                             "<div style='margin-left:3px; margin-top:-2px;'>+</div>",
		                             enlargePoints);
	var scaleDown_btn = createButton("Shrink points",
		                             "<div style='margin-left:6px; margin-top:-4px; font-size:40px'>-</div>", 
		                             shrinkPoints);

	// Pop out viewer
	if (window!=window.top) {
		function popOutViewer(){
			window.open(window.location.href);
		}
		var popOut_btn   = createButton("Open viewer",
			                             "<div style='margin-left:2px; margin-top:4px; font-size:20px;	'>&#8617;</div>",
			                             popOutViewer);
    }

}

