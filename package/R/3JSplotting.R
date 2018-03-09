
# stackoverflow.com/questions/11885207/get-all-parameters-as-list
allargs <- function(orig_values = FALSE) {

  parent_formals <- formals(sys.function(sys.parent(n = 1)))
  fnames <- names(parent_formals)
  fnames <- fnames[-which(fnames == '...')]
  args <- evalq(as.list(environment()), envir = parent.frame())
  args <- c(args[fnames], evalq(list(...), envir = parent.frame()))

  if(orig_values) {
    # get default values
    defargs <- as.list(parent_formals)
    defargs <- defargs[unlist(lapply(defargs, FUN = function(x) class(x) != "name"))]
    args[names(defargs)] <- defargs
    setargs <- evalq(as.list(match.call())[-1], envir = parent.frame())
    args[names(setargs)] <- setargs
  }
  return(args)

}


# Function to generate pretty axis labels that don't go outside range of x
pretty_axis <- function(x, n = 5, include_lims = TRUE){

  prettyx <- pretty(x, n = 5)

  if(include_lims){
    prettyx <- prettyx[prettyx <= max(x) & prettyx >= min(x)]
  } else {
    prettyx <- prettyx[prettyx < max(x) & prettyx > min(x)]
  }

  prettyx

}


#' Generic r3js plotting function
#'
#' @param x
#' @param y
#' @param z
#' @param ...
#'
#' @return
#' @export
#'
#' @examples
plot3js <- function(x,y,z,
                    aspect = c(1, 1, 1),
                    ...){

  # Setup plot
  data3js <- plot3js.new()

  # Define plotting space
  xlim <- extendrange(x)
  ylim <- extendrange(y)
  zlim <- extendrange(z)

  data3js <- plot3js.window(data3js,
                            xlim = xlim,
                            ylim = ylim,
                            zlim = zlim,
                            aspect = aspect)

  # Add a box
  data3js <- box3js(data3js)

  # Add axes
  prettyx <- pretty(xlim, n = 8)
  data3js <- axis3js(data3js,
                     side = "x",
                     loc = "front",
                     at  = prettyx[prettyx < max(xlim) & prettyx > min(xlim)],
                     lwd = 1)

  prettyy <- pretty(ylim, n = 8)
  data3js <- axis3js(data3js,
                     side = "y",
                     loc = "front",
                     at  = prettyy[prettyy < max(ylim) & prettyy > min(ylim)],
                     lwd = 1)

  prettyz <- pretty(zlim, n = 8)
  data3js <- axis3js(data3js,
                     side = "z",
                     loc = "front",
                     at  = prettyz[prettyz < max(zlim) & prettyz > min(zlim)],
                     lwd = 1)

  # Add a grid
  data3js <- grid3js(data3js)

  # Add points
  data3js <- points3js(data3js,
                       x = x,
                       y = y,
                       z = z,
                       ...)

  # Create plot
  widget <- r3js(data3js)
  print(widget)

  # Return plotting widget
  attr(widget, "data") <- data3js
  widget

}


