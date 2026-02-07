/* --- PART 1: Background Animation (Heart Antigravity) --- */
const canvas = document.getElementById('heart-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];
const colors = ['#ff4081', '#f50057', '#d81b60', '#ff80ab', '#ea80fc'];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

function drawHeart(x, y, size, color, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.translate(x, y);
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 2 + size / 2, 0, size);
    ctx.bezierCurveTo(0, (size + topCurveHeight) / 2 + size / 2, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 20;
        this.size = Math.random() * 15 + 5;
        this.speed = Math.random() * 1 + 0.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.1;
        this.wobble = Math.random() * Math.PI * 2;
    }
    update() {
        this.y -= this.speed;
        this.x += Math.sin(this.wobble += 0.05) * 0.5;
        if (this.y < -50) this.reset();
    }
    draw() { drawHeart(this.x, this.y, this.size, this.color, this.opacity); }
}

function initAnimation() {
    resize();
    particles = [];
    const count = Math.floor((width * height) / 10000);
    for (let i = 0; i < count; i++) particles.push(new Particle());
}
function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}
window.addEventListener('resize', () => { resize(); initAnimation(); });
initAnimation();
animate();


/* --- PART 2: Login Logic & Validation --- */

const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const loginCard = document.getElementById('loginCard');
const errorMsg = document.getElementById('error-msg');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim().toLowerCase();
    
    // Clear previous errors
    errorMsg.innerText = '';
    loginCard.classList.remove('shake');

    // Strict Validation for NIT Calicut domain
    if (!email.endsWith('@nitc.ac.in')) {
        // Trigger error UI
        showError('Only @nitc.ac.in emails are allowed.');
        return;
    }

    // Simulate Success (Here you would usually send data to a backend)
    const btnText = document.querySelector('.btn span');
    btnText.innerText = 'Authenticating...';
    
    setTimeout(() => {
        alert('Welcome back, NITC Student!');
        // Redirect logic would go here
    }, 1000);
});

function showError(message) {
    errorMsg.innerText = message;
    
    // Trigger CSS shake animation
    loginCard.classList.add('shake');
    
    // Allow animation to run again if clicked immediately
    setTimeout(() => {
        loginCard.classList.remove('shake');
    }, 500);
}
