
#' Add a sphere of defined radius to a data3js object
#'
#' Unlike points3js, where geometric points can also be represented as
#' spheres, this adds sphere that is sized with respect to the actual
#' dimensions of the plotting space (and so if aspect ratios differ for
#' each axis may not actually appear sphere-like!).
#'
#' @param data3js The data3js object
#' @param x x coordinate of the sphere center
#' @param y y coordinate of the sphere center
#' @param z z coordinate of the sphere center
#' @param radius sphere radius
#' @param col color
#' @param highlight highlight attributes (see `highlight3js()`)
#' @param ... other arguments to pass to `material3js()`
#'
#' @export
#'
sphere3js <- function(
  data3js,
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



#' Add an arrow to a data3js object
#'
#' This is not yet implemented
#'
#' @param data3js The data3js object
#' @param x x coordinates (from then to)
#' @param y y coordinates (from then to)
#' @param z z coordinates (from then to)
#' @param lwd line width
#' @param arrowhead_width arrowhead width
#' @param arrowhead_length arrowhead length
#' @param col color
#' @param mat material (see `material3js()`)
#' @param ... other arguments to pass to `material3js()`
#'
#' @export
#'
arrow3js <- function(
  data3js,
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


#' Add a surface to an data3js object
#'
#' This function behaves very similarly to the \code{surface3d} function in the \code{rgl}
#' package, although the handling of NA values is more robust in this implementation.
#'
#' @param data3js The data3js object
#' @param x Values corresponding to rows of z, or matrix of x coordinates
#' @param y Values corresponding to the columns of z, or matrix of y coordinates
#' @param z Matrix of heights
#' @param col The color of the surface as either a single value, vector or matrix.
#' @param mat The material to use when drawing the matrix, for a solid surface the default is
#' "phong", for a wireframe the default is "line".
#' @param wireframe Logical value for if the surface should be displayed as a mesh
#' @param highlight highlight attributes (see `highlight3js()`)
#' @param ... Material and texture properties. See `material3js()`
#'
#' @export
#'
#'
surface3js <- function(
  data3js,
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
#' @param data3js The data3js object
#' @param vertices An nx3 matrix of 3d vertex coordinates
#' @param faces An nx3 matrix of indices relating to vertices that make up each triangular face
#' @param normals Optional nx3 matrix of normals to each vertex
#' @param col Shape color
#' @param highlight highlight attributes (see `highlight3js()`)
#' @param ... Additional attributes to pass to `material3js()`
#'
#' @export
#'
shape3js <- function(
  data3js,
  vertices,
  faces,
  normals = NULL,
  col  = "black",
  highlight,
  ...) {

  object <- c()
  object$type <- "shape"
  object$vertices   <- vertices
  object$faces      <- faces-1 # Need to convert to base 0
  object$normals    <- normals
  object$properties <- material3js(
    col = col,
    ...
  )

  data3js <- addObject3js(data3js, object)

  # Create the highlight object if requested
  if(!missing(highlight)){
    data3js <- highlight3js(data3js, highlight)
  }

  # Return the updated object
  data3js

}




#' Add a triangle to a data3js object
#'
#' @param data3js The data3js object
#' @param vertices An nx3 matrix of triangle vertices
#' @param col Color of the triangle
#' @param highlight highlight attributes (see `highlight3js()`)
#' @param ... Additional attributes to pass to `material3js()`
#'
#' @export
#'
triangle3js <- function(
  data3js,
  vertices,
  col  = "black",
  highlight,
  ...) {

  object <- c()
  object$type <- "triangle"
  object$vertices   <- vertices

  object$properties <- material3js(
    col = col,
    ...
  )

  data3js <- addObject3js(data3js, object)

  # Create the highlight object if requested
  if(!missing(highlight)){
    data3js <- highlight3js(data3js, highlight)
  }

  # Return the updated object
  data3js

}


#' Add a light source to a data3js object
#'
#' When no light source is provided the 3d scene is lit from the top left, this
#' function allows you to specify different numbers of light sources at
#' different positions - not yet fully implemented.
#'
#' @param data3js The data3js object
#' @param position Position of the light source in x, y, z coords
#'
#' @export
#'
light3js <- function(
  data3js,
  position = NULL
  ){

  object          <- c()
  object$type     <- "light"
  object$position <- position

  # Update the plot object
  if(is.null(data3js$light)) data3js$light <- list()
  data3js$light <- c(data3js$light, list(object))

  # Return the updated object
  data3js

}




