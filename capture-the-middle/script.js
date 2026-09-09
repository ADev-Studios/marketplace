// Capture the Middle — minimal interactions

document.addEventListener('DOMContentLoaded', () => {
  // Smooth parallax-ish effect on hero islands based on scroll
  const islands = document.querySelectorAll('.island');
  if (islands.length && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      islands.forEach((el, i) => {
        const speed = 0.15 + i * 0.05;
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    }, { passive: true });
  }

  // Subtle mouse parallax on hero (desktop only)
  const hero = document.querySelector('.hero');
  if (hero && window.innerWidth > 768) {
    hero.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 12;
      islands.forEach((el, i) => {
        const factor = 1 + i * 0.3;
        el.style.translate = `${x * factor}px ${y * factor}px`;
      });
    });
  }
});
