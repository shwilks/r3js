
library(r3js)
library(testthat)

context("Triangle plotting")

test_that("plot3js with triangles", {

  data3js <- plot3js.new()
  data3js <- plot3js.window(data3js, c(0, 5), c(0, 5), c(0, 5), c(1, 1, 1))
  data3js <- box3js(data3js, col = "grey50")
  data3js <- axis3js(data3js, side = "x")
  data3js <- axis3js(data3js, side = "y")
  data3js <- axis3js(data3js, side = "z")
  data3js <- grid3js(data3js, col = "grey80")
  data3js <- triangle3js(
    data3js,
    vertices = rbind(
      c(0,2,0), c(0,3,0), c(1,2,0),
      c(3,5,3), c(2,4,2), c(3,3,3)
    ),
    col = "orange"
  )

  export.viewer.test(
    r3js(data3js),
    "triangles3js.html"
  )

})
