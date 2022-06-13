
# Function used in the tests to output a plot to the testoutput folder and
# link directly to the packages javascript code, meaning you can make
# changes to the javascript code and see if it fixed problems in the test
# files making development much easier!
#
export.viewer.test <- function(
  widget,
  filename
  ){

  # Set the output filepath
  rootdir <- tempdir()
  testfile <- file.path(normalizePath(rootdir), filename)

  # Save the widget
  htmlwidgets::saveWidget(
    widget,
    file          = testfile,
    selfcontained = FALSE,
    libdir        = "lib"
  )

  # Remove any additional files
  unlink(file.path(rootdir, "lib/r3js-1.0.0"), recursive = T)

  # Replace links to library with links to main code
  plotdata <- readLines(testfile)
  plotdata <- gsub(
    pattern     = "lib/r3js-1.0.0/",
    replacement = system.file("inst/htmlwidgets/lib", package = "r3js"),
    x           = plotdata,
    fixed       = TRUE
  )
  writeLines(plotdata, testfile)

  # Add a test to check plot was outputted correctly
  testthat::expect_true(file.exists(testfile))

}

