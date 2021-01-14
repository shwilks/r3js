
#' Add a single straight line to a data3js object
#'
#' This underlies the lines3js function.
#'
#' @param data3js The data3js object
#' @param x x coords
#' @param y y coords
#' @param z z coords
#' @param lwd line width
#' @param col line color
#' @param mat material (see `material3js()`)
#' @param ... further parameters to pass to `material3js()`
#'
line3js <- function(
  data3js,
  x, y, z,
  lwd = 1,
  col = "black",
  mat = "basic",
  ...
){

  object <- c()
  object$type <- "line"
  object$properties <- material3js(
    mat = mat,
    lwd = lwd,
    col = rep_len(col, length(x)),
    ...
  )
  object$position <- cbind(x, y, z)

  data3js <- addObject3js(data3js, object)
  data3js

}

#' Add a non-geometric line to a data3js object
#'
#' This underlies the `lines3js()` function
#'
#' @param data3js The data3js object
#' @param x x coords
#' @param y y coords
#' @param z z coords
#' @param lwd line width
#' @param col line color
#' @param segments Should the line be interpreted as segments, e.g. a dashed line
#' @param ... Additional arguments to pass to `material3js()`
#'
gllines3js <- function(
  data3js,
  x, y, z,
  lwd = 1,
  col = "black",
  segments = FALSE,
  ...){

  object <- c()
  object$type <- "glline"
  object$properties <- material3js(
    mat = "line",
    lwd = lwd,
    col = rep_len(col, length(x)),
    ...
  )
  object$position <- cbind(x,y,z)
  object$segments <- jsonlite::unbox(segments)
  object

  data3js <- addObject3js(data3js, object)
  data3js

}


#' Add lines to a data3js object
#'
#' This adds lines to a plot, similarly to the `lines()` function. You have to decide whether
#' you would like lines to physically exist as geometries in the scene (geometry = TRUE), i.e. as
#' cylinders, or rather as webgl lines draw into the scene (geometry = FALSE). Such lines added will
#' be "non-geometric" in the sense that they do not physically exist in the scene, so will not be
#' shaded according to lighting, and their width will remain constant independent of how the plot
#' is zoomed. As with `glpoints()` lines drawn in this way are rendered much more efficiently
#' and sometimes the fixed width characteristic is desirable, for example grid lines are drawn
#' in this way.
#'
#' @param data3js The data3js object
#' @param x x coordinates
#' @param y y coordinates
#' @param z z coordinates
#' @param lwd line width
#' @param col line color
#' @param highlight highlight characteristics (see `highlight3ks()`)
#' @param geometry logical, should the point be rendered as a physical geometry
#' @param ... further parameters to pass to `material3js()`
#'
#' @export
#'
lines3js <- function(
  data3js,
  x, y, z,
  lwd = 1,
  col = "black",
  highlight,
  geometry = FALSE,
  ...
){

  # Set color
  col <- rep_len(col, length(x))

  # Create the points
  if(geometry){
    data3js <- line3js(
      data3js = data3js,
      x = x,
      y = y,
      z = z,
      lwd = lwd,
      col = col,
      ...
    )
  } else {
    data3js <- gllines3js(
      data3js = data3js,
      x = x,
      y = y,
      z = z,
      lwd = lwd,
      col = col,
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

#' Add lines segments a 3js object
#'
#' @param data3js The data3js object
#' @param x x coords
#' @param y y coords
#' @param z z coords
#' @param lwd line width
#' @param col line color
#' @param highlight highlight characteristics (see `highlight3ks()`)
#' @param geometry logical, should the lines be rendered as a physical geometries
#' @param ... further parameters to pass to `material3js()`
#'
#' @export
#'
segments3js <- function(
  data3js,
  x, y, z,
  lwd = 1,
  col = "black",
  highlight,
  geometry = FALSE,
  ...
  ){

  # Create the lines
  if(geometry){
    for(n in seq(from = 2, to = length(x), by = 2)){
      data3js <- line3js(
        data3js = data3js,
        x = c(x[n-1], x[n]),
        y = c(y[n-1], y[n]),
        z = c(z[n-1], z[n]),
        lwd = lwd,
        col = col,
        ...
      )
    }
  } else {
    data3js <- gllines3js(
      data3js = data3js,
      x = x,
      y = y,
      z = z,
      lwd = lwd,
      col = col,
      segments = TRUE,
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









