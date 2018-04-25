class Particle extends Actor {

    constructor(){
        super();
        this.velocity = new Victor(0,0)
        this.acceleration = new Victor(0,0)

        this.maxForce = 0.1

        this.fieldOfView = 120
        this.farPoint = 100
        this.minDistance = 50
    }

    get direction(){
        return this.velocity.clone().normalize()
    }

    applyForce(force){
        this.acceleration.add(force)
    }

    applyBehaviour(particles,desire){

        particles.forEach((particle) => {
            if(particle === this) return;

            let distance = particle.position.clone().subtract(this.position)
            let distanceLen = distance.length()

            let dot = this.direction.dot(distance)
            let angle = Math.acos(dot/(distanceLen*this.direction.length()))
            if(angle*(180/Math.PI) > this.fieldOfView){
                return;
            }

            //distance.add(particle.direction)

            if(distanceLen < this.minDistance){
                distance.normalize().multiplyScalar(this.maxForce)
            } else if(distanceLen < this.farPoint) {
                distance.normalize().multiplyScalar((distanceLen-this.minDistance)*0.1)
            } else {
                return;
            }

            distance.subtract(this.velocity)

            if(distance.length() > this.maxForce)
                distance.normalize().multiplyScalar(this.maxForce)

            this.applyForce(distance)
        })

        if(desire) {
            let distance = desire.clone()
                                    .subtract(this.position)
                                    .normalize()
                                    .multiplyScalar(this.maxForce)
            this.applyForce(distance)
        }
    }

    update(){

        this.velocity.add(this.acceleration)
        this.position.add(this.velocity)
        this.acceleration.x = 0;
        this.acceleration.y = 0;
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