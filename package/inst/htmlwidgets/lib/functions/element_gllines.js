
// GL line constructor
R3JS.element.constructors.glline = function(
    plotobj,
    scene
    ){

    // Setup object
    if(plotobj.properties.lwd > 1){
        var element = new R3JS.element.gllines_fat({
            coords : plotobj.position,
            properties : plotobj.properties,
            viewport : scene.viewer.viewport
        });
    } else {
        var element = new R3JS.element.gllines_thin({
            coords : plotobj.position,
            properties : plotobj.properties
        });
    }
    return(element);

}


// Make a thin line object
R3JS.element.gllines_thin = class GLLines_thin extends R3JS.element.base {

    constructor(args){

        super();
        var ncoords = args.coords.length;

        // Set default properties
        if(!args.properties){
            args.properties = {
                mat : "line",
                lwd : 1,
                color : {
                    r : Array(ncoords).fill(0),
                    g : Array(ncoords).fill(0),
                    b : Array(ncoords).fill(0)
                }
            };
        }

        // Set position and color
        var positions = new Float32Array( ncoords * 3 );
        var color     = new Float32Array( ncoords * 4 );
        
        // Fill in info
        for(var i=0; i<args.coords.length; i++){

            positions[i*3]   = args.coords[i][0];
            positions[i*3+1] = args.coords[i][1];
            positions[i*3+2] = args.coords[i][2];

            color[i*4]   = args.properties.color.r[i];
            color[i*4+1] = args.properties.color.g[i];
            color[i*4+2] = args.properties.color.b[i];
            color[i*4+3] = 1;

        }

        // Create buffer geometry
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.addAttribute( 'color',    new THREE.BufferAttribute( color,     4 ) );

        // Create the material
        var material = R3JS.Material(args.properties);
        material.color = new THREE.Color();
        material.vertexColors = THREE.VertexColors;
        material.linewidth = args.properties.lwd;

        // Make the actual line object
        if(args.segments){
            this.object = new THREE.LineSegments( geometry, material );
        } else {
            this.object = new THREE.Line( geometry, material );
        }
        if(args.gapSize){
            this.object.computeLineDistances();
        }
        this.object.element = this;

    }

}


// Make a fat line object
R3JS.element.gllines_fat = class GLLines_fat extends R3JS.element.base {

    constructor(args){

        super();
        
        // Set colors and positions
        var positions = [];
        var colors    = [];
        for(var i=0; i<args.coords.length; i++){
            positions.push(
                args.coords[i][0], 
                args.coords[i][1], 
                args.coords[i][2]
            );
            colors.push(
                args.properties.color.r[i],
                args.properties.color.g[i],
                args.properties.color.b[i]
            );
        }
        
        // Make geometry
        var geometry = new THREE.LineGeometry();
        geometry.setPositions( positions );
        geometry.setColors( colors );

        // Make material
        var matLine = new THREE.LineMaterial( {
            color: 0xffffff,
            vertexColors: THREE.VertexColors
        } );
        matLine.linewidth = args.properties.lwd;

        if(args.properties.gapSize){
            matLine.dashed    = true;
            matLine.dashScale = 200;
            matLine.dashSize  = args.properties.dashSize;
            matLine.gapSize   = args.properties.gapSize;
            matLine.defines.USE_DASH = "";
        }
        
        
        // Add a resize event listener to the viewport
        args.viewport.onresize.push(
            function(){
                matLine.resolution.set( 
                    args.viewport.getWidth(), 
                    args.viewport.getHeight()
                );
            }
        );

        // Make line
        this.object = new THREE.Line2( geometry, matLine );
        this.object.computeLineDistances();

    }

}





