

#' Add points to a data3js object
#'
#'
#'
#' @param data3js
#' @param x
#' @param y
#' @param z
#' @param size
#' @param col
#' @param ...
#'
#' @return
#' @export
#'
#' @examples
points3js <- function(data3js,
                      x, y, z,
                      size = 1,
                      col  = "black",
                      pch  = 16,
                      highlight,
                      label  = NULL,
                      toggle = NULL,
                      geometry = FALSE,
                      ...){

  # Repeat arguments to match length of points
  col    <- rep_len(col,    length(x))
  size   <- rep_len(size,   length(x))
  pch    <- rep_len(pch,    length(x))
  if(!is.null(label)) { label  <- rep_len(label,  length(x)) }
  if(!is.null(toggle)){ toggle <- rep_len(toggle, length(x)) }

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
    data3js <- glpoints3js(data3js,
                           x = x,
                           y = y,
                           z = z,
                           size = size,
                           col = col,
                           pch = pch,
                           label = label,
                           toggle = toggle,
                           ...)
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
#' @param data3js
#' @param x
#' @param y
#' @param z
#' @param lwd
#' @param col
#' @param ...
#'
#' @return
#' @export
#'
#' @examples
segments3js <- function(data3js,
                        x, y, z,
                        lwd = 1,
                        col = "black",
                        highlight,
                        ...){

  # Create the points
  if(geometry){
    for(n in seq(from = 2, to = length(x), by = 2)){
      data3js <- line3js(data3js = data3js,
                         x0 = x[n-1],
                         y0 = y[n-1],
                         z0 = z[n-1],
                         x1 = x[n],
                         y1 = y[n],
                         z1 = z[n],
                         lwd = lwd,
                         col = col,
                         ...)
    }
  } else {
    data3js <- gllines3js(data3js = data3js,
                          x = x,
                          y = y,
                          z = z,
                          lwd = lwd,
                          col = col,
                          segments = TRUE,
                          ...)
  }

  # Create the highlights object if requested
  if(!missing(highlight)){
    data3js <- highlight3js(data3js, highlight)
  }

  # Return the updated object
  data3js

}



#' Add lines to a 3js object
#'
#' @param data3js
#' @param x
#' @param y
#' @param z
#' @param lwd
#' @param col
#' @param ...
#'
#' @return
#' @export
#'
#' @examples
lines3js <- function(data3js,
                     x, y, z,
                     lwd = 1,
                     col = "black",
                     highlight,
                     geometry = FALSE,
                     ...){

  # Set color
  col <- rep_len(col, length(x))

  # Create the points
  if(geometry){
    data3js <- line3js(data3js = data3js,
                       x = x,
                       y = y,
                       z = z,
                       lwd = lwd,
                       col = col,
                       ...)
  } else {
    data3js <- gllines3js(data3js = data3js,
                          x = x,
                          y = y,
                          z = z,
                          lwd = lwd,
                          col = col,
                          ...)
  }

  # Create the highlights object if requested
  if(!missing(highlight)){
    data3js <- highlight3js(data3js, highlight)
  }

  # Return the updated object
  data3js

}

