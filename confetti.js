// Confetti animation
const colors = ['#ff7e5f', '#feb47b', '#ffedbc', '#ff9a9e', '#f6abb6', '#ffebeb'];

class Confetti {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.isRunning = false;
        this.particles = [];
        this.maxParticles = 150;
        
        this.initCanvas();
    }
    
    initCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '2';
        document.body.appendChild(this.canvas);
        
        // Listen for window resize
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }
    
    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * -100 - 100, // Start above the screen
            size: Math.random() * 8 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            speed: Math.random() * 3 + 2,
            rotationSpeed: Math.random() * 5 - 2.5,
            oscillationSpeed: Math.random() * 0.5 + 0.5,
            oscillationDistance: Math.random() * 40 + 40,
            direction: Math.random() > 0.5 ? 1 : -1
        };
    }
    
    updateParticles() {
        // Fill up to max particles
        while (this.particles.length < this.maxParticles && this.isRunning) {
            this.particles.push(this.createParticle());
        }
        
        // Clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Update position
            p.y += p.speed;
            p.x += Math.sin(p.y * p.oscillationSpeed) * p.oscillationDistance * p.direction;
            p.rotation += p.rotationSpeed;
            
            // Remove if out of bounds
            if (p.y > this.canvas.height + 100) {
                this.particles.splice(i, 1);
                i--;
                continue;
            }
            
            // Draw particle
            this.context.save();
            this.context.translate(p.x, p.y);
            this.context.rotate(p.rotation * Math.PI / 180);
            
            this.context.fillStyle = p.color;
            this.context.beginPath();
            
            // Draw different shapes
            const shapeType = Math.floor(p.rotation) % 3;
            if (shapeType === 0) {
                // Heart
                const size = p.size * 0.8;
                this.context.beginPath();
                this.context.moveTo(0, -size);
                this.context.bezierCurveTo(size, -size * 3, size * 3, 0, 0, size * 2);
                this.context.bezierCurveTo(-size * 3, 0, -size, -size * 3, 0, -size);
            } else if (shapeType === 1) {
                // Circle
                this.context.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            } else {
                // Square
                this.context.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            }
            
            this.context.fill();
            this.context.restore();
        }
        
        if (this.isRunning) {
            requestAnimationFrame(() => this.updateParticles());
        }
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.updateParticles();
        }
    }
    
    stop() {
        this.isRunning = false;
        this.particles = [];
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// Create confetti instance
const confetti = new Confetti();

// Function to start confetti
function startConfetti() {
    confetti.start();
    
    // Stop after 8 seconds
    setTimeout(() => {
        confetti.stop();
    }, 8000);
} 