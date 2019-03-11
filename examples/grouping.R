
x <- c(0,1,0,1,0.5,0.5)
y <- c(0,0,1,1,0.5,0.5)
z <- c(0,0,0,0,-1,1)

data3js <- plot3js(x = x,
                   y = y,
                   z = z,
                   type = "n",
                   show_plot = FALSE)

pointIDs <- rep(NA, 6)
for(i in 1:6){

  data3js <- points3js(data3js,
                       x = x[i],
                       y = y[i],
                       z = z[i],
                       col = rainbow(7)[i],
                       highlight = list(size = 3),
                       interactive = TRUE)
  pointIDs[i] <- lastID(data3js)

}

# Apply groupings
# data3js <- group3js(data3js,
#                     objectIDs = pointIDs[1],
#                     groupIDs  = pointIDs[1:4])

debug3js(data3js)
print(r3js(data3js))
