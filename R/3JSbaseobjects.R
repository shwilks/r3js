
# Helper function for converting pch specifications
# to shapes understood by r3js
pch2shape <- function(pch){
  shape <- rep_len(NA, length(pch))
  shape[pch == 0]  <- "osquare"
  shape[pch == 1]  <- "ocircle"
  shape[pch == 2]  <- "otriangle"
  shape[pch == 15] <- "square"
  shape[pch == 16] <- "circle"
  shape[pch == 17] <- "triangle"
  shape
}

#' Add a geometric point to a data3js object
#'
#' This function underlies the points3js function when the geometry argument is set to TRUE.
#' The point generated is included a 'physical' geometry, for example a sphere if pch=16,
#' it will overlap with other points and shade according to the light source more realistically
#' but is _much_ less computationally efficient than glpoints, which uses a single point plus
#' different shader instructions depending on the point type.
#'
#' @param data3js The data3js object
#' @param x x coordinate
#' @param y y coordinate
#' @param z z coordinate
#' @param size point size
#' @param col point color
#' @param pch point type
#' @param highlight point highlight appearance (see `highlight3js()`)
#' @param ... other attributes to pass to `material3js()`
#'
geopoint3js <- function(
  data3js,
  x, y, z,
  size,
  col,
  pch = 16,
  highlight,
  ...
  ){

  object <- c()
  object$type <- "point"
  object$shape <- pch2shape(pch)
  object$size <- size
  object$properties <- material3js(col = col, ...)
  object$position <- c(x,y,z)

  data3js <- addObject3js(data3js, object)
  data3js

}

#' Add a line to a data3js object
#'
#' This is equivalent to lines in the way you specify vectors of x, y and z
#' coordinates to add a line that connects the points
#'
#' @param data3js The data3js object
#' @param x x coords
#' @param y y coords
#' @param z z coords
#' @param lwd line width
#' @param col line color
#' @param mat material (see `material3js()`)
#' @param removeSelfTransparency
#' @param ...
#'
#' @return
#'
#' @examples
line3js <- function(
  data3js,
  x, y, z,
  lwd = 1,
  col = "black",
  mat = "basic",
  removeSelfTransparency = TRUE,
  ...
  ){

  object <- c()
  object$type <- "line"
  object$properties <- material3js(
    mat = mat,
    lwd = lwd,
    col = rep_len(col, length(x)),
    removeSelfTransparency = removeSelfTransparency,
    ...
  )
  object$position <- cbind(x, y, z)

  data3js <- addObject3js(data3js, object)
  data3js

}



#' Insert a line into an r3js plot
#'
#' @param data3js
#' @param x
#' @param y
#' @param z
#' @param lwd
#' @param col
#' @param mat
#' @param segments
#' @param ...
#'
#' @return
#' @export
#'
#' @examples
gllines3js <- function(data3js,
                       x, y, z,
                       lwd = 1,
                       col = "black",
                       segments = FALSE,
                       ...){

  object <- c()
  object$type <- "glline"
  object$properties <- material3js(mat = "line",
                                   lwd = lwd,
                                   col = rep_len(col, length(x)),
                                   ...)
  object$position <- cbind(x,y,z)
  object$segments <- jsonlite::unbox(segments)
  object

  data3js <- addObject3js(data3js, object)
  data3js

}



#' Add webgl points to a plot
#'
#' Adds points to a plot represented as webgl points rather than geometries. They are a much more
#' basic representation, will not obey lighting rules and overlay rather than intersect but are
#' orders of magnitude more highly performent.
#'
#' @param data3js The r3js data object
#' @param x x coordinates
#' @param y y coordinates
#' @param z z coordinates
#' @param size point sizes
#' @param col point colors
#' @param pch plotting characters
#' @param highlight highlight
#' @param ... further parameters to pass to material3js
#'
#' @return Returns and updated r3js plotting object
#' @export
#'
#' @examples
glpoints3js <- function(data3js,
                        x, y, z,
                        size = 1,
                        col  = "black",
                        pch  = 16,
                        highlight,
                        ...){

  object <- c()
  object$type  <- "glpoints"
  object$shape <- pch2shape(rep_len(pch, length(x)))
  object$size  <- rep_len(size, length(x))
  object$properties <- material3js(col = col, ...)
  object$position   <- cbind(x,y,z)

  data3js <- addObject3js(data3js, object, length(x))
  data3js

}



