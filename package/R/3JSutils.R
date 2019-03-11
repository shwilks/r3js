
#' Create a snapshot of an r3js plot
#'
#' @param data3js The r3js data object
#' @param filename File to save the snapshot to
#' @param ... Further parameters to pass to r3js
#'
#' @export
#'
snapshot3js <- function(data3js,
                        filename,
                        ...){

  # Create widget
  widget <- r3js(data3js, ...)

  # Generate a random filename that doesn't already exist in the downloads folder
  while(!exists("random_file") || file.exists(file.path("~/Downloads", random_file))){
    random_file <- paste0("r3jssnapshot", sample(1:1000000, 1), ".png")
  }

  # Create widget
  widget <- htmlwidgets::onRender(x = widget,
                                  jsCode = paste0("function(el, x) {
                                                   el.snapshot('",random_file,"');
                                                   window.setTimeout(function(){
                                                   window.close();
                                                  }, 1000); }"))
  tmp_html <- tempfile(fileext = ".html")
  htmlwidgets::saveWidget(widget = widget,
                          file   = tmp_html)

  # Open webpage behind
  system2("open", args = c("-g", "-j", tmp_html))

  # Move the generated file
  random_file_path <- file.path("~/Downloads", random_file)
  while(!file.exists(random_file_path)){
    Sys.sleep(0.1)
  }
  file.rename(random_file_path, filename)

  # Tidy up
  unlink(tmp_html)

}
