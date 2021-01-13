
library(r3js)
library(testthat)

shape <- readRDS(test_path("sphereshape.rds"))

data3js <- plot3js(
  x = shape$vertices[,1],
  y = shape$vertices[,2],
  z = shape$vertices[,3],
  show_plot = FALSE,
  size = 0.2,
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
  "shape.html"
)
