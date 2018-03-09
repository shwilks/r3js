
library(r3js)


## Simple plotting -----------------
# Test simple 3D plotting
plot3js(x = runif(10),
        y = runif(10),
        z = runif(10),
        col = rainbow(10))


## Building up a plot -----------------
# Generate data
x <- runif(20, 0, 10)
y <- runif(20, 0, 20)
z <- runif(20, 0, 1)

# Initialise new plot
data3js <- plot3js.new()

# Set plot dimensions and aspect ratios
data3js <- plot3js.window(data3js,
                          xlim = extendrange(x),
                          ylim = extendrange(y),
                          zlim = extendrange(z),
                          aspect = c(0.5,1,0.5))

# Add box
data3js <- box3js(data3js, col = "grey50")

# Add axes
data3js <- axis3js(data3js, side = "x", title = "x axis")
data3js <- axis3js(data3js, side = "y", title = "y axis")
data3js <- axis3js(data3js, side = "z", title = "z axis")

# Add axes grids
data3js <- grid3js(data3js, col = "grey80")

# Plot points
data3js <- points3js(data3js, x, y, z, col = rainbow(20))

# Show the plot
r3js(data3js)




## Adding interactivity
# Test simple interactivity
plotdata <- plot3js(x = runif(100),
                    y = runif(100),
                    z = runif(100),
                    col = rainbow(100),
                    highlight = list(size = 1.5,
                                     col = "cyan",
                                     mat = "basic"),
                    label = paste("Point", 1:100))
data3js <- attr(plotdata, "data")

write(x    = paste0("json_data = '", jsonlite::toJSON(data3js), "';\n\nvar plotData = JSON.parse(json_data);"),
      file = "package/inst/htmlwidgets/data/bug.js")

