
function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

function getImgData(viewport){
  if(!viewport.save_renderer){
    viewport.save_renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true,
      physicallyCorrectLights: true,
      antialias: true,
      alpha: true
    });
  }
  viewport.save_renderer.setSize(viewport.offsetWidth,
                                 viewport.offsetHeight);
  viewport.save_renderer.setPixelRatio( window.devicePixelRatio );
  viewport.save_renderer.render( viewport.scene, viewport.camera );
  var img_data = viewport.save_renderer.domElement.toDataURL();
  return(img_data);
}

function saveImg(viewport, filename = "map.png"){
    
    var img_data = getImgData(viewport);
    downloadURI(img_data, filename);

}