#' Set material properties of 3js object
#'
#' @param mat
#' @param col
#' @param opacity
#'
#' @return
#' @export
#'
#' @examples
material3js <- function(mat = "phong",
                        col = "black",
                        opacity = 1.0,
                        xpd = TRUE,
                        lwd = 1,
                        interactive = NULL,
                        label = NULL,
                        toggle = NULL,
                        dimensions = NULL,
                        depthWrite = NULL,
                        polygonOffset = NULL,
                        polygonOffsetFactor = NULL,
                        polygonOffsetUnits = NULL,
                        faces = NULL){

  col <- col2rgb(col)/255
  props <- list(mat         = jsonlite::unbox(mat),
                color       = list(red   = col[1,],
                                   green = col[2,],
                                   blue  = col[3,]),
                opacity     = jsonlite::unbox(opacity),
                xpd         = jsonlite::unbox(xpd),
                lwd         = jsonlite::unbox(lwd),
                transparent = jsonlite::unbox(opacity != 1.0))

  if(!is.null(dimensions[1]))  { props$dimensions  <- jsonlite::unbox(dimensions)  }
  if(!is.null(label[1]))       { props$label       <- jsonlite::unbox(label)       }
  if(!is.null(interactive[1])) { props$interactive <- jsonlite::unbox(interactive) }
  if(!is.null(toggle[1]))      { props$toggle      <- jsonlite::unbox(toggle)      }
  if(!is.null(depthWrite[1]))  { props$depthWrite  <- jsonlite::unbox(depthWrite)  }
  if(!is.null(polygonOffset[1])){ props$polygonOffset <- jsonlite::unbox(polygonOffset) }
  if(!is.null(polygonOffsetFactor[1])){ props$polygonOffsetFactor <- jsonlite::unbox(polygonOffsetFactor) }
  if(!is.null(polygonOffsetUnits[1])){  props$polygonOffsetUnits  <- jsonlite::unbox(polygonOffsetUnits) }
  if(!is.null(faces[1])){  props$faces  <- faces }


  # Return properties
  props

}

#' Add an r3js highlight object
#'
#' @param highlight
#'
#' @return
#' @export
#'
#' @examples
highlight3js <- function(data3js, highlight){

  # Get arguments from parent environment
  largs <- eval(quote(allargs()), parent.frame())

  # Remove the highlight argument and empty plot data
  largs <- largs[!names(largs) == "highlight"]
  largs["data3js"] <- list(plot = c())

  # Replace any default arguments with arguments provided to highlight
  for(x in seq_along(highlight)){
    largs[[names(highlight)[x]]] <- highlight[[x]]
  }

  # Return the plot object output
  hl_objects <- do.call(eval(as.list(sys.call(-1))[[1]]), largs)$plot

  # Add the highlight objects to the data object
  for(x in seq_along(hl_objects)){
    n <- length(data3js$plot) - length(hl_objects) + x
    data3js$plot[[n]]$highlight <- hl_objects[[x]]
  }

  # Return the new data object
  data3js

}


#' Add point to a 3js object
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
#'
#' @examples
point3js <- function(data3js,
                     x, y, z,
                     size,
                     col,
                     pch = 0,
                     highlight,
                     ...){

  object <- c()
  object$type <- "point"
  if(pch == 0){ object$shape <- "circle" }
  if(pch == 1){ object$shape <- "ring"   }
  object$size <- size
  object$properties <- material3js(col = col, ...)
  object$position <- c(x,y,z)

  data3js$plot[[length(data3js$plot)+1]] <- object
  data3js

}


#' Add points to a 3js object
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
                      pch  = 0,
                      highlight,
                      label  = NULL,
                      toggle = NULL,
                      ...){

  # Repeat arguments to match length of points
  col    <- rep_len(col,    length(x))
  size   <- rep_len(size,   length(x))
  pch    <- rep_len(pch,    length(x))
  if(!is.null(label)) { label  <- rep_len(label,  length(x)) }
  if(!is.null(toggle)){ toggle <- rep_len(toggle, length(x)) }

  # Create the points
  for(n in 1:length(x)){
      data3js <- point3js(data3js = data3js,
                          x = x[n],
                          y = y[n],
                          z = z[n],
                          size = size[n],
                          col = col[n],
                          pch = pch[n],
                          label = label[n],
                          toggle = toggle[n],
                          ...)
  }

  # Create the highlights object if requested
  if(!missing(highlight)){
    data3js <- highlight3js(data3js, highlight)
  }

  # Return the updated object
  data3js

}


