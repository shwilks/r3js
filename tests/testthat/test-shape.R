
library(r3js)
library(testthat)

test_that("Test shape from vertices, single value coloring", {

  p <- plot3js(
    xlim = range(teapot$vertices[,1]),
    ylim = range(teapot$vertices[,2]),
    zlim = range(teapot$vertices[,3]),
    label_axes = FALSE,
    aspect = c(1, 1, 1)
  )

  p <- shape3js(
    p,
    vertices = teapot$vertices,
    faces = teapot$edges,
    col = "lightblue"
  )

  export.viewer.test(
    r3js(p),
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

test_that("Test shape from vertices, no normals", {

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
    col = "green"
  )

  export.viewer.test(
    r3js(data3js),
    "shape_no_normals.html"
  )

})
