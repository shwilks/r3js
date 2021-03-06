
#' Plot a data3js object
#'
#' This function takes the assembled data3js object and plots it as an
#' htmlwidget.
#'
#' @param data3js The data3js object
#' @param rotation Plot starting rotation
#' @param zoom Plot starting zoom factor
#' @param translation Plot starting translation
#' @param ... Additional arguments to pass to `htmlwidgets::createWidget()`
#'
#' @return Returns an html widget of the plot
#' @export
#'
r3js <- function(
  data3js,
  rotation     = NULL,
  zoom         = NULL,
  translation  = NULL,
  ...
  ) {

  # Create a list that contains the settings
  if(!is.null(rotation))    { data3js$scene$rotation    <- rotation              }
  if(!is.null(zoom))        { data3js$scene$zoom        <- jsonlite::unbox(zoom) }
  if(!is.null(translation)) { data3js$scene$translation <- translation           }

  settings <- list()

  # Forward options using x
  x = list(
    data3js  = jsonlite::toJSON(data3js),
    settings = settings
  )

  # Create widget
  widget <- htmlwidgets::createWidget(
    name = 'r3js',
    x,
    package = 'r3js',
    sizingPolicy = htmlwidgets::sizingPolicy(
      viewer.padding = 0,
      browser.fill = TRUE,
      browser.padding = 0
    ),
    ...
  )

  # Add any legends
  if(!is.null(data3js$legend)){
    widget <- htmlwidgets::onRender(
      x      = widget,
      jsCode = sprintf("function(el, x, data) {
        var div = document.createElement('div');
        div.innerHTML      = `%s`;
        div.racviewer      = el.viewer;
        el.viewer.viewport.div.appendChild(div);
      }", data3js$legend),
      data   = NULL
    )
  }

  # Return the widget
  widget

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


