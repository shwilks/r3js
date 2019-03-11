

data3js <- plot3js(x = seq_len(nrow(volcano)),
                   y = seq_len(ncol(volcano)),
                   z = volcano,
                   aspect = c(1,
                              ncol(volcano)/nrow(volcano),
                              0.5),
                   show_plot = FALSE,
                   label_axes = "z",
                   type = "n")

# Get topographical colors
color_fun      <- colorRamp(terrain.colors(100))
volcano_colors <- color_fun((volcano - min(volcano))/diff(range(volcano)))
volcano_colors <- rgb(volcano_colors[,1], volcano_colors[,2], volcano_colors[,3], maxColorValue = 255)

# Set x and y grid lines
volcano_x <- seq_len(nrow(volcano))
volcano_y <- seq_len(ncol(volcano))

data3js <- r3js::surface3js(data3js,
                            x = volcano_x,
                            y = volcano_y,
                            z = volcano,
                            col = volcano_colors)



xlineIDs <- rep(NA, length(volcano_x))
ylineIDs <- rep(NA, length(volcano_y))

for(x in seq(from = 1, to = length(volcano_x), by = 2)){

  data3js <- lines3js(data3js,
                      x = rep(volcano_x[x], length(volcano_y)),
                      y = volcano_y,
                      z = volcano[x,]+0.1,
                      opacity = 0,
                      col = "grey20",
                      highlight = list(
                        opacity = 1
                      ),
                      lwd = 1)
  xlineIDs[x] <- lastID(data3js)

}

for(y in seq(from = 1, to = length(volcano_y), by = 2)){

  data3js <- lines3js(data3js,
                      x = volcano_x,
                      y = rep(volcano_y[y], length(volcano_x)),
                      z = volcano[,y]+0.1,
                      opacity = 0,
                      col = "grey20",
                      highlight = list(
                        opacity = 1
                      ),
                      lwd = 1)
  ylineIDs[y] <- lastID(data3js)

}

for(x in seq(from = 1, to = length(volcano_x), by = 2)){
  for(y in seq(from = 1, to = length(volcano_y), by = 2)){
    data3js <- points3js(data3js,
                         x = volcano_x[x],
                         y = volcano_y[y],
                         z = volcano[x,y]+0.1,
                         opacity = 0,
                         size = 1,
                         highlight = list(
                           opacity = 1,
                           size = 0.4
                         ),
                         label = paste0(volcano[x,y], "m"),
                         interactive = TRUE,
                         mat = "basic")
    data3js <- group3js(data3js,
                        objectIDs = lastID(data3js),
                        groupIDs  = c(xlineIDs[x], ylineIDs[y]))
  }
}

print(r3js(data3js,
           rotation = c(-65, 0, -22),
           zoom = 2.15))


