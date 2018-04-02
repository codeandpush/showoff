(function () {

    let canvas = document.getElementById('myCanvas')
    let ctx = canvas.getContext('2d')

    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.strokeStyle = 'rgba(0,153,255,1)'

    let Qx = Math.PI / 4
    let Qy = Math.PI / 3
    let Qz = Math.PI / 4
    let dx = 0
    let dy = 0
    let dz = 0

    let SIZE = 75
    let vertices = []

    function addPoint(x, y, z) {
        return [x, y, z]
    }

    vertices.push(addPoint(SIZE, SIZE, SIZE))
    vertices.push(addPoint(-SIZE, SIZE, SIZE))
    vertices.push(addPoint(-SIZE, -SIZE, SIZE))
    vertices.push(addPoint(SIZE, -SIZE, SIZE))

    vertices.push(addPoint(SIZE, SIZE, SIZE))
    vertices.push(addPoint(SIZE, SIZE, -SIZE))
    vertices.push(addPoint(-SIZE, SIZE, -SIZE))
    vertices.push(addPoint(-SIZE, -SIZE, -SIZE))

    vertices.push(addPoint(SIZE, -SIZE, -SIZE))
    vertices.push(addPoint(SIZE, SIZE, -SIZE))
    vertices.push(addPoint(SIZE, -SIZE, -SIZE))
    vertices.push(addPoint(SIZE, -SIZE, SIZE))

    vertices.push(addPoint(-SIZE, -SIZE, SIZE))
    vertices.push(addPoint(-SIZE, -SIZE, -SIZE))
    vertices.push(addPoint(-SIZE, SIZE, -SIZE))
    vertices.push(addPoint(-SIZE, SIZE, SIZE))

    drawCube()


    window.addEventListener('keydown', checkIfKeyPressed, false)


    function checkIfKeyPressed(e) {
        let step = Math.PI / 4320

        if (e.keyCode === 39) { // right
            dy = dy + step
        } else if (e.keyCode === 37) { // left
            dy = dy - step
        } else if (e.keyCode === 40) { // up
            dx = dx + step
        } else if (e.keyCode === 38) { // down
            dx = dx - step
        } else if (e.keyCode === 65) { // a
            dz = dz + step
        } else if (e.keyCode === 90) { // z
            dy = dz - step
        }

        e.stopPropagation()

        animate()
    }


    var stop = false;
    var frameCount = 0;
    var fps, fpsInterval, startTime, now, then, elapsed;


// initialize the timer variables and start the animation

    function startAnimating(fps) {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
    }
    startAnimating(60)

    function animate() {

        // request another frame

        requestAnimationFrame(animate);

        // calc elapsed time since last loop

        now = Date.now();
        elapsed = now - then;

        // if enough time has elapsed, draw the next frame

        if (elapsed > fpsInterval) {

            // Get ready for next frame by setting then=now, but also adjust for your
            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            then = now - (elapsed % fpsInterval);

            // Put your drawing code here
            updateCube()

        }
    }

    function updateCube() {
        let rate = 0.999

        dx = t = rate * dx
        Qx = Qx + dx
        dy = rate * dy
        Qy = Qy + dy
        dz = rate * dz
        Qz = Qz + dz
        drawCube()
    }


    function project3D(x, y, z) {
        let xRotQz = x * Math.cos(Qz) + y * Math.sin(Qz)
        let yRotQz = y * Math.cos(Qz) - x * Math.sin(Qz)
        let zRotQz = z
        let xRotQzQx = xRotQz
        let yRotQzQx = yRotQz * Math.cos(Qx) + zRotQz * Math.sin(Qx)
        let zRotQzQx = zRotQz * Math.cos(Qx) - yRotQz * Math.sin(Qx)
        let xRotQzQxQy = xRotQzQx * Math.cos(Qy) + zRotQzQx * Math.sin(Qy)
        let yRotQzQxQy = yRotQzQx
        return [xRotQzQxQy, yRotQzQxQy]
    }

    function drawCube() {
        console.log('drawCube')

        ctx.clearRect(0, 0, 650, 400)
        ctx.fillStyle = 'rgba(0,0,0,1)'
        ctx.fillRect(0, 0, 650, 400)

        let verticesPixLoc = []
        for (let i = 0; i < vertices.length; i++) {
            let xyLoc = project3D(vertices[i][0], vertices[i][1], vertices[i][2])
            let pixLoc = transformXYtoPixels(xyLoc[0], xyLoc[1])
            verticesPixLoc.push(pixLoc)

            ctx.beginPath()
            ctx.arc(pixLoc[0], pixLoc[1], 4, 0, 2 * Math.PI)
            ctx.stroke()
            ctx.fillStyle = 'blue'
            ctx.fill()
        }

        for (let i = 0; i < vertices.length - 1; i++) {
            ctx.beginPath()
            ctx.moveTo(verticesPixLoc[i][0], verticesPixLoc[i][1])
            ctx.lineTo(verticesPixLoc[i + 1][0], verticesPixLoc[i + 1][1])
            ctx.stroke()
        }
    }

    function transformXYtoPixels(x, y) {
        return [x + 650 / 2, -y + 400 / 2]

    }
})()