
# r3js::print
test_that("print", {

  p <- plot3js()
  expect_equal(class(p), c("data3js", "list"))
  expect_equal(class(print(p)), c("r3js", "htmlwidget"))

})

# r3js::save3js
test_that("save3js", {

  # Create plot
  p <- plot3js(
    x = iris$Sepal.Length,
    y = iris$Sepal.Width,
    z = iris$Petal.Length,
    col = rainbow(3)[iris$Species],
    xlab = "Sepal Length",
    ylab = "Sepal Width",
    zlab = "Petal Length"
  )

  # Save the plot
  tmp <- tempfile()
  save3js(p, tmp)
  expect_true(file.exists(tmp))
  file.remove(tmp)

})

# r3js::clippingPlane3js
test_that("clippingPlane", {

  # Set up plot
  p <- plot3js(
    xlim = c(-2, 2),
    ylim = c(-2, 2),
    zlim = c(-2, 2)
  )

  # Add a sphere with clipping planes
  export.viewer.test(
    r3js(
      sphere3js(
        data3js = p,
        0, 0, 0,
        radius = 2,
        col = "red",
        clippingPlanes = list(
          clippingPlane3js(
            rbind(
              c(1.5,0,1),
              c(1.5,1,1),
              c(1.5,0,0)
            )
          ),
          clippingPlane3js(
            rbind(
              c(1,1.8,1),
              c(0,1.8,1),
              c(1,1.8,0)
            )
          ),
          clippingPlane3js(
            rbind(
              c(0,-1.8,1),
              c(1,-1.8,1),
              c(1,-1.8,0)
            )
          )
        )
      )
    ),
    "clippingPlane.html"
  )

})


# r3js::legend3js
test_that("legend", {

  # Setup plot
  p <- plot3js(
    x = iris$Sepal.Length,
    y = iris$Sepal.Width,
    z = iris$Petal.Length,
    col = rainbow(3)[iris$Species],
    xlab = "Sepal Length",
    ylab = "Sepal Width",
    zlab = "Petal Length"
  )

  # Add simple legend
  export.viewer.test(
    r3js(
      legend3js(
        data3js = p,
        legend = levels(iris$Species),
        fill = rainbow(3)
      )
    ),
    "legend.html"
  )

})

# rollover
test_that("rollover", {

  export.viewer.test(
    r3js(
      plot3js(
        x = USJudgeRatings$CONT,
        y = USJudgeRatings$INTG,
        z = USJudgeRatings$DMNR,
        highlight = list(
          col = "darkgreen",
          size = 2.5
        ),
        xlab = "CONT",
        ylab = "INTG",
        zlab = "DMNR",
        size = 2,
        col = "green",
        label = rownames(USJudgeRatings)
      )
    ),
    "rollover.html"
  )

})

# toggle
test_that("toggle", {

  # Add toggles to a plot
  export.viewer.test(
    r3js(
      plot3js(
        x = iris$Sepal.Length,
        y = iris$Sepal.Width,
        z = iris$Petal.Length,
        col = rainbow(3)[iris$Species],
        xlab = "Sepal Length",
        ylab = "Sepal Width",
        zlab = "Petal Length",
        toggle = iris$Species
      ),
      styles = list(
        togglediv = list(
          bottom = "4px",
          right = "4px"
        ),
        toggles = list(
          setosa = list(
            on  = list(backgroundColor = colorspace::darken(rainbow(3)[1], 0.1), color = "white"),
            off = list(backgroundColor = colorspace::lighten(rainbow(3)[1], 0.8), color = "white")
          ),
          versicolor = list(
            on  = list(backgroundColor = colorspace::darken(rainbow(3)[2], 0.1), color = "white"),
            off = list(backgroundColor = colorspace::lighten(rainbow(3)[2], 0.8), color = "white")
          ),
          virginica = list(
            on  = list(backgroundColor = colorspace::darken(rainbow(3)[3], 0.1), color = "white"),
            off = list(backgroundColor = colorspace::lighten(rainbow(3)[3], 0.8), color = "white")
          )
        )
      )
    ),
    "toggles.html"
  )

})

