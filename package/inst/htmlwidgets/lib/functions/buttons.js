

R3JS.Viewport.prototype.addButtons = function(){

	var viewer = this.viewer;

    // Create button viewport
    var btn_holder = document.createElement( 'div' );
    btn_holder.color = "#999999";
    btn_holder.classList.add('glyph-holder');
    btn_holder.style.color = btn_holder.color;
    btn_holder.style.display = "none";
    btn_holder.style.background = "white";
    this.div.appendChild(btn_holder);
    this.btns = btn_holder;

    // Create function to make buttons
    var createButton = function(title,
    	                        symbol,
    	                        event){

	    var btn = document.createElement( 'div' );
	    btn.classList.add("glyph-btn");
	    btn.classList.add('not-selectable');
	    btn.title = title;
	    btn.innerHTML = symbol;
	    btn.event = event;
	    btn.addEventListener('mousedown', function(e){
	    	e.stopPropagation();
	    });
	    btn.addEventListener('mouseup', function(e){
	    	this.event();
	    	e.stopPropagation();
	    });
	    btn_holder.appendChild(btn);
	    btn.updateSymbol = function(symbol){
	    	this.innerHTML = symbol;
	    }
	    return(btn);

	}
	this.btns.createButton = createButton;

	// Create button to show viewer info
	function show_info(){
		// this.infoDiv.toggle();
	}
	var grid_btn = createButton("Show info",
		                        icon_info(),
		                        show_info);


	// Create button to re-center plot
    function btn_centerScene(){
    	viewer.resetTransformation();
    }
	var centerScene_btn = createButton("Reset orientation",
		                               icon_center(),
		                               btn_centerScene);
	this.btns.centerScene = centerScene_btn;

	// Create button to download image
	function btn_saveImg(){
      	viewer.downloadImage(viewer.name);
	}
	var saveImg_btn = createButton("Download image",
		                           icon_snapshot(),
		                           btn_saveImg);

	// Pop out viewer
	if (window!=window.top) {
		function popOutViewer(){
			window.open(window.location.href);
		}
		var popOut_btn   = createButton("Open viewer",
			                             icon_open(),
			                             popOutViewer);
    }


    // Add mouseover events to show and hide buttons
    this.div.addEventListener("mouseover", function(){
    	btn_holder.style.display = "block";
    });
    this.div.addEventListener("mouseout", function(){
    	btn_holder.style.display = "none";
    });

}

