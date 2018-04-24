class Particle extends Actor {

    constructor(){
        super();
        this.velocity = new Victor(0,0)
        this.acceleration = new Victor(0,0)

        this.maxSpeed = 10
        this.maxForce = 0.1
        this.adaptativeRadius = 300
    }

    get direction(){
        return this.velocity.clone().normalize()
    }

    applyForce(force){
        this.acceleration.add(force)
    }

    applyBehaviour(goal){
        let desire = goal.clone().subtract(this.position)

        if(desire.lengthSq() < Math.pow(this.adaptativeRadius,2)){
            let adaptativeSpeed = desire.length()*this.maxSpeed/this.adaptativeRadius;
            desire.normalize().multiplyScalar(adaptativeSpeed)
        } else {
            desire.normalize().multiplyScalar(this.maxSpeed)
        }

        desire.subtract(this.velocity)

        if(desire.lengthSq() > Math.pow(this.maxForce,2)){
            desire.normalize().multiplyScalar(this.maxForce)
        }
        this.applyForce(desire)
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