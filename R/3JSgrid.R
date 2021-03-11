
#' Add axis grids to an data3js object
#'
#' This is used for example by `plot3js()` to add axis grids to a plot
#' these show along the faces of the plotting box, indicating axis ticks.
#'
#' @param data3js The data3js object
#' @param sides The axis sides to show the box, any combination of "x", "y" or "z"
#' @param axes Axes for which to draw the grid lines
#' @param at Where to draw grid lines along the axis
#' @param dynamic Should edges of the box closest to the viewer hide themselves automatically
#' @param col Grid line color
#' @param geometry Should the lines be rendered as a physical geometry in the scene (see `lines3js()`)
#' @param ... Other arguments to pass to `material3js()`
#'
#' @export
#'
grid3js <- function(
  data3js,
  sides = c("x","y","z"),
  axes  = c("x","y","z"),
  at = NULL,
  dynamic = TRUE,
  col = "grey95",
  geometry = FALSE,
  ...
){

  # Expand vector of sides
  faces <- NULL
  sides <- as.list(sides)
  sides <- lapply(sides, function(n){
    output <- n
    if(n == "x"){ output <- c("x+", "x-") }
    if(n == "y"){ output <- c("y+", "y-") }
    if(n == "z"){ output <- c("z+", "z-") }
    output
  })
  sides <- unlist(sides)

  # Add axes
  for(ax in axes){
    ax_sides <- sides[!grepl(ax, sides)]
    for(side in ax_sides){
      data3js <- sidegrid3js(
        data3js,
        ax       = ax,
        side     = side,
        at       = at[[ax]],
        dynamic  = dynamic,
        col      = col,
        geometry = geometry,
        ...
      )
    }
  }

  # Return new plotting data
  data3js

}


#' Add a side grid to the plot
#'
#' This is used by the function grid3js to add a grid on the faces of the plot region,
#' marking for example axis points.
#'
#' @param data3js The data3js object
#' @param ax Axis for which to draw lines, one of "x", "y" or "z"
#' @param side The side of the grid, one of "x", "y" or "z"
#' @param at Where to draw grid lines, defaults to the current axis tick marks
#' @param col Color of the grid lines
#' @param dynamic Should edges of the box closest to the viewer hide themselves automatically
#' @param geometry Should the lines be rendered as a physical geometry in the scene (see `lines3js()`)
#' @param ... Other arguments to pass to `material3js()`
#'
sidegrid3js <- function(
  data3js,
  ax,
  side,
  at = NULL,
  col = "grey80",
  dynamic = FALSE,
  geometry = FALSE,
  ...
  ){

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
    axislines3js(
      data3js,
      x = grid_data[[1]],
      y = grid_data[[2]],
      z = grid_data[[3]],
      ax = ax,
      faces = side,
      col   = col,
      geometry = geometry,
      ...
    )
  } else {
    axislines3js(
      data3js,
      x = grid_data[[1]],
      y = grid_data[[2]],
      z = grid_data[[3]],
      ax  = ax,
      col = col,
      geometry = geometry,
      ...
    )
  }

}


#' Add a grid to an r3js plot
#'
#' Add a grid parallel to the axis to an r3js plot. This is mostly intended for
#' adding grid lines to an axis.
#'
#' @noRd
axislines3js <- function(
  data3js,
  x, y, z,
  ax,
  lwd = 0.9,
  col = "grey80",
  geometry = FALSE,
  ...
  ){

  # Setup grid
  grid_data <- list(x,y,z)
  axnum <- match(ax, c("x","y","z"))
  grid_data[-axnum][[1]] <- rep_len(grid_data[-axnum][[1]], 2)
  grid_data[-axnum][[2]] <- rep_len(grid_data[-axnum][[2]], 2)

  # Add grid lines in first direction
  for(n in grid_data[[axnum]]){
    line_data <- grid_data
    line_data[[axnum]] <- rep(n, 2)
    data3js <- lines3js(
      data3js,
      x = line_data[[1]],
      y = line_data[[2]],
      z = line_data[[3]],
      lwd = lwd,
      col = col,
      geometry = geometry,
      ...
    )
  }

  # Return the new data
  data3js

}

