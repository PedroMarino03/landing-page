// ===== COUNTDOWN TIMER =====
(function () {
  // Set deadline: 48 hours from first visit (stored in localStorage)
  const STORAGE_KEY = 'p7k_deadline';
  let deadline = localStorage.getItem(STORAGE_KEY);

  if (!deadline) {
    deadline = Date.now() + 48 * 60 * 60 * 1000; // 48h from now
    localStorage.setItem(STORAGE_KEY, deadline);
  } else {
    deadline = parseInt(deadline, 10);
  }

  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  function updateCountdown() {
    const now = Date.now();
    let diff = deadline - now;

    if (diff <= 0) {
      // Reset for another 48h (evergreen)
      deadline = Date.now() + 48 * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, deadline);
      diff = deadline - Date.now();
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(function (btn) {
  btn.addEventListener('click', function () {
    const item = this.closest('.faq-item');
    const isActive = item.classList.contains('active');

    // Close all
    document.querySelectorAll('.faq-item').forEach(function (el) {
      el.classList.remove('active');
    });

    // Open clicked (if wasn't already open)
    if (!isActive) {
      item.classList.add('active');
    }
  });
});

// ===== SMOOTH SCROLL for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== UTM PASSTHROUGH =====
// Appends UTM params from URL to all checkout links
(function () {
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src'];
  const utmParams = {};

  utmKeys.forEach(function (key) {
    if (params.has(key)) {
      utmParams[key] = params.get(key);
    }
  });

  if (Object.keys(utmParams).length > 0) {
    const utmString = new URLSearchParams(utmParams).toString();

    document.querySelectorAll('a[href*="checkout"], a[href*="pay."]').forEach(function (link) {
      const separator = link.href.includes('?') ? '&' : '?';
      link.href = link.href + separator + utmString;
    });
  }
})();

// ===== SCROLL ANIMATIONS (Intersection Observer) =====
(function () {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  // Add fade-in class to animatable elements
  const selectors = [
    '.problem-card',
    '.solution-card',
    '.module-card',
    '.testimonial-card',
    '.print-card',
    '.audience-card',
    '.pricing-card',
    '.guarantee-box',
    '.future-pacing',
    '.about-content',
    '.about-image'
  ];

  selectors.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.classList.add('fade-up');
      observer.observe(el);
    });
  });
})();

// Add CSS for animations dynamically
const style = document.createElement('style');
style.textContent = `
  .fade-up {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .fade-up.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .fade-up:nth-child(2) { transition-delay: 0.1s; }
  .fade-up:nth-child(3) { transition-delay: 0.2s; }
  .fade-up:nth-child(4) { transition-delay: 0.3s; }
  .fade-up:nth-child(5) { transition-delay: 0.4s; }
  .fade-up:nth-child(6) { transition-delay: 0.5s; }
`;
document.head.appendChild(style);

// ===== INFINITE CAROUSEL (pure CSS, no JS needed) =====
