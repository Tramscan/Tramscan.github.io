class DoublePendulum {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 4;
        
        this.l1 = 120;
        this.l2 = 120;
        this.m1 = 10;
        this.m2 = 10;
        this.a1 = Math.PI / 2;
        this.a2 = Math.PI / 2;
        this.a1_v = 0;
        this.a2_v = 0;
        
        this.g = 1;
        this.isRunning = false;
        this.trace = [];
        this.traceLength = 200;
    }

    update() {
        if (!this.isRunning) return;

        let num1 = -this.g * (2 * this.m1 + this.m2) * Math.sin(this.a1);
        let num2 = -this.m2 * this.g * Math.sin(this.a1 - 2 * this.a2);
        let num3 = -2 * Math.sin(this.a1 - this.a2) * this.m2;
        let num4 = this.a2_v * this.a2_v * this.l2 + this.a1_v * this.a1_v * this.l1 * Math.cos(this.a1 - this.a2);
        let den = this.l1 * (2 * this.m1 + this.m2 - this.m2 * Math.cos(2 * this.a1 - 2 * this.a2));
        let a1_a = (num1 + num2 + num3 * num4) / den;

        num1 = 2 * Math.sin(this.a1 - this.a2);
        num2 = this.a1_v * this.a1_v * this.l1 * (this.m1 + this.m2);
        num3 = this.g * (this.m1 + this.m2) * Math.cos(this.a1);
        num4 = this.a2_v * this.a2_v * this.l2 * this.m2 * Math.cos(this.a1 - this.a2);
        den = this.l2 * (2 * this.m1 + this.m2 - this.m2 * Math.cos(2 * this.a1 - 2 * this.a2));
        let a2_a = (num1 * (num2 + num3 + num4)) / den;

        this.a1_v += a1_a;
        this.a2_v += a2_a;
        this.a1 += this.a1_v;
        this.a2 += this.a2_v;

        let x2 = this.centerX + this.l1 * Math.sin(this.a1) + this.l2 * Math.sin(this.a2);
        let y2 = this.centerY + this.l1 * Math.cos(this.a1) + this.l2 * Math.cos(this.a2);
        
        this.trace.push({x: x2, y: y2, age: 0});
        if (this.trace.length > this.traceLength) {
            this.trace.shift();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw trace
        this.trace.forEach((point, index) => {
            let alpha = 1 - point.age / this.traceLength;
            let hue = (index / this.traceLength) * 360;
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
            this.ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${alpha})`;
            this.ctx.fill();
            point.age++;
        });

        let x1 = this.centerX + this.l1 * Math.sin(this.a1);
        let y1 = this.centerY + this.l1 * Math.cos(this.a1);
        let x2 = x1 + this.l2 * Math.sin(this.a2);
        let y2 = y1 + this.l2 * Math.cos(this.a2);

        // Draw lines
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw masses
        this.ctx.beginPath();
        this.ctx.arc(x1, y1, this.m1, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(x2, y2, this.m2, 0, 2 * Math.PI);
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
        this.a1 = Math.PI / 2;
        this.a2 = Math.PI / 2;
        this.a1_v = 0;
        this.a2_v = 0;
        this.isRunning = false;
        this.trace = [];
        this.draw();
    }
}

function setupPendulum(canvasId, startId, pauseId, resetId) {
    const canvas = document.getElementById(canvasId);
    const pendulum = new DoublePendulum(canvas);
    pendulum.reset();
    pendulum.animate();

    document.getElementById(startId).addEventListener('click', () => pendulum.start());
    document.getElementById(pauseId).addEventListener('click', () => pendulum.pause());
    document.getElementById(resetId).addEventListener('click', () => pendulum.reset());
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('pendulum-canvas');
    const pendulum = new DoublePendulum(canvas);
    pendulum.animate();
});
