
#' Setup a new r3js plot
#'
#' This function sets up a new r3js plot and returns an r3js plotting object
#' that can later be added to using other functions such as \code{\link{points3js}}
#' and \code{\link{lines3js}} etc.  It is in many ways equivalent to the \code{\link{plot.new}}
#' command.
#'
#' @return Returns an r3js plotting object in the form of a list.
#'
#' @seealso
#' \code{\link{axis3js}},
#' \code{\link{box3js}},
#' \code{\link{points3js}},
#' \code{\link{lines3js}},
#' \code{\link{surface3js}}
#'
#' @examples
#' # Initialise plotting object
#' data3js <- plot3js.new()
#'
#' # Add points
#' data3js <- points3js(x = runif(10),
#'                      y = runif(10,
#'                      z = runif(1),
#'                      col = rainbow(10))
#'
#' # Plot the object
#' r3js(data3js)
#' @export
#'
plot3js.new <- function(background = "#ffffff"){

  data3js <- list()
  data3js$ticks <- list(NULL,NULL,NULL)

  # Set background color
  data3js <- background3js(data3js = data3js,
                           col     = background)

  data3js

}




#' Start a new r3js object group
#'
#' This function can be used to build plot objects together into a group before
#' combining them into a main plotting object with the \code{\link{combine3js}}
#' function. See details.
#'
#' @details r3js provides support for plot rollover highlighting of plotted objects
#' through the \code{highlight} argument. Sometimes, however you may wish for several
#' plotted objects to be associated with each other such that interaction with one
#' or any of them causes all other objects in the group to be highlighted. This is
#' where the \code{group3js} function comes in, allowing you to associate objects as
#' a group before adding them to a main plotting object created using \code{\link{plot3js.new}}.
#' By explicitely setting \code{interactive = FALSE} for certain objects of the group
#' you are also still able to control interactivity on a per-object basis, even though
#' highlighting behaviour will now be linked (see examples).
#'
#' @return Returns an empty r3js group object in the form of a list.
#' @export
#'
#' @examples
#' # Using groups
#' x <- runif(100, 0, 50)
#' y <- runif(100, 0, 25)
#' z <- runif(100, -1, 1)
#' cols <- rainbow(100)
#'
#' # Setup new plot
#' data3js <- plot3js.new()
#' data3js <- plot3js.window(data3js,
#'                           xlim = c(0, 50),
#'                           ylim = c(0, 25),
#'                           zlim = c(0,1),
#'                           aspect = c(2,1,0.4))
#'
#' # Add basegrid
#' for(n in 0:50){
#'   data3js <- lines3js(data3js,
#'                       x = rep(n, 2),
#'                       y = c(0,25),
#'                       z = c(0,0),
#'                       col = "grey80")
#' }
#' for(n in 0:25){
#'   data3js <- lines3js(data3js,
#'                       x = c(0,50),
#'                       y = rep(n, 2),
#'                       z = c(0,0),
#'                       col = "grey80")
#' }
#'
#' # Plot points and lines as groups
#' for(n in 1:length(x)){
#'
#'   # Begin new group
#'   group <- group3js()
#'
#'   # Add main point to group
#'   group <- points3js(group,
#'                      x = x[n],
#'                      y = y[n],
#'                      z = z[n],
#'                      col = cols[n],
#'                      highlight = list(size = 1.5,
#'                                       col  = "black"))
#'
#'   # Add line
#'   group <- lines3js(group,
#'                     x = rep(x[n],2),
#'                     y = rep(y[n],2),
#'                     z = c(0,z[n]),
#'                     col = cols[n],
#'                     highlight = list(col  = "black",
#'                                      lwd = 2),
#'                     interactive = FALSE)
#'
#'   # Add base point
#'   group <- points3js(group,
#'                      x = x[n],
#'                      y = y[n],
#'                      z = 0,
#'                      col = cols[n],
#'                      highlight = list(col  = "black",
#'                                       size = 2.5),
#'                      interactive = FALSE,
#'                      dimensions = 2)
#'
#'   # Add group to main plot
#'   data3js <- combine3js(data3js, group)
#'
#' }
#'
#' # Plot result
#' print(r3js(data3js))
#'
group3js <- function(){
  list(type = "group")
}

