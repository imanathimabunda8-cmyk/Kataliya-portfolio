
const swiper = new Swiper(".portfolio-swiper", {
    direction: "horizontal",
    slidesPerView: 1,
    speed: 800,

    // Keep keyboard navigation
    keyboard: {
        enabled: true
    }
});

// Control mouse wheel behaviour ourselves
const portfolio = document.querySelector(".portfolio-swiper");

let wheelLocked = false;

portfolio.addEventListener("wheel", function (event) {

    const delta = event.deltaY;

    // Ignore tiny wheel movements
    if (Math.abs(delta) < 20) return;

    // Get the currently active slide's content
    const activeSlide = swiper.slides[swiper.activeIndex];
    const content = activeSlide.querySelector(".slide-content");

    if (!content) return;

    const scrollTop = content.scrollTop;
    const maxScroll = content.scrollHeight - content.clientHeight;

    const atTop = scrollTop <= 1;
    const atBottom = scrollTop >= maxScroll - 1;

    const scrollingDown = delta > 0;
    const scrollingUp = delta < 0;

    // Check whether the content can still scroll
    const canScrollDown = scrollingDown && !atBottom;
    const canScrollUp = scrollingUp && !atTop;

    // Let the browser scroll the content normally
    if (canScrollDown || canScrollUp) {
        return;
    }

    // We've reached a boundary.
    // Stop normal scrolling and change slides instead.
    event.preventDefault();

    if (wheelLocked) return;

    wheelLocked = true;

    if (scrollingDown) {
        swiper.slideNext();
    } else if (scrollingUp) {
        swiper.slidePrev();
    }

    // Prevent one wheel gesture from skipping multiple slides
    setTimeout(() => {
        wheelLocked = false;
    }, 850);

}, { passive: false });


/* =========================
   NAVIGATION MENU
========================= */

const navLinks = document.querySelectorAll("nav a");

navLinks.forEach(link => {

    link.addEventListener("click", function(event) {

        // Stop the browser from using normal anchor navigation
        event.preventDefault();

        // Get the section ID from the link
        const targetId = this.getAttribute("href").substring(1);

        // Find the matching slide
        const targetIndex = swiper.slides.findIndex(slide => {
            return slide.id === targetId;
        });

        // Navigate to that slide
        if (targetIndex !== -1) {
            swiper.slideTo(targetIndex);
        }

    });

});


/* =========================
   ACTIVE NAVIGATION STATE
========================= */

function updateActiveLink() {

    navLinks.forEach(link => {

        const targetId = link.getAttribute("href").substring(1);

        if (swiper.slides[swiper.activeIndex].id === targetId) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }

    });

}

// Update whenever Swiper changes slides
swiper.on("slideChange", updateActiveLink);

// Set the initial active link
updateActiveLink();