#' Add a sphere of defined radius to an r3js plot
#'
#' @param data3js
#' @param x
#' @param y
#' @param z
#' @param radius
#' @param col
#' @param ...
#'
#' @return
#' @export
#'
#' @examples
sphere3js <- function(data3js,
                      x, y, z,
                      radius,
                      col,
                      highlight,
                      ...) {

  object <- c()
  object$type       <- "sphere"
  object$radius     <- radius
  object$properties <- material3js(col = col, ...)
  object$position   <- c(x,y,z)

  # Add the object to a plot
  data3js <- addObject3js(data3js, object)

  # Create the highlights object if requested
  if(!missing(highlight)){
    data3js <- highlight3js(data3js, highlight)
  }

  # Return the data
  data3js

}



#' Add an arrow to a 3js object
#'
#' @param data3js
#' @param x
#' @param y
#' @param z
#' @param lwd
#' @param arrowhead_width
#' @param arrowhead_length
#' @param col
#' @param mat
#' @param ...
#'
#' @return
#' @export
#'
#' @examples
arrow3js <- function(data3js,
                     x, y, z,
                     lwd = 1,
                     arrowhead_width = 0.2,
                     arrowhead_length = 0.5,
                     col,
                     mat = "basic",
                     ...){

  object <- c()
  object$type <- "arrow"
  object$lwd <- lwd
  object$arrowhead_length <- arrowhead_length
  object$arrowhead_width  <- arrowhead_width
  object$properties       <- material3js(mat = mat, col = col, ...)
  object$position$from <- c(x[1],y[1],z[1])
  object$position$to   <- c(x[2],y[2],z[2])
  object

  data3js <- addObject3js(data3js, object)
  data3js

}





#' Add a surface to an r3js object
#'
#' This function behaves very similarly to the \code{surface3d} function in the \code{rgl}
#' package, although the handling of NA values is more robust in this implementation.
#'
#' @param data3js The r3js object to add the surface to.
#' @param x Values corresponding to rows of z, or matrix of x coordinates
#' @param y Values corresponding to the columns of z, or matrix of y coordinates
#' @param z Matrix of heights
#' @param col The color of the surface as either a single value, vector or matrix.
#' @param mat The material to use when drawing the matrix, for a solid surface the default is
#' "phong", for a wireframe the default is "line".
#' @param wireframe Logical value for if the surface should be displayed as a mesh
#' @param ... Material and texture properties. See \code{\link{material3js}} for details
#'
#' @return Returns the updated r3js object in the form of a list.
#' @export
#'
#' @examples
#' # Taken from "persp"
#' data(volcano)
#'
#' z <- 2 * volcano        # Exaggerate the relief
#' x <- 10 * (1:nrow(z))   # 10 meter spacing (S to N)
#' y <- 10 * (1:ncol(z))   # 10 meter spacing (E to W)
#'
#' zlim <- range(y)
#' zlen <- zlim[2] - zlim[1] + 1
#' colorlut <- terrain.colors(zlen) # height color lookup table
#' col <- colorlut[ z - zlim[1] + 1 ] # assign colors to heights for each point
#'
#' # Setup r3js plot
#' data3js <- plot3js.new()
#' data3js <- plot3js.window(data3js,
#'                           xlim = range(x),
#'                           ylim = range(y),
#'                           zlim = range(z),
#'                           aspect = c(diff(range(x))/diff(range(y)),
#'                                      1,
#'                                      0.5))
#'
#' # Plot surface
#' data3js <- surface3js(data3js,
#'                       x = x,
#'                       y = y,
#'                       z = z,
#'                       col = col)
#'
#' # Display plot
#' print(r3js(data3js))
#'
surface3js <- function(data3js,
                       x, y, z,
                       col = "black",
                       mat,
                       wireframe = FALSE,
                       highlight,
                       ...){

  # Convert x, y and colors into matrices if necessary
  if(!is.matrix(x))  { x   <- matrix(x, nrow = nrow(z), ncol = ncol(z), byrow = FALSE) }
  if(!is.matrix(y))  { y   <- matrix(y, nrow = nrow(z), ncol = ncol(z), byrow = TRUE)  }
  if(!is.matrix(col)){ col <- matrix(col, nrow = nrow(z), ncol = ncol(z))              }

  object <- c()
  if(wireframe){
    object$type <- "grid"
    if(missing(mat)){ mat <- "line" }
  } else {
    object$type <- "surface"
    if(missing(mat)){ mat <- "phong" }
  }
  object$properties <- material3js(mat = mat, col = t(col), ...)
  object$x <- x
  object$y <- y
  object$z <- z
  object

  # Add to data object
  data3js <- addObject3js(data3js, object)

  # Add highlight if given
  if(!missing(highlight)){
    data3js <- highlight3js(data3js, highlight)
  }

  # Return plot data
  data3js

}



