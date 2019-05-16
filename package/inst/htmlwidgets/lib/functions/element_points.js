
// GL line constructor
R3JS.element.constructors.point = function(
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
        )
    }

    // Generate the point object
    element = new R3JS.element.point({
        coords : plotobj.position,
        size : plotobj.size*0.2,
        shape : plotobj.shape,
        properties : plotobj.properties,
        dimensions : plotobj.properties.dimensions
    });

    return(element);

}


// Make a thin line object
R3JS.element.point = class Point extends R3JS.element.base {

    constructor(args){

      super();

      // Set defaults
      if(!args.shape)      args.shape = "circle";
      if(!args.size)       args.size  = 0.2;
      if(!args.dimensions) args.dimensions = 3;
      if(!args.properties){
        args.properties = {
          mat : "phong",
          color : {
            r : 0,
            g : 0,
            b : 0
          },
          lwd : 1
        }
      }

      // Set object geometry
      var geometries = R3JS.get_pointGeos(args.dimensions);
      var geo = geometries[args.shape](args.properties.lwd);

      // Set object material
      var mat = R3JS.Material(args.properties);

      // Make object
      this.object = new THREE.Mesh(geo, mat);
      this.object.element = this;

      // Scale the object
      this.object.scale.set(args.size, 
                            args.size, 
                            args.size);

      // Position object
      this.object.position.set(args.coords[0],
                               args.coords[1],
                               args.coords[2]);

    }

}


// Geometries for each point type
R3JS.get_pointGeos = function(dimensions, lwd){

    if(dimensions == 2){

        var square = function(lwd){
            return(new THREE.PlaneBufferGeometry(0.3, 0.3));
        };
        var circle = function(lwd){
            return(new THREE.CircleBufferGeometry(0.2, 32));
        }
        var ocircle = function(lwd){
            return(new THREE.RingGeometry( 0.2-lwd/25, 0.2, 32 ));
        }
        var lcircle = function(lwd){
            var geo = new THREE.BufferGeometry();
            var vertices = new Float32Array([
                0.20000000298023224, 0, 0,
                0.1961570531129837, 0.039018064737319946, 0,
                0.18477590382099152, 0.07653668522834778, 0,
                0.1662939190864563, 0.11111404746770859, 0,
                0.1414213627576828, 0.1414213627576828, 0,
                0.11111404746770859, 0.1662939190864563, 0,
                0.07653668522834778, 0.18477590382099152, 0,
                0.039018064737319946, 0.1961570531129837, 0,
                1.2246467698671066e-17, 0.20000000298023224, 0,
                -0.039018064737319946, 0.1961570531129837, 0,
                -0.07653668522834778, 0.18477590382099152, 0,
                -0.11111404746770859, 0.1662939190864563, 0,
                -0.1414213627576828, 0.1414213627576828, 0,
                -0.1662939190864563, 0.11111404746770859, 0,
                -0.18477590382099152, 0.07653668522834778, 0,
                -0.1961570531129837, 0.039018064737319946, 0,
                -0.20000000298023224, 2.4492935397342132e-17, 0,
                -0.1961570531129837, -0.039018064737319946, 0,
                -0.18477590382099152, -0.07653668522834778, 0,
                -0.1662939190864563, -0.11111404746770859, 0,
                -0.1414213627576828, -0.1414213627576828, 0,
                -0.11111404746770859, -0.1662939190864563, 0,
                -0.07653668522834778, -0.18477590382099152, 0,
                -0.039018064737319946, -0.1961570531129837, 0,
                -3.6739405577555036e-17, -0.20000000298023224, 0,
                0.039018064737319946, -0.1961570531129837, 0,
                0.07653668522834778, -0.18477590382099152, 0,
                0.11111404746770859, -0.1662939190864563, 0,
                0.1414213627576828, -0.1414213627576828, 0,
                0.1662939190864563, -0.11111404746770859, 0,
                0.18477590382099152, -0.07653668522834778, 0,
                0.1961570531129837, -0.039018064737319946, 0,
            ]);
            geo.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
            return(geo);
        };
        var osquare = function(lwd){
            lwd  = lwd/12;
            var size = 0.3;
            var inner = Math.sqrt((Math.pow(size,2))/2);
            var outer = Math.sqrt((Math.pow(size+lwd,2))/2);
            var geo = new THREE.RingBufferGeometry(inner, outer, 4, 1);
            geo.rotateZ( Math.PI/4 );
            return(geo);
        };
        var lsquare = function(lwd){
            var size = 0.3;
            var geo = new THREE.BufferGeometry();
            var vertices = new Float32Array([
              -0.15, -0.15,  0.0,
              -0.15,  0.15,  0.0,
               0.15,  0.15,  0.0,
               0.15, -0.15,  0.0
            ]);
            geo.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
            return(geo);
        };

    }

    if(dimensions == 3){

        var circle = function(lwd){
            return(new THREE.SphereBufferGeometry(0.2, 25, 25));
        };
        var square = function(lwd){
            return(new THREE.BoxBufferGeometry( 0.3, 0.3, 0.3 ));
        };
        var osquare = function(lwd){
            var size = 0.3;
            lwd  = lwd/25;
            var geo = new THREE.Geometry();
            var lims = [-size/2-lwd/4, size/2+lwd/4];

            // Draw lines
            for(var i=0; i<2; i++){
              for(var j=0; j<2; j++){
                var line = line_geo3D([lims[i], 
                                       lims[j],
                                       lims[0]], 
                                      [lims[i], 
                                       lims[j],
                                       lims[1]], 
                                       lwd, false, lwd/2, 0, true);
                geo.merge(line);
              }
            }
            for(var i=0; i<2; i++){
              for(var j=0; j<2; j++){
                var line = line_geo3D([lims[0], 
                                       lims[i],
                                       lims[j]], 
                                      [lims[1], 
                                       lims[i],
                                       lims[j]], 
                                       lwd, false, lwd/2, 0, true);
                geo.merge(line);
              }
            }
            for(var i=0; i<2; i++){
              for(var j=0; j<2; j++){
                var line = line_geo3D([lims[i], 
                                       lims[0],
                                       lims[j]], 
                                      [lims[i], 
                                       lims[1],
                                       lims[j]], 
                                       lwd, false, lwd/2, 0, true);
                geo.merge(line);
              }
            }

            // Add corner pieces
            for(var i=0; i<2; i++){
              for(var j=0; j<2; j++){
                for(var k=0; k<2; k++){
                  var corner = new THREE.BoxGeometry( lwd/2, lwd/2, lwd/2 );
                  corner.translate(lims[i], lims[j], lims[k]);
                  geo.merge(corner);
                }
              }
            }
            
            geo.mergeVertices();
            geo = new THREE.BufferGeometry().fromGeometry(geo);
            return(geo);
        };
        var lsquare = function(lwd){
          var geo = new THREE.BoxBufferGeometry( 0.3, 0.3, 0.3 );
          var edges = new THREE.EdgesGeometry( geo );
          return( edges );
        }
        var ocircle = circle;
        var lcircle = circle;

    }
    
    return({
        square:  square,
        osquare: osquare,
        lsquare: lsquare,
        circle:  circle,
        ocircle: ocircle,
        lcircle: lcircle
    })
}