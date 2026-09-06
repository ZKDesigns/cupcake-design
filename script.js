// ===== Moving Sprinkles =====
const canvas = document.getElementById('sprinkles');
const ctx = canvas.getContext('2d');

let width, height;
const sprinkles = [];
const colors = ['#e67e22', '#f39c12', '#e74c3c', '#f1c40f', '#ffffff', '#ff9ff3', '#54a0ff'];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Sprinkle {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * width;
    this.y = initial ? Math.random() * height : -20;
    this.size = Math.random() * 5 + 2;
    this.speed = Math.random() * 1.8 + 0.6;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.rotation = Math.random() * 360;
    this.spin = (Math.random() - 0.5) * 4;
    this.opacity = Math.random() * 0.7 + 0.3;
    this.wobble = Math.random() * 0.05;
    this.wobbleSpeed = Math.random() * 0.02 + 0.01;
  }

  update() {
    this.y += this.speed;
    this.x += Math.sin(this.y * this.wobbleSpeed) * this.wobble * 20;
    this.rotation += this.spin;

    if (this.y > height + 20) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    // elongated sprinkle shape
    ctx.fillRect(-this.size / 2, -this.size / 5, this.size, this.size / 2.5);
    ctx.restore();
  }
}

for (let i = 0; i < 70; i++) {
  sprinkles.push(new Sprinkle());
}

function animateSprinkles() {
  ctx.clearRect(0, 0, width, height);
  sprinkles.forEach(s => {
    s.update();
    s.draw();
  });
  requestAnimationFrame(animateSprinkles);
}

animateSprinkles();

// ===== 3D Tilt on gallery items =====
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  });
});

// ===== Scroll reveal =====
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.cupcake-item, .recipe-block, .section-title, .section-desc').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// Smooth parallax on main cupcake
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const mainCupcake = document.querySelector('.cupcake-3d');
  if (mainCupcake && scrolled < window.innerHeight) {
    mainCupcake.style.transform = `translateY(${scrolled * 0.15}px) rotateY(${-8 + scrolled * 0.02}deg)`;
  }
});