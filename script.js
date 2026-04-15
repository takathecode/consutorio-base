(function() {
  "use strict";

  /* ==================== MENU MOBILE ==================== */
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    });
  }

  // Fecha menu ao clicar em link (mobile)
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.querySelector('i').classList.add('fa-bars');
        menuToggle.querySelector('i').classList.remove('fa-times');
      }
    });
  });

  /* ==================== SCROLL REVEAL (Intersection Observer) ==================== */
  const fadeElements = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  fadeElements.forEach(el => observer.observe(el));

  /* ==================== CONTADOR ANIMADO ==================== */
  const numeroItems = document.querySelectorAll('.numero-valor');
  let contadorIniciado = false;

  function animarContadores() {
    numeroItems.forEach(item => {
      const target = parseInt(item.getAttribute('data-target'));
      let current = 0;
      const increment = target / 60; // suave
      const updateCounter = () => {
        current += increment;
        if (current < target) {
          item.textContent = Math.ceil(current) + '+';
          requestAnimationFrame(updateCounter);
        } else {
          item.textContent = target + '+';
        }
      };
      updateCounter();
    });
  }

  // Dispara apenas quando a seção de números estiver visível
  const secaoNumeros = document.querySelector('.numeros');
  if (secaoNumeros) {
    const obsNumeros = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !contadorIniciado) {
          animarContadores();
          contadorIniciado = true;
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    obsNumeros.observe(secaoNumeros);
  }

  /* ==================== FUNÇÃO GENÉRICA DE CARROSSEL ==================== */
  function criarCarrossel(slidesId, prevId, nextId, dotsId) {
    const slidesContainer = document.getElementById(slidesId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    const dotsContainer = document.getElementById(dotsId);
    if (!slidesContainer) return;

    const slides = slidesContainer.children;
    const totalSlides = slides.length;
    let currentIndex = 0;
    let interval;

    function updateCarousel() {
      slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentIndex);
        });
      }
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateCarousel();
    }

    // Criar dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
          resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
      }
    }

    // Auto play (pausa ao interagir)
    function startAutoPlay() {
      interval = setInterval(nextSlide, 5000);
    }
    function resetAutoPlay() {
      clearInterval(interval);
      startAutoPlay();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });

    // Pausar ao passar mouse
    slidesContainer.addEventListener('mouseenter', () => clearInterval(interval));
    slidesContainer.addEventListener('mouseleave', startAutoPlay);

    startAutoPlay();
    updateCarousel();
  }

  // Inicializa carrosséis
  criarCarrossel('clinicaCarousel', 'clinicaPrev', 'clinicaNext', 'clinicaDots');
  criarCarrossel('antesDepoisCarousel', 'antesDepoisPrev', 'antesDepoisNext', 'antesDepoisDots');

  /* ==================== HEADER COM FUNDO AO ROLAR (opcional) ==================== */
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
    } else {
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.02)';
    }
  });

})();