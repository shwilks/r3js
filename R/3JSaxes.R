
#' Add an axis to an r3js plot
#'
#' This is used as part of the `plot3js()` function but can be called
#' separately to add an axis, generally in combination after other lower
#' level functions like `plot3js.new()` and `plot3js.window()`.
#'
#' @param data3js The data3js object
#' @param side The axis side, either "x", "y" or "z"
#' @param at Where to draw labels
#' @param labels Vector of labels to use
#' @param cornerside See `material3js()`
#' @param labeloffset Amount of offset of axis labels from the edge of the plot
#' @param ... Other arguments to pass to `material3js()`
#'
#' @export
#'
axis3js <- function(
  data3js,
  side,
  at     = NULL,
  labels = NULL,
  cornerside = "f",
  labeloffset = 0.1,
  ...){

  # Set locations of tick marks
  if(is.null(at)){
    at <- pretty_axis(data3js$lims[[match(side, c("x", "y", "z"))]])
  }

  # Use number labels if none supplied
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
          poffset <- c(0, (a-1.5)*labeloffset, (b-1.5)*labeloffset)
        }
        if(side == "y"){
          x <- data3js$lims[[1]][a]
          y <- at[n]
          z <- data3js$lims[[3]][b]
          cornercode <- paste0(ap,"y",bp,cornerside)
          poffset <- c((a-1.5)*labeloffset, 0, (b-1.5)*labeloffset)
        }
        if(side == "z"){
          x <- data3js$lims[[1]][b]
          y <- data3js$lims[[2]][a]
          z <- at[n]
          cornercode <- paste0(ap,bp,"z",cornerside)
          poffset <- c((b-1.5)*labeloffset, (a-1.5)*labeloffset, 0)
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


#' Function to generate pretty axis labels that don't go outside range of x
#'
#' @param x A numeric vector
#' @param n Desired number of break points
#' @param include_lims Should axis limits be included or excluded
#'
#' @noRd
#'
pretty_axis <- function(
  x,
  n = 5,
  include_lims = TRUE
  ){

  prettyx <- pretty(x, n = 5)

  if(include_lims){
    prettyx <- prettyx[prettyx <= max(x) & prettyx >= min(x)]
  } else {
    prettyx <- prettyx[prettyx < max(x) & prettyx > min(x)]
  }

  prettyx

}


