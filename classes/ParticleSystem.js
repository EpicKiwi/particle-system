class ParticleSystem extends Actor {

    constructor(particleNumber,size){
        super()

        this.particles = []
        this.emitRemaining = particleNumber;
        this.emitSize = size;
    }

    emitParticle(){
        let particle = new Particle()
        particle.position.x = this.position.x
        particle.position.addScalarX((this.emitSize/2)-Math.random()*this.emitSize)
        particle.position.addScalarY(this.boundaries.se.y-10)
        particle.velocity.y = -10
        this.particles.push(particle)
    }

    executeOnParticles(executor){
        this.particles.forEach((particle) => executor(particle))
    }

    applyForce(force) {
        this.executeOnParticles((p) => p.applyForce(force))
    }

    update(mousePosition) {
        if(this.emitRemaining > 0) {
            this.emitParticle()
            this.emitRemaining--
        }
        this.executeOnParticles((p) => {
            p.applyBehaviour(this.particles,mousePosition)
            p.update()
        })
        if(this.boundaries) {
            this.executeOnParticles((p) => {
                if(p.position.x < this.boundaries.no.x){
                    p.applyForce(new Victor(1,0))
                } else if(p.position.x > this.boundaries.se.x){
                    p.applyForce(new Victor(-1,0))
                }
                if(p.position.y < this.boundaries.no.y){
                    this.particles.splice(this.particles.indexOf(p),1)
                    this.emitParticle()
                } else if(p.position.y > this.boundaries.se.y){
                    p.applyForce(new Victor(0,-1))
                }
            })
        }
    }

    setBoundaries(minX,maxX,minY,maxY){
        this.boundaries = {
            no: new Victor(minX,minY),
            se: new Victor(maxX,maxY)
        }
    }

    draw(context) {
        this.executeOnParticles((p) => p.draw(context))
    }
}