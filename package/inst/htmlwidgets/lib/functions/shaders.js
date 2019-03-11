
// Line shaders
function get_lineVertex_shader(){
    
    return(`
    	
    	uniform float amplitude;
		attribute float visible;
		// varying vec3 color;
		void main() {
			if(visible != 0.0){
			    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		    }
		}

    `);

}

function get_lineFragment_shader(){

    return(`
		// uniform vec3 color;
		// uniform float opacity;
		// varying vec3 vColor;
		void main() {
			gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
		}
	`);

}



// 2 dimensions
function get_vertex_shader2D(){

    return(`

        attribute float size;
		attribute float shape;
		attribute vec4 fillColor;
		attribute vec4 outlineColor;
		attribute float outlineWidth;
		attribute float fillAlpha;
		attribute float outlineAlpha;
		attribute float aspect;
		attribute float visible;
		
		varying vec4 pFillColor;
		varying vec4 pOutlineColor;
		varying float pOutlineWidth;
		varying float pSize;
		varying float pAspect;
		varying float pScale;
		varying float pShape;
		varying float pVisible;
		
		uniform float scale;
		uniform float innerHeight;

		void main() {
			
			pFillColor    = fillColor;
			pOutlineColor = outlineColor;
			pAspect       = aspect;
		    pSize         = size;
		    pShape        = shape;
		    pOutlineWidth = outlineWidth;
		    pVisible      = visible;

			pScale        = pSize*scale*(innerHeight/1000.0);
			gl_PointSize  = pScale;
			
			vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
			gl_Position = projectionMatrix * mvPosition;

		}

    `);

}

function get_fragment_shader2D(){

    return(`

        varying vec4  pFillColor;
		varying float pFillAlpha;
        varying vec4  pOutlineColor;
        //varying float pOutlineAlpha;
        varying float pOutlineWidth;
		varying float pSize;
		varying float pShape;
		varying float pScale;
		varying float pAspect;
		varying vec2 screenpos;

		uniform float opacity;

		void main() {


			// Set variables to style and anti-alias points
		    float outline_width = (0.05/pSize)*pOutlineWidth;
		    float blend_range = (0.05/pScale);
		    float fade_range  = (0.1/pScale);
            
            // Tranform point coordinate
			vec2 p = gl_PointCoord;
            if(screenpos[0] < 0.0){
            	p[0] = (gl_PointCoord[0] - 0.25)*2.0;
            } else {
                p[0] = (gl_PointCoord[0] - 0.75)*2.0;
            }

            if(screenpos[1] < 0.0){
            	p[1] = (gl_PointCoord[1] - 0.75)*2.0;
            } else {
            	p[1] = (gl_PointCoord[1] - 0.25)*2.0;
            }

	        // Square
		    if(pShape == 1.0){

		        float lim = 0.5;
		        float apx = abs(p.x);
		        float apy = abs(p.y);
		        
		        if(apx > lim || apy > lim){
		            discard;
		        } else if(apx > lim-outline_width || apy > lim-outline_width){
		            if(pOutlineColor[3] == 0.0){
		            	discard;
		            } else {
		                gl_FragColor = pOutlineColor;
		            }
		        } else if(apx > lim-outline_width-blend_range || apy > lim-outline_width-blend_range){
		            if(apx > apy){
		                gl_FragColor = mix(pFillColor, pOutlineColor, (apx - (lim-outline_width-blend_range))/blend_range);
		            } else {
		                gl_FragColor = mix(pFillColor, pOutlineColor, (apy - (lim-outline_width-blend_range))/blend_range);
		            }
		        } else {
		        	if(pFillColor[3] == 0.0){
		            	discard;
		            } else {
		                gl_FragColor = pFillColor;
		            }
		        }
		        
		        if(apx > lim-fade_range || apy > lim-fade_range){
		            if(apx > apy){
		                gl_FragColor.a = gl_FragColor.a*(1.0-(apx-(lim-fade_range))/fade_range);
		            } else {
		                gl_FragColor.a = gl_FragColor.a*(1.0-(apy-(lim-fade_range))/fade_range);
		            }
		        }
		    }

		    // Triangle
		    if(pShape == 2.0){

			    vec2 p1 = vec2(0.3849,  0.1666);
				vec2 p2 = vec2(-0.3849, 0.1666);
				vec2 p3 = vec2(0,    -0.5);
		        
				float alpha = ((p2.y - p3.y)*(p.x - p3.x) + (p3.x - p2.x)*(p.y - p3.y)) /
				        ((p2.y - p3.y)*(p1.x - p3.x) + (p3.x - p2.x)*(p1.y - p3.y));
				float beta = ((p3.y - p1.y)*(p.x - p3.x) + (p1.x - p3.x)*(p.y - p3.y)) /
				       ((p2.y - p3.y)*(p1.x - p3.x) + (p3.x - p2.x)*(p1.y - p3.y));
				float gamma = 1.0 - alpha - beta;
		        
		        if(alpha < 0.0 || beta < 0.0 || gamma < 0.0){
		            discard;
		        } else if(alpha < outline_width || beta < outline_width || gamma < outline_width){
				    if(pOutlineColor[3] == 0.0){
		            	discard;
		            } else {
		                gl_FragColor = pOutlineColor;
		            }
		        } else if(alpha < outline_width + blend_range || beta < outline_width + blend_range || gamma < outline_width + blend_range){
		            if(alpha < beta && alpha < gamma){
		                gl_FragColor = mix(pOutlineColor, pFillColor, (alpha-outline_width)/blend_range);
		            } else if(beta < gamma) {
		                gl_FragColor = mix(pOutlineColor, pFillColor, (beta-outline_width)/blend_range);
		            } else {
		                gl_FragColor = mix(pOutlineColor, pFillColor, (gamma-outline_width)/blend_range);
		            }
		        } else {
		            if(pFillColor[3] == 0.0){
		            	discard;
		            } else {
		                gl_FragColor = pFillColor;
		            }
		        }
		        
		        if(alpha < fade_range || beta < fade_range || gamma < fade_range){
		            if(alpha < beta && alpha < gamma){
		                gl_FragColor.a = gl_FragColor.a*(alpha/fade_range);
		            } else if(beta < gamma) {
		                gl_FragColor.a = gl_FragColor.a*(beta/fade_range);
		            } else {
		                gl_FragColor.a = gl_FragColor.a*(gamma/fade_range);
		            }
		        }

		    }

		    // Circle
		    if(pShape == 0.0){

		        float radius = 0.5;
		        float dist = sqrt(p.x * p.x + p.y * p.y);

		        if(dist > radius){
		            discard;
		        } else if(dist > radius - outline_width){
		            if(pOutlineColor[3] == 0.0){
		            	discard;
		            } else {
		                gl_FragColor = pOutlineColor;
		            }
		        } else if(dist > radius - outline_width - blend_range){
		            gl_FragColor = mix(pFillColor, pOutlineColor, (dist-(radius-outline_width-blend_range))/blend_range);
		        } else {
		            if(pFillColor[3] == 0.0){
		            	discard;
		            } else {
		                gl_FragColor = pFillColor;
		            }
		        }

		        if(dist > radius - fade_range){
		            gl_FragColor.a = gl_FragColor.a*(1.0-(dist - (radius - fade_range))/fade_range);
		        }

		    }


		}

    `);

}




