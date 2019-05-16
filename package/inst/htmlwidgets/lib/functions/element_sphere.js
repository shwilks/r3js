
// Sphere constructor
R3JS.element.constructors.sphere = function(
    plotobj,
    plotdims
    ){

    // Setup object
    var object

    // Normalise coords
    if(plotdims){

        plotobj.position = R3JS.utils.normalise_coord(
            plotobj.position,
            plotdims
        );

    }

    // Make the object
    element = new R3JS.element.sphere({
    	radius : plotobj.radius,
        coords : plotobj.position,
        properties : plotobj.properties,
        plotdims : plotdims
    });
    
    // Return the object
    return(element);

}


// Sphere object
R3JS.element.sphere = class Sphere extends R3JS.element.base {

    // Object constructor
    constructor(args){

        super();

        // Check arguments
        if(typeof(args.radius) === "undefined") {
            throw("Radius must be specified");
        }

        // Set default properties
        if(!args.properties){
            args.properties = {
                mat : "phong",
                color : [0,1,0]
            };
        }

        // Make geometry
        var geometry = new THREE.SphereGeometry(args.radius, 32, 32);
        if(args.plotdims){

            for(var i=0; i<geometry.vertices.length; i++){
                geometry.vertices[i].x = (geometry.vertices[i].x/args.plotdims.size[0])*args.plotdims.aspect[0];
                geometry.vertices[i].y = (geometry.vertices[i].y/args.plotdims.size[1])*args.plotdims.aspect[1];
                geometry.vertices[i].z = (geometry.vertices[i].z/args.plotdims.size[2])*args.plotdims.aspect[2];
            }
            geometry.computeFaceNormals();
            geometry.computeVertexNormals();

        }

        // Set material
        var material = R3JS.Material(args.properties);

        // Make object
        this.object  = new THREE.Mesh(geometry, material);
        this.object.element = this;
        
        // Set position
        this.object.position.set(
            args.coords[0],
            args.coords[1],
            args.coords[2]
        );

    }

}

