

#' Convert arguments to a style setting
#'
#' An internal function for converting a string of arguments into a set of css styles for an object.
#'
#' @param ... The list of styles and values
#'
#' @return
#' Returns a list of styles marked with `jsonlite::unbox()`
#'
#' @examples
#' styles <- style3js(color   = "#ff0000",
#'                    padding = "2px")
#'
style3js <- function(...){

  lapply(list(...), jsonlite::unbox)

}


#' Add a legend to a 3js plot
#'
#' @param data3js The r3js plotting data.
#' @param legend A character or expression vector of length ≥ 1 to appear in the legend.
#' @param fill If specified, this argument will cause boxes filled with the specified colors.
#' @param title A character string or length-one expression giving a title to be placed at the top of the legend.
#'
#' @return
#' @export
#'
#' @examples
legend3js <- function(data3js,
                      legend,
                      fill,
                      title,
                      legend_style = list(),
                      line_spacing = "4px"){

  # Create legend object
  legendData <- list()

  # Set the title
  if(!missing(title)){
    legendData$title <- list(name = title,
                             style = style3js(padding = "10px"))
  }

  # Add the legend components
  legendItems <- list()
  legendItem_style <- style3js(paddingLeft   = "4px",
                               paddingRight  = "4px",
                               paddingBottom = line_spacing)
  for(x in 1:length(legend)){
    legendItems[[length(legendItems) + 1]] <- list(legend = legend[x],
                                                   fill   = fill[x],
                                                   style  = legendItem_style)
  }

  # Append the items
  legendData$items <- legendItems

  # Set legend styles
  legend_style_args <- list(color           = "inherit",
                            backgroundColor = "inherit",
                            position        = "absolute",
                            top             = "10px",
                            left            = "10px",
                            padding         = "4px")

  for(x in seq_along(legend_style)){
    legend_style_args[[names(legend_style)[x]]] <- legend_style[[x]]
  }
  legendData$style <- do.call(style3js, legend_style_args)


  # # Add the fill colors
  # legendObject$fill   <- fill

  # # Add points to the legend
  # legendObject$points <- list()
  # for(x in 1:length(legend)){
  #   if(x == 1){
  #     legendObject$points <- lines3js(data3js = legendObject$points,
  #                                     x = c(-0.8,0.8),
  #                                     y = c(0,0),
  #                                     z = c(0,0),
  #                                     lwd = 100,
  #                                     col = "green",
  #                                     dimensions = 2)
  #   } else if(x == 2) {
  #     legendObject$points <- points3js(data3js = legendObject$points,
  #                                      x = 0,
  #                                      y = 0,
  #                                      z = 0,
  #                                      size = 20,
  #                                      col = rainbow(length(legend))[x],
  #                                      dimensions = 3)
  #   } else {
  #     legendObject$points[[length(legendObject$points) + 1]] <- list(type = "fill")
  #   }
  # }

  # Append the legend data to the data object
  data3js$legend <- legendData
  data3js

}
