'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(function (btn) {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);

overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Button Scolling
btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page Navigation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('nav__link--btn')
  ) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component
tabsContainer.addEventListener('click', function (e) {
  const btnClicked = e.target.closest('.operations__tab');
  const tab = e.target.dataset.tab;

  if (!btnClicked) return;

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  // Activate tab
  btnClicked.classList.add('operations__tab--active');
  // Activate content area
  document
    .querySelector(`.operations__content--${tab}`)
    .classList.add('operations__content--active');
});

// Navbar fade animation
const onHoverHandler = function (opacity) {
  return function (e) {
    if (e.target.classList.contains('nav__link')) {
      const hoveredLink = e.target;
      const siblingsLink = hoveredLink
        .closest('.nav')
        .querySelectorAll('.nav__link');
      const logo = hoveredLink.closest('.nav').querySelector('img');
      siblingsLink.forEach(link => {
        if (link !== hoveredLink) {
          link.style.opacity = opacity;
        }
      });
      logo.style.opacity = opacity;
    }
  };
};

nav.addEventListener('mouseover', onHoverHandler(0.5));
nav.addEventListener('mouseout', onHoverHandler(1));

//Sticky navigation
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stikyNav = function (entries) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    nav.classList.remove('sticky');
  } else {
    nav.classList.add('sticky');
  }
};

const stickyNavOptions = {
  root: null, // entire viewport
  threshold: 0, // 0% visible
  rootMargin: `${-navHeight}px`,
};

const headerObserver = new IntersectionObserver(stikyNav, stickyNavOptions);

headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target); // clean observer
};

const revealSectionOptions = {
  root: null,
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(
  revealSection,
  revealSectionOptions
);

allSections.forEach(function (section) {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// Lazy loading images
const imageTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );

  observer.unobserve(entry.target); // clean observer
};

const loadImgOptions = {
  root: null,
  threshold: 0,
};

const imageObserver = new IntersectionObserver(loadImg, loadImgOptions);

imageTargets.forEach(img => imageObserver.observe(img));

// Slider
const sliders = function () {
  const slides = document.querySelectorAll('.slide');
  const buttonLeft = document.querySelector('.slider__btn--left');
  const buttonRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let currentSlide = 0;
  let maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach((_, idx) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${idx}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (currentSlide) {
    slides.forEach(
      (slide, idx) =>
        (slide.style.transform = `translateX(${100 * (idx - currentSlide)}%)`)
      // -100%, 0%, 100%, 200%
    );
  };

  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const init = function () {
    createDots();
    activateDot(0);
    goToSlide(0);
  };

  init();

  // Event handlers
  buttonRight.addEventListener('click', nextSlide);
  buttonLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowRight' && prevSlide();
    e.key === 'ArrowLeft' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

sliders();

document.addEventListener('DOMContentLoaded', function (e) {
  console.log(e);
});

window.addEventListener('load', function (e) {
  console.log(e);
});

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
});
