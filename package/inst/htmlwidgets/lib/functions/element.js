
R3JS.element = {};
R3JS.element.constructors = {};

R3JS.element.base = class Element {

	show(){ this.object.visible = true  }
    hide(){ this.object.visible = false }
    showMat(){ this.object.material.visible = true  }
    hideMat(){ this.object.material.visible = false }

    showHighlight(){
    	if(this.highlight){
    		this.hideMat();
    		this.highlight.show();
    	}
    }

	hideHighlight(){
    	if(this.highlight){
    		this.showMat();
    		this.highlight.hide();
    	}
    }

    highlightGroup(){
    	if(this.group){
    		for(var i=0; i<this.group.length; i++){
    			this.group[i].showHighlight();
    		}
    	}
    }

    dehighlightGroup(){
    	if(this.group){
    		for(var i=0; i<this.group.length; i++){
    			this.group[i].hideHighlight();
    		}
    	}
    }

    scaleGeo(scale){
    	this.object.geometry.scale(
    		scale[0],
    		scale[1],
    		scale[2]
    	);
    }

    setRenderOrder(order){
    	this.object.renderOrder = order;
    }

    elements(){
        return([this]);
    }

    setColor(color){
        this.object.material.color.set(color);
    }

    raycast(a,b){
        this.object.raycast(a,b);
    }

}