#' Combine group data with a data3js object
#'
#' @param data3js
#' @param group
#'
#' @return
#' @export
#'
#' @examples
combine3js <- function(data3js, group){
  data3js$plot[[length(data3js$plot)+1]] <- group
  data3js
}


#' Set axis limits for a 3js plot
#'
#' @param data3js
#' @param xlim
#' @param ylim
#' @param zlim
#'
#' @return
#' @export
#'
#' @examples
plot3js.window <- function(data3js,
                           xlim,
                           ylim,
                           zlim,
                           aspect = c(1,1,1)){

  data3js$lims <- list(xlim,
                       ylim,
                       zlim)
  data3js$aspect <- aspect
  data3js

}

#' Set the background color of an r3js plot
#'
#' @param data3js The plotting object
#' @param col The background color
#'
#' @return
#' @export
#'
#' @examples
background3js <- function(data3js,
                          col){

  data3js$scene$background <- convertCol3js(col)
  data3js

}

#' Add axes to an r3js plot
#'
#' @param data3js
#' @param side
#' @param at
#'
#' @return
#' @export
#'
#' @examples
# Make axis data
axis3js <- function(data3js,
                    side,
                    at     = NULL,
                    labels = NULL,
                    cornerside = "f",
                    ...){

  # Set locations of tick marks
  if(is.null(at)){
      at <- pretty_axis(data3js$lims[[match(side, c("x", "y", "z"))]])
  }

  # Use number labels if none supplie
  if(is.null(labels)){
      labels <- as.character(at)
  }

  for(a in c(1,2)){
    for(b in c(1,2)){
      for(n in seq_along(labels)){
        ap <- c("-", "+")[a]
        bp <- c("-", "+")[b]

        if(side == "x"){
          x <- at[n]
          y <- data3js$lims[[2]][a]+(a-1.5)*0.08
          z <- data3js$lims[[3]][b]+(b-1.5)*0.08
          cornercode <- paste0("x",ap,bp,cornerside)
        }
        if(side == "y"){
          x <- data3js$lims[[1]][a]+(a-1.5)*0.08
          y <- at[n]
          z <- data3js$lims[[3]][b]+(b-1.5)*0.08
          cornercode <- paste0(ap,"y",bp,cornerside)
        }
        if(side == "z"){
          x <- data3js$lims[[1]][b]+(b-1.5)*0.08
          y <- data3js$lims[[2]][a]+(a-1.5)*0.08
          z <- at[n]
          cornercode <- paste0(ap,bp,"z",cornerside)
        }

        data3js <- text3js(data3js,
                           x = x,
                           y = y,
                           z = z,
                           text = labels[n],
                           corners = cornercode,
                           col = "black",
                           type = "html",
                           ...)
      }
    }
  }

  # Return the update plotting object
  data3js

}



#' Add text to a margin
#'
#' @param data3js
#' @param text
#' @param side
#' @param at
#' @param labels
#' @param cornerside
#' @param ...
#'
#' @return
#' @export
#'
#' @examples
mtext3js <- function(data3js,
                     text,
                     side,
                     line   = 0,
                     at     = 0.5,
                     cornerside = "f",
                     ...){

  # Add text to each corner
  for(a in c(1,2)){
    for(b in c(1,2)){

      ap <- c("-", "+")[a]
      bp <- c("-", "+")[b]

      if(side == "x"){
        x <- at*data3js$aspect[1]
        y <- (a-1)*data3js$aspect[2]+(a-1.5)*0.1*line
        z <- (b-1)*data3js$aspect[3]+(b-1.5)*0.1*line
        cornercode <- paste0("x",ap,bp,cornerside)
      }
      if(side == "y"){
        x <- (a-1)*data3js$aspect[1]+(a-1.5)*0.1*line
        y <- at*data3js$aspect[2]
        z <- (b-1)*data3js$aspect[3]+(b-1.5)*0.1*line
        cornercode <- paste0(ap,"y",bp,cornerside)
      }
      if(side == "z"){
        x <- (b-1)*data3js$aspect[1]+(b-1.5)*0.1*line
        y <- (a-1)*data3js$aspect[2]+(a-1.5)*0.1*line
        z <- at*data3js$aspect[3]
        cornercode <- paste0(ap,bp,"z",cornerside)
      }

      data3js <- text3js(data3js,
                         x         = x,
                         y         = y,
                         z         = z,
                         text      = text,
                         corners   = cornercode,
                         col       = "black",
                         type      = "html",
                         normalise = FALSE,
                         ...)

    }
  }

  # Return the update plotting object
  data3js

}



