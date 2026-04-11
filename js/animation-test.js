// TEST FILE: Quick test to verify all animations are working
// Include this in console to verify

console.log('🎬 Animation Test Suite');
console.log('='.repeat(50));

// 1. Check if GSAP is loaded
const gsapLoaded = typeof gsap !== 'undefined';
console.log(`✓ GSAP Loaded: ${gsapLoaded ? '✅' : '❌'}`);

// 2. Check if ScrollTrigger is loaded
const scrollTriggerLoaded = typeof ScrollTrigger !== 'undefined';
console.log(`✓ ScrollTrigger Loaded: ${scrollTriggerLoaded ? '✅' : '❌'}`);

// 3. Check smooth scroll behavior
const htmlSmoothScroll = window.getComputedStyle(
  document.documentElement
).scrollBehavior;
console.log(`✓ HTML Smooth Scroll: ${htmlSmoothScroll}`);

// 4. Count animated elements
const animatedElements = {
  buttons: document.querySelectorAll('.btn').length,
  cards: document.querySelectorAll(
    '.course-card, .post-card, .feature-tile, .journey-step, .most-course-card'
  ).length,
  navLinks: document.querySelectorAll('.nav-link').length,
  footerLinks: document.querySelectorAll('.footer-links a, .footer-contact a')
    .length,
  socialIcons: document.querySelectorAll('.social-icons a').length,
};

console.log('\n📊 Animated Elements Count:');
Object.entries(animatedElements).forEach(([key, count]) => {
  console.log(`  ${key}: ${count}`);
});

// 5. Check for transition properties
const getTransitionStyles = (selector) => {
  const el = document.querySelector(selector);
  if (!el) return 'Element not found';
  return window.getComputedStyle(el).transition;
};

console.log('\n🎨 Transition Properties:');
console.log(`  .btn: ${getTransitionStyles('.btn')}`);
console.log(`  .course-card: ${getTransitionStyles('.course-card')}`);
console.log(`  .nav-link: ${getTransitionStyles('.nav-link')}`);

// 6. Test back to top button
const backToTopBtn = document.getElementById('myBtn');
console.log(`\n🔝 Back to Top Button:`);
console.log(`  Found: ${backToTopBtn ? '✅' : '❌'}`);
console.log(`  Display: ${backToTopBtn?.style.display || 'initial'}`);

// 7. Check prefers-reduced-motion
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;
console.log(`\n♿ Accessibility:`);
console.log(
  `  Prefers Reduced Motion: ${prefersReducedMotion ? '✅ YES' : '❌ NO'}`
);

// 8. Test animation trigger
console.log('\n🧪 Animation Test:');
if (gsapLoaded) {
  // Create a test element
  const testEl = document.createElement('div');
  testEl.id = 'animation-test';
  testEl.style =
    'width: 50px; height: 50px; background: #60a5fa; border-radius: 50%; position: fixed; bottom: 100px; right: 30px; z-index: 1000;';
  document.body.appendChild(testEl);

  // Animate it
  gsap.to(testEl, {
    duration: 1,
    y: -50,
    opacity: 0.5,
    scale: 0.8,
    onComplete: () => {
      console.log('  ✅ Animation test successful!');
      // Remove test element
      setTimeout(() => testEl.remove(), 500);
    },
  });
} else {
  console.log('  ❌ GSAP not loaded, cannot test animations');
}

console.log('\n' + '='.repeat(50));
console.log('✨ Animation Suite Test Complete!');
console.log('='.repeat(50));

// Helper function to log animation durations
window.getAnimationDurations = function () {
  console.log('\n⏱️ Animation Durations:');
  const samples = {
    '.btn': { duration: '0.4s', easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    '.course-card:hover': { translateY: '-12px', scale: '1.02' },
    '.nav-link': { duration: '0.35s' },
    '.feature-icon': { duration: '0.4s', scale: '1.12', rotate: '8deg' },
    'scroll-reveal': { duration: '0.6s', easing: 'power3.out' },
  };

  Object.entries(samples).forEach(([selector, props]) => {
    console.log(`\n${selector}:`);
    Object.entries(props).forEach(([key, val]) => {
      console.log(`  ${key}: ${val}`);
    });
  });
};

console.log(
  '\n💡 Tip: Run window.getAnimationDurations() to see animation timings'
);
