
#' Add text to a data3js object
#'
#' The text added can either be as an html text object, superimposed on the scene
#' but moving relative to appear relative to the specified coordiantes, or an actual
#' geometry, which will appear in the scene, zoom and rotate with it etc.
#'
#' @param data3js The data3js object
#' @param x x coord
#' @param y y coord
#' @param z z coord
#' @param text text string
#' @param size text size
#' @param col text color
#' @param toggle associated text toggle button
#' @param type text type, either "geometry" or "html"
#' @param alignment text alignment, i.e. "left" "top" "topright"
#' @param offset onscreen text offset for html text x then y
#' @param style named list of css style attributes to apply to the html text
#' @param ... Additional attributes to pass to `material3js()`
#'
#' @export
#'
text3js <- function(
  data3js,
  x, y, z,
  text,
  size = 1,
  col    = "inherit",
  toggle = NULL,
  type   = "geometry",
  alignment = "center",
  offset    = c(0, 0),
  style     = list(),
  ...){

  # Repeat arguments to match length of points
  col  <- rep_len(col,  length(x))
  size <- rep_len(size, length(x))
  text <- rep_len(text, length(x))
  type <- rep_len(type, length(x))
  if(!is.null(toggle)){ toggle <- rep_len(toggle, length(x)) }

  # Create the points
  for(n in 1:length(x)){
    data3js <- string3js(
      data3js,
      x[n], y[n], z[n],
      text[n],
      size      = size[n],
      col       = col[n],
      toggle    = toggle[n],
      alignment = alignment,
      offset    = offset,
      type      = type[n],
      style     = style,
      ...
    )
  }

  # Return the updated object
  data3js

}


#' Add a single text string to a 3js plot
#' @noRd
#'
string3js <- function(
  data3js,
  x, y, z,
  text,
  size = 1,
  col = "inherit",
  type   = "geometry",
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
    col = col,
    ...
  )

  data3js <- addObject3js(data3js, object)

  # Return the updated object
  data3js

}
