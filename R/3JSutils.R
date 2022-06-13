
#' Save an r3js plot to an HTML file
#'
#' Converts r3js plot data to a widget and saves it to an HTML file (e.g. for
#' sharing with others)
#'
#' @param data3js The r3js data object to be saved
#' @param file File to save HTML into
#' @param title Text to use as the title of the generated page
#' @param selfcontained Whether to save the HTML as a single self-contained file
#'   (with external resources base64 encoded) or a file with external resources
#'   placed in an adjacent directory.
#' @param libdir Directory to copy HTML dependencies into (defaults to
#'   filename_files)
#' @param ... Further arguments to pass to `r3js()`
#'
#' @return No return value, called for the side-effect of saving the plot.
#'
#' @export
#'
save3js <- function(
  data3js,
  file,
  title = "r3js plot",
  selfcontained = TRUE,
  libdir = NULL,
  ...
  ) {

  # Create the widget
  widget <- r3js(data3js = data3js,
                 ...)

  # Export the widget
  save3jsWidget(
    widget = widget,
    file   = file,
    title  = title,
    selfcontained = selfcontained,
    libdir = libdir
  )

}


#' Save an r3js widget to an HTML file
#'
#' Save a rendered r3js widget to an HTML file (e.g. for sharing with others).
#' This is mostly a wrapper for \code{\link[htmlwidgets]{saveWidget}}.
#'
#' @param widget Widget to save
#' @param file File to save HTML into
#' @param title Text to use as the title of the generated page
#' @param selfcontained Whether to save the HTML as a single self-contained file
#'   (with external resources base64 encoded) or a file with external resources
#'   placed in an adjacent directory
#' @param libdir Directory to copy HTML dependencies into (defaults to
#'   filename_files)
#' @param ... Further arguments to pass to \code{\link[htmlwidgets]{saveWidget}}
#'
#' @return No return value, called for the side-effect of saving the plot.
#'
#' @export
#'
save3jsWidget <- function(
  widget,
  file,
  title = "r3js plot",
  selfcontained = TRUE,
  libdir = NULL,
  ...) {

  # We need to convert to the full filepath name (a bug in htmlwidgets?)
  file <- file.path(normalizePath(dirname(file)), basename(file))

  # If self-contained write first to a temporary file
  # else save as normal widget
  if(selfcontained){

    # Export the widget to a temporary file first
    tmp_file <- tempfile(fileext = ".html")
    htmlwidgets::saveWidget(widget = widget,
                            file   = tmp_file,
                            title  = title,
                            ...)

    # Move the file to the proper location
    file.copy(from = tmp_file,
              to   = file,
              overwrite = TRUE)

    # Remove the temporary file
    unlink(tmp_file)

  } else {

    htmlwidgets::saveWidget(widget        = widget,
                            file          = file,
                            title         = title,
                            selfcontained = selfcontained,
                            libdir        = libdir,
                            ...)

  }


}

