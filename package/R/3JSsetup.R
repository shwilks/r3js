
#' Setup a new r3js plot
#'
#' @return
#' @export
#'
#' @examples
plot3js.new <- function(){
  data3js <- list()
  data3js$ticks <- list(NULL,NULL,NULL)
}

#' Start a new 3js object group
#'
#' @return
#' @export
#'
#' @examples
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
axis3js <- function(data3js,
                    side,
                    loc    = "front",
                    lims   = "--",
                    at     = NULL,
                    labels = NULL,
                    title  = NULL,
                    lwd    = 1,
                    tcl    = 0.2,
                    mgp    = c(3, 1, 0),
                    mat    = "basic",
                    cex.axis = 1,
                    ...){

  # Convert side to numeric value
  side <- match(side, c("x","y","z"))

  # Use pretty values if at is null
  if(is.null(at)){
    at <- pretty_axis(data3js$lims[[side]])
  }

  # Use number labels if none supplie
  if(is.null(labels)){
    labels <- as.character(at)
  }


  # Make axis data
  axis3js <- list()
  axis3js$at         <- at
  axis3js$labels     <- labels
  axis3js$title      <- jsonlite::unbox(title)
  axis3js$properties <- material3js(mat = mat, ...)
  axis3js$lwd        <- lwd
  axis3js$tcl        <- jsonlite::unbox(tcl)
  axis3js$loc        <- loc
  axis3js$cex        <- cex.axis
  axis3js$mgp        <- mgp

  # Break down axis sides
  axis3js$dim  <- side - 1
  axis3js$lims <- c(c(0,1)[match(substr(lims, 1, 1), c("-","+"))],
                    c(0,1)[match(substr(lims, 2, 2), c("-","+"))])

  # Add to plot data
  data3js$axes[[length(data3js$axes)+1]] <- axis3js

  # Save the location of the tick marks
  data3js$ticks[[side]] <- at

  # Return plot data
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
                    at, dynamic = TRUE, ...){

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
                             dynamic = dynamic, ...)
    }
  }

  # Return new plotting data
  data3js

}
