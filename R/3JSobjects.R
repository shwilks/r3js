
#' Add a sphere of defined radius to a data3js object
#'
#' Unlike points3js, where geometric points can also be represented as
#' spheres, this adds sphere that is sized with respect to the actual
#' dimensions of the plotting space (and so if aspect ratios differ for
#' each axis may not actually appear sphere-like).
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
#' @return Returns an updated data3js object
#'
#' @export
#' @family plot components
#'
#' @examples
#' # Setup base plot
#' p <- plot3js(
#'   xlim = c(-10, 10),
#'   ylim = c(-5, 5),
#'   zlim = c(-8, 8)
#' )
#'
#' # Add sphere (this will look distorted because of axis scaling)
#' p <- sphere3js(
#'   data3js = p,
#'   0, 0, 0,
#'   radius = 5,
#'   col = "green"
#' )
#'
#' r3js(p, zoom = 2.5)
#'
#' # Setup base plot with equal aspect ratio
#' p <- plot3js(
#'   xlim = c(-10, 10),
#'   ylim = c(-5, 5),
#'   zlim = c(-8, 8),
#'   aspect = c(1, 1, 1)
#' )
#'
#' # Add sphere (fixed aspect ratio now makes the sphere look spherical)
#' p <- sphere3js(
#'   data3js = p,
#'   0, 0, 0,
#'   radius = 5,
#'   col = "green"
#' )
#'
#' r3js(p, zoom = 2)
#'
sphere3js <- function(
  data3js,
  x, y, z,
  radius,
  col = "black",
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


#' Add arrows to a data3js object
#'
#' @param data3js The data3js object
#' @param from nx3 matrix of coords for the arrow start points
#' @param to nx3 matrix of coords for the arrow end points
#' @param lwd line width
#' @param arrowhead_width arrowhead width
#' @param arrowhead_length arrowhead length
#' @param col color
#' @param mat material (see `material3js()`)
#' @param ... other arguments to pass to `material3js()`
#'
#' @return Returns an updated data3js object
#'
#' @export
#' @family plot components
#'
#' @examples
#' # Draw a set of arrows
#' from <- cbind(
#'   runif(10, 0.2, 0.8),
#'   runif(10, 0.2, 0.8),
#'   runif(10, 0.2, 0.8)
#' )
#'
#' to <- jitter(from, amount = 0.2)
#'
#' # Setup base plot
#' p <- plot3js(label_axes = FALSE)
#'
#' # Add arrows
#' p <- arrows3js(
#'   p, from, to,
#'   arrowhead_length = 0.06,
#'   arrowhead_width = 0.04,
#'   lwd = 0.01
#' )
#'
#' # View the plot
#' r3js(p, translation = c(0, 0, 0.15), zoom = 2)
#'
arrows3js <- function(
  data3js,
  from, to,
  lwd = 1,
  arrowhead_width = 0.2,
  arrowhead_length = 0.5,
  col = "black",
  mat = "lambert",
  ...){

  # Cycle through arrows
  for (i in seq_len(nrow(from))) {
    data3js <- arrow3js(
      data3js = data3js,
      from = from[i,],
      to = to[i,],
      lwd = lwd,
      arrowhead_width = arrowhead_width,
      arrowhead_length = arrowhead_length,
      col = col,
      mat = mat,
      ...
    )
  }

  # Update the last IDs field to reflect all the points added
  data3js$lastID <- seq(
    from = data3js$lastID - nrow(from) + 1,
    to = data3js$lastID
  )

  data3js

}



#' Add an arrow to a data3js object
#'
#' @param data3js The data3js object
#' @param from Vector of coords for the arrow start point
#' @param to Vector of coords for the arrow end point
#' @param lwd line width
#' @param arrowhead_width arrowhead width
#' @param arrowhead_length arrowhead length
#' @param col color
#' @param mat material (see `material3js()`)
#' @param ... other arguments to pass to `material3js()`
#'
#' @return Returns an updated data3js object
#'
#' @noRd
#'
arrow3js <- function(
  data3js,
  from,
  to,
  lwd = 1,
  arrowhead_width = 0.2,
  arrowhead_length = 0.5,
  col = "black",
  mat = "lambert",
  ...){

  object <- c()
  object$type <- "arrow"
  object$arrowhead_length <- arrowhead_length
  object$arrowhead_width  <- arrowhead_width
  object$properties       <- material3js(mat = mat, col = col, lwd = lwd, ...)
  object$position$from    <- from
  object$position$to      <- to
  object

  data3js <- addObject3js(data3js, object)
  data3js

}


#' Add a surface to an data3js object
#'
#' This function behaves very similarly to the \code{surface3d} function in the \code{rgl}
#' package, although the handling of NA values are handled differently.
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
#' @return Returns an updated data3js object
#'
#' @export
#' @family plot components
#'
#' @examples
#' # volcano example taken from "persp"
#' z <- 2 * volcano        # Exaggerate the relief
#' x <- 10 * (1:nrow(z))   # 10 meter spacing (S to N)
#' y <- 10 * (1:ncol(z))   # 10 meter spacing (E to W)
#'
#' zlim <- range(z)
#' zlen <- zlim[2] - zlim[1] + 1
#'
#' colorlut <- terrain.colors(zlen) # height color lookup table
#' col <- colorlut[ z - zlim[1] + 1 ] # assign colors to heights for each point
#'
#' p <- plot3js(
#'   xlim = range(x),
#'   ylim = range(y),
#'   zlim = range(z),
#'   label_axes = FALSE,
#'   aspect = c(1, 1, 1) # Maintain a constant aspect ratio
#' )
#'
#' p <- surface3js(
#'   data3js = p,
#'   x, y, z,
#'   col = col
#' )
#'
#' r3js(
#'   data3js = p,
#'   rotation = c(-1.15, 0, -0.65),
#'   zoom = 1.5
#' )
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
  object$properties <- material3js(mat = mat, col = col, ...)
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
#' @return Returns an updated data3js object
#'
#' @family plot components
#' @export
#'
#' @examples
#' # Draw a teapot
#' data(teapot)
#' p <- plot3js(
#'   xlim = range(teapot$vertices[,1]),
#'   ylim = range(teapot$vertices[,2]),
#'   zlim = range(teapot$vertices[,3]),
#'   label_axes = FALSE,
#'   aspect = c(1, 1, 1)
#' )
#'
#' p <- shape3js(
#'   p,
#'   vertices = teapot$vertices,
#'   faces = teapot$edges,
#'   col = "lightblue"
#' )
#'
#' r3js(p, rotation = c(-2.8, 0, 3.14), zoom = 1.2)
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
  object$faces      <- faces - 1 # Need to convert to base 0
  object$normals    <- normals
  object$properties <- material3js(
    col = col,
    ...
  )

  data3js <- addObject3js(data3js, object)

  # Create the highlight object if requested
  if (!missing(highlight)) {
    data3js <- highlight3js(data3js, highlight)
  }

  # Return the updated object
  data3js

}


