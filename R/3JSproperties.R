
#' Set material properties of 3js object
#'
#' @param mat Material to use for the object, one of "basic", "lambert", "phong"
#'   or "line", see e.g.
#'   [MeshBasicMaterial](https://threejs.org/docs/index.html#api/en/materials/MeshBasicMaterial)
#'
#' @param col Color
#' @param opacity Opacity
#' @param xpd Should parts of the object outside the plot limits be shown
#' @param lwd Line width
#' @param lend Line end type (not implemented)
#' @param ljoin Line join type (not implemented)
#' @param dashSize Dash size for dashed lines
#' @param gapSize Gap size for dashed lines
#' @param interactive Is the object interactive
#' @param moveable Is the object moveable (not implemented)
#' @param label The label for the object
#' @param toggle Toggle button associated with the object
#' @param dimensions Dimensions of the object - relevant for point geometries, e.g. 3d is sphere 2d is a circle
#' @param depthWrite See [depthWrite](https://threejs.org/docs/index.html#api/en/materials/Material.depthWrite)
#' @param depthTest See [depthTest](https://threejs.org/docs/index.html#api/en/materials/Material.depthTest)
#' @param polygonOffset See [polygonOffset](https://threejs.org/docs/index.html#api/en/materials/Material.polygonOffset)
#' @param polygonOffsetFactor See [polygonOffsetFactor](https://threejs.org/docs/index.html#api/en/materials/Material.polygonOffsetFactor)
#' @param polygonOffsetUnits See [polygonOffsetUnits](https://threejs.org/docs/index.html#api/en/materials/Material.polygonOffsetUnits)
#' @param shininess Shininess of object surface
#' @param faces For dynamically hidden objects, the face with which it is associated, see details.
#' @param corners For dynamically hidden objects, the corners with which it is associated, see details.
#' @param rotation In place rotation of the object geometry (most relevant for points)
#' @param normalise Should coordinates be normalised to be with respect to axis ranges or placed according to the plotting box which has unit coordinates.
#' @param poffset Positional offset, the offset is relative to the plotting area size rather than axis limits
#' @param clippingPlanes Clipping planes to apply to the object
#' @param doubleSide Should the object be rendered as double sided, see [Material Constants](https://threejs.org/docs/index.html#api/en/constants/Materials)
#' @param renderOrder See [renderOrder](https://threejs.org/docs/index.html#api/en/core/Object3D.renderOrder)
#' @param renderSidesSeparately Render the front and back side separately (not implemented)
#' @param removeSelfTransparency Remove self-transparency (not implemented)
#' @param breakupMesh Breakup the object mesh to achieve more realistic transparency rendering (not implemented)
#' @param ... Additional parameters that are not used
#'
#' @details
#'
#' @export
#'
material3js <- function(
  mat = "phong",
  col = "black",
  opacity = NULL,
  xpd = TRUE,
  lwd = 1,
  lend = 0,
  ljoin = 0,
  dashSize = NULL,
  gapSize = NULL,
  interactive = NULL,
  moveable = NULL,
  label = NULL,
  toggle = NULL,
  dimensions = NULL,
  depthWrite = NULL,
  depthTest = NULL,
  polygonOffset = NULL,
  polygonOffsetFactor = NULL,
  polygonOffsetUnits = NULL,
  shininess = 30,
  faces     = NULL,
  corners   = NULL,
  rotation  = NULL,
  normalise = NULL,
  poffset = NULL,
  clippingPlanes = NULL,
  frontSide = TRUE,
  backSide = TRUE,
  renderOrder = NULL,
  renderSidesSeparately = NULL,
  removeSelfTransparency = NULL,
  breakupMesh = NULL,
  ...
){

  # Get opacity from color if not otherwise specified
  if(is.null(opacity)){ opacity <- col_opacity(col) }

  props <- list(
    mat         = jsonlite::unbox(mat),
    color       = convertCol3js(col),
    opacity     = jsonlite::unbox(opacity),
    xpd         = jsonlite::unbox(xpd),
    lwd         = jsonlite::unbox(lwd),
    lend        = jsonlite::unbox(lend),
    ljoin       = jsonlite::unbox(ljoin),
    transparent = jsonlite::unbox(opacity < 1.0)
  )

  if(!is.null(dimensions))                            { props$dimensions             <- jsonlite::unbox(dimensions)             }
  if(!is.null(label))                                 { props$label                  <- label                                   }
  if(!is.null(interactive) && interactive)            { props$interactive            <- jsonlite::unbox(interactive)            }
  if(!is.null(moveable) && moveable)                  { props$draggable              <- jsonlite::unbox(moveable)               }
  if(!is.null(toggle))                                { props$toggle                 <- jsonlite::unbox(toggle)                 }
  if(!is.null(dashSize))                              { props$dashSize               <- jsonlite::unbox(dashSize)               }
  if(!is.null(gapSize))                               { props$gapSize                <- jsonlite::unbox(gapSize)                }
  if(!is.null(depthWrite))                            { props$depthWrite             <- jsonlite::unbox(depthWrite)             }
  if(!is.null(depthTest))                             { props$depthTest              <- jsonlite::unbox(depthTest)              }
  if(!is.null(polygonOffset))                         { props$polygonOffset          <- jsonlite::unbox(polygonOffset)          }
  if(!is.null(polygonOffsetFactor))                   { props$polygonOffsetFactor    <- jsonlite::unbox(polygonOffsetFactor)    }
  if(!is.null(polygonOffsetUnits))                    { props$polygonOffsetUnits     <- jsonlite::unbox(polygonOffsetUnits)     }
  if(!is.null(faces))                                 { props$faces                  <- faces                                   }
  if(!is.null(corners))                               { props$corners                <- corners                                 }
  if(!is.null(rotation))                              { props$rotation               <- (rotation/180)*pi                       }
  if(!is.null(normalise))                             { props$normalise              <- jsonlite::unbox(normalise)              }
  if(!is.null(poffset))                               { props$poffset                <- poffset                                 }
  if(!is.null(shininess))                             { props$shininess              <- jsonlite::unbox(shininess)              }
  if(!is.null(clippingPlanes))                        { props$clippingPlanes         <- clippingPlanes                          }
  if(!is.null(renderOrder))                           { props$renderOrder            <- renderOrder                             }
  if(!is.null(renderSidesSeparately) && opacity < 1)  { props$renderSidesSeparately  <- jsonlite::unbox(renderSidesSeparately)  }
  if(!is.null(removeSelfTransparency) && opacity < 1) { props$removeSelfTransparency <- jsonlite::unbox(removeSelfTransparency) }
  if(!is.null(breakupMesh) && opacity < 1)            { props$breakupMesh            <- jsonlite::unbox(breakupMesh)            }
  props$frontSide <- jsonlite::unbox(frontSide)
  props$backSide <- jsonlite::unbox(backSide)


  # Return properties
  props

}


