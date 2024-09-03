class Pendulum {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.angle = Math.PI / 4;
        this.angleVelocity = 0;
        this.angleAcceleration = 0;
        this.length = 200;
        this.origin = { x: canvas.width / 2, y: 50 };
        this.bob = { x: 0, y: 0 };
    }

    update() {
        const gravity = 0.5;
        this.angleAcceleration = (-gravity / this.length) * Math.sin(this.angle);
        this.angleVelocity += this.angleAcceleration;
        this.angle += this.angleVelocity;

        this.bob.x = this.origin.x + this.length * Math.sin(this.angle);
        this.bob.y = this.origin.y + this.length * Math.cos(this.angle);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.ctx.moveTo(this.origin.x, this.origin.y);
        this.ctx.lineTo(this.bob.x, this.bob.y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(this.bob.x, this.bob.y, 20, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('pendulum-canvas');
    const pendulum = new Pendulum(canvas);
    pendulum.animate();
});
