
library(r3js)
library(testthat)

context("Core plotting")

setup_plot <- function(
  xlim = c(0,10),
  ylim = c(0,10),
  zlim = c(0,1)
){

  # Initialise new plot
  data3js <- plot3js.new()

  # Set plot dimensions and aspect ratios
  data3js <- plot3js.window(
    data3js,
    xlim = xlim,
    ylim = ylim,
    zlim = zlim,
    aspect = c(1,1,diff(range(zlim))/diff(range(ylim)))
  )

  # Add box
  data3js <- box3js(data3js, col = "grey50")

  # Add axes
  data3js <- axis3js(data3js, side = "x")
  data3js <- axis3js(data3js, side = "y")
  data3js <- axis3js(data3js, side = "z")

  # Add axes grids
  data3js <- grid3js(data3js, col = "grey80")

  # Return the plot data
  data3js

}


# Core plotting function
test_that("plot3js", {

  data3js <- plot3js(
    x = iris$Sepal.Length,
    y = iris$Sepal.Width,
    z = iris$Petal.Length,
    col = rainbow(3)[iris$Species],
    show_plot = FALSE
  )

  export.viewer.test(
    r3js(data3js),
    "plot3js.html"
  )

})

test_that("plot3js with hover info", {

  data3js <- plot3js(
    x = runif(100),
    y = runif(100),
    z = runif(100),
    col = rainbow(100),
    highlight = list(
      size = 1.5,
      col = "cyan",
      mat = "basic"
    ),
    label = paste("Point", 1:100),
    show_plot = FALSE
  )

  export.viewer.test(
    r3js(data3js),
    "plot3js_with_hover_info.html"
  )

})



