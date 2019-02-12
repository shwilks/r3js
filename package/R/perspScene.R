#
# rm(list = ls())
# set.seed(100)
#
# # map     <- Racmacs::read_acmap("~/Desktop/LabBook/barda_h5_maps/data/March2018/MergeAll_september2017_map_no_low_strains_vacc.save")
# # data3js <- Racmacs::plot_acmap3js(map)
# # # x <- runif(10)
# # # y <- runif(10)
# # # z <- runif(10)
# #
# # # data3js <- plot3js(x = x,
# # #                    y = y,
# # #                    z = z,
# # #                    xlim = c(0,1),
# # #                    ylim = c(0,1),
# # #                    zlim = c(0,1),
# # #                    col = rainbow(10),
# # #                    grid_lwd = 0.1,
# # #                    show_plot = FALSE)
# # #
# # # data3js$scene$rotation <- c(0,0,0)
# #
# # # data3js2 <- plot3js(x = x,
# # #                     y = y,
# # #                     z = z,
# # #                     xlim = c(0,1),
# # #                     ylim = c(0,1),
# # #                     zlim = c(0,1),
# # #                     col = rainbow(10),
# # #                     grid_lwd = 1,
# # #                     show_plot = FALSE)
# # #
# # # data3js2$scene$rotation <- c(1,0.1,3)
#
# load("~/Desktop/3js_lndscp.RData")
# data3js$scene$rotation    <- c(-1.173, -0.004, -1.956)
# # data3js$scene$translation <- c(-0.044, -0.017, 0.112)
# data3js$scene$zoom        <- 1.994
#
# data3js <- lines3js(data3js,
#                     x = c(data3js$lims[[1]][1], data3js$lims[[1]][1]),
#                     y = c(data3js$lims[[2]][1], data3js$lims[[2]][1]),
#                     z = data3js$lims[[3]],
#                     corners = list(edge = "z--",
#                                    pos = c("left", "front", "bottom")),
#                     xpd = TRUE)
# debug3js(data3js)
# stop()
# library(V8)
#
# ct <- new_context()
# ct$source("package/inst/htmlwidgets/lib/threejs/three.min.js")
# ct$eval("var mat = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler( 0, 0, 0, 'XYZ' )).toArray()")
# rot_mat <- matrix(ct$get("mat"), 4, 4)
#
#
# ct <- new_context()
# ct$source("package/inst/htmlwidgets/lib/threejs/three.min.js")
# ct$source("package/inst/htmlwidgets/lib/functions/plotting.js")
# ct$source("package/inst/htmlwidgets/lib/functions/points.js")
# ct$source("package/inst/htmlwidgets/lib/functions/lines.js")
# ct$source("package/inst/htmlwidgets/lib/functions/scene.js")
# ct$source("package/inst/htmlwidgets/lib/functions/dynamic.js")
# ct$assign(name  = "plotData",
#           value = data3js)
# ct$eval("var scene = generate_scene(plotData);")
# ct$eval("var triangles = scene_to_triangles(scene, { position : new THREE.Vector3(0,0,3) });")
#
# scene_data <- ct$get("triangles")
#
#
#
# library(misc3d)
#
# scene <- list()
# for(x in 1:length(scene_data$vertices)){
#
#   vertices <- scene_data$vertices[[x]]
#   faces    <- scene_data$faces[[x]]
#   colors   <- scene_data$colors[[x]]
#   mat      <- scene_data$mat[[x]]
#   tri <- makeTriangles(v1 = vertices[faces[,1]+1,],
#                        v2 = vertices[faces[,2]+1,],
#                        v3 = vertices[faces[,3]+1,],
#                        color = colors)
#   if(mat == "basic"){
#       tri$material <- "basic"
#   }
#   scene <- c(scene, list(tri))
#
# }
#
# # Custom lighting function
# custom_lighting <- function(normals,
#                             view,
#                             light,
#                             color,
#                             color2,
#                             alpha,
#                             mat){
#
#   if(mat == "basic"){
#     color.light <- rep_len(color, length(normals))
#   } else {
#
#     # Add some point light
#     color.light <- phongLighting(normals,
#                                  view,
#                                  c(-1,1,1,1),
#                                  color,
#                                  color2,
#                                  alpha,
#                                  mat)
#
#     # Add some ambient light
#     color_rgb <- col2rgb(color)/255
#     color.light <- adjustcolor(col    = color.light,
#                                offset = c(color_rgb[1]*0.1, color_rgb[2]*0.1, color_rgb[3]*0.1, 0))
#   }
#
#   # Return the lit color
#   color.light
#
# }
#
# drawScene(scene,
#           engine = "grid",
#           screen = list(),
#           scale = FALSE,
#           xlim = extendrange(c(-0.5, 0.5)*data3js$aspect[1], f = 0),
#           ylim = extendrange(c(-0.5, 0.5)*data3js$aspect[2], f = 0),
#           zlim = extendrange(c(-0.5, 0.5)*data3js$aspect[3], f = 0),
#           distance = 1/5,
#           perspective = TRUE,
#           lighting = custom_lighting)
# # objvert <- scene_data$vertices[[1]]
# # objface <- scene_data$faces[[1]]
# # obj    <- makeTriangles(v1 = cbind(objtri$x
#
#
# #
# # mesh_sphere <- function(radius,
# #                         widthSegments  = 32,
# #                         heightSegments = 32,
# #                         phiStart    = 0,
# #                         phiLength   = pi*2,
# #                         thetaStart  = 0,
# #                         thetaLength = pi){
# #
# #   indices  = c()
# #   vertices = c()
# #   grid     = c()
# #   index <- 1
# #   thetaEnd = thetaStart + thetaLength
# #
# #   # Vertices
# #   for (iy in seq_len(heightSegments+1)) {
# #
# #     verticesRow = c()
# #     v = iy / heightSegments
# #
# #     for ( ix in seq_len(widthSegments+1)) {
# #
# #       u = ix / widthSegments
# #
# #       # Vertex
# #       vertex = c(
# #         -radius*cos(phiStart + u * phiLength)*sin(thetaStart + v * thetaLength),
# #         radius * cos( thetaStart + v * thetaLength ),
# #         radius * sin( phiStart + u * phiLength ) * sin( thetaStart + v * thetaLength )
# #       )
# #
# #       vertices <- rbind(vertices,
# #                         vertex)
# #       verticesRow <- c(verticesRow, index)
# #       index <- index+1
# #
# #     }
# #
# #     grid <- rbind(grid, verticesRow)
# #
# #   }
# #
# #
# #   # Indices
# #   for (iy in seq_len(heightSegments)) {
# #     for ( ix in seq_len(widthSegments)) {
# #
# #       a = grid[ iy, ix + 1 ]
# #       b = grid[ iy, ix ]
# #       c = grid[ iy + 1, ix ]
# #       d = grid[ iy + 1, ix + 1 ]
# #
# #       if ( iy != 0 || thetaStart > 0 )                 { indices <- rbind(indices, c( a, b, d )) }
# #       if ( iy != heightSegments - 1 || thetaEnd < pi ) { indices <- rbind(indices, c( b, c, d )) }
# #
# #     }
# #   }
# #
# #   # Return vertices and indices
# #   list(
# #     vertices = vertices,
# #     indices  = indices
# #   )
# #
# # }
# #
# # make_sphere <- function(x,y,z,
# #                         col){
# #
# #   sphere <- mesh_sphere(0.2,12,12)
# #
# #   sphere$vertices[,1] <- sphere$vertices[,1] + x
# #   sphere$vertices[,2] <- sphere$vertices[,2] + y
# #   sphere$vertices[,3] <- sphere$vertices[,3] + z
# #
# #   sphere_obj <- list(
# #     v1 = sphere$vertices[sphere$indices[,1],],
# #     v2 = sphere$vertices[sphere$indices[,2],],
# #     v3 = sphere$vertices[sphere$indices[,3],],
# #     color = col,
# #     color2 = NA,
# #     fill = TRUE,
# #     material = "default",
# #     col.mesh = NA,
# #     alpha = 1,
# #     smooth = 0
# #   )
# #   attr(sphere_obj, "class") <- "Triangles3D"
# #   sphere_obj
# #
# # }
# #
# #
# # r3js2D <- function(data3js){
# #
# #   scene <- list()
# #   for(pt in data3js$plot){
# #     if(pt$type == "point"){
# #       scene <- c(scene, list(make_sphere(x = pt$position[1],
# #                                          y = pt$position[2],
# #                                          z = pt$position[3],
# #                                          col = rgb(pt$properties$color[1],
# #                                                    pt$properties$color[2],
# #                                                    pt$properties$color[3]))))
# #     }
# #   }
# #   scene
# #
# # }
# #
# # scene <- r3js2D(data3js)
# #
# #
# # misc3d::drawScene(scene,
# #                   light = c(-1,1,1),
# #                   engine = "standard")
# #
# # stop()
# #
# # library(misc3d)
# # scene <- pointsTetrahedra(1,1,1)
# # misc3d::drawScene(scene)
# #
# #
# #
# # jsondata <- jsonlite::read_json("~/Downloads/file.txt")
# #
# # scene <- lapply(jsondata, function(mesh){
# #
# #   # Get triangles
# #   v1 <- t(sapply(mesh$triangles, function(x){
# #     unlist(x[[1]])
# #   }))
# #
# #   v2 <- t(sapply(mesh$triangles, function(x){
# #     unlist(x[[2]])
# #   }))
# #
# #   v3 <- t(sapply(mesh$triangles, function(x){
# #     unlist(x[[3]])
# #   }))
# #
# #   colors <- sapply(mesh$color, function(col){
# #     rgb(col[[1]],
# #         col[[2]],
# #         col[[3]])
# #   })
# #
# #   misc3d::makeTriangles(v1 = v1,
# #     v2 = v2,
# #     v3 = v3,
# #     color = colors
# #   )
# #   # vector_matrix <- matrix(unlist(mesh$triangles$array), ncol = 3, byrow = TRUE)
# #   # color_matrix  <- matrix(unlist(mesh$color$array), ncol = 3, byrow = TRUE)
# #   # makeTriangles(v1 = vector_matrix,
# #   #               color = rgb(color_matrix[,1],color_matrix[,2],color_matrix[,3]),
# #   #               alpha = 0.1)
# #
# # })
# #
# # custom_lighting <- function(normals, view, light, color, color2, alpha, mat){
# #   rep_len(color, length(normals))
# # }
# #
# # png(filename = "~/Desktop/r3js2d.png",
# #     width = 7, height = 7,
# #     units = "in",
# #     res = 600)
# # misc3d::drawScene(scene       = scene,
# #                   screen      = list(x=0, y=0, z=0),
# #                   scale       = FALSE,
# #                   perspective = TRUE,
# #                   light       = c(-1,1,1),
# #                   engine      = "grid",
# #                   distance    = 0.2,
# #                   col.bg = "white",
# #                   lighting = custom_lighting)
# # dev.off()
#
#
# # map     <- Racmacs::read_acmap("~/Desktop/LabBook/barda_h5_maps/data/March2018/MergeAll_september2017_map_no_low_strains_vacc.save")
# # data3js <- Racmacs::plot_acmap3js(map)
# #
# # ct <- new_context()
# # ct$source("package/inst/htmlwidgets/lib/threejs/three.min.js")
# # ct$source("package/inst/htmlwidgets/lib/functions/plotting.js")
# # ct$assign(name  = "plotData",
# #           value = data3js)
# # ct$eval("populatePlot(viewport, plotData, true);")
#
# # function SphereBufferGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ) {
# #
# #   BufferGeometry.call( this );
# #
# #   this.type = 'SphereBufferGeometry';
# #
# #   this.parameters = {
# #     radius: radius,
# #     widthSegments: widthSegments,
# #     heightSegments: heightSegments,
# #     phiStart: phiStart,
# #     phiLength: phiLength,
# #     thetaStart: thetaStart,
# #     thetaLength: thetaLength
# #   };
# #
# #   radius = radius || 1;
# #
# #   widthSegments = Math.max( 3, Math.floor( widthSegments ) || 8 );
# #   heightSegments = Math.max( 2, Math.floor( heightSegments ) || 6 );
# #
# #   phiStart = phiStart !== undefined ? phiStart : 0;
# #   phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;
# #
# #   thetaStart = thetaStart !== undefined ? thetaStart : 0;
# #   thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;
# #
# #   var thetaEnd = thetaStart + thetaLength;
# #
# #   var ix, iy;
# #
# #   var index = 0;
# #   var grid = [];
# #
# #   var vertex = new Vector3();
# #   var normal = new Vector3();
# #
# #   // buffers
# #
# #   var indices = [];
# #   var vertices = [];
# #   var normals = [];
# #   var uvs = [];
# #
# #   // generate vertices, normals and uvs
# #
# #   for ( iy = 0; iy <= heightSegments; iy ++ ) {
# #
# #     var verticesRow = [];
# #
# #     var v = iy / heightSegments;
# #
# #     for ( ix = 0; ix <= widthSegments; ix ++ ) {
# #
# #       var u = ix / widthSegments;
# #
# #       // vertex
# #
# #       vertex.x = - radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
# #       vertex.y = radius * Math.cos( thetaStart + v * thetaLength );
# #       vertex.z = radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
# #
# #       vertices.push( vertex.x, vertex.y, vertex.z );
# #
# #       // normal
# #
# #       normal.set( vertex.x, vertex.y, vertex.z ).normalize();
# #       normals.push( normal.x, normal.y, normal.z );
# #
# #       // uv
# #
# #       uvs.push( u, 1 - v );
# #
# #       verticesRow.push( index ++ );
# #
# #     }
# #
# #     grid.push( verticesRow );
# #
# #   }
# #
# #   // indices
# #
# #   for ( iy = 0; iy < heightSegments; iy ++ ) {
# #
# #     for ( ix = 0; ix < widthSegments; ix ++ ) {
# #
# #       var a = grid[ iy ][ ix + 1 ];
# #       var b = grid[ iy ][ ix ];
# #       var c = grid[ iy + 1 ][ ix ];
# #       var d = grid[ iy + 1 ][ ix + 1 ];
# #
# #       if ( iy !== 0 || thetaStart > 0 ) indices.push( a, b, d );
# #       if ( iy !== heightSegments - 1 || thetaEnd < Math.PI ) indices.push( b, c, d );
# #
# #     }
# #
# #   }
# #
# #   // build geometry
# #
# #   this.setIndex( indices );
# #   this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
# #   this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
# #   this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );
# #
# # }
#
#
#
