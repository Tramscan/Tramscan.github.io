class Pendulum {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.angle = Math.PI / 4;
        this.angleVelocity = 0;
        this.angleAcceleration = 0;
        this.length = 180; // Slightly shorter to fit better in rounded corners
        this.origin = { x: canvas.width / 2, y: 70 }; // Move origin down a bit
        this.bob = { x: 0, y: 0 };
        this.isRunning = false;
    }

    update() {
        if (!this.isRunning) return;
        const gravity = 0.5;
        this.angleAcceleration = (-gravity / this.length) * Math.sin(this.angle);
        this.angleVelocity += this.angleAcceleration;
        this.angle += this.angleVelocity;

        this.bob.x = this.origin.x + this.length * Math.sin(this.angle);
        this.bob.y = this.origin.y + this.length * Math.cos(this.angle);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw pendulum arm (white)
        this.ctx.beginPath();
        this.ctx.moveTo(this.origin.x, this.origin.y);
        this.ctx.lineTo(this.bob.x, this.bob.y);
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw base (white circle)
        this.ctx.beginPath();
        this.ctx.arc(this.origin.x, this.origin.y, 5, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
        
        // Draw bob (maroon circle)
        this.ctx.beginPath();
        this.ctx.arc(this.bob.x, this.bob.y, 15, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'maroon';
        this.ctx.fill();
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
        this.angle = Math.PI / 4;
        this.angleVelocity = 0;
        this.angleAcceleration = 0;
        this.bob.x = this.origin.x + this.length * Math.sin(this.angle);
        this.bob.y = this.origin.y + this.length * Math.cos(this.angle);
        this.isRunning = false;
        this.draw();
    }
}

function setupPendulum(canvasId, startId, pauseId, resetId) {
    const canvas = document.getElementById(canvasId);
    const pendulum = new Pendulum(canvas);
    pendulum.reset();
    pendulum.animate();

    document.getElementById(startId).addEventListener('click', () => pendulum.start());
    document.getElementById(pauseId).addEventListener('click', () => pendulum.pause());
    document.getElementById(resetId).addEventListener('click', () => pendulum.reset());
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('pendulum-canvas');
    const pendulum = new Pendulum(canvas);
    pendulum.animate();
});
