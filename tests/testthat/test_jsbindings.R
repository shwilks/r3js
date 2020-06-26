
# Setup workspace
rm(list=ls())

# Test simple 3D plotting
plotData <- plot3js(x   = runif(10),
                    y   = runif(10),
                    z   = runif(10),
                    col = rainbow(10),
                    show_plot = FALSE)

plotWidget <- r3js(plotData)

# Setup code for making rotations and snapshots on render
nframes <- 240
rotationJScode <- paste0("
function(el, x) {
  var nframes = ", nframes,";
  var frames = [];
  function rotate_and_saveImage(){
    if(frames.length < nframes){
      el.viewport.render();
      el.rotateSceneEuclidean([0,((2*Math.PI)/nframes),0]);
      frames.push(getImgData(el.viewport));
      requestAnimationFrame(rotate_and_saveImage);
    } else {
      for(var i=0; i<nframes; i++){
      var frame_num = i+1;
        downloadURI(frames[i], 'map'+frame_num);
      }
      window.close();
    }
  }
  rotate_and_saveImage();
}")

# rotationJScode <- "
# function(el, x) {
#   var int = window.setInterval(function(){
#     el.rotateSceneEuclidean([0,0.01,0]);
#   }, 20);
#   el.addEventListener('mousedown', function(){
#     window.clearInterval(int);
#   });
# }
# "

# Remove any previous images in the downloads folder
unlink(paste0("~/Downloads/map", 1:nframes, ".png"))

# Attach the JS code to the widget to run on initiation
options(viewer = NULL) # Set the plot to open in the browser
plotWidget <- htmlwidgets::onRender(plotWidget,
                                    jsCode = rotationJScode)

# Open the plot widget (note that it needs to pop out into the web browser for the snapshots to work)
print(plotWidget)

stop()

# export3js(plotWidget, "~/Desktop/rotating_plot.html")
