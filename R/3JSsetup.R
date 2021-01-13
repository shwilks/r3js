
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

  data3js <-  structure(list(), class = c("data3js", "list"))
  data3js$ticks <- list(NULL,NULL,NULL)

  # Set background color
  data3js <- background3js(
    data3js = data3js,
    col     = background
  )

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
                    mgp = c(3, 1, 0)*0.1,
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
          y <- data3js$lims[[2]][a]
          z <- data3js$lims[[3]][b]
          cornercode <- paste0("x",ap,bp,cornerside)
          poffset <- c(0, (a-1.5)*mgp[2], (b-1.5)*mgp[2])
        }
        if(side == "y"){
          x <- data3js$lims[[1]][a]
          y <- at[n]
          z <- data3js$lims[[3]][b]
          cornercode <- paste0(ap,"y",bp,cornerside)
          poffset <- c((a-1.5)*mgp[2], 0, (b-1.5)*mgp[2])
        }
        if(side == "z"){
          x <- data3js$lims[[1]][b]
          y <- data3js$lims[[2]][a]
          z <- at[n]
          cornercode <- paste0(ap,bp,"z",cornerside)
          poffset <- c((b-1.5)*mgp[2], (a-1.5)*mgp[2], 0)
        }

        data3js <- text3js(
          data3js,
          x = x,
          y = y,
          z = z,
          text = labels[n],
          corners = cornercode,
          poffset = poffset,
          col = "black",
          type = "html",
          ...
        )
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
                   col = "grey80",
                   geometry = FALSE,
                   renderOrder = 1,
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
                            geometry = geometry,
                            renderOrder = renderOrder,
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
                            geometry = geometry,
                            renderOrder = renderOrder,
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
                            geometry = geometry,
                            renderOrder = renderOrder,
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
                    col = "grey95",
                    geometry = FALSE,
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
                             ax       = ax,
                             side     = side,
                             at       = at[[ax]],
                             dynamic  = dynamic,
                             col      = col,
                             geometry = geometry,
                             ...)
    }
  }

  # Return new plotting data
  data3js

}


#' Save an r3js plot to an HTML file
#'
#' Converts r3js plot data to a widget and saves it to an HTML file (e.g. for sharing with others)
#'
#' @param data3js The r3js data object to be saved
#' @param file File to save HTML into
#' @param title Text to use as the title of the generated page
#' @param selfcontained Whether to save the HTML as a single self-contained file (with external resources base64 encoded) or a file with external resources placed in an adjacent directory.
#' @param libdir Directory to copy HTML dependencies into (defaults to filename_files)
#' @param ... Further arguments to pass to \code{\link{r3js}}
#'
#' @export
#'
save3js <- function(data3js,
                    file,
                    title = "r3js plot",
                    selfcontained = TRUE,
                    libdir = NULL,
                    ...) {

  # Create the widget
  widget <- r3js(data3js = data3js,
                 ...)

  # Export the widget
  save3jsWidget(widget = widget,
                file   = file,
                title  = title,
                selfcontained = selfcontained,
                libdir = libdir)

}


#' Save an r3js widget to an HTML file
#'
#' Save a rendered r3js widget to an HTML file (e.g. for sharing with others). This is mostly a wrapper for \code{\link[htmlwidgets]{saveWidget}}.
#'
#' @param widget Widget to save
#' @param file File to save HTML into
#' @param title Text to use as the title of the generated page
#' @param selfcontained Whether to save the HTML as a single self-contained file (with external resources base64 encoded) or a file with external resources placed in an adjacent directory
#' @param libdir Directory to copy HTML dependencies into (defaults to filename_files)
#' @param ... Further arguments to pass to \code{\link[htmlwidgets]{saveWidget}}
#'
#' @return
#' @export
#'
#' @examples
save3jsWidget <- function(widget,
                          file,
                          title = "r3js plot",
                          selfcontained = TRUE,
                          libdir = NULL,
                          ...) {

  # We need to convert to the full filepath name (a bug in htmlwidgets?)
  file <- file.path(normalizePath(dirname(file)), basename(file))

  # If self-contained write first to a temporary file
  # else save as normal widget
  if(selfcontained){

    # Export the widget to a temporary file first
    tmp_file <- tempfile(fileext = ".html")
    htmlwidgets::saveWidget(widget = widget,
                            file   = tmp_file,
                            title  = title,
                            ...)

    # Move the file to the proper location
    file.copy(from = tmp_file,
              to   = file,
              overwrite = TRUE)

    # Remove the temporary file
    unlink(tmp_file)

  } else {

    htmlwidgets::saveWidget(widget        = widget,
                            file          = file,
                            title         = title,
                            selfcontained = selfcontained,
                            libdir        = libdir,
                            ...)

  }


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
clippingPlane3js <- function(coplanarPoints = NULL){

  clippingPlane <- c()
  clippingPlane$coplanarPoints = coplanarPoints
  clippingPlane

}
