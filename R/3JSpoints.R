
#' Add a geometric point to a data3js object
#'
#' This function underlies the points3js function when the geometry argument is set to TRUE.
#' The point generated is included a 'physical' geometry, for example a sphere if shape = "circle",
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
#' @param fill point fill color
#' @param shape point shape
#' @param highlight point highlight appearance (see `highlight3js()`)
#' @param ... other attributes to pass to `material3js()`
#'
#' @noRd
#'
geopoint3js <- function(
  data3js,
  x, y, z,
  size,
  col  = "black",
  fill = col,
  shape = "sphere",
  highlight,
  ...
){

  object <- c()
  object$type <- "point"
  object$shape <- shape
  object$size <- size
  object$fill <- convertCol3js(fill)
  object$properties <- material3js(col = col, ...)
  object$position <- c(x,y,z)

  data3js <- addObject3js(data3js, object)
  data3js

}


#' Add webgl points to a data3js object
#'
#' Adds points to a plot represented as webgl points rather than geometries. They are a much more
#' basic representation, will not obey lighting rules and overlay rather than intersect but are
#' orders of more efficient to render.
#'
#' @param data3js The data3js object
#' @param x x coordinates
#' @param y y coordinates
#' @param z z coordinates
#' @param size point sizes
#' @param col point colors
#' @param fill point fill color
#' @param shape point shapes
#' @param highlight highlight characteristics (see `highlight3ks()`)
#' @param ... further parameters to pass to `material3js()`
#'
#' @noRd
#'
glpoints3js <- function(
  data3js,
  x, y, z,
  size = 1,
  col  = "black",
  fill = col,
  shape = "sphere",
  highlight,
  ...){

  object <- c()
  object$type  <- "glpoints"
  object$shape <- shape
  object$size  <- rep_len(size, length(x))
  object$fill  <- convertCol3js(fill)
  object$properties <- material3js(col = col, ...)
  object$position   <- cbind(x,y,z)

  data3js <- addObject3js(data3js, object, length(x))
  data3js

}


#' Add points to a data3js object
#'
#' This is the base function for adding points to a plot. Alongside other parameters
#' you will need to decide whether you want the points plotted as physical geometries
#' (geometry = TRUE) or webgl points rendered with a shader (geometry = FALSE). Points
#' rendered as geometries use `geopoint3js()` and will respect lighting and intersect
#' properly, also more point types are supported but come at a larger computational
#' cost of rendering. webgl points use `glpoints3js()` and are rendered orders of
#' magnitude faster but have less flexible appearances and ignore lighting.
#'
#' @param data3js The data3js object
#' @param x point x coords
#' @param y point y coords
#' @param z point z coords
#' @param size point sizes
#' @param col point colors
#' @param fill point fill color
#' @param shape point shapes, see the examples below for a list of different types.
#' @param geometry logical, should the point be rendered as a physical geometry
#' @param highlight highlight characteristics (see `highlight3js()`)
#' @param label optional vector of interactive labels to apply to the points (see `highlight3js()`)
#' @param toggle optional vector of interactive toggles associate to each point (see `highlight3js()`)
#' @param ... further parameters to pass to `material3js()`
#' @export
#' @family {plot components}
#'
#' @examples
#' geo_shapes <- c(
#'   "circle", "square", "triangle",
#'   "circle open", "square open", "triangle open",
#'   "circle filled", "square filled", "triangle filled",
#'   "sphere", "cube", "tetrahedron",
#'   "cube open",
#'   "cube filled"
#' )
#'
#' gl_shapes <- c(
#'   "circle", "square", "triangle",
#'   "circle open", "square open", "triangle open",
#'   "circle filled", "square filled", "triangle filled",
#'   "sphere"
#' )
#'
#' # Setup base plot
#' p <- plot3js(
#'   xlim = c(0, length(geo_shapes) + 1),
#'   ylim = c(-4, 4),
#'   zlim = c(-4, 4),
#'   label_axes = FALSE
#' )
#'
#' # Plot the different point geometries
#' p <- points3js(
#'   data3js = p,
#'   x = seq_along(geo_shapes),
#'   y = rep(0, length(geo_shapes)),
#'   z = rep(0, length(geo_shapes)),
#'   size = 2,
#'   shape = geo_shapes,
#'   col = rainbow(length(geo_shapes)),
#'   fill = "grey70"
#' )
#'
#' r3js(p, rotation = c(0, 0, 0), zoom = 2)
#'
#' # Setup base plot
#' p <- plot3js(
#'   xlim = c(0, length(gl_shapes) + 1),
#'   ylim = c(-4, 4),
#'   zlim = c(-4, 4),
#'   label_axes = FALSE
#' )
#'
#' # Plot the different gl points
#' p <- points3js(
#'   data3js = p,
#'   x = seq_along(gl_shapes),
#'   y = rep(0, length(gl_shapes)),
#'   z = rep(0, length(gl_shapes)),
#'   size = 2,
#'   shape = gl_shapes,
#'   col = rainbow(length(gl_shapes)),
#'   fill = "grey50",
#'   geometry = FALSE
#' )
#'
#' r3js(p, rotation = c(0, 0, 0), zoom = 2)
#'
#' # Plot a 10,000 points using the much more efficient gl.point representation
#'
#' # Setup base plot
#' p <- plot3js(
#'   xlim = c(-4, 4),
#'   ylim = c(-4, 4),
#'   zlim = c(-4, 4),
#'   label_axes = FALSE
#' )
#'
#' p <- points3js(
#'   data3js = p,
#'   x = rnorm(10000, 0),
#'   y = rnorm(10000, 0),
#'   z = rnorm(10000, 0),
#'   size = 0.6,
#'   col = rainbow(10000),
#'   shape = "sphere",
#'   geometry = FALSE
#' )
#'
#' r3js(p, rotation = c(0, 0, 0), zoom = 2)
#'
points3js <- function(
  data3js,
  x, y, z,
  size = 1,
  col = "black",
  fill = col,
  shape = "sphere",
  highlight,
  geometry = TRUE,
  label = NULL,
  toggle = NULL,
  ...) {

  # Perform input checks
  ellipsis::check_dots_used()

  # Repeat arguments to match length of points
  col    <- rep_len(col,    length(x))
  fill   <- rep_len(fill,   length(x))
  size   <- rep_len(size,   length(x))
  shape  <- rep_len(shape,  length(x))
  if(!is.null(label)) { label  <- rep_len(label,  length(x)) }
  if(!is.null(toggle)){ toggle <- rep_len(toggle, length(x)) }

  if (length(y) != length(x)) stop("y and x have different lengths")
  if (length(z) != length(x)) stop("z and x have different lengths")

  # Create the points
  if(geometry){

    for(i in seq_along(x)) {
      data3js <- geopoint3js(
        data3js = data3js,
        x = x[i],
        y = y[i],
        z = z[i],
        size = size[i],
        col = col[i],
        fill = fill[i],
        shape = shape[i],
        label = label[i],
        toggle = toggle[i],
        ...
      )
    }

    # Update the last IDs field to reflect all the points added
    data3js$lastID <- seq(
      from = data3js$lastID - length(x) + 1,
      to = data3js$lastID
    )

  } else {

    data3js <- glpoints3js(
      data3js,
      x = x,
      y = y,
      z = z,
      size = size,
      col = col,
      fill = fill,
      shape = shape,
      label = label,
      toggle = toggle,
      ...
    )

  }

  # Create the highlights object if requested
  if(!missing(highlight)){
    data3js <- highlight3js(data3js, highlight)
  }

  # Return the updated object
  data3js

}

