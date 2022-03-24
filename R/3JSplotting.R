
#' 3D scatter / line plot
#'
#' A high level method for generating a 3D scatter or line plot.
#'
#' @param x x coords for points / lines
#' @param y y coords for points / lines
#' @param z z coords for points / lines
#' @param xlim plot x limits
#' @param ylim plot y limits
#' @param zlim plot z limits
#' @param xlab x axis label
#' @param ylab y axis label
#' @param zlab z axis label
#' @param label optional vector of interactive point labels
#' @param type plot type "p" for geometric points, "l" for lines, or "glpoints"
#'   gl.POINTS rendered points
#' @param axislabel_line Distance of axis label from plot
#' @param aspect Plot axis aspect ratio, see `plot3js.window()`
#' @param label_axes Vector of axes to label, any combination of "x", "y" and
#'   "z"
#' @param draw_grid Should an axis grid be drawn in the background
#' @param draw_box Should a box be drawn around the plot
#' @param grid_lwd Grid line width
#' @param grid_col Grid line color
#' @param axis_lwd Axis line width
#' @param box_lwd Box line width
#' @param box_col Box color
#' @param background Background color for the plot
#' @param ... Further parameters to pass to `material3js()`
#'
#' @return Returns a data3js object, that can be plotted as a widget using
#'   `print()` or `r3js()` or further added to with the other plotting
#'   functions.
#'
#' @examples
#' plot3js(
#'   x = iris$Sepal.Length,
#'   y = iris$Sepal.Width,
#'   z = iris$Petal.Length,
#'   col = rainbow(3)[iris$Species],
#'   xlab = "Sepal Length",
#'   ylab = "Sepal Width",
#'   zlab = "Petal Length"
#' )
#'
#' @export
plot3js <- function(
  x, y, z,
  xlim = NULL,
  ylim = NULL,
  zlim = NULL,
  xlab = NULL,
  ylab = NULL,
  zlab = NULL,
  label = NULL,
  type = "p",
  axislabel_line = 3,
  aspect = NULL,
  label_axes = c("x", "y", "z"),
  draw_box   = TRUE,
  draw_grid  = TRUE,
  grid_lwd   = 1,
  grid_col   = "grey90",
  axis_lwd   = grid_lwd,
  box_lwd    = grid_lwd,
  box_col    = grid_col,
  background = "#ffffff",
  ...
){

  # Setup plot
  data3js <- plot3js.new(background = background)

  # Set default limits
  if (is.null(xlim)) {
    if (missing(x)) xlim <- c(0, 1)
    else            xlim <- grDevices::extendrange(x)
  }

  if (is.null(ylim)) {
    if (missing(y)) ylim <- c(0, 1)
    else            ylim <- grDevices::extendrange(y)
  }

  if (is.null(zlim)) {
    if (missing(z)) zlim <- c(0, 1)
    else            zlim <- grDevices::extendrange(z)
  }

  data3js <- plot3js.window(
    data3js,
    xlim = xlim,
    ylim = ylim,
    zlim = zlim,
    aspect = aspect
  )

  # Add a box
  if (draw_box) {
    data3js <- box3js(data3js, lwd = box_lwd, col = box_col)
  }

  # Add axes
  xaxs_ticks <- pretty_axis(xlim, n = 8)
  yaxs_ticks <- pretty_axis(ylim, n = 8)
  zaxs_ticks <- pretty_axis(zlim, n = 8)

  if("x" %in% label_axes){
    data3js <- axis3js(
      data3js,
      side = "x",
      cornerside = "f",
      at  = xaxs_ticks,
      lwd = axis_lwd
    )
  }
  if("y" %in% label_axes){
    data3js <- axis3js(
      data3js,
      side = "y",
      cornerside = "f",
      at  = yaxs_ticks,
      lwd = axis_lwd
    )
  }
  if("z" %in% label_axes){
    data3js <- axis3js(
      data3js,
      side = "z",
      cornerside = "f",
      at  = zaxs_ticks,
      lwd = axis_lwd
    )
  }

  # Add margin text
  if(!is.null(xlab)){
    data3js <- mtext3js(
      data3js,
      text       = xlab,
      side       = "x",
      line       = axislabel_line,
      at         = 0.5,
      cornerside = "f"
    )
  }
  if(!is.null(ylab)){
    data3js <- mtext3js(
      data3js,
      text       = ylab,
      side       = "y",
      line       = axislabel_line,
      at         = 0.5,
      cornerside = "f"
    )
  }
  if(!is.null(zlab)){
    data3js <- mtext3js(
      data3js,
      text       = zlab,
      side       = "z",
      line       = axislabel_line,
      at         = 0.5,
      cornerside = "f"
    )
  }

  # Add a grid
  if(draw_grid){
    data3js <- grid3js(
      data3js,
      lwd = grid_lwd,
      col = grid_col
    )
  }

  # Add points
  if(!missing(x)
     && !missing(y)
     && !missing(z)){

    if(type == "p"){
      data3js <- points3js(
        data3js,
        x = x,
        y = y,
        z = z,
        label = label,
        ...
      )
    } else if(type == "l"){
      data3js <- lines3js(
        data3js,
        x = x,
        y = y,
        z = z,
        ...
      )
    } else if(type == "glpoints"){
      data3js <- glpoints3js(
        data3js,
        x = x,
        y = y,
        z = z,
        label = label,
        ...
      )
    }

  }

  # Return plotting data
  data3js

}
