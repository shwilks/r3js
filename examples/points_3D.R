
# Generate point set
set.seed(100)
ptx <- rep(1:10, times = 10)
pty <- rep(1:10, each  = 10)
ptpch <- rep(15:16, times = 50)

ptsize <- seq(from = 0.2, to = 1.5, length.out = 100)

data3js <- plot3js(
  x = ptx,
  y = pty,
  z = rep(0, length(ptx)),
  zlim = c(-1,1),
  size = ptsize,
  pch = ptpch,
  label_axes = FALSE,
  geometry = FALSE,
  label = 1:100
)

data3js$dimensions <- 3
debug3js(data3js, filename = "glpoints3d.js")

ptcol <- rainbow(100)
ptsizes <- runif(100, 0.1, 1)

ptcol <- rainbow(100)
ptsizes <- runif(100, 2, 5)