# r3js::plot3js
test_that("plot3js", {
  export.viewer.test(
    r3js(
      plot3js(
        x = iris$Sepal.Length,
        y = iris$Sepal.Width,
        z = iris$Petal.Length,
        col = rainbow(3)[iris$Species],
        xlab = "Sepal Length",
        ylab = "Sepal Width",
        zlab = "Petal Length"
      )
    ),
    "plot3js.html"
  )
})

# r3js::light3js
test_that("light3js", {

  # Set up a plot
  p <- plot3js(
    x = 1:4,
    y = c(2,1,3,4),
    z = c(3,2,4,1),
    xlim = c(0, 5),
    ylim = c(0, 5),
    zlim = c(0, 5),
    size = 20,
    col = c("white", "blue", "red", "green"),
    grid_col = "grey40",
    background = "black"
  )

  # Light scene intensely from above
  export.viewer.test(
    r3js(light3js(
      p,
      position = c(0, 1, 0)
    )),
    "light_directional.html"
  )

  # Light scene positionally from the middle of the plot
  export.viewer.test(
    r3js(light3js(
      p,
      position = c(2.5, 2.5, 2.5),
      type = "point"
    )),
    "light_positional.html"
  )

  # Light scene ambiently with a yellow light
  export.viewer.test(
    r3js(light3js(
      p,
      intensity = 0.3,
      type = "ambient",
      col = "yellow"
    )),
    "light_ambient.html"
  )

})

# r3js::mtext3js
test_that("mtext3js", {

  # Create a blank plot
  p <- plot3js.new()
  p <- box3js(p)

  # Add some margin text
  p <- mtext3js(p, "0.5m", side = "x")
  p <- mtext3js(p, "0.25m", side = "x", at = 0.25, line = 1)
  p <- mtext3js(p, "1m", side = "y", at = 1, line = 2)

  export.viewer.test(
    r3js(p),
    "mtext.html"
  )

})


# r3js::box3js
test_that("box3js", {

  # Add a box to a blank plot
  p <- plot3js.new()
  export.viewer.test(
    r3js(box3js(p)),
    "box.html"
  )

})

# r3js::sidegrid3js
test_that("sidegrid3js", {

  # Setup blank base plot
  p <- plot3js(
    xlim = c(0, 10),
    ylim = c(0, 10),
    zlim = c(0, 10),
    draw_grid = F,
    xlab = "X",
    ylab = "Y",
    zlab = "Z"
  )

  # Add a box
  p <- box3js(p)

  # Add grid lines for the z axis and
  # only at the top end of the x axis
  p <- sidegrid3js(
    p, col = "blue",
    axis = "z",
    side = "x+"
  )

  # Add grid lines for the z axis at
  # the bottom end of the x axis, and
  # Have them shown and hidden dynamically
  # according to the plot rotation
  p <- sidegrid3js(
    p, col = "red",
    axis = "z",
    side = "x-",
    dynamic = TRUE
  )

  export.viewer.test(
    r3js(p),
    "sidegrid.html"
  )

})


# r3js::grid3js
test_that("grid3js", {

  # Setup blank base plot
  p <- plot3js(draw_grid = F, xlab = "X", ylab = "Y", zlab = "Z")

  # Add a box and margin text
  p <- box3js(p)

  # Add grid lines but only for the z axis and
  # only at either end of the x axis
  export.viewer.test(
    r3js(
      grid3js(
        p, col = "blue",
        axes = "z",
        sides = "x"
      )
    ),
    "grid.html"
  )

})

# r3js::arrow3js
test_that("arrow3js", {

  # Draw a set of arrows
  from <- cbind(
    runif(10, 0.2, 0.8),
    runif(10, 0.2, 0.8),
    runif(10, 0.2, 0.8)
  )

  to <- jitter(from, amount = 0.2)

  # Setup base plot
  p <- plot3js()

  # Add points
  p <- points3js(
    p,
    x = from[,1],
    y = from[,2],
    z = from[,3],
    col = "lightblue"
  )

  p <- points3js(
    p,
    x = to[,1],
    y = to[,2],
    z = to[,3],
    col = "red"
  )

  # Add arrows
  p <- arrows3js(
    p, from, to,
    arrowhead_length = 0.06,
    arrowhead_width = 0.04,
    lwd = 0.01
  )

  # Add arrows
  export.viewer.test(
    r3js(p),
    "arrows.html"
  )

})

