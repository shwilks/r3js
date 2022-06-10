
#' Plot a data3js object
#'
#' This function takes the assembled data3js object and plots it as an
#' htmlwidget.
#'
#' @param data3js The data3js object
#' @param rotation Plot starting rotation as an XYZ Euler rotation
#' @param zoom Plot starting zoom factor
#' @param translation Plot starting translation
#' @param styles List of styles controlling elements of the plot, see examples
#' @param title Title for the viewer
#' @param ... Additional arguments to pass to `htmlwidgets::createWidget()`
#'
#' @return Returns an html widget of the plot
#' @export
#'
#' @examples
#' # Control toggle button appearance
#' r3js(
#'   plot3js(
#'     x = iris$Sepal.Length,
#'     y = iris$Sepal.Width,
#'     z = iris$Petal.Length,
#'     col = rainbow(3)[iris$Species],
#'     xlab = "Sepal Length",
#'     ylab = "Sepal Width",
#'     zlab = "Petal Length",
#'     toggle = iris$Species
#'   ),
#'   styles = list(
#'     togglediv = list(
#'       bottom = "4px",
#'       right = "4px"
#'     ),
#'     toggles = list(
#'       setosa = list(
#'         on  = list(backgroundColor = colorspace::darken(rainbow(3)[1], 0.1), color = "white"),
#'         off = list(backgroundColor = colorspace::lighten(rainbow(3)[1], 0.8), color = "white")
#'       ),
#'       versicolor = list(
#'         on  = list(backgroundColor = colorspace::darken(rainbow(3)[2], 0.1), color = "white"),
#'         off = list(backgroundColor = colorspace::lighten(rainbow(3)[2], 0.8), color = "white")
#'       ),
#'       virginica = list(
#'         on  = list(backgroundColor = colorspace::darken(rainbow(3)[3], 0.1), color = "white"),
#'         off = list(backgroundColor = colorspace::lighten(rainbow(3)[3], 0.8), color = "white")
#'       )
#'     )
#'   ),
#'   zoom = 1.5
#' )
#'
r3js <- function(
  data3js,
  rotation     = c(-1.45, 0, -2.35),
  zoom         = 2,
  translation  = c(0, 0, 0),
  styles       = list(),
  title        = "R3JS viewer",
  ...
  ) {

  # Create a list that contains the settings
  if(!is.null(rotation))    { data3js$scene$rotation    <- rotation              }
  if(!is.null(zoom))        { data3js$scene$zoom        <- jsonlite::unbox(zoom) }
  if(!is.null(translation)) { data3js$scene$translation <- translation           }

  settings <- list()
  settings$styles <- styles
  settings$title  <- title

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


