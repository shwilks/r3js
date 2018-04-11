
function bind_events(viewport){

    // Add some general event listeners
    window.addEventListener("resize", function(){ 
        viewport.camera.resize();
    });

    // Function to get mouse position
    function getMousePos(event, container){
        var offsets = container.getBoundingClientRect();
        var top     = offsets.top;
        var left    = offsets.left;
        var mouseX  = ( (event.clientX-left) / container.offsetWidth ) * 2 - 1;
        var mouseY  = -( (event.clientY-top) / container.offsetHeight ) * 2 + 1;
        return({
            x:mouseX,
            y:mouseY
        });
    }

    // Add a mouse move event listener
    function viewportMouseMove(event) {
        var mouse = getMousePos(event, this);
        this.mouse.deltaX = mouse.x - this.mouse.x;
        this.mouse.deltaY = mouse.y - this.mouse.y;
        this.mouse.x = mouse.x;
        this.mouse.y = mouse.y;
    }
    viewport.addEventListener("mousemove", viewportMouseMove);

    // Add a touch move event listener
    function viewportTouchMove(event) {
        event.preventDefault();

        // // Make a fake additional touch for testing
        // event = {touches:[
        //     {clientX : event.touches[0].clientX,
        //      clientY : event.touches[0].clientY},
        //     {clientX : 530,
        //      clientY : 630}
        // ]};
        
        var mouse = getMousePos(event.touches[0], this);
        this.mouse.deltaX = mouse.x - this.mouse.x;
        this.mouse.deltaY = mouse.y - this.mouse.y;
        this.mouse.x = mouse.x;
        this.mouse.y = mouse.y;
        
        if(this.touch.num > 1){
            
            // this.mouse.scrollX = -20*this.mouse.deltaX;
            // this.mouse.scrollY = -20*this.mouse.deltaY;
            for(var i=0; i<event.touches.length; i++){
                var touch = getMousePos(event.touches[i], this);
                this.touch.touches[i].last_x = this.touch.touches[i].x;
                this.touch.touches[i].last_y = this.touch.touches[i].y;
                this.touch.touches[i].x = touch.x;
                this.touch.touches[i].y = touch.y;
                this.touch.touches[i].deltaX = this.touch.touches[i].last_x - this.touch.touches[i].x;
                this.touch.touches[i].deltaY = this.touch.touches[i].last_y - this.touch.touches[i].y;
            }
            var dist1 = Math.sqrt(
                Math.pow(this.touch.touches[0].last_x - this.touch.touches[1].last_x, 2) +
                Math.pow(this.touch.touches[0].last_y - this.touch.touches[1].last_y, 2)
            );
            var dist2 = Math.sqrt(
                Math.pow(this.touch.touches[0].x - this.touch.touches[1].x, 2) +
                Math.pow(this.touch.touches[0].y - this.touch.touches[1].y, 2)
            );
            // this.mouse.scrollX = -20*this.mouse.deltaX;
            this.mouse.scrollY = (dist2 - dist1)*20;
        }
    }
    viewport.addEventListener("touchmove", viewportTouchMove);

    // Add mouse down and up listeners
    function viewportMouseDown(event) {
        //event.preventDefault();
        document.activeElement.blur();
        this.mouse.down  = true;
        this.mouse.event = event;
    }
    function viewportMouseUp(event) {
        this.mouse.down  = false;
        this.mouse.event = event;
    }

    function viewportTouchDown(event) {
        event.preventDefault();
        document.activeElement.blur();

        // // Make a fake additional touch for testing
        // event = {touches:[
        //     {clientX : event.touches[0].clientX,
        //      clientY : event.touches[0].clientY},
        //     {clientX : 530,
        //      clientY : 630}
        // ]};

        this.touch.num = event.touches.length;
        if(event.touches.length == 1){
            var mouse = getMousePos(event.touches[0], this);
            this.mouse.x = mouse.x;
            this.mouse.y = mouse.y;
            this.mouse.down  = true;
            this.mouse.event = event;
            raytrace();
        } else {
            this.mouse.down  = false;
            var touches = [];
            for(var i=0; i<event.touches.length; i++){
              var touch = getMousePos(event.touches[i], this);
              touches.push(touch);
            }
            this.touch.touches = touches;
        }
    }
    function viewportTouchUp(event) {
        this.mouse.down  = false;
        this.mouse.event = event;
        this.touch.num = event.touches.length;
        if(viewport.intersected){
            dehover_intersects(viewport.intersected);
            viewport.intersected = null;
        }
    }

    function viewportContextMenu(event){
        this.mouse.down = false;
    }
    viewport.addEventListener("mouseup",     viewportMouseUp);
    viewport.addEventListener("mousedown",   viewportMouseDown);
    viewport.addEventListener("touchend",    viewportTouchUp);
    viewport.addEventListener("touchstart",  viewportTouchDown);
    viewport.addEventListener('contextmenu', viewportContextMenu);

  // Add mouse over mouse out listeners
  function viewportMouseOver() {
      this.mouse.over = true;
  }
  function viewportMouseOut() {
      this.mouse.over = false;
      this.mouse.down = false;
      if(viewport.intersected){
        dehover_point(viewport.intersected);
        viewport.intersected = null;
      }
      viewport.render();
  }

    viewport.addEventListener("mouseover", viewportMouseOver);
    viewport.addEventListener("mouseout", viewportMouseOut);

    // Add a mouse scroll event listener
    function viewportMouseScroll(event){
        event.preventDefault();
        this.mouse.scrollX = dampScroll(event.deltaX);
        this.mouse.scrollY = dampScroll(event.deltaY);
    }
    viewport.addEventListener("wheel", viewportMouseScroll);

    // Add key down event listeners
    function windowKeyDown(event){
        viewport.keydown = event;
        if(viewport.keydown.key == "Meta"){
            viewport.style.cursor = "all-scroll";
            viewport.dragmode = true;
        }
    }
    function windowKeyUp(event){
        viewport.keydown = null;
        viewport.style.cursor = "default";
        viewport.dragmode = false;
    }
    document.addEventListener("keydown", windowKeyDown);
    document.addEventListener("keyup",   windowKeyUp);

    // Window focus event listener
    function windowBlur(){
        windowKeyUp();
        viewport.mouse.down = false;
        viewport.style.cursor = "default";
    }
    window.addEventListener("blur", windowBlur);

}

