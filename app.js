const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")

const canvasWidth = document.body.clientWidth
const canvasHeight = document.body.clientHeight

let mousePress = false
let mousePosition = new Victor(0,0)
document.addEventListener("mousedown",() => mousePress = true)
document.addEventListener("mouseup",() => mousePress = false)
document.addEventListener("mousemove", (e) => {
    mousePosition.x = e.clientX;
    mousePosition.y = e.clientY;
})

const system = new ParticleSystem(300,600)

function setup(){
    canvas.style.width = canvasWidth+"px"
    canvas.width = canvasWidth
    canvas.style.height = canvasHeight+"px"
    canvas.height = canvasHeight

    system.position.x = canvasWidth/2
    system.position.y = canvasHeight/2
}

function update(){
    system.update(mousePosition)
}

function draw(){
    system.draw(context)
}

function tick(){
    update()
    context.clearRect(0, 0, canvas.width, canvas.height)
    draw()
    requestAnimationFrame(() => tick())
}

setup()
tick()