
library(r3js)
library(testthat)

test_that("Test gl points, single coloring", {

  data3js <- plot3js(
    x = iris$Sepal.Length,
    y = iris$Sepal.Width,
    z = iris$Petal.Length,
    show_plot = FALSE,
    size = 1,
    type = "glpoints",
    col = "green"
  )

  export.viewer.test(
    r3js(data3js),
    "glpoints_single_color.html"
  )

})

test_that("Test glpoints multicoloring", {

  data3js <- plot3js(
    x = iris$Sepal.Length,
    y = iris$Sepal.Width,
    z = iris$Petal.Length,
    show_plot = FALSE,
    size = 1,
    type = "glpoints",
    col = rainbow(length(iris$Sepal.Length))
  )

  export.viewer.test(
    r3js(data3js),
    "glpoints_multi_color.html"
  )

})
