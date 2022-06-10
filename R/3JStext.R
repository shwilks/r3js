
#' Add text to a data3js object
#'
#' The text added can either be as an html text object, superimposed on the scene
#' but moving relative to appear relative to the specified coordinqtes, or an actual
#' geometry, which will appear in the scene, zoom and rotate with it etc.
#'
#' @param data3js The data3js object
#' @param x x coords
#' @param y y coords
#' @param z z coords
#' @param text character vector of text
#' @param size text size, if type is "geometry" this is interpreted in terms of
#'   text height within the plotting space (default 1), if type is "html" then
#'   this is interpreted as size in pts (default 16).
#' @param col text color
#' @param toggle associated text toggle button
#' @param type text type, either "geometry" or "html"
#' @param alignment text alignment, i.e. "left" "top" "topright"
#' @param offset onscreen text offset for html text, x then y
#' @param style named list of css style attributes to apply to the html text
#' @param ... Additional attributes to pass to `material3js()`
#'
#' @family plot components
#' @export
#'
#' @examples
#' # Set text parameters
#' x <- 1:4
#' y <- rep(0, 4)
#' z <- rep(0, 4)
#' labels <- LETTERS[1:4]
#' sizes <- c(0.4, 0.6, 0.8, 1)
#'
#' # Create empty plot
#' p0 <- plot3js(
#'   xlim = c(0, 5),
#'   ylim = c(-1, 1),
#'   zlim = c(-1, 1),
#'   aspect = c(1, 1, 1),
#'   label_axes = FALSE
#' )
#'
#' # Add text as a geometry
#' p <- text3js(
#'   data3js = p0,
#'   x = x,
#'   y = y,
#'   z = z,
#'   size = sizes,
#'   text = labels
#' )
#'
#' r3js(p, rotation = c(0, 0, 0), zoom = 1)
#'
#' # Add text as a html labels
#' p <- text3js(
#'   data3js = p0,
#'   x = x,
#'   y = y,
#'   z = z,
#'   size = sizes*40,
#'   text = labels,
#'   type = "html"
#' )
#'
#' r3js(p, rotation = c(0, 0, 0), zoom = 1)
#'
text3js <- function(
  data3js,
  x, y, z,
  text,
  size   = NULL,
  col    = "inherit",
  toggle = NULL,
  type   = "geometry",
  alignment = "center",
  offset    = c(0, 0),
  style     = list(fontFamily = "sans-serif"),
  ...){

  # Set default size
  if (is.null(size)) {
    size <- switch(
      type,
      geometry = 1,
      html = 16
    )
  }

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
  style  = list(fontFamily = "sans-serif"),
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
    object$style <- do.call(convert_style, args = style)
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
