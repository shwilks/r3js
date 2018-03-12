

function addButtons(viewport){

    // Create button viewport
    var btn_holder = document.createElement( 'div' );
    btn_holder.color = "#999999";
    btn_holder.classList.add('glyph-holder');
    btn_holder.style.color = btn_holder.color;
    btn_holder.style.display = "none";
    btn_holder.style.background = "white";
    viewport.appendChild(btn_holder);
    viewport.btns = btn_holder;

    // Create function to make buttons
    function createButton(title,
    	                  symbol,
    	                  event){
	    var btn = document.createElement( 'div' );
	    btn.title = title;
	    btn.innerHTML = symbol;
	    btn.addEventListener('mousedown', event);
	    btn.classList.add("glyph-btn");
	    btn_holder.appendChild(btn);
	    return(btn);
	}

	// Create button to show viewer info
	function show_info(){
	}
	var grid_btn = createButton("Show info",
		                        "<div style='font-family:viewerglyphs'>d</div>",
		                        show_info);


	// Create button to re-center plot
    function btn_centerMap(){
    }
	var centerMap_btn = createButton("Reset orientation",
		                             "<div style='font-family:viewerglyphs'>c</div>",
		                             btn_centerMap);

	// Create button to download image
	function btn_saveImg(){
      saveImg(viewport);
	}
	var saveImg_btn = createButton("Download image",
		                           "<div style='font-family:viewerglyphs'>i</div>",
		                           btn_saveImg);

	// Pop out viewer
	if (window!=window.top) {
		function popOutViewer(){
			window.open(window.location.href);
		}
		var popOut_btn   = createButton("Open viewer",
			                             "<div style='font-family:viewerglyphs'>o</div>",
			                             popOutViewer);
    }


    // Add mouseover events to show and hide buttons
    viewport.addEventListener("mouseover", function(){
    	btn_holder.style.display = "block";
    });
    viewport.addEventListener("mouseout", function(){
    	btn_holder.style.display = "none";
    });

}

