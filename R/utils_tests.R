
# Placeholder test function
export.viewer.test <- function(
  widget,
  filename
  ){

  # Expect widget created successfully
  testthat::expect_true(inherits(widget, "htmlwidget"))

}