#' Add a line to a 3js object
#'
#' @param data3js
#' @param x0
#' @param y0
#' @param z0
#' @param x1
#' @param y1
#' @param z1
#' @param lwd
#' @param col
#' @param mat
#' @param ...
#'
#' @return
#'
#' @examples
line3js <- function(data3js,
                    x0, y0, z0,
                    x1, y1, z1,
                    lwd = 1,
                    col = "black",
                    mat = "basic",
                    ...){

  object <- c()
  object$type <- "line"
  object$properties <- material3js(mat = mat, lwd = lwd, col = col, ...)
  object$position$from <- c(x0,y0,z0)
  object$position$to   <- c(x1,y1,z1)
  object

  data3js$plot[[length(data3js$plot)+1]] <- object
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
                     ...){

  # Create the points
  for(n in 2:length(x)){
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

  # Create the highlights object if requested
  if(!missing(highlight)){
    data3js <- highlight3js(data3js, highlight)
  }

  # Return the updated object
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

  data3js$plot[[length(data3js$plot)+1]] <- object
  data3js

}


#' Add a surface to a 3js object
#'
#' @param data3js
#' @param x
#' @param y
#' @param z
#' @param col
#' @param mat
#' @param wireframe
#' @param ...
#'
#' @return
#' @export
#'
#' @examples
surface3js <- function(data3js,
                       x, y, z,
                       col,
                       mat,
                       wireframe = FALSE,
                       highlight,
                       ...){

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
  data3js$plot[[length(data3js$plot)+1]] <- object

  # Add highlight if given
  if(!missing(highlight)){
    data3js <- highlight3js(data3js, highlight)
  }

  # Return plot data
  data3js

}


#' Add a grid to an r3js plot
#'
#' Add a grid parallel to the axis to an r3js plot. This is mostly intended for
#' adding grid lines to an axis.
#'
#' @param data3js
#' @param x
#' @param y
#' @param z
#'
#' @return
#' @export
#'
#' @examples
axislines3js <- function(data3js, x, y, z, ax, lwd = 0.9, col = "grey80", ...){

  # Setup grid
  grid_data <- list(x,y,z)
  axnum <- match(ax, c("x","y","z"))
  grid_data[-axnum][[1]] <- rep_len(grid_data[-axnum][[1]], 2)
  grid_data[-axnum][[2]] <- rep_len(grid_data[-axnum][[2]], 2)

  # Add grid lines in first direction
  for(n in grid_data[[axnum]]){
    line_data <- grid_data
    line_data[[axnum]] <- rep(n, 2)
    data3js <- lines3js(data3js,
                        x = line_data[[1]],
                        y = line_data[[2]],
                        z = line_data[[3]],
                        lwd = 0.9,
                        col = "grey80",
                        ...)
  }

  # Return the new data
  data3js

}

#' Add grid lines to an axis
#'
#' @param data3js
#' @param ax
#' @param side
#' @param at
#' @param ...
#'
#' @return
#' @export
#'
#' @examples
sidegrid3js <- function(data3js, ax, side, at, dynamic = FALSE, ...){

  # Setup grid data
  grid_data <- list()
  axnum <- match(ax, c("x","y","z"))

  # Set where the tick marks will be drawn
  if(missing(at)){
    at <- data3js$ticks[[axnum]]
    if(is.null(at)){
      pretty_axis(data3js$lims[[axnum]])
    }
  }
  grid_data[[axnum]] <- at

  # Set the side position of the axis
  sidenum <- match(substr(side, 1, 1), c("x","y","z"))
  if(substr(side, 2, 2) == "+"){ grid_data[[sidenum]] <- max(data3js$lims[[sidenum]]) }
  if(substr(side, 2, 2) == "-"){ grid_data[[sidenum]] <- min(data3js$lims[[sidenum]]) }

  # Set the range for the final side
  rangenum <- (1:3)[-c(axnum, sidenum)]
  grid_data[[rangenum]] <- data3js$lims[[rangenum]]

  # Plot the grid lines
  if(dynamic){
    axislines3js(data3js,
                 x = grid_data[[1]],
                 y = grid_data[[2]],
                 z = grid_data[[3]],
                 ax = ax,
                 faces = side, ...)
  } else {
    axislines3js(data3js,
                 x = grid_data[[1]],
                 y = grid_data[[2]],
                 z = grid_data[[3]],
                 ax = ax, ...)
  }

}





