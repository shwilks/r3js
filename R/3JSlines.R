
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
#' is zoomed. As with `points3js(geometry = FALSE)` lines drawn in this way are rendered much more
#' efficiently and sometimes the fixed width characteristic is desirable, for example grid lines
#' are drawn in this way.
#'
#' @param data3js The data3js object
#' @param x x coordinates
#' @param y y coordinates
#' @param z z coordinates
#' @param lwd line width
#' @param col line color (only a single color is currently supported)
#' @param highlight highlight characteristics (see `highlight3ks()`)
#' @param geometry logical, should the point be rendered as a physical geometry
#' @param ... further parameters to pass to `material3js()`
#'
#' @examples
#' # Draw three lines
#' x <- seq(from = 0, to = 6, length.out = 100)
#' y <- cos(x*5)
#' z <- sin(x*5)
#' linecols <- rainbow(100)
#'
#' p <- plot3js(
#'   xlim = c(0, 6),
#'   ylim = c(0, 6),
#'   zlim = c(-1, 1),
#'   aspect = c(1, 1, 1)
#' )
#'
#' # Add a line using the linegl representation
#' p <- lines3js(
#'   data3js = p,
#'   x, y + 1, z,
#'   col = linecols
#' )
#'
#' # Add a thicker line using the linegl representation
#' p <- lines3js(
#'   data3js = p,
#'   x, y + 3, z,
#'   lwd = 3,
#'   col = linecols
#' )
#'
#' # Add a line as a physical geometry to the plot
#' p <- lines3js(
#'   data3js = p,
#'   x, y + 5, z,
#'   lwd = 0.2,
#'   geometry = TRUE,
#'   col = "blue" # Currently only supports fixed colors
#' )
#'
#' # View the plot
#' p
#'
#' @export
lines3js <- function(
  data3js,
  x, y, z,
  lwd = 1,
  col = "black",
  highlight,
  geometry = FALSE,
  ...
){


  # Create the points
  if(geometry){

    # Check color
    if (length(col) > 1) stop("Only a single line color is currently supported for geometric lines", call. = F)

    for (i in seq_len(length(x) - 1)) {
      data3js <- line3js(
        data3js = data3js,
        x = x[c(i, i+1)],
        y = y[c(i, i+1)],
        z = z[c(i, i+1)],
        lwd = lwd,
        col = col,
        ...
      )
    }

    # Update the last IDs field to reflect all the points added
    data3js$lastID <- seq(
      from = data3js$lastID - length(x)-1 + 1,
      to = data3js$lastID
    )

  } else {

    # Set color
    col <- rep_len(col, length(x))

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
#' @examples
#' # Draw three lines
#' x <- seq(from = 0, to = 6, length.out = 100)
#' y <- cos(x*5)
#' z <- sin(x*5)
#' linecols <- rainbow(100)
#'
#' p <- plot3js(
#'   xlim = c(0, 6),
#'   ylim = c(0, 6),
#'   zlim = c(-1, 1),
#'   aspect = c(1, 1, 1)
#' )
#'
#' # Add a line using the linegl representation
#' p <- segments3js(
#'   data3js = p,
#'   x, y + 1, z,
#'   col = linecols
#' )
#'
#' # Add a thicker line using the linegl representation
#' p <- segments3js(
#'   data3js = p,
#'   x, y + 3, z,
#'   lwd = 3,
#'   col = linecols
#' )
#'
#' # Add a line as a physical geometry to the plot
#' p <- segments3js(
#'   data3js = p,
#'   x, y + 5, z,
#'   lwd = 0.2,
#'   geometry = TRUE,
#'   col = "blue" # Currently only supports fixed colors
#' )
#'
#' # View the plot
#' p
#'
#' @export
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









