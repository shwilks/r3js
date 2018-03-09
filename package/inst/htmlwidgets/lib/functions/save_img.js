
function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

function saveImg(viewport){
    var save_renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true,
      physicallyCorrectLights: true,
      antialias: true,
      alpha: true
    });
    save_renderer.setSize(viewport.offsetWidth,
    	                  viewport.offsetHeight);
    save_renderer.setPixelRatio( window.devicePixelRatio );
    save_renderer.render( viewport.scene, viewport.camera );
    var img_data = save_renderer.domElement.toDataURL();
    downloadURI(img_data, "map.png");
}

