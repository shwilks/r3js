
# Test simple 3D plotting
set.seed(100)

data3js <- plot3js(x   = runif(10),
                   y   = runif(10,min = 10,max = 11),
                   z   = runif(10,min = 100,max = 101),
                   col = rainbow(10),
                   show_plot = FALSE,
                   label_axes = FALSE)


data3js <- axis3js(data3js, "x")
data3js <- axis3js(data3js, "y")
data3js <- axis3js(data3js, "z")

export.viewer.test(
  r3js(data3js, rotation = c(0.264, -0.951, 0.050)),
  "simpleplot.html"
)

