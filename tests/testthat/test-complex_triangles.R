
library(r3js)
library(testthat)

context("Complex triangle plotting")

test_that("plot3js with complex triangles", {

  vert <- data.frame(
    id = rep(1:6, each = 6),
    index = rep(1:6, 6),
    x = c( 15, 15, 0, 0, 0, 15, 15, 15, 15, 15, 15, 15, 0, 0, 15, 15, 15, 0, 0,
           0, 0, 0, 0, 0, 0, 15, 15, 15, 0, 0, 15, 15, 0, 0, 0, 15),
    y = c(0, 0, 0, 0, 0, 0, 15, 15, 0, 0, 0, 15, 15, 15, 15, 15, 15, 15, 0, 0,
          15, 15, 15, 0, 15, 15, 0, 0, 0, 15, 0, 15, 15, 15, 0, 0),
    z = c(0, 5, 5, 5, 0, 0, 0, 5, 5, 5, 0, 0, 0, 5, 5, 5, 0, 0, 0, 5, 5, 5, 0, 0,
          0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5),
    color_ext = c("#CCB266FF", "#CCB266FF", "#CCB266FF", "#CCB266FF",
                  "#CCB266FF", "#CCB266FF", "#CCB266FF", "#CCB266FF", "#CCB266FF",
                  "#CCB266FF", "#CCB266FF", "#CCB266FF", "#CCB266FF", "#CCB266FF",
                  "#CCB266FF", "#CCB266FF", "#CCB266FF", "#CCB266FF", "#CCB266FF",
                  "#CCB266FF", "#CCB266FF", "#CCB266FF", "#CCB266FF", "#CCB266FF",
                  "#808080FF", "#808080FF", "#808080FF", "#808080FF", "#808080FF",
                  "#808080FF", "#994C4CFF", "#994C4CFF", "#994C4CFF", "#994C4CFF",
                  "#994C4CFF", "#994C4CFF"),
    color_int = c("#EBE2C5FF", "#EBE2C5FF", "#EBE2C5FF", "#EBE2C5FF",
                  "#EBE2C5FF", "#EBE2C5FF", "#EBE2C5FF", "#EBE2C5FF", "#EBE2C5FF",
                  "#EBE2C5FF", "#EBE2C5FF", "#EBE2C5FF", "#EBE2C5FF", "#EBE2C5FF",
                  "#EBE2C5FF", "#EBE2C5FF", "#EBE2C5FF", "#EBE2C5FF", "#EBE2C5FF",
                  "#EBE2C5FF", "#EBE2C5FF", "#EBE2C5FF", "#EBE2C5FF", "#EBE2C5FF",
                  "#BFBFBFFF", "#BFBFBFFF", "#BFBFBFFF", "#BFBFBFFF", "#BFBFBFFF",
                  "#BFBFBFFF", "#CA9595FF", "#CA9595FF", "#CA9595FF", "#CA9595FF",
                  "#CA9595FF", "#CA9595FF"),
    alpha = c(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
              1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
    surface_type = c("Wall", "Wall", "Wall", "Wall", "Wall", "Wall", "Wall",
                     "Wall", "Wall", "Wall", "Wall", "Wall", "Wall", "Wall", "Wall", "Wall",
                     "Wall", "Wall", "Wall", "Wall", "Wall", "Wall", "Wall", "Wall", "Floor",
                     "Floor", "Floor", "Floor", "Floor", "Floor", "Roof", "Roof", "Roof",
                     "Roof", "Roof", "Roof")
  )

  # Initialise new plot
  data3js <- plot3js.new()

  # Set plot dimensions and aspect ratios
  data3js <- plot3js.window(
    data3js,
    xlim = range(vert$x) * 1.1,
    ylim = range(vert$y) * 1.1,
    zlim = range(vert$z) * 1.1,
    aspect = c(1,1,1)
  )

  # Add axes
  data3js <- axis3js(data3js, side = "x")
  data3js <- axis3js(data3js, side = "y")
  data3js <- axis3js(data3js, side = "z")

  # Add axes grids
  data3js <- grid3js(data3js, col = "grey80")

  vertices <- as.matrix(vert[, c("x", "y", "z")])

  # data3js <- shape3js(
  #   data3js,
  #   vertices = vertices,
  #   faces = matrix(seq_len(nrow(vert)*3), ncol = 3, byrow = TRUE),
  #   col = vert$color_ext
  # )

  data3js <- triangle3js(data3js,
                         vertices = vertices,
                         col = vert$color_ext,
                         shiness = 0)

  # Add outlines to shape
  lims <- apply(vertices, 2, range)

  data3js <- lines3js(
    data3js,
    x = lims[c(1,2),1],
    y = lims[c(2,2),2],
    z = lims[c(2,2),3],
    col = "black",
    lwd = 2
  )

  data3js <- lines3js(
    data3js,
    x = lims[c(2,2),1],
    y = lims[c(1,2),2],
    z = lims[c(2,2),3],
    col = "black",
    lwd = 2
  )

  data3js <- lines3js(
    data3js,
    x = lims[c(2,2),1],
    y = lims[c(2,2),2],
    z = lims[c(1,2),3],
    col = "black",
    lwd = 2
  )

  # Add axis lines
  data3js <- lines3js(
    data3js,
    x = c(0, 35),
    y = c(0, 0),
    z = c(0, 0),
    col = "green",
    lwd = 2
  )

  data3js <- lines3js(
    data3js,
    x = c(0, 0),
    y = c(0, 35),
    z = c(0, 0),
    col = "blue",
    lwd = 2
  )

  data3js <- lines3js(
    data3js,
    x = c(0, 0),
    y = c(0, 0),
    z = c(0, 15),
    col = "red",
    lwd = 2
  )

  data3js <- light3js(
    data3js,
    position = NULL
  )

  # Show the plot
  export.viewer.test(
    r3js(data3js),
    "triangles3js_complex.html"
  )

})
