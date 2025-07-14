document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const productCards = document.querySelectorAll('.product-card');

  // Sections that might be hidden when searching
  const sectionsToHide = [
    document.querySelector('.jarallax'),
    ...document.querySelectorAll('section.container.my-5'),
    document.querySelector('.social-float')
  ].filter(Boolean);

  searchInput.addEventListener('input', () => {
    const term = searchInput.value.trim().toLowerCase();

    let anyProductVisible = false;

    productCards.forEach(card => {
      const text = card.innerText.toLowerCase();
      const slide = card.closest('.swiper-slide');
      if (!slide) return;

      // Show slide if it matches the term or if search is empty
      if (!term || text.includes(term)) {
        slide.style.display = '';
        anyProductVisible = true;
      } else {
        slide.style.display = 'none';
      }
    });

    // Show/hide sections based on if they have visible slides
    sectionsToHide.forEach(section => {
      if (!section) return;

      // Check if this section has any visible swiper-slide inside it
      const visibleSlidesInSection = section.querySelectorAll('.swiper-slide:not([style*="display: none"])');

      if (term && visibleSlidesInSection.length === 0) {
        // Hide sections with no visible products when searching
        section.style.display = 'none';
      } else {
        // Show sections if search empty or they have visible products
        section.style.display = '';
      }
    });

    // If search term is empty, show everything
    if (!term) {
      productCards.forEach(card => {
        const slide = card.closest('.swiper-slide');
        if (slide) slide.style.display = '';
      });
      sectionsToHide.forEach(section => {
        if (section) section.style.display = '';
      });
    }
  });
});
