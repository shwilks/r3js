
# Setup workspace
set.seed(200)
library(r3js)
rm(list= ls())

# Generate some data
# pdata <- data.frame(
#   x = rnorm(100),
#   y = rnorm(100, sd = 10, mean = 20),
#   z = rnorm(100, sd = 0.1, mean = -20)
# )

pdata <- data.frame(
  x = rnorm(100),
  y = rnorm(100),
  z = rnorm(100)
)

# Setup plot
data3js <- plot3js(x = pdata$x,
                   y = pdata$y,
                   z = pdata$z,
                   col  = "blue",
                   mat  = "basic",
                   size = 0.5,
                   aspect = c(1,1,1),
                   show_plot = FALSE)

# Calculate the 3d convex hull
source("../labbook_code/scripts/chull.R")
coords <- as.matrix(pdata)
chull  <- chull3d(coords)


# Add the chull to the plot
for(x in 1:nrow(chull)){
  data3js <- lines3js(data3js,
                      x = c(coords[chull[x,1],1], coords[chull[x,2],1]),
                      y = c(coords[chull[x,1],2], coords[chull[x,2],2]),
                      z = c(coords[chull[x,1],3], coords[chull[x,2],3]),
                      col = "black")

  data3js <- lines3js(data3js,
                      x = c(coords[chull[x,1],1], coords[chull[x,3],1]),
                      y = c(coords[chull[x,1],2], coords[chull[x,3],2]),
                      z = c(coords[chull[x,1],3], coords[chull[x,3],3]),
                      col = "black")

  data3js <- lines3js(data3js,
                      x = c(coords[chull[x,3],1], coords[chull[x,2],1]),
                      y = c(coords[chull[x,3],2], coords[chull[x,2],2]),
                      z = c(coords[chull[x,3],3], coords[chull[x,2],3]),
                      col = "black")
}

# Generate clipping planes
clipping_planes <- apply(chull, 1, function(i){

  clippingPlane3js(coplanarPoints = coords[i,])

})

# Create a sphere cropped by the clipping planes
data3js <- sphere3js(data3js,
                     x = 0,
                     y = 0,
                     z = 0,
                     radius = 2,
                     col = "red",
                     xpd = FALSE,
                     clippingPlanes = clipping_planes)

# Show the plot
debug3js(data3js, "clipping_planes.js")
# r3js(data3js)

