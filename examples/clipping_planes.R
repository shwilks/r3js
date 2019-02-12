
# Setup workspace
set.seed(200)
library(r3js)
rm(list= ls())

# Generate some data
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
                   show_plot = FALSE)

# Calculate the 3d convex hull
source("../labbook_code/scripts/chull.R")
coords <- as.matrix(pdata)
chull  <- chull3d(coords)

# # Cross product function
# CrossProduct3D <- function(U, V) {
#
#   c(U[2]*V[3]-U[3]*V[2],
#     U[3]*V[1]-U[1]*V[3],
#     U[1]*V[2]-U[2]*V[1])
#
# }
#
#
# for(x in seq_len(nrow(chull))){
#
#   tri_i <- chull[x,]
#
#   for(n in seq_len(nrow(delauney))){
#     vmatch <- delauney[n,] %in% tri_i
#     if(sum(vmatch) == 3){
#       ntri_i <- delauney[n,][!vmatch]
#       break
#     }
#   }
#
#   # Calculate the surface normal
#   tri_norm <- CrossProduct3D(
#     coords[tri_i[1],] - coords[tri_i[2],],
#     coords[tri_i[1],] - coords[tri_i[3],]
#   )
#   tri_norm <- tri_norm/sqrt(sum(tri_norm^2))
#
#   # Get the vector
#   pv <- coords[ntri_i,] - coords[tri_i[2],]
#
#   dp <- t(tri_norm) %*% pv
#   if(dp > 0){
#     chull[x,] <- rev(chull[x,])
#   }
#
# }


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
                     clippingPlanes = clipping_planes)

debug3js(data3js)

# Show the plot
r3js(data3js)