#' Add a triangle to a data3js object
#'
#' @param data3js The data3js object
#' @param vertices An nx3 matrix of triangle vertices
#' @param col Single color for the triangles or vector of vertex colors
#' @param highlight highlight attributes (see `highlight3js()`)
#' @param ... Additional attributes to pass to `material3js()`
#'
#' @return Returns an updated data3js object
#'
#' @export
#' @family plot components
#'
#' @examples
#' # Draw some random triangles
#' M <- matrix(
#'   data = rnorm(36),
#'   ncol = 3,
#'   nrow = 12
#' )
#'
#' p <- plot3js(
#'   xlim = range(M[,1]),
#'   ylim = range(M[,2]),
#'   zlim = range(M[,3]),
#'   label_axes = FALSE
#' )
#'
#' p <- triangle3js(
#'   p,
#'   vertices = M,
#'   col = rainbow(nrow(M))
#' )
#'
#' r3js(p, zoom = 2)
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
#' @param position Position of the light source in x, y, z coords, see details.
#' @param intensity Light intensity
#' @param type Type of light, either "point", "directional" or "ambient", see details.
#' @param col Light color
#'
#' @details If light position is "directional", the default light will appear to
#'   come from the direction of the position argument but from an infinite
#'   distance. If "point" the light will appear to emanate from that position in
#'   coordinate space light a light bulb. If "ambient" any position argument is
#'   ignored and the light will light all aspects of the scene evenly from no
#'   particular position.
#'
#' @return Returns an updated data3js object
#'
#' @export
#' @family plot components
#'
#' @examples
#' # Set up a plot
#' p0 <- plot3js(
#'   x = 1:4,
#'   y = c(2,1,3,4),
#'   z = c(3,2,4,1),
#'   xlim = c(0, 5),
#'   ylim = c(0, 5),
#'   zlim = c(0, 5),
#'   size = 20,
#'   col = c("white", "blue", "red", "green"),
#'   grid_col = "grey40",
#'   background = "black"
#' )
#'
#' # Light scene intensely from above
#' p <- light3js(
#'   p0,
#'   position = c(0, 1, 0)
#' )
#' r3js(p, zoom = 2)
#'
#' # Light scene positionally from the middle of the plot
#' p <- light3js(
#'   p0,
#'   position = c(2.5, 2.5, 2.5),
#'   type = "point"
#' )
#' r3js(p, zoom = 2)
#'
#' # Light scene ambiently with a yellow light
#' p <- light3js(
#'   p0,
#'   intensity = 0.3,
#'   type = "ambient",
#'   col = "yellow"
#' )
#' r3js(p, zoom = 2)
#'
light3js <- function(
  data3js,
  position = NULL,
  intensity = 1,
  type = "directional",
  col = "white"
  ){

  object           <- c()
  object$type      <- "light"
  object$lighttype <- jsonlite::unbox(type)
  object$position  <- position
  object$intensity <- jsonlite::unbox(intensity)
  object$color     <- convertCol3js(col)

  # Update the plot object
  if(is.null(data3js$light)) data3js$light <- list()
  data3js$light <- c(data3js$light, list(object))

  # Return the updated object
  data3js

}




