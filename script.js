document.addEventListener('DOMContentLoaded', function () {
    // Mobile Navigation Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const desktopNav = document.getElementById('desktopNav');

    if (mobileToggle && desktopNav) {
        mobileToggle.addEventListener('click', function () {
            desktopNav.classList.toggle('active');
        });
    }

    // Dropdown Toggle on Mobile
    const dropdowns = document.querySelectorAll('.nav-item-dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                this.classList.toggle('active');
            }
        });
    });

    // Single Page Navigation / Dynamic Page Switching
    const navLinks = document.querySelectorAll('.page-nav-link');
    const pageViews = document.querySelectorAll('.page-view');

    function navigateToPage(targetId) {
        pageViews.forEach(page => {
            page.classList.remove('active');
        });

        const targetPage = document.getElementById(targetId);
        if (targetPage) {
            targetPage.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Update active navbar links
        document.querySelectorAll('.desktop-nav .nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-target') === targetId) {
                link.classList.add('active');
            }
        });

        // Close mobile nav menu
        if (desktopNav) {
            desktopNav.classList.remove('active');
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const target = this.getAttribute('data-target');
            if (target) {
                e.preventDefault();
                navigateToPage(target);
            }
        });
    });

    // Handle URL Hash changes
    function handleHashChange() {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            const pageMap = {
                'home': 'home-page',
                'about': 'about-page',
                'beliefs': 'beliefs-page',
                'leadership': 'leadership-page',
                'visit': 'visit-page',
                'messages': 'messages-page',
                'events': 'events-page',
                'gallery': 'gallery-page',
                'give': 'give-page'
            };
            if (pageMap[hash]) {
                navigateToPage(pageMap[hash]);
            }
        }
    }

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    // Event Badges Date Evaluator & Reverse Chronological Sorting
    const eventsTrack = document.getElementById('eventsTrack');
    const eventCards = Array.from(document.querySelectorAll('.event-card'));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    function parseEventDate(dateStr) {
        if (!dateStr) return null;
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        }
        const parsed = new Date(dateStr);
        return isNaN(parsed.getTime()) ? null : parsed;
    }

    eventCards.forEach((card, originalIndex) => {
        card.dataset.originalIndex = originalIndex;
        const dateStr = card.getAttribute('data-date');
        const eventDate = parseEventDate(dateStr);

        if (eventDate) {
            const imageWrap = card.querySelector('.event-image-wrap');

            if (eventDate < today) {
                // Date has passed
                const passedBadge = document.createElement('div');
                passedBadge.className = 'badge-passed';
                passedBadge.textContent = 'passed';
                imageWrap.appendChild(passedBadge);
            } else {
                // Date is upcoming
                const upcomingBadge = document.createElement('div');
                upcomingBadge.className = 'badge-upcoming';
                upcomingBadge.textContent = 'upcoming';
                imageWrap.appendChild(upcomingBadge);
            }
        }
    });

    if (eventsTrack && eventCards.length > 0) {
        const sortedCards = [...eventCards].sort((a, b) => {
            const dateA = parseEventDate(a.getAttribute('data-date'));
            const dateB = parseEventDate(b.getAttribute('data-date'));
            const timeA = dateA ? dateA.getTime() : -Infinity;
            const timeB = dateB ? dateB.getTime() : -Infinity;

            if (timeA !== timeB) {
                return timeB - timeA;
            }
            return Number(a.dataset.originalIndex) - Number(b.dataset.originalIndex);
        });

        sortedCards.forEach(card => {
            eventsTrack.appendChild(card);
        });
    }

    // Events Slider Controls
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    let currentSlideIndex = 0;

    function updateCarousel() {
        if (!eventsTrack) return;
        const card = eventsTrack.querySelector('.event-card');
        if (!card) return;
        const cardWidth = card.offsetWidth + 25; // width + gap
        eventsTrack.style.transform = `translateX(-${currentSlideIndex * cardWidth}px)`;
    }

    if (nextBtn && prevBtn && eventsTrack) {
        nextBtn.addEventListener('click', function() {
            const totalCards = eventsTrack.querySelectorAll('.event-card').length;
            const visibleCards = window.innerWidth <= 768 ? 1 : 2;
            if (currentSlideIndex < totalCards - visibleCards) {
                currentSlideIndex++;
                updateCarousel();
            }
        });

        prevBtn.addEventListener('click', function() {
            if (currentSlideIndex > 0) {
                currentSlideIndex--;
                updateCarousel();
            }
        });

        window.addEventListener('resize', updateCarousel);
    }
});

// Tab Switcher Function for "Looking For More?"
function openTab(evt, tabName) {
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }

    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }

    const currentTab = document.getElementById(tabName);
    if (currentTab) {
        currentTab.classList.add('active');
    }
    evt.currentTarget.classList.add('active');
}