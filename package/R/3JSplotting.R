
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


#' Function to generate pretty axis labels that don't go outside range of x
#'
#' @param x
#' @param n
#' @param include_lims
#'
#' @return
#' @export
#'
#' @examples
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
                    xlim = extendrange(x),
                    ylim = extendrange(y),
                    zlim = extendrange(z),
                    xlab = NULL,
                    ylab = NULL,
                    zlab = NULL,
                    type = "p",
                    axisline = 3,
                    aspect = c(1, 1, 1),
                    fixed_aspect = FALSE,
                    show_plot  = TRUE,
                    label_axes = "xyz",
                    show_grid  = TRUE,
                    grid_lwd   = 1,
                    axis_lwd   = grid_lwd,
                    box_lwd    = grid_lwd,
                    ...){

  # Setup plot
  data3js <- plot3js.new()

  if(fixed_aspect){
    aspect <- c(1,
                diff(range(ylim))/diff(range(xlim)),
                diff(range(zlim))/diff(range(xlim)))
  }

  data3js <- plot3js.window(data3js,
                            xlim = xlim,
                            ylim = ylim,
                            zlim = zlim,
                            aspect = aspect)

  # Add a box
  data3js <- box3js(data3js, lwd = box_lwd)

  # Add axes
  xaxs_ticks <- pretty_axis(xlim, n = 8)
  yaxs_ticks <- pretty_axis(ylim, n = 8)
  zaxs_ticks <- pretty_axis(zlim, n = 8)

  if(grepl("x", label_axes)){
    data3js <- axis3js(data3js,
                       side = "x",
                       cornerside = "f",
                       at  = xaxs_ticks,
                       lwd = axis_lwd)
  }
  if(grepl("y", label_axes)){
    data3js <- axis3js(data3js,
                       side = "y",
                       cornerside = "f",
                       at  = yaxs_ticks,
                       lwd = axis_lwd)
  }
  if(grepl("z", label_axes)){
    data3js <- axis3js(data3js,
                       side = "z",
                       cornerside = "f",
                       at  = zaxs_ticks,
                       lwd = axis_lwd)
  }

  # Add margin text
  if(!is.null(xlab)){
    data3js <- mtext3js(data3js,
                        text       = xlab,
                        side       = "x",
                        line       = axisline,
                        at         = 0.5,
                        cornerside = "f")
  }
  if(!is.null(ylab)){
    data3js <- mtext3js(data3js,
                        text       = ylab,
                        side       = "y",
                        line       = axisline,
                        at         = 0.5,
                        cornerside = "f")
  }
  if(!is.null(zlab)){
    data3js <- mtext3js(data3js,
                        text       = zlab,
                        side       = "z",
                        line       = axisline,
                        at         = 0.5,
                        cornerside = "f")
  }

  # Add a grid
  if(show_grid){
    data3js <- grid3js(data3js,
                       lwd = grid_lwd)
  }

  # Add points
  if(!missing(x)
     && !missing(y)
     && !missing(z)){

    if(type == "p"){
      data3js <- points3js(data3js,
                           x = x,
                           y = y,
                           z = z,
                           ...)
    }

    if(type == "l"){
      data3js <- lines3js(data3js,
                          x = x,
                          y = y,
                          z = z,
                          ...)
    }

  }

  # Create plot
  widget <- r3js(data3js)
  if(show_plot){
    print(widget)
  }

  # Return plotting data
  invisible(data3js)

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
                        opacity = NULL,
                        xpd = TRUE,
                        lwd = 1,
                        lend = 0,
                        ljoin = 0,
                        dashSize = NULL,
                        gapSize = NULL,
                        interactive = NULL,
                        moveable = NULL,
                        label = NULL,
                        toggle = NULL,
                        dimensions = NULL,
                        depthWrite = NULL,
                        depthTest = NULL,
                        polygonOffset = NULL,
                        polygonOffsetFactor = NULL,
                        polygonOffsetUnits = NULL,
                        faces     = NULL,
                        corners   = NULL,
                        rotation  = NULL,
                        normalise = NULL,
                        poffset = NULL,
                        clippingPlanes = NULL,
                        doubleSide = TRUE,
                        renderOrder = NULL,
                        renderSidesSeparately = NULL,
                        removeSelfTransparency = NULL,
                        breakupMesh = NULL){

  # Get opacity from color if not otherwise specified
  if(is.null(opacity)){ opacity <- col2rgb(col, alpha = TRUE)[4]/255 }

  props <- list(mat         = jsonlite::unbox(mat),
                color       = convertCol3js(col),
                opacity     = jsonlite::unbox(opacity),
                xpd         = jsonlite::unbox(xpd),
                lwd         = jsonlite::unbox(lwd),
                lend        = jsonlite::unbox(lend),
                ljoin       = jsonlite::unbox(ljoin),
                transparent = jsonlite::unbox(opacity < 1.0))

  if(!is.null(dimensions))                            { props$dimensions             <- jsonlite::unbox(dimensions)             }
  if(!is.null(label))                                 { props$label                  <- jsonlite::unbox(label)                  }
  if(!is.null(interactive) && interactive)            { props$interactive            <- jsonlite::unbox(interactive)            }
  if(!is.null(moveable) && moveable)                  { props$draggable              <- jsonlite::unbox(moveable)               }
  if(!is.null(toggle))                                { props$toggle                 <- jsonlite::unbox(toggle)                 }
  if(!is.null(dashSize))                              { props$dashSize               <- jsonlite::unbox(dashSize)               }
  if(!is.null(gapSize))                               { props$gapSize                <- jsonlite::unbox(gapSize)                }
  if(!is.null(depthWrite))                            { props$depthWrite             <- jsonlite::unbox(depthWrite)             }
  if(!is.null(depthTest))                             { props$depthTest              <- jsonlite::unbox(depthTest)              }
  if(!is.null(polygonOffset))                         { props$polygonOffset          <- jsonlite::unbox(polygonOffset)          }
  if(!is.null(polygonOffsetFactor))                   { props$polygonOffsetFactor    <- jsonlite::unbox(polygonOffsetFactor)    }
  if(!is.null(polygonOffsetUnits))                    { props$polygonOffsetUnits     <- jsonlite::unbox(polygonOffsetUnits)     }
  if(!is.null(faces))                                 { props$faces                  <- faces                                   }
  if(!is.null(corners))                               { props$corners                <- corners                                 }
  if(!is.null(rotation))                              { props$rotation               <- (rotation/180)*pi                       }
  if(!is.null(normalise))                             { props$normalise              <- jsonlite::unbox(normalise)              }
  if(!is.null(poffset))                               { props$poffset                <- poffset                                 }
  if(!is.null(clippingPlanes))                        { props$clippingPlanes         <- clippingPlanes                          }
  if(!is.null(renderOrder))                           { props$renderOrder            <- renderOrder                             }
  if(!is.null(renderSidesSeparately) && opacity < 1)  { props$renderSidesSeparately  <- jsonlite::unbox(renderSidesSeparately)  }
  if(!is.null(removeSelfTransparency) && opacity < 1) { props$removeSelfTransparency <- jsonlite::unbox(removeSelfTransparency) }
  if(!is.null(breakupMesh) && opacity < 1)            { props$breakupMesh            <- jsonlite::unbox(breakupMesh)            }
  props$doubleSide <- jsonlite::unbox(doubleSide)


  # Return properties
  props

}


