class ParticleSystem extends Actor {

    constructor(particleNumber,size){
        super()

        this.particles = []
        this.emitRemaining = particleNumber;
        this.emitSize = size;
    }

    emitParticle(){
        let particle = new Particle()
        particle.position = this.position.clone()
        particle.position.addScalarX((this.emitSize/2)-Math.random()*this.emitSize)
        particle.position.addScalarY((this.emitSize/2)-Math.random()*this.emitSize)
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
            p.applyBehaviour(mousePosition)
            p.update()
        })
    }

    draw(context) {
        this.executeOnParticles((p) => p.draw(context))
    }
}