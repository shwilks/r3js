
#' @export
print.data3js <- function(x, ..., view = interactive()) {
  print(r3js(x), view = view, ...)
}

.onLoad <- function(...) {
  vctrs::s3_register("knitr::knit_print", "data3js")
}

knit_print.data3js <- function(x, ..., options = NULL) {
  knitr::knit_print(r3js(x), options = options, ...)
}

#' @import htmltools
NULL

#' @method as.tags data3js
#' @export
as.tags.data3js <- function(x, standalone = FALSE, ...) {
  htmltools::as.tags(r3js(x), standalone = standalone, ...)
}

#' @rdname print.data3js
#' @method plot data3js
#' @export
plot.data3js <- print.data3js
