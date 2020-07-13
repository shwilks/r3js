
export.viewer.test <- function(widget, filename){

  # Set the output filepath
  rootdir <- test_path("../testoutput/viewer")
  testfile <- file.path(normalizePath(rootdir), filename)

  # Save the widget
  htmlwidgets::saveWidget(
    widget,
    file          = testfile,
    selfcontained = FALSE,
    libdir        = ".lib"
  )

  # Remove any additional files
  unlink(file.path(rootdir, paste0(".lib/r3js-1.0.0")), recursive = T)

  # Replace links to library with links to main code
  plotdata <- readLines(testfile)
  plotdata <- gsub(
    pattern     = paste0(".lib/r3js-1.0.0/"),
    replacement = paste0("../../../inst/htmlwidgets/lib/"),
    x           = plotdata,
    fixed       = TRUE
  )
  writeLines(plotdata, testfile)

  # Add a test to check plot was outputted correctly
  expect_true(file.exists(testfile))

}