#' Add a box to an r3js plot
#'
#' @param data3js
#' @param type
#'
#' @return
#' @export
#'
#' @examples
box3js <- function(data3js,
                   sides = c("x","y","z"),
                   dynamic = TRUE,
                   col = "grey50",
                   ...){

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
        data3js <- lines3js(data3js,
                            x = data3js$lims[[1]],
                            y = rep(data3js$lims[[2]][i], 2),
                            z = rep(data3js$lims[[3]][j], 2),
                            faces = faces,
                            col = col,
                            ...)
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
        data3js <- lines3js(data3js,
                            x = rep(data3js$lims[[1]][i], 2),
                            y = data3js$lims[[2]],
                            z = rep(data3js$lims[[3]][j], 2),
                            faces = faces,
                            col = col,
                            ...)
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
        data3js <- lines3js(data3js,
                            x = rep(data3js$lims[[1]][i], 2),
                            y = rep(data3js$lims[[2]][j], 2),
                            z = data3js$lims[[3]],
                            faces = faces,
                            col = col,
                            ...)
      }
    }
  }

  # Return new plot data
  data3js

}



#' Add axis grids to an r3js plot
#'
#' @param data3js
#' @param sides
#' @param axes
#' @param at
#' @param dynamic
#' @param ...
#'
#' @return
#' @export
#'
#' @examples
grid3js <- function(data3js,
                    sides = c("x","y","z"),
                    axes  = c("x","y","z"),
                    at = NULL, dynamic = TRUE,
                    col = "grey80",
                    ...){

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

  # Add axes
  for(ax in axes){
    ax_sides <- sides[!grepl(ax, sides)]
    for(side in ax_sides){
      data3js <- sidegrid3js(data3js,
                             ax      = ax,
                             side    = side,
                             at      = at,
                             dynamic = dynamic,
                             col     = col,
                             ...)
    }
  }

  # Return new plotting data
  data3js

}


#' Export an r3js plot
#'
#' Exports a r3js plot to an external html file.
#'
#' @param data3js The
#' @param ...
#'
#' @return
#' @export
#'
#' @examples
export3js <- function(data3js,
                      file,
                      title = "r3js plot",
                      ...) {

  # Create the widget
  widget <- r3js(data3js = data3js,
                 ...)

  # Export the widget
  export3jsWidget(widget = widget,
                  file   = file,
                  title  = title)

}


#' Export an r3js html widget
#'
#' Export an r3js html widget to an external html file.
#'
#' @param widget The
#' @param ...
#'
#' @return
#' @export
#'
#' @examples
export3jsWidget <- function(widget,
                            file,
                            title = "r3js plot") {

  # Check file has .html extension
  if(!grepl("\\.html$", file)){
    file <- paste0(file, ".html")
  }

  # Export the widget to a temporary file first
  tmp_file <- tempfile(fileext = ".html")
  htmlwidgets::saveWidget(widget = widget,
                          file   = tmp_file,
                          title  = title)

  # Move the file to the proper location
  file.copy(from = tmp_file,
            to   = file,
            overwrite = TRUE)

  # Remove the temporary file
  unlink(tmp_file)

}


#' Create a clipping plane object
#'
#' This function can be used to create a clipping plane that can then be applied
#' to individual objects in a plot
#'
#' @param normal The normal of the plane
#' @param coplanarPoint A point coplanar to the plane
#' @param coplanarPoints A matrix of 3 points coplanar to the plane
#'
#' @return Returns and r3js clipping plane object
#' @export
#'
#' @examples
clippingPlane3js <- function(normal         = NULL,
                             coplanarPoint  = NULL,
                             coplanarPoints = NULL){

  clippingPlane <- c()
  if(!is.null(normal))        { clippingPlane$normal         = normal         }
  if(!is.null(coplanarPoint)) { clippingPlane$coplanarPoint  = coplanarPoint  }
  if(!is.null(coplanarPoints)){ clippingPlane$coplanarPoints = coplanarPoints }
  clippingPlane

}
