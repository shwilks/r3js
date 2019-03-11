
#' Generate a new object ID
#'
#' Generate a new object ID for an r3js plot.
#'
#' @param data3js The r3js data object
#' @param num The number of new IDs to generate
#'
#' @return Returns the update r3js data object
#' @export
addObject3js <- function(data3js, object){

  # Generate an object ID
  if(is.null(data3js$lastID)){ data3js$lastID <- 0 }
  object$ID <- max(data3js$lastID) + 1

  # If object is interactive and highlighted add a reference to itself to
  # it's highlight group by default
  if(!is.null(object$properties$interactive)){
    object$group <- object$ID
  }

  # Add the object to the plot data
  data3js$plot[[length(data3js$plot)+1]] <- object

  # Update the ID of the last object added
  data3js$lastID <- object$ID

  # Return the new data
  data3js

}

#' Find the ID of the last object(s) added
#'
#' Find the ID of the last object(s) added to an r3js plot.
#'
#' @param data3js The r3js data object
#'
#' @return Returns a vector of IDs for the last objects added
#' @export
lastID <- function(data3js){

  data3js$lastID

}



#' Start a new r3js object group
#'
#' This function can be used to link plot objects together into a group in order to apply
#' highlighting and interactive effects. See details.
#'
#' @param data3js The r3js data object
#' @param objectIDs IDs for each object you want to apply the group to.
#' @param groupIDs IDs for each object you want to include in the group.
#'
#' @return Returns an empty r3js group object in the form of a list.
#' @export
#'
group3js <- function(data3js,
                     objectIDs,
                     groupIDs = objectIDs){

  data3js$plot <- lapply(data3js$plot, function(object){
    if(object$ID %in% objectIDs){
      object$group <- unique(c(object$group, groupIDs))
    }
    object
  })

  data3js

}





