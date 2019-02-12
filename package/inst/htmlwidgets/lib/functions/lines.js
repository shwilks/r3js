
function get_lineGeos(dimensions, lwd){

    if(dimensions == 2){

        var line = function(length, width){
            var geo = new THREE.PlaneGeometry( width*0.05, length );
            geo.translate( 0, -length/2, 0 );
            return(geo);
        };
        var arrow = function(length, width){
            var geo = new THREE.Geometry();
            geo.vertices.push(
                new THREE.Vector3( 0, 0, 0 ),
                new THREE.Vector3( width/2, length, 0 ),
                new THREE.Vector3( -width/2, length, 0 )
            );
            geo.faces.push( new THREE.Face3( 0, 1, 2 ) );
            return(geo);
        };

    }

    if(dimensions == 3){

        var line = function(length, width){
            var geo = new THREE.CylinderGeometry( width*0.025, width*0.025, length, 32 );
            geo.translate( 0, -length/2, 0 );
            return(geo);
        };
        var arrow = function(length, width){
            var geo = new THREE.ConeGeometry( width/2, length, 32 );
            geo.translate( 0, -length/2, 0 );
            return(geo);
        };

    }
    
    return({
        line:    line,
        arrow:   arrow
    })
}


function make_lineMeshGeo(from, to, linewidth, dimensions){

    // Return an empty geometry if the line start and ends in the same place
    if(from[0] == to[0] &&
        from[1] == to[1] &&
        from[2] == to[2]){
        return new THREE.Geometry();
    }

    // Get direction and length
    var direction = new THREE.Vector3(to[0]-from[0],
                                      to[1]-from[1],
                                      to[2]-from[2]);
    var line_length = direction.length();

    // Set object geometry
    var geometries = get_lineGeos(dimensions);
    var geo = geometries.line(line_length, linewidth/20);

    // Make translation matrix
    var transmat = new THREE.Matrix4();
    transmat.makeTranslation(to[0], to[1], to[2]);

    // Make rotation matrix
    var axis = new THREE.Vector3(0, 1, 0);
    var quat = new THREE.Quaternion().setFromUnitVectors(axis, direction.clone().normalize());

    var rotmat = new THREE.Matrix4();
    rotmat.makeRotationFromQuaternion(quat);
    
    // Rotate to match direction and position
    geo.applyMatrix(rotmat);
    geo.applyMatrix(transmat);

    return(geo);

}


function make_simpleLineMesh(from, to, linewidth, color){

    // Set geo
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3().fromArray(from));
    geometry.vertices.push(new THREE.Vector3().fromArray(to));

    var material = new THREE.LineBasicMaterial({ 
        color: color,
        linewidth: linewidth
    });

    var line = new THREE.Line( geometry, material );

    return(line);

}


