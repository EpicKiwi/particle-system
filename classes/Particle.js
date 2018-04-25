class Particle extends Actor {

    constructor(){
        super();
        this.velocity = new Victor(0,0)
        this.acceleration = new Victor(0,0)

        this.maxForce = 0.01
        this.maxSpeed = 10
        this.slowdownCircle = 100
        this.separateCircle = 25
        this.coordinationCircle = 100
    }

    get direction(){
        return this.velocity.clone().normalize()
    }

    applyForce(force){
        this.acceleration.add(force)
    }

    applyBehaviour(particles,desire){

        this.coordinate(particles)
        this.separate(particles)

        if(desire) {
            this.seek(desire)
        }

    }

    seek(target){
        let space = target.clone()
        space.subtract(this.position)
        let distance = space.length()

        space.normalize()

        if(distance < this.slowdownCircle){
            space.multiplyScalar(distance*0.05)
        } else {
            space.multiplyScalar(this.maxSpeed)
        }

        space.subtract(this.velocity)
        if(space.length() > this.maxForce){
            space.normalize().multiplyScalar(this.maxForce)
        }
        this.applyForce(space)
    }

    coordinate(others){
        let count = 0
        let sum = others.reduce((ac,el) => {
                let space = el.position.clone().subtract(this.position)
                if(el != this && space.length() < this.coordinationCircle){
                    ac.add(space.normalize())
                    count++
                }
                return ac
            },new Victor(0,0))

        if(count < 1) return

        sum.divideScalar(count)
        sum.normalize().multiplyScalar(this.maxSpeed/2)
        sum.subtract(this.velocity)
        if(sum.length() > this.maxForce){
            sum.multiplyScalar(this.maxForce)
        }
        this.applyForce(sum)
    }

    separate(others){
        let count = 0
        let sum = others.reduce((ac,el) => {
            let space = this.position.clone().subtract(el.position)
            if(el != this && space.length() < this.separateCircle){
                ac.add(space.normalize())
                count++
            }
            return ac
        },new Victor(0,0))

        if(count < 1) return

        sum.divideScalar(count)
        sum.normalize().multiplyScalar(this.maxSpeed)
        sum.subtract(this.velocity)
        if(sum.length() > this.maxForce){
            sum.multiplyScalar(this.maxForce)
        }
        this.applyForce(sum)
    }

    update(){

        this.velocity.add(this.acceleration)
        this.position.add(this.velocity)
        this.acceleration.x = 0
        this.acceleration.y = 0
    }

    draw(context){
        context.save()

        context.translate(this.position.x,this.position.y)
        context.rotate(this.direction.horizontalAngle()-(Math.PI/2))

        context.fillStyle = `rgba(255, 255, 255, 1)`
        context.beginPath()
        context.moveTo(0,10)
        context.lineTo(5,-5)
        context.lineTo(-5,-5)
        context.fill()

        context.restore()
    }

}