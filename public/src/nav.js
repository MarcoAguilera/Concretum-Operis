var hamburger = document.querySelector(".hamburger");
var toggle = false;

// var mobile_nav = document.querySelector('.mobile-nav');

var tl = gsap.timeline({paused: true});
tl.to(".social", {opacity: 0, duration: 0.125}, 0)
  .to(".social_media", {display: "none"}, 0)
  .to('.nav_list', {display: "flex"}, 0.5)
  .to('.nav_list li', {opacity: 1, duration: 0.3, stagger: 0.05}, 0.4);

var m_nav = gsap.timeline({paused: true});

m_nav.to('.mobile-nav', {duration: .35, width: "100vw"}, 0)
     .to('.mobile-nav__list', {display: "flex"}, 0)
     .to('.mobile-nav__list li', {duration: .1, opacity: 1});


hamburger.addEventListener("click", function() {
    var w = window.screen.width;
    // Toggle class "is-active"
    hamburger.classList.toggle("is-active");
    // Do something else, like open/close menu
    if(toggle == false) {
        if (w > 570) {
            tl.play();
        }
        toggle = true;
        m_nav.play();
    }
    else {
        if (w > 570) {
            tl.reverse();
        }
        toggle = false;
        m_nav.reverse();
    }
});

var navbar  = document.querySelector('.nav');

ScrollTrigger.matchMedia({
    "(min-width: 570px)" : function() {
        ScrollTrigger.create({
            start: "80px top",
            end: 99999,
            onUpdate: ({direction}) => {
                if (direction == -1) {
                    $('.request-popup').css({ top: '8.1rem'});
                    navbar.classList.remove('hide-nav');
        
                } else {
                    $('.request-popup').css({ top: '0rem' });
                    navbar.classList.add('hide-nav');
                }
            }
        });
    }
});

 function closeNav(div) {
    var w = window.screen.width;
    $('.hamburger').trigger("click");
    if(w > 750) {
        $('html,body').animate({
            scrollTop: $(div).offset().top,
        },
            'slow', function() {
                var navbar  = document.querySelector('.nav');
                navbar.classList.add('hide-nav');
            });
    }
    else {
        $('html,body').animate({
            scrollTop: $(div).offset().top - 50,
        }, 'slow');
    }
}