#' Add a generic shape to an 3js plot
#'
#' @param data3js
#' @param vertices
#' @param faces
#' @param col
#' @param highlight
#' @param label
#' @param toggle
#' @param ...
#'
#' @return
#' @export
#'
#' @examples
shape3js <- function(data3js,
                     vertices,
                     faces,
                     col  = "black",
                     highlight,
                     label  = NULL,
                     toggle = NULL,
                     ...) {

  object <- c()
  object$type <- "shape"
  object$vertices   <- vertices
  object$faces      <- faces-1 # Need to convert to base 0
  object$properties <- material3js(col = col,
                                   label = label,
                                   toggle = toggle,
                                   ...)

  data3js <- addObject3js(data3js, object)

  # Create the highlight object if requested
  if(!missing(highlight)){
    data3js <- highlight3js(data3js, highlight)
  }

  # Return the updated object
  data3js

}




#' Add a triangle to an r3js plot
#'
#' @param data3js
#' @param vertices
#' @param col
#' @param highlight
#' @param label
#' @param toggle
#' @param ...
#'
#' @return
#' @export
#'
#' @examples
triangle3js <- function(data3js,
                        vertices,
                        col  = "black",
                        highlight,
                        label  = NULL,
                        toggle = NULL,
                        ...) {

  object <- c()
  object$type <- "triangle"
  object$vertices   <- vertices

  object$properties <- material3js(col = col,
                                   label = label,
                                   toggle = toggle,
                                   ...)

  data3js <- addObject3js(data3js, object)

  # Create the highlight object if requested
  if(!missing(highlight)){
    data3js <- highlight3js(data3js, highlight)
  }

  # Return the updated object
  data3js

}




#' Add a single text string to a 3js plot
#'
#' @param x
#' @param y
#' @param z
#' @param labels
#' @param pos
#'
string3js <- function(
  data3js,
  x, y, z,
  text,
  size = 1,
  col = "inherit",
  type   = "geometry",
  label  = NULL,
  toggle = NULL,
  alignment = "center",
  offset = c(0, 0),
  style  = list(),
  ...
  ){

  object <- c()
  object$type      <- "text"
  object$rendering <- jsonlite::unbox(type)
  object$position  <- c(x,y,z)
  object$text      <- text
  object$size      <- size
  object$offset    <- offset

  # Set text aligment
  if(alignment == "center"){ object$alignment <- c(0 ,0 ) }

  if(alignment == "top")   { object$alignment <- c(0 ,1 ) }
  if(alignment == "bottom"){ object$alignment <- c(0 ,-1) }
  if(alignment == "left")  { object$alignment <- c(-1,0 ) }
  if(alignment == "right") { object$alignment <- c(1 ,0 ) }

  if(alignment == "topright")    { object$alignment <- c(1 ,1 ) }
  if(alignment == "topleft")     { object$alignment <- c(-1,1 ) }
  if(alignment == "bottomright") { object$alignment <- c(1 ,-1) }
  if(alignment == "bottomleft")  { object$alignment <- c(-1,-1) }

  # If the type is html text turn on the label renderer and set text style
  if(type == "html"){
    data3js$label_renderer = TRUE
    object$style <- do.call(style3js, args = style)
  }

  # Set object properties
  object$properties <- material3js(
    label = label,
    toggle = toggle,
    col = col,
    ...
  )

  data3js <- addObject3js(data3js, object)

  # Return the updated object
  data3js

}


#' Add a light source to a plot
#'
#' @param position Position of the light source
#'
#' @return Returns the updated r3js object
#' @export
#'
light3js <- function(data3js,
                     position = NULL){

  object          <- c()
  object$type     <- "light"
  object$position <- position

  # Update the plot object
  if(is.null(data3js$light)) data3js$light <- list()
  data3js$light <- c(data3js$light, list(object))

  # Return the updated object
  data3js

}




