
#' Setup a new r3js plot
#'
#' This function sets up a new r3js plot and returns an r3js plotting object
#' that can later be added to using other functions such as `points3js()`
#' and `lines3js()` etc.  It is in many ways equivalent to the `plot.new()`
#' command.
#'
#' @param background Background color to use
#'
#' @return Returns a new data3js plotting object
#'
#' @export
plot3js.new <- function(
  background = "#ffffff"
  ){

  data3js <-  structure(list(), class = c("data3js", "list"))
  data3js$ticks <- list(NULL,NULL,NULL)

  # Set background color
  data3js <- background3js(
    data3js = data3js,
    col     = background
  )

  # Set default unit plot lims
  data3js <- plot3js.window(
    data3js = data3js,
    xlim = c(0,1),
    ylim = c(0,1),
    zlim = c(0,1)
  )

  # Return the object
  data3js

}


#' Set axis limits for a data3js object
#'
#' This is similar to the `plot.window()` command except that plot limits can
#' only be set once for each plot.
#'
#' @param data3js The data3js object
#' @param xlim x axis limits
#' @param ylim y axis limits
#' @param zlim z axis limits
#' @param aspect vector of length 3 giving the aspect ratio, or null to
#'   automatically set the aspect ratio such that axes have the same visual
#'   length
#'
#' @return Returns an updated data3js object
#'
#' @export
#'
plot3js.window <- function(
  data3js,
  xlim,
  ylim,
  zlim,
  aspect = NULL
){

  if(is.null(aspect)){
    xspan <- diff(range(xlim))
    yspan <- diff(range(ylim))
    zspan <- diff(range(zlim))
    aspect <- c(1, xspan/yspan, xspan/zspan)
  }
  data3js$lims <- list(xlim, ylim, zlim)
  data3js$aspect <- aspect
  data3js

}

#' Set the plot background color
#'
#' @param data3js The data3js object
#' @param col The background color
#'
#' @return Returns an updated data3js object
#'
#' @export
#'
background3js <- function(
  data3js,
  col
  ){

  data3js$scene$background <- convertCol3js(col)
  data3js

}


#' Add text to the margin of an r3js plot
#'
#' This is used for example to add axis labels but can also
#' be used for other purposes.
#'
#' @param data3js The data3js object
#' @param text The margin text
#' @param side The axis side, either "x", "y" or "z"
#' @param line The number of lines away from the plot edge
#' @param at Position along the plot edge, defaults to 0.5 (middle)
#' @param cornerside See `material3js()`
#' @param ... Other arguments to pass to `material3js()`
#'
#' @return Returns an updated data3js object
#'
#' @export
#' @family plot components
#'
#' @examples
#' # Create a blank plot
#' p <- plot3js.new()
#' p <- box3js(p)
#'
#' # Add some margin text
#' p <- mtext3js(p, "0.5m", side = "x")
#' p <- mtext3js(p, "0.25m", side = "x", at = 0.25, line = 1)
#' p <- mtext3js(p, "1m", side = "y", at = 1, line = 2)
#' r3js(p)
#'
mtext3js <- function(
  data3js,
  text,
  side,
  line   = 0,
  at     = 0.5,
  cornerside = "f",
  ...
  ){

  # Add text to each corner
  for(a in c(1,2)){
    for(b in c(1,2)){

      ap <- c("-", "+")[a]
      bp <- c("-", "+")[b]

      if(side == "x"){
        x <- data3js$lims[[1]][1] + diff(range(data3js$lims[[1]]))*at
        y <- switch(a, "1" = data3js$lims[[2]][1], "2" = data3js$lims[[2]][2])
        z <- switch(b, "1" = data3js$lims[[3]][1], "2" = data3js$lims[[3]][2])
        poffset <- c(0, (a-1.5)*line*0.1, (b-1.5)*line*0.1)
        cornercode <- paste0("x",ap,bp,cornerside)
      }
      if(side == "y"){
        x <- switch(a, "1" = data3js$lims[[1]][1], "2" = data3js$lims[[1]][2])
        y <- data3js$lims[[2]][1] + diff(range(data3js$lims[[2]]))*at
        z <- switch(b, "1" = data3js$lims[[3]][1], "2" = data3js$lims[[3]][2])
        poffset <- c((a-1.5)*line*0.1, 0, (b-1.5)*line*0.1)
        cornercode <- paste0(ap,"y",bp,cornerside)
      }
      if(side == "z"){
        x <- switch(b, "1" = data3js$lims[[1]][1], "2" = data3js$lims[[1]][2])
        y <- switch(a, "1" = data3js$lims[[2]][1], "2" = data3js$lims[[2]][2])
        z <- data3js$lims[[3]][1] + diff(range(data3js$lims[[3]]))*at
        poffset <- c((b-1.5)*line*0.1, (a-1.5)*line*0.1, 0)
        cornercode <- paste0(ap,bp,"z",cornerside)
      }

      data3js <- text3js(
        data3js,
        x         = x,
        y         = y,
        z         = z,
        text      = text,
        corners   = cornercode,
        col       = "black",
        type      = "html",
        normalise = FALSE,
        poffset   = poffset,
        ...
      )

    }
  }

  # Return the update plotting object
  data3js

}