#' Internal function to get opacity from a color specification
col_opacity <- function(col) {

  col[col == "inherit"] <- "black"
  grDevices::col2rgb(col, alpha = TRUE)[4]/255

}


#' Internal function to convert color to an rgb list
#'
#' @param col The color to convert in a format R understands
#'
#' @return Returns a list with red, green and blue values
#'
convertCol3js <- function(col){

  col[col == "inherit"] <- "black"
  rgbcol <- grDevices::col2rgb(col)/255

  rcol <- rgbcol["red",]
  gcol <- rgbcol["green",]
  bcol <- rgbcol["blue",]

  if (is.matrix(col)) {
    rcol <- matrix(rcol, nrow(col), ncol(col))
    gcol <- matrix(gcol, nrow(col), ncol(col))
    bcol <- matrix(bcol, nrow(col), ncol(col))
  }

  list(
    r = rcol,
    g = gcol,
    b = bcol
  )

}


#' Add interactive highlighting to an r3js plot object
#'
#' r3js allows for interactive highlighting of a plot object upon mouse-over, for
#' example changing the color or size of a point. This can be particularly helpful
#' when combined with a point label which will also show on mouse-over. The
#' highlight parameter takes a list of arguments to apply to the highlighted
#' version of the object, for example if you want a point to turn blue and increase
#' to size 4, you could supply `highlight = list(col="blue", size=4)`.
#'
#' @param data3js The data3js object
#' @param highlight Arguments to apply to the highlighted object
#'
highlight3js <- function(
  data3js,
  highlight
  ){

  # Get arguments from parent environment
  largs <- eval(quote(allargs()), parent.frame())

  # Remove the highlight argument and empty plot data
  largs <- largs[!names(largs) == "highlight"]
  largs["data3js"] <- list(plot = c())

  # Replace any default arguments with arguments provided to highlight
  for(x in seq_along(highlight)){
    largs[[names(highlight)[x]]] <- highlight[[x]]
  }

  # Return the plot object output
  hl_objects <- do.call(eval(as.list(sys.call(-1))[[1]]), largs)$plot

  # Add the highlight objects to the data object
  for(x in seq_along(hl_objects)){
    n <- length(data3js$plot) - length(hl_objects) + x
    data3js$plot[[n]]$highlight <- hl_objects[[x]]
  }

  # Return the new data object
  data3js

}


# stackoverflow.com/questions/11885207/get-all-parameters-as-list
allargs <- function(orig_values = FALSE, ...) {

  parent_formals <- formals(sys.function(sys.parent(n = 1)))
  fnames <- names(parent_formals)
  fnames <- fnames[-which(fnames == '...')]
  args <- evalq(as.list(environment()), envir = parent.frame())
  args <- c(args[fnames], evalq(list(...), envir = parent.frame()))

  if(orig_values) {
    # get default values
    defargs <- as.list(parent_formals)
    defargs <- defargs[unlist(lapply(defargs, FUN = function(x) class(x) != "name"))]
    args[names(defargs)] <- defargs
    setargs <- evalq(as.list(match.call())[-1], envir = parent.frame())
    args[names(setargs)] <- setargs
  }
  return(args)

}


#' Create a clipping plane object
#'
#' This function can be used to create a clipping plane that can then be applied
#' to individual objects in a plot
#'
#' @param coplanarPoints A matrix of 3 points coplanar to the plane, each row is a point, cols are coordinates
#'
#' @return Returns and r3js clipping plane object
#' @export
#'
clippingPlane3js <- function(
  coplanarPoints = NULL
){

  clippingPlane <- c()
  clippingPlane$coplanarPoints = coplanarPoints
  clippingPlane

}



