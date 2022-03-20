
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
#' @param pch plotting characters
#' @param highlight highlight characteristics (see `highlight3ks()`)
#' @param ... further parameters to pass to `material3js()`
#'
#' @export
#'
glpoints3js <- function(
  data3js,
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
#' @param pch point types
#' @param geometry logical, should the point be rendered as a physical geometry
#' @param highlight highlight characteristics (see `highlight3ks()`)
#' @param label optional vector of interactive labels to apply to the points (see `highlight3ks()`)
#' @param toggle optional vector of interactive toggles associate to each point (see `highlight3ks()`)
#' @param ... further parameters to pass to `material3js()`
#'
#' @export
#'
points3js <- function(
  data3js,
  x, y, z,
  size = 1,
  col  = "black",
  pch  = 16,
  highlight,
  geometry = TRUE,
  label = NULL,
  toggle = NULL,
  ...){

  # Perform input checks
  ellipsis::check_dots_used()

  # Repeat arguments to match length of points
  col    <- rep_len(col,    length(x))
  size   <- rep_len(size,   length(x))
  pch    <- rep_len(pch,    length(x))
  if(!is.null(label)) { label  <- rep_len(label,  length(x)) }
  if(!is.null(toggle)){ toggle <- rep_len(toggle, length(x)) }

  if (length(y) != length(x)) stop("y and x have different lengths")
  if (length(z) != length(x)) stop("z and x have different lengths")

  # Create the points
  if(geometry){
    for(n in 1:length(x)){
      data3js <- geopoint3js(
        data3js = data3js,
        x = x[n],
        y = y[n],
        z = z[n],
        size = size[n],
        col = col[n],
        pch = pch[n],
        label = label[n],
        toggle = toggle[n],
        ...
      )
    }
  } else {
    data3js <- glpoints3js(
      data3js,
      x = x,
      y = y,
      z = z,
      size = size,
      col = col,
      pch = pch,
      label = label,
      toggle = toggle,
      ...
    )
  }

  # Create the highlights object if requested
  if(!missing(highlight)){
    data3js <- highlight3js(data3js, highlight)
  }

  # Update the last IDs field
  data3js$lastID <- seq(
    from = data3js$lastID - length(x) + 1,
    to = data3js$lastID
  )

  # Return the updated object
  data3js

}