#' Add a box to an r3js plot
#'
#' @param data3js The data3js object
#' @param sides The axis side to show the box, any combination of "x", "y" or "z"
#' @param dynamic Should edges of the box closest to the viewer hide themselves automatically
#' @param col Box color
#' @param geometry Should the box be rendered as a physical geometry in the scene (see `lines3js()`)
#' @param renderOrder The render order for the box, defaults to 1
#' @param ... Other arguments to pass to `material3js()`
#'
#' @return Returns an updated data3js object
#'
#' @export
#' @family plot components
#'
#' @examples
#' p <- plot3js.new()
#' p <- box3js(p)
#' r3js(p)
#'
box3js <- function(
  data3js,
  sides = c("x","y","z"),
  dynamic = TRUE,
  col = "grey80",
  geometry = FALSE,
  renderOrder = 1,
  ...
  ){

  # Expand vector of sides
  faces <- NULL
  sides <- as.list(sides)
  sides <- lapply(sides, function(n){
    output <- n
    if(n == "x"){ output <- c("x+", "x-") }
    if(n == "y"){ output <- c("y+", "y-") }
    if(n == "z"){ output <- c("z+", "z-") }
    output
  })
  sides <- unlist(sides)

  # Draw lines parallel to x axis
  for(i in 1:2){
    for(j in 1:2){
      face1 <- c("y-","y+")[i]
      face2 <- c("z-","z+")[j]
      if(sum(c(face1, face2) %in% sides) > 0){
        if(dynamic){
          faces <- c()
          if(face1 %in% sides){ faces <- c(faces, face1) }
          if(face2 %in% sides){ faces <- c(faces, face2) }
        }
        data3js <- lines3js(
          data3js,
          x = data3js$lims[[1]],
          y = rep(data3js$lims[[2]][i], 2),
          z = rep(data3js$lims[[3]][j], 2),
          faces = faces,
          col = col,
          geometry = geometry,
          renderOrder = renderOrder,
          ...
        )
      }
    }
  }

  # Draw lines parallel to y axis
  for(i in 1:2){
    for(j in 1:2){
      face1 <- c("x-","x+")[i]
      face2 <- c("z-","z+")[j]
      if(sum(c(face1, face2) %in% sides) > 0){
        if(dynamic){
          faces <- c()
          if(face1 %in% sides){ faces <- c(faces, face1) }
          if(face2 %in% sides){ faces <- c(faces, face2) }
        }
        data3js <- lines3js(
          data3js,
          x = rep(data3js$lims[[1]][i], 2),
          y = data3js$lims[[2]],
          z = rep(data3js$lims[[3]][j], 2),
          faces = faces,
          col = col,
          geometry = geometry,
          renderOrder = renderOrder,
          ...
        )
      }
    }
  }

  # Draw lines parallel to z axis
  for(i in 1:2){
    for(j in 1:2){
      face1 <- c("x-","x+")[i]
      face2 <- c("y-","y+")[j]
      if(sum(c(face1, face2) %in% sides) > 0){
        if(dynamic){
          faces <- c()
          if(face1 %in% sides){ faces <- c(faces, face1) }
          if(face2 %in% sides){ faces <- c(faces, face2) }
        }
        data3js <- lines3js(
          data3js,
          x = rep(data3js$lims[[1]][i], 2),
          y = rep(data3js$lims[[2]][j], 2),
          z = data3js$lims[[3]],
          faces = faces,
          col = col,
          geometry = geometry,
          renderOrder = renderOrder,
          ...
        )
      }
    }
  }

  # Return new plot data
  data3js

}

