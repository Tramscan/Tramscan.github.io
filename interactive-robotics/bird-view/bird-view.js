class BirdVisualizer {
    constructor(canvasId, sizeInputId, tweetButtonId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.sizeInput = document.getElementById(sizeInputId);
        this.tweetButton = document.getElementById(tweetButtonId);
        
        this.bird = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            size: 20,
            color: '#4287f5',
            trail: []
        };

        this.isTweeting = false;
        this.setupEventListeners();
        this.animate();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => this.moveBird(e));
        this.sizeInput.addEventListener('input', () => this.updateBirdSize());
        this.tweetButton.addEventListener('click', () => this.tweet());
    }

    moveBird(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.bird.x = e.clientX - rect.left;
        this.bird.y = e.clientY - rect.top;
        this.bird.trail.push({x: this.bird.x, y: this.bird.y});
        if (this.bird.trail.length > 50) {
            this.bird.trail.shift();
        }
    }

    updateBirdSize() {
        this.bird.size = parseInt(this.sizeInput.value);
    }

    tweet() {
        this.isTweeting = true;
        setTimeout(() => {
            this.isTweeting = false;
        }, 1000);
    }

    drawBird() {
        this.ctx.fillStyle = this.bird.color;
        this.ctx.beginPath();
        this.ctx.arc(this.bird.x, this.bird.y, this.bird.size / 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw beak
        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        this.ctx.moveTo(this.bird.x + this.bird.size / 2, this.bird.y);
        this.ctx.lineTo(this.bird.x + this.bird.size, this.bird.y - this.bird.size / 4);
        this.ctx.lineTo(this.bird.x + this.bird.size, this.bird.y + this.bird.size / 4);
        this.ctx.fill();

        // Draw eye
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.arc(this.bird.x + this.bird.size / 4, this.bird.y - this.bird.size / 4, this.bird.size / 10, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawTrail() {
        this.ctx.strokeStyle = 'rgba(66, 135, 245, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.bird.trail.forEach((point, index) => {
            if (index === 0) {
                this.ctx.moveTo(point.x, point.y);
            } else {
                this.ctx.lineTo(point.x, point.y);
            }
        });
        this.ctx.stroke();
    }

    drawTweet() {
        if (this.isTweeting) {
            this.ctx.fillStyle = '#000000';
            this.ctx.font = '20px Arial';
            this.ctx.fillText('Tweet!', this.bird.x + this.bird.size, this.bird.y - this.bird.size);
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawTrail();
        this.drawBird();
        this.drawTweet();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the BirdVisualizer when the window loads
window.onload = () => {
    new BirdVisualizer('birdCanvas', 'birdSizeInput', 'tweetButton');
};
