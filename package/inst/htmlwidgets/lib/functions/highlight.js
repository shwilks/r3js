
R3JS.Viewer.prototype.hoverElements = function(ids){

	for(var i=0; i<ids.length; i++){
		this.scene.elements[ids[i]].highlightGroup();
		this.scene.elements[ids[i]].setColor("lightgreen");
	}
	this.sceneChange = true;

}

R3JS.Viewer.prototype.dehoverElements = function(ids){

	for(var i=0; i<ids.length; i++){
		this.scene.elements[ids[i]].dehighlightGroup();
		this.scene.elements[ids[i]].setColor("lightblue");
	}
	this.sceneChange = true;

}