// 3 dimensions
function get_vertex_shader3D(){

    return(`

        attribute float size;
		attribute float shape;
		attribute vec4 fillColor;
		attribute vec4 outlineColor;
		attribute float outlineWidth;
		attribute float fillAlpha;
		//attribute float outlineAlpha;
		attribute float aspect;
		
		varying vec4 pFillColor;
		varying float pFillAlpha;
		varying vec4 pOutlineColor;
		//varying float pOutlineAlpha;
		varying float pOutlineWidth;
		varying float pSize;
		varying float pAspect;
		varying float pScale;
		varying float pShape;
		varying float pPixelRatio;
		varying vec2 screenpos;
		
		uniform float scale;
		uniform float viewportHeight;
		uniform float viewportWidth;
		uniform float viewportPixelRatio;

		void main() {
			
			pFillColor    = fillColor;
			pFillAlpha    = fillAlpha;
			pOutlineColor = outlineColor;
			//pOutlineAlpha = outlineAlpha;
			pAspect       = aspect;
		    pSize         = size;
		    pShape        = shape;
		    pOutlineWidth = outlineWidth;
		    pPixelRatio   = viewportPixelRatio;

			vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
			gl_Position = projectionMatrix * mvPosition;
			screenpos     = vec2(gl_Position[0], gl_Position[1]);

			pScale       = pSize*scale*(viewportHeight/1000.0);
			gl_PointSize = pScale*2.0 * ( 30.0 / -mvPosition.z );
            
            if(gl_Position[0] < 0.0){
			    gl_Position[0] = gl_Position[0] + gl_PointSize*0.5/(viewportWidth*viewportPixelRatio)*gl_Position[3];
		    } else {
		    	gl_Position[0] = gl_Position[0] - gl_PointSize*0.5/(viewportWidth*viewportPixelRatio)*gl_Position[3];
		    }

		    if(gl_Position[1] < 0.0){
			    gl_Position[1] = gl_Position[1] + gl_PointSize*0.5/(viewportHeight*viewportPixelRatio)*gl_Position[3];
			} else {
				gl_Position[1] = gl_Position[1] - gl_PointSize*0.5/(viewportHeight*viewportPixelRatio)*gl_Position[3];
			}


		}

    `);

}

function get_fragment_shader3D(){

    return(`

        varying vec4  pFillColor;
		varying float pFillAlpha;
        varying vec4  pOutlineColor;
        //varying float pOutlineAlpha;
        varying float pOutlineWidth;
		varying float pSize;
		varying float pShape;
		varying float pScale;
		varying float pAspect;
		varying vec2 screenpos;

		uniform float opacity;
		uniform sampler2D circleTexture;

		void main() {


			// Set variables to style and anti-alias points
		    float outline_width = (0.05/pSize)*pOutlineWidth;
		    float blend_range = (0.05/pScale);
		    float fade_range  = (0.1/pScale);
            
            // Tranform point coordinate
			vec2 p = gl_PointCoord;
            if(screenpos[0] < 0.0){
            	p[0] = (gl_PointCoord[0] - 0.25)*2.0;
            } else {
                p[0] = (gl_PointCoord[0] - 0.75)*2.0;
            }

            if(screenpos[1] < 0.0){
            	p[1] = (gl_PointCoord[1] - 0.75)*2.0;
            } else {
            	p[1] = (gl_PointCoord[1] - 0.25)*2.0;
            }
            
            // Sphere
            gl_FragColor = pFillColor * texture2D( circleTexture, vec2(p[0]+0.5, p[1]+0.5) );
	        gl_FragColor.a = gl_FragColor.a = gl_FragColor.a*pFillAlpha;

		    float radius = 0.4;
	        float dist = sqrt(p.x * p.x + p.y * p.y);

	        if(dist > radius){
	           discard;
	        }

		}

    `);

}


