
##' Post-vaccine landscapes
###' Ferret vaccination landscapes with whole / split
#'

# Setup workspace
rm(list = ls())
library(labbook)
library(tidyverse)
library(ablandscapes)
# library(lighthouselndscp)
library(Racmacs)
set.seed(100)

# Load databases
library(acutils)
agdb <- read.agdb("../../databases/h5/antigens.json")
srdb <- read.srdb("../../databases/h5/sera.json")
expdb <- read.expdb("../../databases/h5/experiments/h5_mutants/results.json")
exp <- acdb.search(expdb, name = "Madison 222-224 Split Vaccines")

# Read the map
map <- read.acmap("../../projects/h5_mutants/maps/sinamap/2021_Mar_Mad_Split_Vacc_Table_shifted_with_ids.ace")

# Get titers
vac_titers <- acutils::mergeExpTables(exp)
vac_sera <- srdb.getIDs(colnames(vac_titers), srdb)
vac_sera_long  <- collate(vac_sera %$% long)
vac_sera_group <- collate(vac_sera %$% groups$group)

srnum <- 30
titers <- vac_titers[agIDs(map), srnum]
srSize(map)[srnum] <- 8

# Set 222 ags to *
ags222224 <- grepl("Q222L", agNames(map))
titers[ags222224] <- "*"

# Train landscape
fit <- ablandscape.fit(
  titers = titers,
  coords = agCoords(map),
  bandwidth = 16,
  degree = 2,
  error.sd = 1.1,
  control = list(
    # model.fn = lighthouselndscp::lndscp_fun,
    min.titer.possible = -Inf
  )
)

# Set prediction grid
x <- seq(from = min(agCoords(map)[,1]) - 3, to = max(agCoords(map)[,1]) + 3, by = 2)
y <- seq(from = min(agCoords(map)[,2]) - 3, to = max(agCoords(map)[,2]) + 3, by = 2)
z <- seq(from = min(agCoords(map)[,3]) - 3, to = max(agCoords(map)[,3]) + 3, by = 2)

coords_grid <- unname(expand.grid(x, y, z))
heights <- predict(fit, coords = coords_grid, crop2chull = FALSE)

heights <- array(
  data = heights,
  dim = c(length(x), length(y), length(z))
)

blob <- rmarchingcubes::contour3d(
  griddata = heights,
  level = 2,
  x = x,
  y = y,
  z = z
)

source("../../projects/h5_mutants/functions/plot_acmap3js.R")
agSize(map) <- 2
data3js <- plot_acmap3js(map)

data3js <- r3js::shape3js(
  data3js,
  vertices = blob$vertices,
  faces = blob$triangles,
  normals = blob$normals,
  col = rep("blue", length(blob$vertices)*2),
  opacity = 0.8,
  breakupMesh = TRUE,
  frontSide = FALSE,
  backSide = TRUE
)

export.viewer.test(
  r3js(data3js),
  "selftransparency.html"
)


