
// ✅ Generic Swiper config function for reuse (without arrows)
function initSwiper(selector) {
  return new Swiper(selector, {
    slidesPerView: 3,
    spaceBetween: 20,

    pagination: {
      el: selector + ' .swiper-pagination',
      clickable: true,
    },

    breakpoints: {
      576: { slidesPerView: 3 },
      768: { slidesPerView: 4 },
      992: { slidesPerView: 5 },
    },
  });
}

// ✅ Init existing Swipers
initSwiper('.sports-swiper');
initSwiper('.accessories-swiper');
initSwiper('.cling-Swiper');

// ✅ Init NEW Bike Parts Swiper
initSwiper('.bikeparts-swiper');

// ✅ Init Bicycle Lights Swiper
initSwiper('.lights-swiper');

// ✅ Init Cycling Tech & Essentials Swiper
initSwiper('.tech-swiper');
initSwiper('.jersey-swiper');
initSwiper('.watch-swiper');
initSwiper('.mtumba-swiper');
initSwiper('.peripherals-swiper');
initSwiper('.bags-swiper');

const customerReviewSwiper = new Swiper('.customer-review-swiper', {
  loop: true,
  spaceBetween: 20,
  slidesPerView: 1,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  speed: 800,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true
  },
  breakpoints: {
    576: {
      slidesPerView: 1.2,
    },
    768: {
      slidesPerView: 2,
    },
    992: {
      slidesPerView: 3,
    }
  }
});
