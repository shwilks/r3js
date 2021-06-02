
library(r3js)
library(testthat)

shape <- readRDS(test_path("sphereshape.rds"))

test_that("Test shape from vertices, normal coloring", {

  data3js <- plot3js(
    x = shape$vertices[,1],
    y = shape$vertices[,2],
    z = shape$vertices[,3],
    show_plot = FALSE,
    size = 0.1,
    type = "glpoints"
  )

  data3js <- shape3js(
    data3js,
    vertices = shape$vertices,
    faces = shape$triangles,
    normals = shape$normals,
    col = "lightblue"
  )

  export.viewer.test(
    r3js(data3js),
    "shape_single_color.html"
  )

})

test_that("Test shape from vertices, vertex coloring", {

  data3js <- plot3js(
    x = shape$vertices[,1],
    y = shape$vertices[,2],
    z = shape$vertices[,3],
    show_plot = FALSE,
    size = 0.1,
    type = "glpoints"
  )

  data3js <- shape3js(
    data3js,
    vertices = shape$vertices,
    faces = shape$triangles,
    normals = shape$normals,
    col = rainbow(nrow(shape$vertices))
  )

  export.viewer.test(
    r3js(data3js),
    "shape_vertex_color.html"
  )

})
