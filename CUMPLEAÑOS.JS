// ===== CONTADOR CON FUEGOS ARTIFICIALES MEJORADOS =====
window.addEventListener('load', () => {
  const numberElement = document.getElementById('number');
  if(!numberElement) return;

  let count = 0;
  const target = 33;
  const speed = 100; // contador más lento para efecto dramático

  // ===== CANVAS PARA FUEGOS ARTIFICIALES =====
  const canvas = document.getElementById('fireworksCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];

  function createFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height / 2; // parte superior
    const colors = ['#ff0040','#ffbf00','#40ff00','#00ffff','#ff00ff','#ffffff','#ff6600','#00ffcc'];
    const numParticles = 80 + Math.floor(Math.random() * 40); // más partículas

    for(let i = 0; i < numParticles; i++){
      const speed = Math.random() * 5 + 2;
      const angle = Math.random() * 2 * Math.PI;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: 0.015 + Math.random() * 0.015,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: 2 + Math.random() * 2
      });
    }
  }

  function animateFireworks(){
  // No limpiar con negro, solo limpiar los pixeles de los particles
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for(let i=particles.length-1;i>=0;i--){
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= p.decay;

    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;

    if(p.alpha <= 0) particles.splice(i,1);
  }
  requestAnimationFrame(animateFireworks);
}

  animateFireworks();

  // ===== FUNCION PARA CONTAR Y ACTIVAR FUEGOS ARTIFICIALES =====
  function increment(){
    if(count < target){
      count++;
      numberElement.innerText = count;
      setTimeout(increment, speed);
    } else {
      // Disparar fuegos artificiales en cascada durante 10 segundos
      let fireworksInterval = setInterval(() => {
        for(let i=0; i<3; i++){
          createFirework();
        }
      }, 300);

      // Detener los fuegos después de 10 segundos
      setTimeout(() => clearInterval(fireworksInterval), 10000);
    }
  }
  increment();

  // ===== CARRUSEL 3D =====
  const carousel = document.getElementById("carousel");
  if(carousel){
    const numCards = 6;
    const angleStep = 360 / numCards;
    const radius = 180;

    const items = [
      { src: "https://iili.io/3MFDjiG.jpg", caption: "" },
      { src: "https://iili.io/3MFDNff.jpg", caption: "" },
      { src: "https://iili.io/3MFDOl4.jpg", caption: "" },
      { src: "https://iili.io/3MFDhVs.jpg", caption: "" },
      { src: "https://iili.io/3MFD4Wu.jpg", caption: "" },
      { src: "https://iili.io/3MFDrxe.jpg", caption: "" }
    ];

    items.forEach((item, i) => {
      const card = document.createElement("div");
      card.className = "card";
      card.style.transform = `rotateX(${i * angleStep}deg) translateZ(${radius}px)`;
      card.style.backgroundImage = `url('${item.src}')`;
      card.addEventListener("click", () => openLightbox(item.src));
      carousel.appendChild(card);
    });

    let currentRotation = 0;
    let rotationInterval = setInterval(() => {
      currentRotation += angleStep;
      carousel.style.transform = `rotateX(${currentRotation}deg)`;
    }, 3000);

    carousel.addEventListener("mouseover", () => clearInterval(rotationInterval));
    carousel.addEventListener("mouseout", () => {
      rotationInterval = setInterval(() => {
        currentRotation += angleStep;
        carousel.style.transform = `rotateX(${currentRotation}deg)`;
      }, 3000);
    });

    let startY;
    document.addEventListener("mousedown", (e) => {
      startY = e.clientY;
      document.onmousemove = (e) => {
        const deltaY = e.clientY - startY;
        startY = e.clientY;
        currentRotation += deltaY * 0.5;
        carousel.style.transform = `rotateX(${currentRotation}deg)`;
      };
      document.onmouseup = () => { document.onmousemove = null; document.onmouseup = null; };
    });

    document.addEventListener("touchstart", (e) => startY = e.touches[0].clientY);
    document.addEventListener("touchmove", (e) => {
      const deltaY = e.touches[0].clientY - startY;
      startY = e.touches[0].clientY;
      currentRotation += deltaY * 0.5;
      carousel.style.transform = `rotateX(${currentRotation}deg)`;
    });
  }

  // ===== LIGHTBOX =====
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("closeBtn");

  function openLightbox(src){
    lightboxImg.src = src;
    lightbox.classList.add("active");
  }
  function closeLightbox(){
    lightbox.classList.remove("active");
    setTimeout(()=> lightboxImg.src="", 300);
  }
  if(lightbox){
    lightbox.addEventListener("click", e => {
      if(e.target === lightbox || e.target === closeBtn) closeLightbox();
    });
  }
});

