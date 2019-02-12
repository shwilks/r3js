
# Setup a basic plot
data3js <- plot3js(x   = runif(10),
                   y   = runif(10),
                   z   = runif(10),
                   col = rainbow(10),
                   show_plot = FALSE)

# Add a simple legend
data3js <- legend3js(data3js,
                     legend = c("Description 1",
                                "Description 2",
                                "Description 3"),
                     fill = c("red",
                              "green",
                              "blue"),
                     title = "Test legend")

# Show the plot
r3js(data3js)
debug3js(data3js)