# r3js::shape3js
test_that("shape3js", {

  # Draw a teapot
  data(teapot)
  p <- plot3js(
    xlim = range(teapot$vertices[,1]),
    ylim = range(teapot$vertices[,2]),
    zlim = range(teapot$vertices[,3]),
    label_axes = FALSE,
    aspect = c(1, 1, 1)
  )

  p <- shape3js(
    p,
    vertices = teapot$vertices,
    faces = teapot$edges,
    col = "lightblue"
  )

  export.viewer.test(
    r3js(p),
    "shape.html"
  )

})

# r3js::segments3js
test_that("segments3js", {

  # Draw three lines
  x <- seq(from = 0, to = 6, length.out = 100)
  y <- cos(x*5)
  z <- sin(x*5)
  linecols <- rainbow(100)

  p <- plot3js(
    xlim = c(0, 6),
    ylim = c(0, 6),
    zlim = c(-1, 1),
    aspect = c(1, 1, 1)
  )

  # Add a line using the linegl representation
  p <- segments3js(
    data3js = p,
    x, y + 1, z,
    col = linecols
  )

  # Add a thicker line using the linegl representation
  p <- segments3js(
    data3js = p,
    x, y + 3, z,
    lwd = 3,
    col = linecols
  )

  # Add a line as a physical geometry to the plot
  p <- segments3js(
    data3js = p,
    x, y + 5, z,
    lwd = 0.2,
    geometry = TRUE,
    col = "blue" # Currently only supports fixed colors
  )

  # View the plot
  export.viewer.test(
    r3js(p),
    "segments.html"
  )

})


# r3js::lines3js
test_that("lines3js", {

  # Draw three lines
  x <- seq(from = 0, to = 6, length.out = 100)
  y <- cos(x*5)
  z <- sin(x*5)
  linecols <- rainbow(100)

  p <- plot3js(
    xlim = c(0, 6),
    ylim = c(0, 6),
    zlim = c(-1, 1),
    aspect = c(1, 1, 1)
  )

  # Add a line using the linegl representation
  p <- lines3js(
    data3js = p,
    x, y + 1, z,
    col = linecols
  )

  # Add a thicker line using the linegl representation
  p <- lines3js(
    data3js = p,
    x, y + 3, z,
    lwd = 3,
    col = linecols
  )

  # Add a line as a physical geometry to the plot
  p <- lines3js(
    data3js = p,
    x, y + 5, z,
    lwd = 0.2,
    geometry = TRUE,
    col = "blue" # Currently only supports fixed colors
  )

  # View the plot
  export.viewer.test(
    r3js(p),
    "lines.html"
  )

})


# r3js::points3js
test_that("points3js", {

  geo_shapes <- c(
    "circle", "square", "triangle",
    "circle open", "square open", "triangle open",
    "circle filled", "square filled", "triangle filled",
    "sphere", "cube", "tetrahedron",
    "cube open",
    "cube filled"
  )

  gl_shapes <- c(
    "circle", "square", "triangle",
    "circle open", "square open", "triangle open",
    "circle filled", "square filled", "triangle filled",
    "sphere"
  )

  # Setup base plot
  p <- plot3js(
    xlim = c(0, length(geo_shapes) + 1),
    ylim = c(-4, 4),
    zlim = c(-4, 4)
  )

  export.viewer.test(
    r3js(
      # Plot the three different point geometries
      points3js(
        data3js = p,
        x = seq_along(geo_shapes),
        y = rep(0, length(geo_shapes)),
        z = rep(0, length(geo_shapes)),
        size = 2,
        shape = geo_shapes,
        col = rainbow(length(geo_shapes)),
        fill = "grey70"
      )
    ),
    "points_geo.html"
  )

  # Setup base plot
  p <- plot3js(
    xlim = c(0, length(gl_shapes) + 1),
    ylim = c(-4, 4),
    zlim = c(-4, 4)
  )

  export.viewer.test(
    r3js(
      # Plot the three different point geometries
      points3js(
        data3js = p,
        x = seq_along(gl_shapes),
        y = rep(0, length(gl_shapes)),
        z = rep(0, length(gl_shapes)),
        size = 2,
        shape = gl_shapes,
        col = rainbow(length(gl_shapes)),
        fill = "grey50",
        geometry = FALSE
      )
    ),
    "points_gl.html"
  )

  # Plot a 10,000 points using the much more efficient webgl representation
  # Add a set of points as the default sphere representation
  # Setup base plot
  p <- plot3js(
    xlim = c(-4, 4),
    ylim = c(-4, 4),
    zlim = c(-4, 4)
  )

  export.viewer.test(
    r3js(
      points3js(
        data3js = p,
        x = rnorm(10000, 0),
        y = rnorm(10000, 0),
        z = rnorm(10000, 0),
        size = 0.6,
        col = rainbow(10000),
        shape = "sphere",
        geometry = FALSE
      )
    ),
    "points_gl_sphere.html"
  )

})


