
#' Printing r3js data information
#'
#' Prints information about an r3js data object.
#'
#' @param data3js The r3js data object
#'
#' @export
print.data3js <- function(data3js){

  cat("\n=====================")
  cat("\nr3js plot data object")
  cat("\n=====================\n")

  cat("\n")
  cat("Limits\n")
  cat("---------\n")
  cat(
    paste(
      c("x:", "y:", "z:"),
      c(paste0("[", data3js$lims[[1]][1], ",", data3js$lims[[1]][2], "]", "\n"),
        paste0("[", data3js$lims[[1]][1], ",", data3js$lims[[1]][2], "]", "\n"),
        paste0("[", data3js$lims[[1]][1], ",", data3js$lims[[1]][2], "]", "\n"))
    ),
    sep = ""
  )
  cat("\n")

  cat("Aspect\n")
  cat("---------\n")
  cat(
    paste(c("x:", "y:", "z:"),
          data3js$aspect
    ),
    sep = "\n"
  )
  cat("\n")

  cat("Content\n")
  cat("----------\n")
  print(summary(as.factor(sapply(data3js$plot, function(x){ x$type }))))
  cat("\n")

}


