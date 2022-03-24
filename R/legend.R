

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
#' @export
legend3js <- function(
  data3js,
  legend,
  fill
){

  # Set variables
  box.width      <- "14px"
  box.height     <- "14px"
  font.size      <- "14px"
  legend.spacing <- "4px"
  padding.bottom <- "12px"
  padding.right  <- "12px"

  # Create the legend holder
  div.legend <- htmltools::div(
    style = sprintf(
      "position:absolute; bottom:%s; left:%s;",
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
          "font-size:%s;display:inline-block;",
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