# r3js::sphere3js
test_that("sphere3js", {

  # Setup base plot
  p <- plot3js(
    xlim = c(-10, 10),
    ylim = c(-5, 5),
    zlim = c(-8, 8)
  )

  # Add sphere (this will look distorted because of axis scaling)
  export.viewer.test(
    r3js(
      sphere3js(
        data3js = p,
        0, 0, 0,
        radius = 5,
        col = "green"
      )
    ),
    "sphere.html"
  )

  # Setup base plot with equal aspect ratio
  p <- plot3js(
    xlim = c(-10, 10),
    ylim = c(-5, 5),
    zlim = c(-8, 8),
    aspect = c(1, 1, 1)
  )

  # Add sphere (fixed aspect ratio now makes the sphere look spherical)
  export.viewer.test(
    r3js(
      sphere3js(
        data3js = p,
        0, 0, 0,
        radius = 5,
        col = "green"
      )
    ),
    "sphere_fixed_aspect.html"
  )

})


# r3js::text3js
test_that("text3js", {

  # Set text parameters
  x <- 1:4
  y <- rep(0, 4)
  z <- rep(0, 4)
  labels <- LETTERS[1:4]
  sizes <- c(0.4, 0.6, 0.8, 1)

  # Create empty plot with fixed aspect
  p <- plot3js(
    xlim = c(0, 5),
    ylim = c(-1, 1),
    zlim = c(-1, 1),
    aspect = c(1, 1, 1)
  )

  # Add text as a geometry
  export.viewer.test(
    r3js(
      text3js(
        data3js = p,
        x = x,
        y = y,
        z = z,
        size = sizes,
        text = labels
      )
    ),
    "text_geo.html"
  )

  # Add text as a html labels
  export.viewer.test(
    r3js(
      text3js(
        data3js = p,
        x = x,
        y = y,
        z = z,
        size = sizes*40,
        text = labels,
        type = "html"
      )
    ),
    "text_html.html"
  )

})


# r3js::triangle3js
test_that("triangle3js", {

  M <- matrix(
    data = rnorm(36),
    ncol = 3,
    nrow = 12
  )

  p <- plot3js(
    xlim = range(M[,1]),
    ylim = range(M[,2]),
    zlim = range(M[,3]),
    label_axes = FALSE
  )

  p <- triangle3js(
    p,
    vertices = M,
    col = rainbow(nrow(M))
  )

  export.viewer.test(
    r3js(p),
    "triangles3js.html"
  )

})


# r3js::surface3js
test_that("surface3js", {

  # volcano example taken from "persp"
  z <- 2 * volcano        # Exaggerate the relief
  x <- 10 * (1:nrow(z))   # 10 meter spacing (S to N)
  y <- 10 * (1:ncol(z))   # 10 meter spacing (E to W)

  zlim <- range(z)
  zlen <- zlim[2] - zlim[1] + 1

  colorlut <- terrain.colors(zlen) # height color lookup table
  col <- colorlut[ z - zlim[1] + 1 ] # assign colors to heights for each point

  p <- plot3js(
    xlim = range(x),
    ylim = range(y),
    zlim = range(z),
    label_axes = FALSE,
    aspect = c(1, 1, 1) # Maintain a constant aspect ratio
  )

  export.viewer.test(
    r3js(
      data3js = surface3js(
        data3js = p,
        x, y, z,
        col = col
      ),
      rotation = c(-1.15, 0, -0.65),
      zoom = 1.5
    ),
    "surface3js.html"
  )

  export.viewer.test(
    r3js(
      data3js = surface3js(
        data3js = p,
        x, y, z,
        wireframe = TRUE,
        col = col
      ),
      rotation = c(-1.15, 0, -0.65),
      zoom = 1.5
    ),
    "surface3js_wireframe.html"
  )

})

