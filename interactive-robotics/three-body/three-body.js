class ThreeBodySystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.bodies = [
            { x: this.width * 0.4, y: this.height * 0.4, vx: 0, vy: 1, mass: 1000, color: 'red' },
            { x: this.width * 0.6, y: this.height * 0.6, vx: 0, vy: -1, mass: 1000, color: 'green' },
            { x: this.width * 0.5, y: this.height * 0.5, vx: 0, vy: 0, mass: 1000, color: 'blue' }
        ];
        this.isRunning = false;
        this.G = 0.1;
        this.trails = [[], [], []];
        this.trailLength = 200;
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

            // Add current position to trail
            this.trails[i].push({x: this.bodies[i].x, y: this.bodies[i].y});
            if (this.trails[i].length > this.trailLength) {
                this.trails[i].shift();
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw trails
        this.trails.forEach((trail, index) => {
            this.ctx.beginPath();
            trail.forEach((point, i) => {
                if (i === 0) {
                    this.ctx.moveTo(point.x, point.y);
                } else {
                    this.ctx.lineTo(point.x, point.y);
                }
            });
            this.ctx.strokeStyle = this.bodies[index].color;
            this.ctx.globalAlpha = 0.3;
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
        });

        // Draw bodies
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
            { x: this.width * 0.4, y: this.height * 0.4, vx: 0, vy: 1, mass: 1000, color: 'red' },
            { x: this.width * 0.6, y: this.height * 0.6, vx: 0, vy: -1, mass: 1000, color: 'green' },
            { x: this.width * 0.5, y: this.height * 0.5, vx: 0, vy: 0, mass: 1000, color: 'blue' }
        ];
        this.trails = [[], [], []];
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
