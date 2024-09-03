class ThreeBodySystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.bodies = [
            { x: 200, y: 200, vx: 0, vy: 1, mass: 1000, color: 'red' },
            { x: 300, y: 300, vx: 0, vy: -1, mass: 1000, color: 'green' },
            { x: 100, y: 100, vx: 0, vy: 0, mass: 1000, color: 'blue' }
        ];
        this.isRunning = false;
        this.G = 0.1; // Gravitational constant (adjusted for simulation)
    }

    update() {
        if (!this.isRunning) return;

        for (let i = 0; i < this.bodies.length; i++) {
            let ax = 0, ay = 0;
            for (let j = 0; j < this.bodies.length; j++) {
                if (i !== j) {
                    let dx = this.bodies[j].x - this.bodies[i].x;
                    let dy = this.bodies[j].y - this.bodies[i].y;
                    let distSq = dx * dx + dy * dy;
                    let f = this.G * this.bodies[i].mass * this.bodies[j].mass / distSq;
                    let dist = Math.sqrt(distSq);
                    ax += f * dx / dist / this.bodies[i].mass;
                    ay += f * dy / dist / this.bodies[i].mass;
                }
            }
            this.bodies[i].vx += ax;
            this.bodies[i].vy += ay;
            this.bodies[i].x += this.bodies[i].vx;
            this.bodies[i].y += this.bodies[i].vy;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let body of this.bodies) {
            this.ctx.beginPath();
            this.ctx.arc(body.x, body.y, Math.sqrt(body.mass) / 2, 0, 2 * Math.PI);
            this.ctx.fillStyle = body.color;
            this.ctx.fill();
        }
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    start() {
        this.isRunning = true;
    }

    pause() {
        this.isRunning = false;
    }

    reset() {
        this.bodies = [
            { x: 200, y: 200, vx: 0, vy: 1, mass: 1000, color: 'red' },
            { x: 300, y: 300, vx: 0, vy: -1, mass: 1000, color: 'green' },
            { x: 100, y: 100, vx: 0, vy: 0, mass: 1000, color: 'blue' }
        ];
        this.isRunning = false;
        this.draw();
    }

    updateMass(index, mass) {
        this.bodies[index].mass = mass;
    }
}

function setupThreeBodySystem(canvasId, startId, pauseId, resetId, massSliders) {
    const canvas = document.getElementById(canvasId);
    const system = new ThreeBodySystem(canvas);
    system.reset();
    system.animate();

    document.getElementById(startId).addEventListener('click', () => system.start());
    document.getElementById(pauseId).addEventListener('click', () => system.pause());
    document.getElementById(resetId).addEventListener('click', () => system.reset());

    massSliders.forEach((sliderId, index) => {
        const slider = document.getElementById(sliderId);
        slider.addEventListener('input', (e) => {
            system.updateMass(index, parseFloat(e.target.value));
        });
    });
}
