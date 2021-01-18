var hamburger = document.querySelector(".hamburger");
var toggle = false;

var tl = gsap.timeline({paused: true});
tl.to(".social", {opacity: 0, duration: 0.125}, 0)
  .to(".social_media", {display: "none"}, 0)
  .to('.nav_list', {display: "flex"}, 0.5)
  .to('.nav_list li', {opacity: 1, duration: 0.3, stagger: 0.05}, 0.4);

  // On click
hamburger.addEventListener("click", function() {
    // Toggle class "is-active"
    hamburger.classList.toggle("is-active");
    // Do something else, like open/close menu
    if(toggle == false) {
        tl.play();
        toggle = true;
    }
    else {
        tl.reverse();
        toggle = false;
    }
});

var navbar  = document.querySelector('.nav');

ScrollTrigger.create({
    start: "top",
    end: 99999,
    onUpdate: ({direction}) => {
        if (direction == -1) {
            $('.request-popup').css({ top: '8.1rem' });
            navbar.classList.remove('hide-nav');

        } else {
            $('.request-popup').css({ top: '0rem' });
            navbar.classList.add('hide-nav');
        }
    }
});

function closeNav(div) {
    $('.hamburger').trigger("click");
}

// gsap.to('.nav', {
//     scrollTrigger: {
//         trigger: '.header',
//         start: "bottom",
//         markers: true,
//         scrub: true
//     },
//     backgroundColor: "rgba(30, 28, 25, 0.86)",
//     boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.2)"
// });

// gsap.set('.nav', {
//     scrollTrigger: {
//         trigger: '.login__body',
//         start: "top",
//         markers: true,
//     },
//     backgroundColor: "rgba(30, 28, 25, 0.86)",
//     boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.2)"
// });