
#' Add a plot object to a data3js object
#'
#' This is used internally to add an object to a data3js object, it assigns the
#' object an id and adds a record to the data3js object.
#'
#' @param data3js The r3js data object
#' @param object The plot object data to add
#' @param number_of_ids The number of ids to assign to the object, e.g. 10 when adding 10 points.
#'
#' @return Returns the updated data3js object
#' @noRd
#'
addObject3js <- function(
  data3js,
  object,
  number_of_ids = 1
  ){

  # Generate an object ID
  if(is.null(data3js$lastID)){ data3js$lastID <- 0 }
  object$ID <- max(data3js$lastID) + seq_len(number_of_ids)

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


#' Get the ID of the last object(s) added
#'
#' Get the ID of the last object(s) added to an data3js object, this is useful when for
#' example wanting to link different objects together into groups, you can use this
#' function after adding each of them to keep a record of their unique plot id.
#'
#' @param data3js The data3js object
#'
#' @return Returns a vector of ID(s) for the last object added. After e.g. `sphere3js()`, this
#' will simply be a single id relating to the sphere added, after e.g. `points3js()` this will
#' be a vector of ids relating to each point in turn.
#'
#' @export
#'
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
group3js <- function(
  data3js,
  objectIDs,
  groupIDs = objectIDs
  ){

  data3js$plot <- lapply(data3js$plot, function(object){
    if(object$ID %in% objectIDs){
      object$group <- unique(c(object$group, groupIDs))
    }
    object
  })

  data3js

}





