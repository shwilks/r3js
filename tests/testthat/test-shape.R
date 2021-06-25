
library(r3js)
library(testthat)

# Function to generate values decreasing in a sphere-like way
f <- function(coords) coords[1]^2 + coords[2]^2 + coords[3]^2

# Set grid coordinates at which to calculate values
x <- seq(-2,2,len = 20)
y <- seq(-2,2,len = 20)
z <- seq(-2,2,len = 20)

# Calculate values across grid coordinates
grid_coords <- expand.grid(x, y, z)
grid_values <- apply(grid_coords, 1, f)

# Convert to a 3d array
grid_array <- array(grid_values, dim = c(length(x), length(y), length(z)))

# Calculate 3d contour from the grid data at a contour level of value 4
shape <- rmarchingcubes::contour3d(
  griddata = grid_array,
  level = 4,
  x = x,
  y = y,
  z = z
)

test_that("Test shape from vertices, single value coloring", {

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
