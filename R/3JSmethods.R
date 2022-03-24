
#' Print data3js
#'
#' The print method for the data3js object, by default plotting the htmlwidget.
#'
#' @param x The data3js object
#' @param ... Additional arguments, not used
#'
#' @export
#'
print.data3js <- function(x, ...){

  print(r3js(x), ...)

}
