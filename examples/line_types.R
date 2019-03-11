
# Generate point set
set.seed(100)

A <- 1
B <- 1
t <- 1:1000/50

ptx <- A*cos(t)
pty <- A*sin(t)
ptz <- B*t

ptcol <- rainbow(1000)


## Geometries ---------
plot3js(x = ptx,
        y = pty,
        z = ptz,
        col = ptcol,
        lwd = 12,
        geometry = TRUE,
        type = "l")


plot3js(x = ptx,
        y = pty,
        z = ptz,
        col = ptcol,
        lwd = 1,
        dashSize = 4,
        gapSize = 8,
        type = "l")