# # ## Setup the plot
# # data3js <- setup_plot(zlim = c(0,10))
#
#
# # data3js <- glpoints3js(data3js,
# #                        x    = runif(10),
# #                        y    = runif(10),
# #                        z    = runif(10),
# #                        size = runif(10, min = 1, max = 5),
# #                        col  = rainbow(10))
#
# n <- 100000
#
# # A <- 3
# # B <- 1
# # t <- seq(from = 1, to = 6, length.out = n)
# #
# # x <- 0.1*t*A*cos(t)+5
# # y <- 0.1*t*A*sin(t)+5
# # z <- B*t
# #
# # sd <- c(
# #   seq(from = 0.01, to = 1, length.out = n)
# # )
# #
# # x <- x + rnorm(n, sd = sd)
# # y <- y + rnorm(n, sd = sd)
# # z <- z + rnorm(n, sd = sd)
# #
# # data3js <- glpoints3js(data3js,
# #                        x    = x,
# #                        y    = y,
# #                        z    = z,
# #                        size = runif(n, min = 0.05, max = 0.1),
# #                        col  = rainbow(n)[sample(n)])
#
# data3js <- glpoints3js(data3js,
#                        x    = rnorm(n)+5,
#                        y    = rnorm(n)+5,
#                        z    = rnorm(n)+5,
#                        size = runif(n, min = 0.01, max = 0.1),
#                        col  = rainbow(n))
#
# print(r3js(data3js))
# # ## Points
# # data3js <- points3js(data3js,
# #                      x = runif(10),
# #                      y = runif(10),
# #                      z = runif(10),
# #                      col = rainbow(10))
# debug3js(data3js)
# stop()
#
# ## Lines
# data3js <- lines3js(data3js,
#                     x = runif(10)+2,
#                     y = runif(10),
#                     z = runif(10),
#                     col = "red",
#                     lwd = 4)
#
# data3js <- lines3js(data3js,
#                     x = runif(10)+2,
#                     y = runif(10),
#                     z = runif(10),
#                     col = "blue",
#                     lwd = 2)
#
# ## Spheres
# data3js <- sphere3js(data3js,
#                      x = 4.5,
#                      y = 0.5,
#                      z = 0.5,
#                      radius = 0.5,
#                      col = "lightgreen")
#
# ## Segments
# x <- runif(10)+6
# y <- runif(10)
# z <- runif(10)
#
# data3js <- segments3js(data3js,
#                        x = x,
#                        y = y,
#                        z = z,
#                        col = "purple",
#                        lwd = 3)
#
# data3js <- segments3js(data3js,
#                        x = x[-1],
#                        y = y[-1],
#                        z = z[-1],
#                        col = "orange",
#                        lwd = 6)
#
# # Arrows
# data3js <- arrow3js(data3js,
#                     x = c(8, 9),
#                     y = c(0,1),
#                     z = c(0,0),
#                     col = "darkgreen")
#
# data3js <- arrow3js(data3js,
#                     x = c(9, 9),
#                     y = c(0,1),
#                     z = c(0,0),
#                     col = "darkblue")
#
#
# # Triangles
# data3js <- triangle3js(data3js,
#                        vertices = rbind(c(0,2,0),
#                                         c(0,3,0),
#                                         c(1,2,0)),
#                        col = "orange")
#
# # print(r3js(data3js))
#
#
#
#
# # Strings
# data3js <- text3js(data3js,
#                    x = 2,
#                    y = 2,
#                    z = 0,
#                    text = "Text",
#                    col = "green")
#
# debug3js(data3js)
#
# ## Simple plotting -----------------
# # Test simple 3D plotting
# lpos <- 10
#
# plotData <- plot3js(x   = runif(10),
#                     y   = runif(10),
#                     z   = runif(10),
#                     xlab = "x axis",
#                     ylab = "y axis",
#                     zlab = "z axis",
#                     col = rainbow(10))
# stop()
# # plotData <- plot3js.new()
# plotData <- mtext3js(data3js = plotData,
#                      text    = "x axis",
#                      side    = "x",
#                      line    = lpos,
#                      at      = 0.5,
#                      cornerside = "f")
# # r3js(plotData)
#
# plotData <- mtext3js(data3js = plotData,
#                      text    = "y axis",
#                      side    = "y",
#                      line    = lpos,
#                      at      = 0.5,
#                      cornerside = "f")
#
# plotData <- mtext3js(data3js = plotData,
#                      text    = "z axis",
#                      side    = "z",
#                      line    = lpos,
#                      at      = 0.5,
#                      cornerside = "f")
#
# r3js(plotData)
# # debug3js(plotData)
#
# # plotData <- lines3js(data3js = plotData,
# #                      x = c(0,1,0),
# #                      y = c(0,1,1),
# #                      z = c(0,1,1),
# #                      lwd = 2,
# #                      col = "green")
# #
# # plotData <- points3js(data3js = plotData,
# #                    x = c(0),
# #                    y = c(0),
# #                    z = c(0),
# #                    lwd = 2,
# #                    col = "black")
# #
# # r3js(plotData)
# #
# #
# # ## Building up a plot -----------------
# # # Generate data
# # x <- runif(20, 0, 10)
# # y <- runif(20, 0, 20)
# # z <- runif(20, 0, 1)
# #
# # # Initialise new plot
# # data3js <- plot3js.new()
# #
# # # Set plot dimensions and aspect ratios
# # data3js <- plot3js.window(data3js,
# #                           xlim = extendrange(x),
# #                           ylim = extendrange(y),
# #                           zlim = extendrange(z),
# #                           aspect = c(0.5,1,0.5))
# #
# # # Add box
# # data3js <- box3js(data3js, col = "grey50")
# #
# # # Add axes
# # data3js <- axis3js(data3js, side = "x", title = "x axis")
# # data3js <- axis3js(data3js, side = "y", title = "y axis")
# # data3js <- axis3js(data3js, side = "z", title = "z axis")
# #
# # # Add axes grids
# # data3js <- grid3js(data3js, col = "grey80")
# #
# # # Plot points
# # data3js <- points3js(data3js, x, y, z, col = rainbow(20))
# #
# # data3js <- legend3js(data3js,
# #                      legend = c("Description 1",
# #                                 "Description 2",
# #                                 "Description 3"),
# #                      fill = rainbow(3))
# #
# # # Show the plot
# # r3js(data3js)
# #
# # stop()
# # # # Test exporting of files
# # # data3js <- plot3js(x = runif(10),
# # #                    y = runif(10),
# # #                    z = runif(10),
# # #                    col = rainbow(10))
# # #
# # # export3js(data3js, "~/Desktop/test_page.html")
# #
# # # ## Adding interactivity
# # # # Test simple interactivity
# # # plotdata <- plot3js(x = runif(100),
# # #                     y = runif(100),
# # #                     z = runif(100),
# # #                     col = rainbow(100),
# # #                     highlight = list(size = 1.5,
# # #                                      col = "cyan",
# # #                                      mat = "basic"),
# # #                     label = paste("Point", 1:100))
# # # data3js <- attr(plotdata, "data")
# #
# # # write(x    = paste0("json_data = '", jsonlite::toJSON(data3js), "';\n\nvar plotData = JSON.parse(json_data);"),
# # #       file = "package/inst/htmlwidgets/data/bug.js")
# #
# # data3js <- plot3js(x   = runif(10, min = -10, max = 10),
# #                    y   = runif(10),
# #                    z   = runif(10),
# #                    col = rainbow(10),
# #                    moveable = TRUE)
# #
# # data3js <- sphere3js(data3js,
# #                      x   = 0.5,
# #                      y   = 0.5,
# #                      z   = 0.5,
# #                      radius = 0.2,
# #                      col = "blue",
# #                      opacity = 2,
# #                      highlight = list(radius = 0.5))
# #
# # debug3js(data3js)
