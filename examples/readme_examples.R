
# Generate and view a simple 3D scatterplot
x <- sort(rnorm(1000))
y <- rnorm(1000)
z <- rnorm(1000) + atan2(x, y)

widget <- plot3js(x, y, z, col = rainbow(1000))

# Save as a webpage
htmlwidgets::saveWidget(widget, "/Users/samwilks/Desktop/LabBook/r3js/examples/plots/scatterplot3D.html")
