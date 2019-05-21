
# Generate point set
set.seed(100)
ptx <- rnorm(100)
pty <- rnorm(100)
ptz <- rnorm(100)

ptcol <- rainbow(100)
ptsizes <- runif(100, 0.1, 1)

ptcol <- rainbow(100)
ptsizes <- runif(100, 2, 5)

## Geometries ---------
# Spheres as geometries
plot3js(x = ptx,
        y = pty,
        z = ptz,
        size = ptsizes,
        col = ptcol,
        zlim = c(0,2))

# Circles as geometries
plot3js(x = ptx,
        y = pty,
        z = ptz,
        size = ptsizes,
        col = ptcol,
        mat = "basic")

# Open cubes as geometries
plot3js(x = ptx,
        y = pty,
        z = ptz,
        size = ptsizes,
        pch = 0,
        col = ptcol)

# Filled cubes as geometries
plot3js(x = ptx,
        y = pty,
        z = ptz,
        size = ptsizes,
        pch = 15,
        col = ptcol)



## Points ---------
# Spheres as points
plot3js(x = ptx,
        y = pty,
        z = ptz,
        size = ptsizes,
        col = ptcol,
        dimensions = 3,
        geometry = FALSE,
        zlim = c(0,2))


# Open circles as points
plot3js(x = ptx,
        y = pty,
        z = ptz,
        size = ptsizes,
        col = ptcol,
        pch = 1,
        geometry = FALSE)

# Filled circles as points
plot3js(x = ptx,
        y = pty,
        z = ptz,
        size = ptsizes,
        col = ptcol,
        pch = 16,
        geometry = FALSE)



# Open squares as points
plot3js(x = ptx,
        y = pty,
        z = ptz,
        size = ptsizes,
        pch = 0,
        col = ptcol,
        geometry = FALSE)

# Filled squares as points
plot3js(x = ptx,
        y = pty,
        z = ptz,
        size = ptsizes,
        pch = 15,
        col = ptcol,
        geometry = FALSE)


# Open triangles as points
plot3js(x = ptx,
        y = pty,
        z = ptz,
        size = ptsizes,
        pch = 2,
        col = ptcol,
        geometry = FALSE)

# Filled triangles as points
plot3js(x = ptx,
        y = pty,
        z = ptz,
        size = ptsizes,
        pch = 17,
        col = ptcol,
        geometry = FALSE)


