
library(r3js)
library(testthat)

context("Text rendering")

# Core plotting function
test_that("Adding geometric text", {

  data3js <- plot3js(
    x = iris$Sepal.Length,
    y = iris$Sepal.Width,
    z = iris$Petal.Length,
    col = rainbow(3)[iris$Species]
  )

  data3js <- text3js(
    data3js,
    x = c(5, 7),
    y = c(4, 4),
    z = c(2, 2),
    text = c("label 1", "label 2"),
    size = c(0.1, 0.1),
    type = "geometry"
  )

  export.viewer.test(
    r3js(data3js),
    "text_geometry.html"
  )

})
