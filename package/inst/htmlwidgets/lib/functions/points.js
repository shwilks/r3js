

function make_point(object){
    
    // Set default dimensionality
    if(!object.properties.dimensions){
        object.properties.dimensions = 3;
    }
    
    // Set object geometry
    var geometries = get_pointGeos(object.properties.dimensions);
    var geo = geometries[object.shape](object);
    
    // Set object material
    var mat = get_object_material(object);

    // Make object
    var point = new THREE.Mesh(geo, mat);

    // Scale object
    if(object.normalise){
        point.scale.set(object.size/10, 
                        object.size/10, 
                        object.size/10);
    }

    // Normalise the coords
    if(object.normalise){
        object.position = normalise_coords(object.position,
                                           object.lims,
                                           object.aspect);
    }

    // Position object
    point.position.set(object.position[0],
                       object.position[1],
                       object.position[2]);
    if(!point.position.z){
        point.position.z = 0;
    }

    // Return object
    return(point);

}

function get_pointGeos(dimensions, lwd){

    if(dimensions == 2){

        var square = function(object){
            return(new THREE.PlaneBufferGeometry(0.3, 0.3));
        };
        var circle = function(object){
            return(new THREE.CircleBufferGeometry(0.2, 32));
        }
        var ocircle = function(object){
            return(new THREE.RingGeometry( 0.2-object.properties.lwd/25, 0.2, 32 ));
        }
        var lcircle = function(object){
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
        var osquare = function(object){
            var lwd  = object.properties.lwd/12;
            var size = 0.3;
            var inner = Math.sqrt((Math.pow(size,2))/2);
            var outer = Math.sqrt((Math.pow(size+lwd,2))/2);
            var geo = new THREE.RingBufferGeometry(inner, outer, 4, 1);
            geo.rotateZ( Math.PI/4 );
            return(geo);
        };
        var lsquare = function(object){
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

        var circle = function(){
            return(new THREE.SphereBufferGeometry(0.2, 25, 25));
        };
        var square = function(){
            return(new THREE.BoxBufferGeometry( 0.3, 0.3, 0.3 ));
        };
        var osquare = function(object){
            var size = 0.3;
            var lwd  = object.properties.lwd/25;
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
        var lsquare = function(object){
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