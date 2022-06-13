

#' Convert arguments to a style setting
#'
#' An internal function for converting a string of arguments into a set of css styles for an object.
#'
#' @param ... The list of styles and values
#'
#' @return
#' Returns a list of styles marked with `jsonlite::unbox()`
#'
#' @noRd
#'
convert_style <- function(...){

  lapply(list(...), jsonlite::unbox)

}


#' Add a legend to an data3js object
#'
#' @param data3js The data3js object
#' @param legend Character vector of legend labels
#' @param fill If supplied the fill color of a box placed next to each label
#'
#' @return Returns an updated data3js object
#'
#' @export
#' @family plot components
#'
#' @examples
#' # Setup plot
#' p <- plot3js(
#'   x = iris$Sepal.Length,
#'   y = iris$Sepal.Width,
#'   z = iris$Petal.Length,
#'   col = rainbow(3)[iris$Species],
#'   xlab = "Sepal Length",
#'   ylab = "Sepal Width",
#'   zlab = "Petal Length"
#' )
#'
#' # Add simple legend
#' p <- legend3js(
#'   data3js = p,
#'   legend = levels(iris$Species),
#'   fill = rainbow(3)
#' )
#'
#' # View plot
#' r3js(p, zoom = 2)
#'
legend3js <- function(
  data3js,
  legend,
  fill
){

  # Set variables
  box.width      <- "14px"
  box.height     <- "14px"
  font.size      <- "14px"
  font.family    <- "sans-serif"
  legend.spacing <- "4px"
  padding.bottom <- "12px"
  padding.right  <- "12px"

  # Create the legend holder
  div.legend <- htmltools::div(
    style = sprintf(
      "position:absolute; bottom:%s; left:%s; white-space:normal;",
      padding.bottom,
      padding.right
    )
  )

  # Add the legend entries
  for(x in seq_along(legend)){

    # Create the entry
    div.entry <- htmltools::div(
      style = sprintf("line-height:%s; margin:%s;", font.size, legend.spacing),
      htmltools::div(
        style = sprintf(
          "line-height:%s;width:%s;height:%s;background-color:%s;display:inline-block;",
          font.size,
          box.width,
          box.height,
          fill[x]
        ),
        onClick = NULL
      ),
      htmltools::div(
        legend[x],
        style = sprintf(
          "font-family:%s;font-size:%s;display:inline-block;",
          font.family,
          font.size
        )
      )
    )

    # Append the entry to the legend
    div.legend <- htmltools::tagAppendChild(
      div.legend,
      div.entry
    )

  }

  # Return the map with legend added
  data3js$legend <- as.character(div.legend)
  data3js

}