#' Internal function to convert color to an rgb list
#'
#' @param col The color to convert in a format R understands
#'
#' @return Returns a list with red, green and blue values
#'
convertCol3js <- function(col){
  col2rgb(col)/255
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
axislines3js <- function(data3js, x, y, z, ax, lwd = 0.9, col = "grey80", geometry = FALSE, ...){

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
                        lwd = lwd,
                        col = col,
                        geometry = geometry,
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
sidegrid3js <- function(data3js,
                        ax,
                        side,
                        at = NULL,
                        col = "grey80",
                        dynamic = FALSE,
                        geometry = FALSE, ...){

  # Setup grid data
  grid_data <- list()
  axnum <- match(ax, c("x","y","z"))

  # Set where the tick marks will be drawn
  if(is.null(at)){
    at <- data3js$ticks[[axnum]]
    if(is.null(at)){
      at <- pretty_axis(data3js$lims[[axnum]])
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
                 faces = side,
                 col   = col,
                 geometry = geometry,
                 ...)
  } else {
    axislines3js(data3js,
                 x = grid_data[[1]],
                 y = grid_data[[2]],
                 z = grid_data[[3]],
                 ax  = ax,
                 col = col,
                 geometry = geometry,
                 ...)
  }

}


#' Add a generic shape to an 3js plot
#'
#' @param data3js
#' @param vertices
#' @param faces
#' @param col
#' @param highlight
#' @param label
#' @param toggle
#' @param ...
#'
#' @return
#' @export
#'
shape3js <- function(data3js,
                     vertices,
                     faces,
                     col  = "black",
                     highlight,
                     label  = NULL,
                     toggle = NULL,
                     ...) {

  object <- c()
  object$type <- "shape"
  object$vertices   <- vertices
  object$faces      <- faces-1 # Need to convert to base 0
  object$properties <- material3js(col = col,
                                   label = label,
                                   toggle = toggle,
                                   ...)

  data3js$plot[[length(data3js$plot)+1]] <- object

  # Create the highlight object if requested
  if(!missing(highlight)){
    data3js <- highlight3js(data3js, highlight)
  }
}







#' Add text to a 3js plot
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
text3js <- function(data3js,
                    x, y, z,
                    text,
                    size = 1,
                    col    = "inherit",
                    label  = NULL,
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
  if(!is.null(label)) { label  <- rep_len(label,  length(x)) }
  if(!is.null(toggle)){ toggle <- rep_len(toggle, length(x)) }

  # Create the points
  for(n in 1:length(x)){
    data3js <- string3js(data3js,
                         x[n], y[n], z[n],
                         text[n],
                         size   = size[n],
                         col    = col[n],
                         label  = label[n],
                         toggle = toggle[n],
                         alignment = alignment,
                         offset    = offset,
                         type      = type[n],
                         style     = style,
                         ...)
  }

  # Return the updated object
  data3js

}




