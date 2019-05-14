
## Racmacs shiny web application
# Load the required packages
miniViewer <- function(data3js,
                       jsinit = NULL,
                       serverfn = NULL,
                       height = NULL,
                       width = NULL,
                       ...){

  # Check RStudio is running
  if(!rstudioapi::isAvailable()){
    stop("This code must be run from within RStudio.")
  }

  # Prepare UI elements
  ui_elements <- list()
  ui_elements[[1]] <- r3js("r3jsViewer", height = "100%")

  # If javascript provided, include it with extendShinyjs
  if(!is.null(jsinit)){
    ui_elements[[2]] <- shinyjs::useShinyjs()
    ui_elements[[3]] <- shinyjs::extendShinyjs(text = jsinit)
  }

  # Generate UI
  ui <- do.call(shiny::fillPage, ui_elements)

  # Make server
  server <- function(input, output, session, ...) {

    # Render the map in the viewer
    output$r3jsViewer <- renderR3js({
      r3js(data3js)
    })

    # Run any additional server functions provided
    if(!is.null(serverfn)){
      serverfn(input, output, ...)
    }

  }

  # Decide where to open the viewer
  if(is.null(height) && is.null(width)){
    viewer <- shiny::paneViewer()
  } else if(!is.null(height) && !is.null(width)) {
    viewer <- shiny::dialogViewer("Mini viewer", width, height)
  } else {
    stop("Either neither or both of 'height' and 'width' must be provided.")
  }

  # Open the viewer
  suppressMessages({
    shiny::runGadget(
      app = ui,
      server = server,
      viewer = viewer
    )
  })

}


#' Take a map snapshot
#'
#' Takes a snapshot of a map and saves it as a png
#'
#' @param map The map data object
#' @param filename The filename of the snapshot
#' @param height Optional height of the screenshot (in pixels), see details.
#' @param width Optional width of the screenshot (in pixels), see details.
#' @param ... Further parameters to pass to \code{RacViewer()}
#'
#' @export
#'
snapshot3js <- function(data3js,
                        filename,
                        height = NULL,
                        width = NULL,
                        ...){

  # Javascript to run when the map viewer opens
  jsinit <- '
    shinyjs.init = function() {

      // Mask viewer with div
      $("body").append("<div style=\'position:fixed; top:0; left:0; right:0; bottom:0; z-index:1000; background-color:#ffffff;\'></div>");

      // Add event listener for the viewer being loaded
      window.addEventListener("r3jsViewerLoaded", function(e){

        // Send snapshot data to the R session
        window.setTimeout(function(){
          Shiny.setInputValue("snapshot", {
            data : viewport.getImgData()
          });
        }, 10);

      });
    }
  '

  # Define the additional server function for snapshotting
  serverfn <- function(input, output, snapshot){

    observeEvent(input$snapshot, {

      # Get the data from the shiny session
      img <- input$snapshot$data

      # Open a file and write the binary png data to it
      filecon <- file(filename, "wb")
      base64enc::base64decode(substr(img, 23, nchar(img)), output = filecon)
      close(filecon)

      # Stop the app
      stopApp()

    })

  }

  # Run the miniviewer to take a snapshot
  miniViewer(data3js  = data3js,
             jsinit   = jsinit,
             serverfn = serverfn,
             height   = height,
             width    = width,
             ...)



}

data3js <- plot3js(1:10,
                   1:10,
                   1:10)

snapshot3js(data3js, "~/Desktop/testsnapshot.png")



