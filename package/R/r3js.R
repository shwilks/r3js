
#' Plot r3js data
#'
#' Creates an html widget from an r3js data object.
#'
#' @import htmlwidgets
#'
#' @export
r3js <- function(data3js,
                 width       = NULL,
                 height      = NULL,
                 elementId   = NULL,
                 rotation    = NULL,
                 zoom        = NULL,
                 translation = NULL,
                 show_rotation = FALSE) {

  # Create a list that contains the settings
  if(!is.null(rotation))    { data3js$scene$rotation    <- rotation    }
  if(!is.null(zoom))        { data3js$scene$zoom        <- zoom        }
  if(!is.null(translation)) { data3js$scene$translation <- translation }

  settings <- list(
    show_rotation = show_rotation
  )

  # Forward options using x
  x = list(
    data3js  = jsonlite::toJSON(data3js),
    settings = settings
  )

  # Create widget
  htmlwidgets::createWidget(
    name = 'r3js',
    x,
    width = width,
    height = height,
    package = 'r3js',
    elementId = elementId,
    sizingPolicy = htmlwidgets::sizingPolicy(
      viewer.padding = 0,
      browser.fill = TRUE,
      browser.padding = 0
    )
  )

}

#' Shiny bindings for r3js
#'
#' Output and render functions for using r3js within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a r3js
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name r3js-shiny
#'
#' @export
r3jsOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'r3js', width, height, package = 'r3js')
}

#' @rdname r3js-shiny
#' @export
renderR3js <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, r3jsOutput, env, quoted = TRUE)
}



#' Write to the debug file
#'
#' @param data3js
#'
#' @return
#' @export
#'
#' @examples
debug3js <- function(data3js, filename = "bug.js"){

  write(x    = paste0("json_data = '", jsonlite::toJSON(data3js), "';\n\nvar plotData = JSON.parse(json_data);"),
        file = file.path("~/Dropbox/LabBook/r3js/package/inst/htmlwidgets/lib/tests/data", filename))

}


