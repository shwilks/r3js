
library(r3js)
library(testthat)

x_vals <- seq_len(nrow(volcano))
y_vals <- seq_len(ncol(volcano))
z_vals <- volcano

test_that("Test surface, vertex coloring", {

  data3js <- plot3js(
    xlim = range(x_vals),
    ylim = range(y_vals),
    zlim = range(z_vals),
    type = "n"
  )

  colfn <- colorRamp(terrain.colors(10))
  cols <- colfn((z_vals - min(z_vals)) / diff(range(z_vals)))
  colmatrix <- z_vals
  colmatrix[] <- apply(cols, 1, function(x) rgb(x[1], x[2], x[3], maxColorValue = 255))

  data3js <- surface3js(
    data3js,
    x = x_vals,
    y = y_vals,
    z = z_vals,
    col = colmatrix
  )

  data3js <- surface3js(
    data3js,
    x = x_vals,
    y = y_vals,
    z = z_vals + 5,
    col = colmatrix,
    wireframe = TRUE
  )

  export.viewer.test(
    r3js(data3js),
    "surface_single_color.html"
  )

})

