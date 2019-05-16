
// Surface constructor
R3JS.element.constructors.surface = function(
    plotobj,
    plotdims
    ){

    // Setup object
    var object

    // Normalise coords
    if(plotdims){

        var lims   = plotdims.lims;
        var size   = plotdims.size;
        var aspect = plotdims.aspect;

        for(var i=0; i<plotobj.x.length; i++){
            for(var j=0; j<plotobj.x[0].length; j++){
                plotobj.x[i][j] = ((plotobj.x[i][j] - lims[0][0]) / size[0]) * aspect[0];
            }
        }
        for(var i=0; i<plotobj.y.length; i++){
            for(var j=0; j<plotobj.y[0].length; j++){
                plotobj.y[i][j] = ((plotobj.y[i][j] - lims[1][0]) / size[1]) * aspect[1];
            }
        }
        for(var i=0; i<plotobj.z.length; i++){
            for(var j=0; j<plotobj.z[0].length; j++){
                plotobj.z[i][j] = ((plotobj.z[i][j] - lims[2][0]) / size[2]) * aspect[2];
            }
        }

    }

    // Make the object
    element = new R3JS.element.surface({
    	x : plotobj.x,
        y : plotobj.y,
        z : plotobj.z,
        properties : plotobj.properties
    });
    
    // Return the object
    return(element);

}


// Sphere object
R3JS.element.surface = class Surface extends R3JS.element.base {

    // Object constructor
    constructor(args){

        super();

        // Set default properties
        if(!args.properties){
            args.properties = {
                mat : "phong",
                color : [0,1,0]
            };
        }

        var nrow = args.x.length;
        var ncol = args.x[0].length;

        // Set object geometry
        var geo = new THREE.PlaneGeometry(5, 5, ncol-1, nrow-1);
        var material = R3JS.Material(args.properties);

        // Color surface by vertices if more than one color supplied
        var surface_cols = args.properties.color;
        if(surface_cols.r.length > 1){
            for(var i=0; i<geo.faces.length; i++){
                geo.faces[i].vertexColors[0] = new THREE.Color(
                    surface_cols.r[geo.faces[i].a],
                    surface_cols.g[geo.faces[i].a],
                    surface_cols.b[geo.faces[i].a]
                );
                geo.faces[i].vertexColors[1] = new THREE.Color(
                    surface_cols.r[geo.faces[i].b],
                    surface_cols.g[geo.faces[i].b],
                    surface_cols.b[geo.faces[i].b]
                );
                geo.faces[i].vertexColors[2] = new THREE.Color(
                    surface_cols.r[geo.faces[i].c],
                    surface_cols.g[geo.faces[i].c],
                    surface_cols.b[geo.faces[i].c]
                );
            }
            material.vertexColors = THREE.VertexColors;
            material.color = new THREE.Color();
        }


        // Set vertices
        var n = 0;
        var nas = [];
        for(var i=0; i<args.x.length; i++){
            for(var j=0; j<args.x[0].length; j++){
                if(!isNaN(args.z[i][j])){
                    var coords = [args.x[i][j], args.y[i][j], args.z[i][j]];
                    geo.vertices[n].set(
                        coords[0],
                        coords[1],
                        coords[2]
                    )
                } else {
                    geo.vertices[n].set(
                        null,
                        null,
                        null
                    );
                    nas.push(n);
                };
                n++;
            }
        }

        // Remove faces with nas
        var i=0
        while(i<geo.faces.length){
            var face = geo.faces[i];
            if(nas.indexOf(face.a) != -1 || 
               nas.indexOf(face.b) != -1 || 
               nas.indexOf(face.c) != -1){
                geo.faces.splice(i,1);
            } else {
                i++;
            }
        }

        // Calculate normals
        geo.computeVertexNormals();
        geo = new THREE.BufferGeometry().fromGeometry( geo );

        // Make object
        this.object = new THREE.Mesh(geo, material);
        this.object.element = this;

    }

}



function make_surface(object){

    //console.log(object.properties.color);
    // Get number of rows and columns
    var nrow = object.x.length;
    var ncol = object.x[0].length;

    // Set object geometry
    var geo = new THREE.PlaneGeometry(5, 5, ncol-1, nrow-1);


    var surface_cols = Object.assign({}, object.properties.color);
    var mat = get_object_material(object);

    // Color surface by vertices if more than one color supplied
    if(surface_cols[0].length > 1){
        for(var i=0; i<geo.faces.length; i++){
            geo.faces[i].vertexColors[0] = new THREE.Color(
                surface_cols[0][geo.faces[i].a],
                surface_cols[1][geo.faces[i].a],
                surface_cols[2][geo.faces[i].a]
            );
            geo.faces[i].vertexColors[1] = new THREE.Color(
                surface_cols[0][geo.faces[i].b],
                surface_cols[1][geo.faces[i].b],
                surface_cols[2][geo.faces[i].b]
            );
            geo.faces[i].vertexColors[2] = new THREE.Color(
                surface_cols[0][geo.faces[i].c],
                surface_cols[1][geo.faces[i].c],
                surface_cols[2][geo.faces[i].c]
            );
        }
        mat.vertexColors = THREE.VertexColors;
        mat.color = new THREE.Color();
    }
    
    
    // // Find a safe vertex
    // var safe_vertex = null;
    // for(var i=0; i<object.z.length; i++){
    //     if(safe_vertex){ break; }
    //     for(var j=0; j<object.z[0].length; j++){
    //         if(!isNaN(object.z[i][j])){
    //             safe_vertex = new THREE.Vector3(
    //                 object.x[i][j],
    //                 object.y[i][j],
    //                 object.z[i][j]
    //             );
    //             break;
    //         }
    //     }
    // }

    // Set vertices
    var n = 0;
    var nas = [];
    for(var i=0; i<object.x.length; i++){
        for(var j=0; j<object.x[0].length; j++){
            if(!isNaN(object.z[i][j])){
                if(object.normalise){
                    var coords = normalise_coords(
                        [object.x[i][j], object.y[i][j], object.z[i][j]],
                        object.lims,
                        object.aspect
                    );
                } else {
                    var coords = [object.x[i][j], object.y[i][j], object.z[i][j]];  
                }
                geo.vertices[n].set(
                    coords[0],
                    coords[1],
                    coords[2]
                )
            } else {
                geo.vertices[n].set(
                    null,
                    null,
                    null
                );
                nas.push(n);
            };
            n++;
        }
    }

    // Remove faces with nas
    var i=0
    while(i<geo.faces.length){
        var face = geo.faces[i];
        if(nas.indexOf(face.a) != -1 || 
           nas.indexOf(face.b) != -1 || 
           nas.indexOf(face.c) != -1){
            geo.faces.splice(i,1);
        } else {
            i++;
        }
    }

    // Calculate normals
    geo.computeVertexNormals();
    geo = new THREE.BufferGeometry().fromGeometry( geo );

    // Make object
    var surface = new THREE.Mesh(geo, mat);
    return(surface);

}

