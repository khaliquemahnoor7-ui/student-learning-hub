
//wait until the website is completely laded beofre running any code
document.addEventListener('DOMContentLoaded', () => {

  // find the search bar filter vuttons drop down and course cards
  const searchInput   = document.getElementById('courseSearch');
  const categoryPills = document.querySelectorAll('#categoryFilters .pill');
  const levelSelect   = document.getElementById('levelFilter');
  const courseCards   = document.querySelectorAll('.course-card');
  const resultsCount  = document.getElementById('resultsCount');
  const noResults     = document.getElementById('noResults');

  //find the popup window elements
  const modal            = document.getElementById('courseModal');
  const modalClose        = document.getElementById('modalClose');
  const modalTag          = document.getElementById('modalTag');
  const modalTitle        = document.getElementById('modalTitle');
  const modalDescription  = document.getElementById('modalDescription');
  const modalDuration      = document.getElementById('modalDuration');
  const modalRating        = document.getElementById('modalRating');

  //set the default filters to show everything at the start
  let activeCategory = 'all';
  let activeLevel    = 'all';

  // filtering the coutses
  function applyFilters() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    courseCards.forEach(card => {
      const title       = card.dataset.title.toLowerCase();
      const description = card.querySelector('.course-body p').textContent.toLowerCase();
      const category    = card.dataset.category;
      const level       = card.dataset.level;

      const matchesSearch   = title.includes(searchTerm) || description.includes(searchTerm);
      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      const matchesLevel    = activeLevel === 'all' || level === activeLevel;
// the card is visible only if it passes all 3 checks
      const isVisible = matchesSearch && matchesCategory && matchesLevel;
      card.classList.toggle('is-hidden', !isVisible);

      if (isVisible) visibleCount++;
    });

    updateResultsCount(visibleCount);
  }

  // this updates the text screen for the user
  function updateResultsCount(visibleCount) {
    const total = courseCards.length;
    resultsCount.textContent = `Showing ${visibleCount} of ${total} courses`;

    const hasResults = visibleCount > 0;
    resultsCount.hidden = !hasResults;
    noResults.hidden = hasResults;
  }

  // Search box filter as the user types
  searchInput.addEventListener('input', applyFilters);

  // Category pills single-select, toggle active state
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.dataset.filter;
      applyFilters();
    });
  });

  // Level dropdown
  levelSelect.addEventListener('change', () => {
    activeLevel = levelSelect.value;
    applyFilters();
  });

  // course detail modal

  function openModal(card) {
    const tag         = card.querySelector('.course-tag').textContent;
    const title       = card.querySelector('.course-body h3').textContent;
    const description = card.querySelector('.course-body p').textContent;
    const metaSpans   = card.querySelectorAll('.course-meta span');

    modalTag.textContent = tag;
    modalTag.className = 'course-tag ' + card.querySelector('.course-tag').className.split(' ')[1];
    modalTitle.textContent = title;
    modalDescription.textContent = description;

    if (metaSpans.length >= 2) {
      modalDuration.textContent = metaSpans[0].textContent.trim();
      modalRating.textContent = metaSpans[1].textContent.trim();
    }

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.view-course-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.course-card');
      openModal(card);
    });
  });

  modalClose.addEventListener('click', closeModal);

  // Close when clicking outside the modal card
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  // Initial count on page load
  updateResultsCount(courseCards.length);

});